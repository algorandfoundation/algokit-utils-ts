import type { MultisigSignature, MultisigSubsignature, SignedTransaction, Transaction } from '@algorandfoundation/algokit-transact'
import { decodeSignedTransaction, encodeSignedTransaction, encodeTransaction, getTransactionId } from '@algorandfoundation/algokit-transact'
import { Address } from './encoding/address.js'
import { MultisigMetadata, addressFromMultisigPreImg, pksFromAddresses } from './multisig.js'
import * as nacl from './nacl/naclWrappers.js'
import * as utils from './utils/utils.js'

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
  const pks = pksFromAddresses(addrs)
  const subsignatures: MultisigSubsignature[] = pks.map((pk) => ({
    address: new Address(pk).toString(),
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
  let authAddress: string | undefined
  if (msigAddr.toString() !== txn.sender) {
    authAddress = msigAddr.toString()
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
    if (Address.fromString(subsig.address).publicKey.every((byte, idx) => byte === myPk[idx])) {
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
 * partialSignTxn partially signs this transaction and returns a partially-signed multisig transaction,
 * encoded with msgpack as a typed array.
 * @param transaction - The transaction to sign
 * @param version - multisig version
 * @param threshold - multisig threshold
 * @param pks - multisig public key list, order is important.
 * @param sk - an Algorand secret key to sign with.
 * @returns an encoded, partially signed multisig transaction.
 */
function partialSignTxn(transaction: Transaction, { version, threshold, pks }: MultisigMetadataWithPks, sk: Uint8Array) {
  // get signature verifier
  const myPk = nacl.keyPairFromSecretKey(sk).publicKey
  const bytesToSign = encodeTransaction(transaction)
  const rawSig = nacl.sign(bytesToSign, sk)
  return createMultisigTransactionWithSignature(transaction, { rawSig, myPk }, { version, threshold, pks })
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
  if (!nacl.isValidSignatureLength(signature.length)) {
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
    pks: refSigTx.multiSignature.subsignatures.map((subsig) => Address.fromString(subsig.address).publicKey),
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
      pks: unisig.multiSignature.subsignatures.map((subsig) => Address.fromString(subsig.address).publicKey),
    }
    const msgigAddr = addressFromMultisigPreImg(preimg)
    if (refMsigAddr.toString() !== msgigAddr.toString()) {
      throw new Error(MULTISIG_MERGE_WRONG_PREIMAGE_ERROR_MSG)
    }

    // now, we can merge
    unisig.multiSignature.subsignatures.forEach((uniSubsig, index) => {
      if (!uniSubsig.signature) return
      const current = newSubsigs[index]
      if (current.signature && !utils.arrayEqual(uniSubsig.signature, current.signature)) {
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
 * signMultisigTransaction takes a raw transaction (see signTransaction), a multisig preimage, a secret key, and returns
 * a multisig transaction, which is a blob representing a transaction and multisignature account preimage. The returned
 * multisig txn can accumulate additional signatures through mergeMultisigTransactions or appendSignMultisigTransaction.
 * @param txn - object with either payment or key registration fields
 * @param version - multisig version
 * @param threshold - multisig threshold
 * @param addrs - a list of Algorand addresses representing possible signers for this multisig. Order is important.
 * @param sk - Algorand secret key. The corresponding pk should be in the pre image.
 * @returns object containing txID, and blob of partially signed multisig transaction (with multisig preimage information)
 * If the final calculated fee is lower than the protocol minimum fee, the fee will be increased to match the minimum.
 */
export function signMultisigTransaction(txn: Transaction, { version, threshold, addrs }: MultisigMetadata, sk: Uint8Array) {
  // build pks for partialSign
  const pks = pksFromAddresses(addrs)
  const blob = partialSignTxn(txn, { version, threshold, pks }, sk)
  return {
    txID: getTransactionId(txn),
    blob,
  }
}

/**
 * appendSignMultisigTransaction takes a multisig transaction blob, and appends our signature to it.
 * While we could derive public key preimagery from the partially-signed multisig transaction,
 * we ask the caller to pass it back in, to ensure they know what they are signing.
 * @param multisigTxnBlob - an encoded multisig txn. Supports non-payment txn types.
 * @param version - multisig version
 * @param threshold - multisig threshold
 * @param addrs - a list of Algorand addresses representing possible signers for this multisig. Order is important.
 * @param sk - Algorand secret key
 * @returns object containing txID, and blob representing encoded multisig txn
 */
export function appendSignMultisigTransaction(
  multisigTxnBlob: Uint8Array,
  { version, threshold, addrs }: MultisigMetadata,
  sk: Uint8Array,
) {
  const pks = pksFromAddresses(addrs)
  // obtain underlying txn, sign it, and merge it
  const multisigTxObj = decodeSignedTransaction(multisigTxnBlob)
  const partialSignedBlob = partialSignTxn(multisigTxObj.txn, { version, threshold, pks }, sk)
  return {
    txID: getTransactionId(multisigTxObj.txn),
    blob: mergeMultisigTransactions([multisigTxnBlob, partialSignedBlob]),
  }
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
  const pks = pksFromAddresses(addrs)
  // obtain underlying txn, sign it, and merge it
  const multisigTxObj = decodeSignedTransaction(multisigTxnBlob)
  const partialSignedBlob = partialSignWithMultisigSignature(multisigTxObj.txn, { version, threshold, pks }, signerAddr, signature)
  return {
    txID: getTransactionId(multisigTxObj.txn),
    blob: mergeMultisigTransactions([multisigTxnBlob, partialSignedBlob]),
  }
}
