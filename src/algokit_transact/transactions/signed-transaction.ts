import { addressCodec, bytesCodec, numberCodec, OmitEmptyObjectCodec } from '../encoding/codecs'
import { decodeMsgpack, encodeMsgpack } from '../encoding/msgpack'
import { LogicSignatureDto, MultisigSignatureDto, SignedTransactionDto } from '../encoding/signed-transaction-dto'
import { fromTransactionDto, toTransactionDto, Transaction, validateTransaction } from './transaction'

/**
 * Represents a signed Algorand transaction
 */
export type SignedTransaction = {
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
export type MultisigSubsignature = {
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
export type MultisigSignature = {
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
export type LogicSignature = {
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
 * @param signedTransaction - The signed transaction to encode
 * @returns The MsgPack encoded bytes or an error if encoding fails.
 */
export function encodeSignedTransaction(signedTransaction: SignedTransaction): Uint8Array {
  validateSignedTransaction(signedTransaction)
  const encodingData = toSignedTransactionDto(signedTransaction)
  return encodeMsgpack(encodingData)
}

/**
 * Encode signed transactions to MsgPack for sending on the network.
 *
 *  This method performs canonical encoding. No domain separation prefix is applicable.
 *
 * @param signedTransactions - A collection of signed transactions to encode
 * @returns A collection of MsgPack encoded bytes or an error if encoding fails.
 */
export function encodeSignedTransactions(signedTransactions: SignedTransaction[]): Uint8Array[] {
  return signedTransactions.map((st) => encodeSignedTransaction(st))
}

/**
 * Decodes MsgPack bytes into a signed transaction.
 *
 * @param encodedSignedTransaction - The MsgPack encoded signed transaction bytes
 * @returns The decoded SignedTransaction or an error if decoding fails.
 */
export function decodeSignedTransaction(encodedSignedTransaction: Uint8Array): SignedTransaction {
  const decodedData = decodeMsgpack<SignedTransactionDto>(encodedSignedTransaction)
  return fromSignedTransactionDto(decodedData)
}

/**
 * Decodes a collection of MsgPack bytes into a signed transaction collection.
 *
 * @param encodedSignedTransactions - A collection of MsgPack encoded bytes, each representing a signed transaction.
 * @returns A collection of decoded signed transactions or an error if decoding fails.
 */
export function decodeSignedTransactions(encodedSignedTransactions: Uint8Array[]): SignedTransaction[] {
  return encodedSignedTransactions.map((est) => decodeSignedTransaction(est))
}

/**
 * Validate a signed transaction structure
 */
function validateSignedTransaction(signedTransaction: SignedTransaction): void {
  validateTransaction(signedTransaction.transaction)

  // Validate that only one signature type is set
  const sigTypes = [signedTransaction.signature, signedTransaction.multiSignature, signedTransaction.logicSignature]
  const setSigCount = sigTypes.filter((sig) => sig !== undefined).length

  if (setSigCount === 0) {
    throw new Error('At least one signature type must be set')
  }
  if (setSigCount > 1) {
    throw new Error(`Only one signature type can be set, found ${setSigCount}`)
  }

  // Validate signature lengths
  if (signedTransaction.signature && signedTransaction.signature.length !== 64) {
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
  const stx_dto: SignedTransactionDto = {
    txn: toTransactionDto(signedTransaction.transaction),
  }

  if (signedTransaction.signature) {
    stx_dto.sig = bytesCodec.encode(signedTransaction.signature)
  }

  if (signedTransaction.multiSignature) {
    stx_dto.msig = toMultisigSignatureDto(signedTransaction.multiSignature)
  }

  if (signedTransaction.logicSignature) {
    stx_dto.lsig = logicSignatureDtoCodec.encode({
      l: bytesCodec.encode(signedTransaction.logicSignature.logic),
      arg: signedTransaction.logicSignature.args?.map((arg) => bytesCodec.encode(arg) ?? bytesCodec.defaultValue()),
      sig: bytesCodec.encode(signedTransaction.logicSignature.signature),
      ...(signedTransaction.logicSignature.multiSignature
        ? { msig: toMultisigSignatureDto(signedTransaction.logicSignature.multiSignature) }
        : undefined),
    })
  }

  if (signedTransaction.authAddress) {
    stx_dto.sgnr = addressCodec.encode(signedTransaction.authAddress)
  }

  return stx_dto
}

function fromMultisigSignatureDto(msigDto: MultisigSignatureDto): MultisigSignature | undefined {
  return multisigSignatureCodec.decodeOptional({
    version: numberCodec.decode(msigDto.v),
    threshold: numberCodec.decode(msigDto.thr),
    subsignatures:
      msigDto.subsig?.map((subsigData) => {
        return {
          address: addressCodec.decode(subsigData.pk),
          signature: bytesCodec.decodeOptional(subsigData.s),
        } satisfies MultisigSubsignature
      }) ?? [],
  })
}

function fromSignedTransactionDto(signedTransactionDto: SignedTransactionDto): SignedTransaction {
  const stx: SignedTransaction = {
    transaction: fromTransactionDto(signedTransactionDto.txn),
  }

  if (signedTransactionDto.sig) {
    stx.signature = bytesCodec.decodeOptional(signedTransactionDto.sig)
  }

  if (signedTransactionDto.msig) {
    stx.multiSignature = fromMultisigSignatureDto(signedTransactionDto.msig)
  }

  if (signedTransactionDto.lsig) {
    stx.logicSignature = logicSignatureCodec.decodeOptional({
      logic: bytesCodec.decode(signedTransactionDto.lsig.l),
      args: signedTransactionDto.lsig.arg?.map((arg) => bytesCodec.decode(arg)),
      signature: bytesCodec.decodeOptional(signedTransactionDto.lsig.sig),
      ...(signedTransactionDto.lsig.msig ? { multiSignature: fromMultisigSignatureDto(signedTransactionDto.lsig.msig) } : undefined),
    })
  }

  if (signedTransactionDto.sgnr) {
    stx.authAddress = addressCodec.decodeOptional(signedTransactionDto.sgnr)
  }

  return stx
}
