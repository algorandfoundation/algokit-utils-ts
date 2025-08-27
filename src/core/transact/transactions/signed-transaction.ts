import { addressCodec, bytesCodec, numberCodec, OmitEmptyObjectCodec } from '../encoding/codecs'
import { decodeMsgpack, encodeMsgpack } from '../encoding/msgpack'
import { LogicSignatureDto, MultisigSignatureDto, SignedTransactionDto } from '../encoding/signed-transaction-dto'
import { fromTransactionDto, toTransactionDto, Transaction, validateTransaction } from './transaction'

/**
 * Represents a signed Algorand transaction
 */
export interface SignedTransaction {
  /**
   * The transaction that has been signed.
   */
  transaction: Transaction

  /**
   * Optional Ed25519 signature authorizing the transaction.
   */
  signature?: Uint8Array

  /**
   * Optional multisignature signature for the transaction.
   */
  multiSignature?: MultisigSignature

  /**
   * Optional logic signature for the transaction.
   */
  logicSignature?: LogicSignature

  /**
   * Optional auth address applicable if the transaction sender is a rekeyed account.
   */
  authAddress?: string
}

/**
 * Represents a single subsignature in a multisignature transaction.
 *
 * Each subsignature contains the address of a participant and an optional signature.
 */
export interface MultisigSubsignature {
  /**
   * Address of a keypair account participant that is sub-signing a multisignature transaction.
   */
  address: string

  /**
   * Optional Ed25519 signature for the transaction.
   */
  signature?: Uint8Array
}

/**
 * Represents an Algorand multisignature signature.
 *
 * A multisignature signature is defined by a version, a threshold, and a list of participating addresses.
 * The version indicates the multisig protocol version, while the threshold specifies the minimum number of signatures required to authorize a transaction.
 * While technically this accepts `Address` types, it is expected that these will be the addresses of Ed25519 public keys.
 */
export interface MultisigSignature {
  /**
   * Multisig version.
   */
  version: number

  /**
   * Minimum number of signatures required.
   */
  threshold: number

  /**
   * Array of subsignatures
   */
  subsignatures: Array<MultisigSubsignature>
}

/**
 * Logic signature structure
 */
export interface LogicSignature {
  /**
   * Logic signature program
   */
  logic: Uint8Array

  /**
   * Logic signature arguments
   */
  args?: Uint8Array[]

  /**
   * Signature for delegated logic sig
   */
  signature?: Uint8Array

  /**
   * Multisig for delegated logic sig
   */
  multiSignature?: MultisigSignature
}

/**
 * Encode signed transactions to MsgPack for sending on the network.
 *
 * This method performs canonical encoding. No domain separation prefix is applicable.
 *
 * @param signedTx - The signed transaction to encode
 * @returns The MsgPack encoded bytes or an error if encoding fails.
 */
export function encodeSignedTransaction(signedTx: SignedTransaction): Uint8Array {
  validateSignedTransaction(signedTx)
  const encodingData = toSignedTransactionDto(signedTx)
  return encodeMsgpack(encodingData)
}

/**
 * Encode signed transactions to MsgPack for sending on the network.
 *
 *  This method performs canonical encoding. No domain separation prefix is applicable.
 *
 * @param signedTxs - A collection of signed transactions to encode
 * @returns A collection of MsgPack encoded bytes or an error if encoding fails.
 */
export function encodeSignedTransactions(signedTxs: SignedTransaction[]): Uint8Array[] {
  return signedTxs.map((st) => encodeSignedTransaction(st))
}

/**
 * Decodes MsgPack bytes into a signed transaction.
 *
 * @param encodedSignedTx - The MsgPack encoded signed transaction bytes
 * @returns The decoded SignedTransaction or an error if decoding fails.
 */
export function decodeSignedTransaction(encodedSignedTx: Uint8Array): SignedTransaction {
  const decodedData = decodeMsgpack<SignedTransactionDto>(encodedSignedTx)
  return fromSignedTransactionDto(decodedData)
}

/**
 * Decodes a collection of MsgPack bytes into a signed transaction collection.
 *
 * @param encodedSignedTxs - A collection of MsgPack encoded bytes, each representing a signed transaction.
 * @returns A collection of decoded signed transactions or an error if decoding fails.
 */
export function decodeSignedTransactions(encodedSignedTxs: Uint8Array[]): SignedTransaction[] {
  return encodedSignedTxs.map((est) => decodeSignedTransaction(est))
}

/**
 * Validate a signed transaction structure
 */
function validateSignedTransaction(signedTx: SignedTransaction): void {
  validateTransaction(signedTx.transaction)

  // Validate that only one signature type is set
  const sigTypes = [signedTx.signature, signedTx.multiSignature, signedTx.logicSignature]
  const setSigCount = sigTypes.filter((sig) => sig !== undefined).length

  if (setSigCount === 0) {
    throw new Error('At least one signature type must be set')
  }
  if (setSigCount > 1) {
    throw new Error(`Only one signature type can be set, found ${setSigCount}`)
  }

  // Validate signature lengths
  if (signedTx.signature && signedTx.signature.length !== 64) {
    throw new Error('Signature must be 64 bytes')
  }
}
const multisigSignatureCodec = new OmitEmptyObjectCodec<MultisigSignature>()
const multisigSignatureDtoCodec = new OmitEmptyObjectCodec<MultisigSignatureDto>()
const logicSignatureCodec = new OmitEmptyObjectCodec<LogicSignature>()
const logicSignatureDtoCodec = new OmitEmptyObjectCodec<LogicSignatureDto>()

function toMultisigSignatureDto(multisigSignature: MultisigSignature): MultisigSignatureDto | undefined {
  return multisigSignatureDtoCodec.encode({
    v: numberCodec.encode(multisigSignature.version),
    thr: numberCodec.encode(multisigSignature.threshold),
    subsig: multisigSignature.subsignatures.map((subsig) => ({
      pk: addressCodec.encode(subsig.address),
      s: bytesCodec.encode(subsig.signature),
    })),
  })
}

function toSignedTransactionDto(signedTransaction: SignedTransaction): SignedTransactionDto {
  const data: SignedTransactionDto = {
    txn: toTransactionDto(signedTransaction.transaction),
  }

  if (signedTransaction.signature) {
    data.sig = bytesCodec.encode(signedTransaction.signature)
  }

  if (signedTransaction.multiSignature) {
    data.msig = toMultisigSignatureDto(signedTransaction.multiSignature)
  }

  if (signedTransaction.logicSignature) {
    data.lsig = logicSignatureDtoCodec.encode({
      l: bytesCodec.encode(signedTransaction.logicSignature.logic),
      arg: signedTransaction.logicSignature.args?.map((arg) => bytesCodec.encode(arg) ?? bytesCodec.defaultValue()),
      sig: bytesCodec.encode(signedTransaction.logicSignature.signature),
      ...(signedTransaction.logicSignature.multiSignature
        ? { msig: toMultisigSignatureDto(signedTransaction.logicSignature.multiSignature) }
        : undefined),
    })
  }

  if (signedTransaction.authAddress) {
    data.sgnr = addressCodec.encode(signedTransaction.authAddress)
  }

  return data
}

function fromMultisigSignatureDto(msigData: MultisigSignatureDto): MultisigSignature | undefined {
  return multisigSignatureCodec.decodeOptional({
    version: numberCodec.decode(msigData.v),
    threshold: numberCodec.decode(msigData.thr),
    subsignatures:
      msigData.subsig?.map((subsigData) => {
        return {
          address: addressCodec.decode(subsigData.pk),
          signature: bytesCodec.decodeOptional(subsigData.s),
        } satisfies MultisigSubsignature
      }) ?? [],
  })
}

function fromSignedTransactionDto(data: SignedTransactionDto): SignedTransaction {
  const signedTransaction: SignedTransaction = {
    transaction: fromTransactionDto(data.txn),
  }

  if (data.sig) {
    signedTransaction.signature = bytesCodec.decodeOptional(data.sig)
  }

  if (data.msig) {
    signedTransaction.multiSignature = fromMultisigSignatureDto(data.msig)
  }

  if (data.lsig) {
    signedTransaction.logicSignature = logicSignatureCodec.decodeOptional({
      logic: bytesCodec.decode(data.lsig.l),
      args: data.lsig.arg?.map((arg) => bytesCodec.decode(arg)),
      signature: bytesCodec.decodeOptional(data.lsig.sig),
      ...(data.lsig.msig ? { multiSignature: fromMultisigSignatureDto(data.lsig.msig) } : undefined),
    })
  }

  if (data.sgnr) {
    signedTransaction.authAddress = addressCodec.decodeOptional(data.sgnr)
  }

  return signedTransaction
}
