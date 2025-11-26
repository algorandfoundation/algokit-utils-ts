import {
  Address,
  ALGORAND_ADDRESS_BYTE_LENGTH,
  ALGORAND_CHECKSUM_BYTE_LENGTH,
  arrayEqual,
  getAddress,
  hash,
  PUBLIC_KEY_BYTE_LENGTH,
  SIGNATURE_BYTE_LENGTH,
} from '@algorandfoundation/algokit-common'
import {
  AddressWithDelegatedLsigSigner,
  AddressWithTransactionSigner,
  decodeSignedTransaction,
  encodeSignedTransaction,
  getTransactionId,
  MultisigSignature,
  MultisigSubsignature,
  SignedTransaction,
  Transaction,
  TransactionSigner,
} from '@algorandfoundation/algokit-transact'

/**
 * Creates an empty multisignature signature from a list of participant addresses.
 */
export function newMultisigSignature(version: number, threshold: number, participants: Address[]): MultisigSignature {
  if (version === 0) {
    throw new Error('Version cannot be zero')
  }
  if (participants.length === 0) {
    throw new Error('Participants cannot be empty')
  }
  if (threshold === 0 || threshold > participants.length) {
    throw new Error('Threshold must be greater than zero and less than or equal to the number of participants')
  }

  return {
    version,
    threshold,
    subsignatures: participants.map((address) => ({ address })),
  }
}

/**
 * Returns the list of participant addresses from a multisignature signature.
 */
export function participantsFromMultisigSignature(multisigSignature: MultisigSignature): Address[] {
  return multisigSignature.subsignatures.map((subsig) => subsig.address)
}

const toPublicKeys = (addrs: Array<string | Address>): Uint8Array[] => addrs.map((addr) => getAddress(addr).publicKey)

/**
 * Returns the address of the multisignature account.
 */
export function addressFromMultisigSignature(multisigSignature: MultisigSignature): Address {
  return addressFromMultisigPreImg({
    version: multisigSignature.version,
    threshold: multisigSignature.threshold,
    pks: multisigSignature.subsignatures.map((subsig) => subsig.address.publicKey),
  })
}

/**
 * Applies a subsignature for a participant to a multisignature signature, replacing any existing signature.
 *
 * This method applies the signature to ALL instances of the given address (to support weighted multisig).
 * Since ed25519 signatures are deterministic, there's only one valid signature for a given message and public key.
 */
export function applyMultisigSubsignature(
  multisigSignature: MultisigSignature,
  participant: Address,
  signature: Uint8Array,
): MultisigSignature {
  let found = false
  const newSubsignatures = multisigSignature.subsignatures.map((subsig) => {
    if (subsig.address.equals(participant)) {
      found = true
      return { ...subsig, signature }
    }
    return subsig
  })

  if (!found) {
    throw new Error('Address not found in multisig signature')
  }

  return {
    ...multisigSignature,
    subsignatures: newSubsignatures,
  }
}

/**
 * Merges two multisignature signatures, replacing signatures in the first with those from the second where present.
 * For each participant, the resulting signature will be taken from the second multisig if present, otherwise from the first.
 */
export function mergeMultisignatures(multisigSignatureA: MultisigSignature, multisigSignatureB: MultisigSignature): MultisigSignature {
  if (multisigSignatureA.version !== multisigSignatureB.version) {
    throw new Error('Cannot merge multisig signatures with different versions')
  }
  if (multisigSignatureA.threshold !== multisigSignatureB.threshold) {
    throw new Error('Cannot merge multisig signatures with different thresholds')
  }

  // Check participants match exactly (same addresses in same order)
  const participantsA = participantsFromMultisigSignature(multisigSignatureA)
  const participantsB = participantsFromMultisigSignature(multisigSignatureB)
  if (JSON.stringify(participantsA) !== JSON.stringify(participantsB)) {
    throw new Error('Cannot merge multisig signatures with different participants')
  }

  const mergedSubsignatures: MultisigSubsignature[] = multisigSignatureA.subsignatures.map((s1, index) => {
    const s2 = multisigSignatureB.subsignatures[index]
    return {
      address: s1.address,
      signature: s2.signature || s1.signature, // Prefer s2, fall back to s1
    }
  })

  return {
    version: multisigSignatureA.version,
    threshold: multisigSignatureA.threshold,
    subsignatures: mergedSubsignatures,
  }
}

// Convert "MultisigAddr" UTF-8 to byte array
const MULTISIG_PREIMG2ADDR_PREFIX = new Uint8Array([77, 117, 108, 116, 105, 115, 105, 103, 65, 100, 100, 114])

const INVALID_MSIG_VERSION_ERROR_MSG = 'invalid multisig version'
const INVALID_MSIG_THRESHOLD_ERROR_MSG = 'bad multisig threshold'
const INVALID_MSIG_PK_ERROR_MSG = 'bad multisig public key - wrong length'
const UNEXPECTED_PK_LEN_ERROR_MSG = 'nacl public key length is not 32 bytes'

export const MULTISIG_MERGE_LESSTHANTWO_ERROR_MSG = 'Not enough multisig transactions to merge. Need at least two'
export const MULTISIG_MERGE_MISMATCH_ERROR_MSG = 'Cannot merge txs. txIDs differ'
export const MULTISIG_MERGE_MISMATCH_AUTH_ADDR_MSG = 'Cannot merge txs. Auth addrs differ'
export const MULTISIG_MERGE_WRONG_PREIMAGE_ERROR_MSG = 'Cannot merge txs. Multisig preimages differ'
export const MULTISIG_MERGE_SIG_MISMATCH_ERROR_MSG = 'Cannot merge txs. subsigs are mismatched.'
export const MULTISIG_NO_MUTATE_ERROR_MSG = 'Cannot mutate a multisig field as it would invalidate all existing signatures.'
export const MULTISIG_USE_PARTIAL_SIGN_ERROR_MSG = 'Cannot sign a multisig transaction using `signTxn`. Use `partialSignTxn` instead.'
export const MULTISIG_SIGNATURE_LENGTH_ERROR_MSG = 'Cannot add multisig signature. Signature is not of the correct length.'
const MULTISIG_KEY_NOT_EXIST_ERROR_MSG = 'Key does not exist'

/**
 * createMultisigTransaction creates a raw, unsigned multisig transaction blob.
 * @param txn - the actual transaction.
 * @param version - multisig version
 * @param threshold - multisig threshold
 * @param pks - ordered list of public keys in this multisig
 * @returns encoded multisig blob
 */
export function createMultisigTransaction(txn: Transaction, { version, threshold, addrs }: MultisigMetadata) {
  // construct the appendable multisigned transaction format
  const pks = toPublicKeys(addrs)
  const subsignatures: MultisigSubsignature[] = pks.map((pk) => ({
    address: new Address(pk),
    signature: undefined,
  }))

  const multiSignature: MultisigSignature = {
    version,
    threshold,
    subsignatures,
  }

  // if the address of this multisig is different from the transaction sender,
  // we need to add the auth-addr field
  const msigAddr = addressFromMultisigPreImg({
    version,
    threshold,
    pks,
  })
  let authAddress: Address | undefined
  if (!msigAddr.equals(txn.sender)) {
    authAddress = msigAddr
  }

  const signedTxn: SignedTransaction = {
    txn: txn,
    multiSignature,
    authAddress,
  }

  return encodeSignedTransaction(signedTxn)
}

interface MultisigOptions {
  rawSig: Uint8Array
  myPk: Uint8Array
}

interface MultisigMetadataWithPks extends Omit<MultisigMetadata, 'addrs'> {
  pks: Uint8Array[]
}

/**
 * createMultisigTransactionWithSignature creates a multisig transaction blob with an included signature.
 * @param txn - the actual transaction to sign.
 * @param rawSig - a Uint8Array raw signature of that transaction
 * @param myPk - a public key that corresponds with rawSig
 * @param version - multisig version
 * @param threshold - multisig threshold
 * @param pks - ordered list of public keys in this multisig
 * @returns encoded multisig blob
 */
function createMultisigTransactionWithSignature(
  txn: Transaction,
  { rawSig, myPk }: MultisigOptions,
  { version, threshold, pks }: MultisigMetadataWithPks,
): Uint8Array {
  // Create an empty encoded multisig transaction
  const encodedMsig = createMultisigTransaction(txn, {
    version,
    threshold,
    addrs: pks.map((pk) => new Address(pk)),
  })
  // note: this is not signed yet, but will be shortly
  const signedTxn = decodeSignedTransaction(encodedMsig)

  let keyExist = false

  // append the multisig signature to the corresponding public key in the multisig blob
  const updatedSubsigs = signedTxn.multiSignature!.subsignatures.map((subsig) => {
    if (arrayEqual(subsig.address.publicKey, myPk)) {
      keyExist = true
      return { ...subsig, signature: rawSig }
    }
    return subsig
  })

  if (!keyExist) {
    throw new Error(MULTISIG_KEY_NOT_EXIST_ERROR_MSG)
  }

  const updatedSignedTxn: SignedTransaction = {
    ...signedTxn,
    multiSignature: {
      ...signedTxn.multiSignature!,
      subsignatures: updatedSubsigs,
    },
  }

  return encodeSignedTransaction(updatedSignedTxn)
}

/**
 * mergeMultisigTransactions takes a list of multisig transaction blobs, and merges them.
 * @param multisigTxnBlobs - a list of blobs representing encoded multisig txns
 * @returns typed array msg-pack encoded multisig txn
 */
export function mergeMultisigTransactions(multisigTxnBlobs: Uint8Array[]) {
  if (multisigTxnBlobs.length < 2) {
    throw new Error(MULTISIG_MERGE_LESSTHANTWO_ERROR_MSG)
  }
  const refSigTx = decodeSignedTransaction(multisigTxnBlobs[0])
  if (!refSigTx.multiSignature) {
    throw new Error('Invalid multisig transaction, multisig structure missing at index 0')
  }
  const refTxID = getTransactionId(refSigTx.txn)
  const refAuthAddr = refSigTx.authAddress
  const refPreImage = {
    version: refSigTx.multiSignature.version,
    threshold: refSigTx.multiSignature.threshold,
    pks: refSigTx.multiSignature.subsignatures.map((subsig) => subsig.address.publicKey),
  }
  const refMsigAddr = addressFromMultisigPreImg(refPreImage)

  const newSubsigs: MultisigSubsignature[] = refSigTx.multiSignature.subsignatures.map((sig) => ({ ...sig }))
  for (let i = 1; i < multisigTxnBlobs.length; i++) {
    const unisig = decodeSignedTransaction(multisigTxnBlobs[i])
    if (!unisig.multiSignature) {
      throw new Error(`Invalid multisig transaction, multisig structure missing at index ${i}`)
    }

    if (getTransactionId(unisig.txn) !== refTxID) {
      throw new Error(MULTISIG_MERGE_MISMATCH_ERROR_MSG)
    }

    const authAddr = unisig.authAddress
    if (refAuthAddr !== authAddr) {
      throw new Error(MULTISIG_MERGE_MISMATCH_AUTH_ADDR_MSG)
    }

    // check multisig has same preimage as reference
    if (unisig.multiSignature.subsignatures.length !== refSigTx.multiSignature.subsignatures.length) {
      throw new Error(MULTISIG_MERGE_WRONG_PREIMAGE_ERROR_MSG)
    }
    const preimg: MultisigMetadataWithPks = {
      version: unisig.multiSignature.version,
      threshold: unisig.multiSignature.threshold,
      pks: unisig.multiSignature.subsignatures.map((subsig) => subsig.address.publicKey),
    }
    const msgigAddr = addressFromMultisigPreImg(preimg)
    if (refMsigAddr.toString() !== msgigAddr.toString()) {
      throw new Error(MULTISIG_MERGE_WRONG_PREIMAGE_ERROR_MSG)
    }

    // now, we can merge
    unisig.multiSignature.subsignatures.forEach((uniSubsig, index) => {
      if (!uniSubsig.signature) return
      const current = newSubsigs[index]
      if (current.signature && !arrayEqual(uniSubsig.signature, current.signature)) {
        // mismatch
        throw new Error(MULTISIG_MERGE_SIG_MISMATCH_ERROR_MSG)
      }
      current.signature = uniSubsig.signature
    })
  }

  const multiSignature: MultisigSignature = {
    version: refSigTx.multiSignature.version,
    threshold: refSigTx.multiSignature.threshold,
    subsignatures: newSubsigs,
  }

  const signedTxn: SignedTransaction = {
    txn: refSigTx.txn,
    multiSignature,
    authAddress: refAuthAddr,
  }

  return encodeSignedTransaction(signedTxn)
}

/**
 * partialSignWithMultisigSignature partially signs this transaction with an external raw multisig signature and returns
 * a partially-signed multisig transaction, encoded with msgpack as a typed array.
 * @param transaction - The transaction to sign
 * @param metadata - multisig metadata
 * @param signerAddr - address of the signer
 * @param signature - raw multisig signature
 * @returns an encoded, partially signed multisig transaction.
 */
function partialSignWithMultisigSignature(
  transaction: Transaction,
  metadata: MultisigMetadataWithPks,
  signerAddr: string | Address,
  signature: Uint8Array,
) {
  if (signature.length != SIGNATURE_BYTE_LENGTH) {
    throw new Error(MULTISIG_SIGNATURE_LENGTH_ERROR_MSG)
  }
  const signerAddressObj = typeof signerAddr === 'string' ? Address.fromString(signerAddr) : signerAddr
  return createMultisigTransactionWithSignature(
    transaction,
    {
      rawSig: signature,
      myPk: signerAddressObj.publicKey,
    },
    metadata,
  )
}

/**
 * appendMultisigTransactionSignature takes a multisig transaction blob, and appends a given raw signature to it.
 * This makes it possible to compile a multisig signature using only raw signatures from external methods.
 * @param multisigTxnBlob - an encoded multisig txn. Supports non-payment txn types.
 * @param version - multisig version
 * @param threshold - multisig threshold
 * @param addrs - a list of Algorand addresses representing possible signers for this multisig. Order is important.
 * @param signerAddr - address of the signer
 * @param signature - raw multisig signature
 * @returns object containing txID, and blob representing encoded multisig txn
 */
export function appendSignRawMultisigSignature(
  multisigTxnBlob: Uint8Array,
  { version, threshold, addrs }: MultisigMetadata,
  signerAddr: string | Address,
  signature: Uint8Array,
) {
  const pks = toPublicKeys(addrs)
  // obtain underlying txn, sign it, and merge it
  const multisigTxObj = decodeSignedTransaction(multisigTxnBlob)
  const partialSignedBlob = partialSignWithMultisigSignature(multisigTxObj.txn, { version, threshold, pks }, signerAddr, signature)
  return {
    txID: getTransactionId(multisigTxObj.txn),
    blob: mergeMultisigTransactions([multisigTxnBlob, partialSignedBlob]),
  }
}

/**
 * fromMultisigPreImg takes multisig parameters and returns a 32 byte typed array public key,
 * representing an address that identifies the "exact group, version, and public keys" that are required for signing.
 * Hash("MultisigAddr" || version uint8 || threshold uint8 || PK1 || PK2 || ...)
 * Encoding this output yields a human readable address.
 * @param version - multisig version
 * @param threshold - multisig threshold
 * @param pks - array of typed array public keys
 */
export function addressFromMultisigPreImg({
  version,
  threshold,
  pks,
}: Omit<MultisigMetadata, 'addrs'> & {
  pks: Uint8Array[]
}): Address {
  if (version > 255 || version < 0) {
    // ^ a tad redundant, but in case in the future version != 1, still check for uint8
    throw new Error(`${INVALID_MSIG_VERSION_ERROR_MSG}: ${version}`)
  }
  if (threshold === 0 || pks.length === 0 || threshold > pks.length || threshold > 255) {
    throw new Error(INVALID_MSIG_THRESHOLD_ERROR_MSG)
  }
  const pkLen = ALGORAND_ADDRESS_BYTE_LENGTH - ALGORAND_CHECKSUM_BYTE_LENGTH
  if (pkLen !== PUBLIC_KEY_BYTE_LENGTH) {
    throw new Error(UNEXPECTED_PK_LEN_ERROR_MSG)
  }
  const merged = new Uint8Array(MULTISIG_PREIMG2ADDR_PREFIX.length + 2 + pkLen * pks.length)
  merged.set(MULTISIG_PREIMG2ADDR_PREFIX, 0)
  merged.set([version], MULTISIG_PREIMG2ADDR_PREFIX.length)
  merged.set([threshold], MULTISIG_PREIMG2ADDR_PREFIX.length + 1)
  for (let i = 0; i < pks.length; i++) {
    if (pks[i].length !== pkLen) {
      throw new Error(INVALID_MSIG_PK_ERROR_MSG)
    }
    merged.set(pks[i], MULTISIG_PREIMG2ADDR_PREFIX.length + 2 + i * pkLen)
  }
  return new Address(Uint8Array.from(hash(merged)))
}

/**
 * fromMultisigPreImgAddrs takes multisig parameters and returns a human readable Algorand address.
 * This is equivalent to fromMultisigPreImg, but interfaces with encoded addresses.
 * @param version - multisig version
 * @param threshold - multisig threshold
 * @param addrs - array of encoded addresses
 */
export function addressFromMultisigPreImgAddrs({ version, threshold, addrs }: MultisigMetadata): Address {
  return addressFromMultisigPreImg({
    version,
    threshold,
    pks: toPublicKeys(addrs),
  })
}

/**
 * multisigAddress takes multisig metadata (preimage) and returns the corresponding human readable Algorand address.
 * @param version - multisig version
 * @param threshold - multisig threshold
 * @param addrs - list of Algorand addresses
 */
export const multisigAddress: typeof addressFromMultisigPreImgAddrs = addressFromMultisigPreImgAddrs

export interface MultisigMetadata {
  /**
   * Multisig version
   */
  version: number

  /**
   * Multisig threshold value. Authorization requires a subset of signatures,
   * equal to or greater than the threshold value.
   */
  threshold: number

  /**
   * A list of Algorand addresses representing possible signers for this multisig. Order is important.
   */
  addrs: Array<Address>
}

/** Account wrapper that supports partial or full multisig signing. */
export class MultisigAccount implements AddressWithTransactionSigner {
  _params: MultisigMetadata
  _subSigners: (AddressWithTransactionSigner & AddressWithDelegatedLsigSigner)[]
  _addr: Address
  _signer: TransactionSigner

  /** The parameters for the multisig account */
  get params(): Readonly<MultisigMetadata> {
    return this._params
  }

  /** The list of accounts that are present to sign transactions or lsigs */
  get subSigners() {
    return this._subSigners
  }

  /** The address of the multisig account */
  get addr(): Readonly<Address> {
    return this._addr
  }

  /** The transaction signer for the multisig account */
  get signer(): TransactionSigner {
    return this._signer
  }

  constructor(multisigParams: MultisigMetadata, subSigners: (AddressWithTransactionSigner & AddressWithDelegatedLsigSigner)[]) {
    this._params = multisigParams
    this._subSigners = subSigners
    this._addr = multisigAddress(multisigParams)
    this._signer = async (txns: Transaction[], indexesToSign: number[]): Promise<Uint8Array[]> => {
      const txnsToSign = txns.filter((_, index) => indexesToSign.includes(index))
      const signedMsigTxns: Uint8Array[] = []

      for (const txn of txnsToSign) {
        let signedMsigTxn = createMultisigTransaction(txn, this._params)

        for (const subSigner of this.subSigners) {
          const stxn = (await subSigner.signer([txn], [0]))[0]
          const sig = decodeSignedTransaction(stxn).signature

          if (!sig) {
            throw new Error(
              `Signer for address ${subSigner.addr.toString()} did not produce a valid signature when signing ${getTransactionId(txn)} for multisig account ${this._addr.toString()}`,
            )
          }

          signedMsigTxn = appendSignRawMultisigSignature(signedMsigTxn, this._params, subSigner.addr, sig).blob
        }

        signedMsigTxns.push(signedMsigTxn)
      }

      return signedMsigTxns
    }
  }
}
