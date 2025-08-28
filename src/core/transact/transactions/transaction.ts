import base32 from 'hi-base32'
import {
  ALGORAND_TRANSACTION_LENGTH,
  MAX_TX_GROUP_SIZE,
  SIGNATURE_ENCODING_INCR,
  TRANSACTION_DOMAIN_SEPARATOR,
  TRANSACTION_GROUP_DOMAIN_SEPARATOR,
} from '../../constants'
import { hash } from '../../crypto'
import { addressCodec, bigIntCodec, booleanCodec, bytesCodec, numberCodec, OmitEmptyObjectCodec, stringCodec } from '../encoding/codecs'
import { decodeMsgpack, encodeMsgpack } from '../encoding/msgpack'
import { AssetParamsDto, StateSchemaDto, TransactionDto } from '../encoding/transaction-dto'
import { AppCallTransactionFields, OnApplicationComplete, StateSchema } from './app-call'
import { AssetConfigTransactionFields } from './asset-config'
import { AssetFreezeTransactionFields } from './asset-freeze'
import { AssetTransferTransactionFields } from './asset-transfer'
import { KeyRegistrationTransactionFields } from './key-registration'
import { PaymentTransactionFields } from './payment'

/**
 * Represents a complete Algorand transaction.
 *
 * This structure contains the fields that are present in every transaction,
 * regardless of transaction type, plus transaction-type-specific fields.
 */
export interface Transaction {
  /**
   * The type of transaction
   */
  transactionType: TransactionType

  /**
   * The account that authorized the transaction.
   *
   * Fees are deducted from this account.
   */
  sender: string

  /**
   * Optional transaction fee in microALGO.
   *
   * When not set, the fee will be interpreted as 0 by the network.
   */
  fee?: bigint

  /**
   * First round for when the transaction is valid.
   */
  firstValid: bigint

  /**
   * Last round for when the transaction is valid.
   *
   * After this round, the transaction will be expired.
   */
  lastValid: bigint

  /**
   * Hash of the genesis block of the network.
   *
   * Used to identify which network the transaction is for.
   */
  genesisHash?: Uint8Array

  /**
   * Genesis ID of the network.
   *
   * A human-readable string used alongside genesis hash to identify the network.
   */
  genesisId?: string

  /**
   * Optional user-defined note field.
   *
   * Can contain arbitrary data up to 1KB in size.
   */
  note?: Uint8Array

  /**
   * Optional authorized account for future transactions.
   *
   * If set, only this account will be used for transaction authorization going forward.
   * Reverting back control to the original address must be done by setting this field to
   * the original address.
   */
  rekeyTo?: string

  /**
   * Optional lease value to enforce mutual transaction exclusion.
   *
   * When a transaction with a non-empty lease field is confirmed, the lease is acquired.
   * A lease X is acquired by the sender, generating the (sender, X) lease.
   * The lease is kept active until the last_valid round of the transaction has elapsed.
   * No other transaction sent by the same sender can be confirmed until the lease expires.
   */
  lease?: Uint8Array

  /**
   * Optional group ID for atomic transaction grouping.
   *
   * Transactions with the same group ID must execute together or not at all.
   */
  group?: Uint8Array

  /**
   * Payment specific fields
   */
  payment?: PaymentTransactionFields

  /**
   * Asset transfer specific fields
   */
  assetTransfer?: AssetTransferTransactionFields

  /**
   * Asset config specific fields
   */
  assetConfig?: AssetConfigTransactionFields

  /**
   * App call specific fields
   */
  appCall?: AppCallTransactionFields

  /**
   * Key registration specific fields
   */
  keyRegistration?: KeyRegistrationTransactionFields

  /**
   * Asset freeze specific fields
   */
  assetFreeze?: AssetFreezeTransactionFields
}

/**
 * Supported transaction types
 */
export type TransactionType = 'Payment' | 'AssetTransfer' | 'AssetFreeze' | 'AssetConfig' | 'KeyRegistration' | 'AppCall'

export interface FeeParams {
  feePerByte: bigint
  minFee: bigint
  extraFee?: bigint
  maxFee?: bigint
}

/**
 * Get the transaction type from the encoded transaction.
 * This is particularly useful when decoding a transaction that has an unknown type
 */
export function getEncodedTransactionType(encoded_tx: Uint8Array): TransactionType {
  const decoded = decodeTransaction(encoded_tx)
  return decoded.transactionType
}

/**
 * Encode the transaction with the domain separation (e.g. "TX") prefix
 *
 * @param tx - The transaction to encode
 * @returns The MsgPack encoded bytes or an error if encoding fails.
 */
export function encodeTransaction(tx: Transaction): Uint8Array {
  validateTransaction(tx)
  const rawBytes = encodeTransactionRaw(tx)
  const prefixedBytes = new Uint8Array(TRANSACTION_DOMAIN_SEPARATOR.length + rawBytes.length)

  // Add domain separation prefix
  const prefixBytes = new TextEncoder().encode(TRANSACTION_DOMAIN_SEPARATOR)
  prefixedBytes.set(prefixBytes, 0)
  prefixedBytes.set(rawBytes, prefixBytes.length)

  return prefixedBytes
}

/**
 * Encode transactions with the domain separation (e.g. "TX") prefix
 *
 * @param txs - A collection of transactions to encode
 * @returns A collection of MsgPack encoded bytes or an error if encoding fails.
 */
export function encodeTransactions(txs: Transaction[]): Uint8Array[] {
  return txs.map((tx) => encodeTransaction(tx))
}

/**
 * Validate a transaction structure
 */
export function validateTransaction(tx: Transaction): void {
  if (!tx.sender) {
    throw new Error('Transaction sender is required')
  }

  // Validate that only one transaction type specific field is set
  const typeFields = [tx.payment, tx.assetTransfer, tx.assetConfig, tx.appCall, tx.keyRegistration, tx.assetFreeze]

  const setFieldsCount = typeFields.filter((field) => field !== undefined).length

  if (setFieldsCount === 0) {
    throw new Error('No transaction type specific field is set')
  }

  if (setFieldsCount > 1) {
    throw new Error('Multiple transaction type specific fields set')
  }
}

/**
 * Encode the transaction without the domain separation (e.g. "TX") prefix
 * This is useful for encoding the transaction for signing with tools that automatically add "TX" prefix to the transaction bytes.
 */
export function encodeTransactionRaw(tx: Transaction): Uint8Array {
  validateTransaction(tx)
  const encodingData = toTransactionDto(tx)
  return encodeMsgpack(encodingData)
}

/**
 * Decodes MsgPack bytes into a transaction.
 *
 * # Parameters
 * * `encoded_tx` - MsgPack encoded bytes representing a transaction.
 *
 * # Returns
 * A decoded transaction or an error if decoding fails.
 */
export function decodeTransaction(encoded_tx: Uint8Array): Transaction {
  if (encoded_tx.length === 0) {
    throw new Error('attempted to decode 0 bytes')
  }

  const prefixBytes = new TextEncoder().encode(TRANSACTION_DOMAIN_SEPARATOR)
  // Check if the transaction has the domain separation prefix
  let hasPrefix = true
  if (encoded_tx.length < prefixBytes.length) {
    hasPrefix = false
  } else {
    for (let i = 0; i < prefixBytes.length; i++) {
      if (encoded_tx[i] !== prefixBytes[i]) {
        hasPrefix = false
        break
      }
    }
  }

  const decodedData = decodeMsgpack<TransactionDto>(hasPrefix ? encoded_tx.slice(prefixBytes.length) : encoded_tx)
  return fromTransactionDto(decodedData)
}

/**
 * Decodes a collection of MsgPack bytes into a transaction collection.
 *
 * # Parameters
 * * `encoded_txs` - A collection of MsgPack encoded bytes, each representing a transaction.
 *
 * # Returns
 * A collection of decoded transactions or an error if decoding fails.
 */
export function decodeTransactions(encoded_txs: Uint8Array[]): Transaction[] {
  return encoded_txs.map((et) => decodeTransaction(et))
}

/**
 * Return the size of the transaction in bytes as if it was already signed and encoded.
 * This is useful for estimating the fee for the transaction.
 */
export function estimateTransactionSize(tx: Transaction): bigint {
  const encoded = encodeTransactionRaw(tx)
  return BigInt(encoded.length + SIGNATURE_ENCODING_INCR)
}

/**
 * Get the raw 32-byte transaction ID for a transaction.
 */
export function getTransactionIdRaw(tx: Transaction): Uint8Array {
  const encodedBytes = encodeTransaction(tx)
  return hash(encodedBytes)
}

/**
 * Get the base32 transaction ID string for a transaction.
 */
export function getTransactionId(tx: Transaction): string {
  const hash = getTransactionIdRaw(tx)
  return base32.encode(hash).slice(0, ALGORAND_TRANSACTION_LENGTH)
}

/**
 * Groups a collection of transactions by calculating and assigning the group to each transaction.
 */
export function groupTransactions(txs: Transaction[]): Transaction[] {
  const groupId = computeGroupId(txs)
  return txs.map((tx) => ({
    ...tx,
    group: groupId,
  }))
}

export function assignFee(tx: Transaction, feeParams: FeeParams): Transaction {
  const fee = calculateFee(tx, feeParams)
  return {
    ...tx,
    fee,
  }
}

function computeGroupId(txs: Transaction[]): Uint8Array {
  if (txs.length === 0) {
    throw new Error('Transaction group size cannot be 0')
  }

  if (txs.length > MAX_TX_GROUP_SIZE) {
    throw new Error(`Transaction group size exceeds the max limit of ${MAX_TX_GROUP_SIZE}`)
  }

  const txHashes = txs.map((tx) => {
    if (tx.group) {
      throw new Error('Transactions must not already be grouped')
    }
    return getTransactionIdRaw(tx)
  })

  const prefixBytes = new TextEncoder().encode(TRANSACTION_GROUP_DOMAIN_SEPARATOR)
  const encodedBytes = encodeMsgpack({
    txlist: txHashes,
  })

  const prefixedBytes = new Uint8Array(prefixBytes.length + encodedBytes.length)
  prefixedBytes.set(prefixBytes, 0)
  prefixedBytes.set(encodedBytes, prefixBytes.length)

  return hash(prefixedBytes)
}

function calculateFee(tx: Transaction, feeParams: FeeParams): bigint {
  let calculatedFee = 0n

  if (feeParams.feePerByte > 0n) {
    const estimatedSize = estimateTransactionSize(tx)
    calculatedFee = feeParams.feePerByte * BigInt(estimatedSize)
  }

  if (calculatedFee < feeParams.minFee) {
    calculatedFee = feeParams.minFee
  }

  if (feeParams.extraFee) {
    calculatedFee += feeParams.extraFee
  }

  if (feeParams.maxFee && calculatedFee > feeParams.maxFee) {
    throw new Error(`Transaction fee ${calculatedFee} µALGO is greater than max fee ${feeParams.maxFee} µALGO`)
  }

  return calculatedFee
}

/**
 * Get transaction type string for MessagePack
 */
function toTransactionTypeDto(type: TransactionType): TransactionDto['type'] {
  switch (type) {
    case 'Payment':
      return 'pay'
    case 'AssetTransfer':
      return 'axfer'
    case 'AssetFreeze':
      return 'afrz'
    case 'AssetConfig':
      return 'acfg'
    case 'KeyRegistration':
      return 'keyreg'
    case 'AppCall':
      return 'appl'
    default:
      throw new Error(`Unknown transaction type: ${type}`)
  }
}

/**
 * Get transaction type from MsgPack string
 */
function fromTransactionTypeDto(type: TransactionDto['type']): TransactionType {
  switch (type) {
    case 'pay':
      return 'Payment'
    case 'axfer':
      return 'AssetTransfer'
    case 'afrz':
      return 'AssetFreeze'
    case 'acfg':
      return 'AssetConfig'
    case 'keyreg':
      return 'KeyRegistration'
    case 'appl':
      return 'AppCall'
    default:
      throw new Error(`Unknown transaction type string: ${type}`)
  }
}

/**
 * Get on OnApplicationComplete number for MsgPack
 */
function toOnApplicationCompleteDto(onComplete: OnApplicationComplete): Exclude<TransactionDto['apan'], undefined> {
  switch (onComplete) {
    case 'NoOp':
      return 0
    case 'OptIn':
      return 1
    case 'CloseOut':
      return 2
    case 'ClearState':
      return 3
    case 'UpdateApplication':
      return 4
    case 'DeleteApplication':
      return 5
    default:
      throw new Error(`Unknown OnApplicationComplete: ${onComplete}`)
  }
}

/**
 * Get OnApplicationComplete from MsgPack number
 */
function fromOnApplicationCompleteDto(onComplete: TransactionDto['apan']): OnApplicationComplete {
  switch (onComplete ?? 0) {
    case 0:
      return 'NoOp'
    case 1:
      return 'OptIn'
    case 2:
      return 'CloseOut'
    case 3:
      return 'ClearState'
    case 4:
      return 'UpdateApplication'
    case 5:
      return 'DeleteApplication'
    default:
      throw new Error(`Unknown OnApplicationComplete number: ${onComplete}`)
  }
}

const stateSchemaCodec = new OmitEmptyObjectCodec<StateSchema>()
const stateSchemaDtoCodec = new OmitEmptyObjectCodec<StateSchemaDto>()
const assetParamsDtoCodec = new OmitEmptyObjectCodec<AssetParamsDto>()

export function toTransactionDto(tx: Transaction): TransactionDto {
  const encodeable_tx: TransactionDto = {
    type: toTransactionTypeDto(tx.transactionType),
    fv: bigIntCodec.encode(tx.firstValid),
    lv: bigIntCodec.encode(tx.lastValid),
    snd: addressCodec.encode(tx.sender),
    gen: stringCodec.encode(tx.genesisId),
    gh: bytesCodec.encode(tx.genesisHash),
    fee: bigIntCodec.encode(tx.fee),
    note: bytesCodec.encode(tx.note),
    lx: bytesCodec.encode(tx.lease),
    rekey: addressCodec.encode(tx.rekeyTo),
    grp: bytesCodec.encode(tx.group),
  }

  // Add transaction type specific fields
  if (tx.payment) {
    encodeable_tx.amt = bigIntCodec.encode(tx.payment.amount)
    encodeable_tx.rcv = addressCodec.encode(tx.payment.receiver)
    encodeable_tx.close = addressCodec.encode(tx.payment.closeRemainderTo)
  }

  if (tx.assetTransfer) {
    encodeable_tx.xaid = bigIntCodec.encode(tx.assetTransfer.assetId)
    encodeable_tx.aamt = bigIntCodec.encode(tx.assetTransfer.amount)
    encodeable_tx.arcv = addressCodec.encode(tx.assetTransfer.receiver)
    encodeable_tx.aclose = addressCodec.encode(tx.assetTransfer.closeRemainderTo)
    encodeable_tx.asnd = addressCodec.encode(tx.assetTransfer.assetSender)
  }

  if (tx.assetConfig) {
    encodeable_tx.caid = bigIntCodec.encode(tx.assetConfig.assetId)
    // Asset config field
    encodeable_tx.apar = assetParamsDtoCodec.encode({
      t: bigIntCodec.encode(tx.assetConfig.total),
      dc: numberCodec.encode(tx.assetConfig.decimals),
      df: booleanCodec.encode(tx.assetConfig.defaultFrozen),
      un: stringCodec.encode(tx.assetConfig.unitName),
      an: stringCodec.encode(tx.assetConfig.assetName),
      au: stringCodec.encode(tx.assetConfig.url),
      am: bytesCodec.encode(tx.assetConfig.metadataHash),
      m: addressCodec.encode(tx.assetConfig.manager),
      f: addressCodec.encode(tx.assetConfig.freeze),
      c: addressCodec.encode(tx.assetConfig.clawback),
      r: addressCodec.encode(tx.assetConfig.reserve),
    })
  }

  if (tx.assetFreeze) {
    encodeable_tx.faid = bigIntCodec.encode(tx.assetFreeze.assetId)
    encodeable_tx.fadd = addressCodec.encode(tx.assetFreeze.freezeTarget)
    encodeable_tx.afrz = booleanCodec.encode(tx.assetFreeze.frozen)
  }

  if (tx.appCall) {
    encodeable_tx.apid = bigIntCodec.encode(tx.appCall.appId)
    encodeable_tx.apan = numberCodec.encode(toOnApplicationCompleteDto(tx.appCall.onComplete))
    encodeable_tx.apap = bytesCodec.encode(tx.appCall.approvalProgram)
    encodeable_tx.apsu = bytesCodec.encode(tx.appCall.clearStateProgram)
    if (tx.appCall.globalStateSchema) {
      encodeable_tx.apgs = stateSchemaDtoCodec.encode({
        nui: numberCodec.encode(tx.appCall.globalStateSchema.numUints),
        nbs: numberCodec.encode(tx.appCall.globalStateSchema.numByteSlices),
      })
    }
    if (tx.appCall.localStateSchema) {
      encodeable_tx.apls = stateSchemaDtoCodec.encode({
        nui: numberCodec.encode(tx.appCall.localStateSchema.numUints),
        nbs: numberCodec.encode(tx.appCall.localStateSchema.numByteSlices),
      })
    }
    encodeable_tx.apaa = tx.appCall.args?.map((arg) => bytesCodec.encode(arg) ?? bytesCodec.defaultValue())
    encodeable_tx.apat = tx.appCall.accountReferences?.map((a) => addressCodec.encode(a) ?? addressCodec.defaultValue())
    encodeable_tx.apfa = tx.appCall.appReferences?.map((a) => bigIntCodec.encode(a) ?? bigIntCodec.defaultValue())
    encodeable_tx.apas = tx.appCall.assetReferences?.map((a) => bigIntCodec.encode(a) ?? bigIntCodec.defaultValue())
    encodeable_tx.apep = numberCodec.encode(tx.appCall.extraProgramPages)
  }

  if (tx.keyRegistration) {
    encodeable_tx.votekey = bytesCodec.encode(tx.keyRegistration.voteKey)
    encodeable_tx.selkey = bytesCodec.encode(tx.keyRegistration.selectionKey)
    encodeable_tx.votefst = bigIntCodec.encode(tx.keyRegistration.voteFirst)
    encodeable_tx.votelst = bigIntCodec.encode(tx.keyRegistration.voteLast)
    encodeable_tx.votekd = bigIntCodec.encode(tx.keyRegistration.voteKeyDilution)
    encodeable_tx.sprfkey = bytesCodec.encode(tx.keyRegistration.stateProofKey)
    encodeable_tx.nonpart = booleanCodec.encode(tx.keyRegistration.nonParticipation)
  }

  return encodeable_tx
}

export function fromTransactionDto(encodeable_tx: TransactionDto): Transaction {
  const transactionType = fromTransactionTypeDto(encodeable_tx.type)

  const tx: Transaction = {
    transactionType,
    sender: addressCodec.decode(encodeable_tx.snd),
    firstValid: bigIntCodec.decode(encodeable_tx.fv),
    lastValid: bigIntCodec.decode(encodeable_tx.lv),
    fee: bigIntCodec.decodeOptional(encodeable_tx.fee),
    genesisId: stringCodec.decodeOptional(encodeable_tx.gen),
    genesisHash: bytesCodec.decodeOptional(encodeable_tx.gh),
    note: bytesCodec.decodeOptional(encodeable_tx.note),
    lease: bytesCodec.decodeOptional(encodeable_tx.lx),
    rekeyTo: addressCodec.decodeOptional(encodeable_tx.rekey),
    group: bytesCodec.decodeOptional(encodeable_tx.grp),
  }

  // Add transaction type specific fields
  switch (transactionType) {
    case 'Payment':
      tx.payment = {
        amount: bigIntCodec.decode(encodeable_tx.amt),
        receiver: addressCodec.decode(encodeable_tx.rcv),
        closeRemainderTo: addressCodec.decodeOptional(encodeable_tx.close),
      }
      break
    case 'AssetTransfer':
      tx.assetTransfer = {
        assetId: bigIntCodec.decode(encodeable_tx.xaid),
        amount: bigIntCodec.decode(encodeable_tx.aamt),
        receiver: addressCodec.decode(encodeable_tx.arcv),
        closeRemainderTo: addressCodec.decodeOptional(encodeable_tx.aclose),
        assetSender: addressCodec.decodeOptional(encodeable_tx.asnd),
      }
      break
    case 'AssetConfig':
      tx.assetConfig = {
        assetId: bigIntCodec.decode(encodeable_tx.caid),
        ...(encodeable_tx.apar !== undefined
          ? {
              total: bigIntCodec.decodeOptional(encodeable_tx.apar.t),
              decimals: numberCodec.decodeOptional(encodeable_tx.apar.dc),
              defaultFrozen: booleanCodec.decodeOptional(encodeable_tx.apar.df),
              unitName: stringCodec.decodeOptional(encodeable_tx.apar.un),
              assetName: stringCodec.decodeOptional(encodeable_tx.apar.an),
              url: stringCodec.decodeOptional(encodeable_tx.apar.au),
              metadataHash: bytesCodec.decodeOptional(encodeable_tx.apar.am),
              manager: addressCodec.decodeOptional(encodeable_tx.apar.m),
              reserve: addressCodec.decodeOptional(encodeable_tx.apar.r),
              freeze: addressCodec.decodeOptional(encodeable_tx.apar.f),
              clawback: addressCodec.decodeOptional(encodeable_tx.apar.c),
            }
          : undefined),
      }
      break
    case 'AssetFreeze':
      tx.assetFreeze = {
        assetId: bigIntCodec.decode(encodeable_tx.faid),
        freezeTarget: addressCodec.decode(encodeable_tx.fadd),
        frozen: booleanCodec.decode(encodeable_tx.afrz),
      }
      break
    case 'AppCall':
      tx.appCall = {
        appId: bigIntCodec.decode(encodeable_tx.apid),
        onComplete: fromOnApplicationCompleteDto(encodeable_tx.apan),
        approvalProgram: bytesCodec.decodeOptional(encodeable_tx.apap),
        clearStateProgram: bytesCodec.decodeOptional(encodeable_tx.apsu),
        args: encodeable_tx.apaa?.map((arg) => bytesCodec.decode(arg)),
        accountReferences: encodeable_tx.apat?.map((addr) => addressCodec.decode(addr)),
        appReferences: encodeable_tx.apfa?.map((id) => bigIntCodec.decode(id)),
        assetReferences: encodeable_tx.apas?.map((id) => bigIntCodec.decode(id)),
        extraProgramPages: numberCodec.decodeOptional(encodeable_tx.apep),
        ...(encodeable_tx.apgs !== undefined
          ? {
              globalStateSchema: stateSchemaCodec.decodeOptional({
                numUints: numberCodec.decode(encodeable_tx.apgs.nui),
                numByteSlices: numberCodec.decode(encodeable_tx.apgs.nbs),
              }),
            }
          : undefined),
        ...(encodeable_tx.apls !== undefined
          ? {
              localStateSchema: stateSchemaCodec.decodeOptional({
                numUints: numberCodec.decode(encodeable_tx.apls.nui),
                numByteSlices: numberCodec.decode(encodeable_tx.apls.nbs),
              }),
            }
          : undefined),
      }
      break
    case 'KeyRegistration':
      tx.keyRegistration = {
        voteKey: bytesCodec.decodeOptional(encodeable_tx.votekey),
        selectionKey: bytesCodec.decodeOptional(encodeable_tx.selkey),
        voteFirst: bigIntCodec.decodeOptional(encodeable_tx.votefst),
        voteLast: bigIntCodec.decodeOptional(encodeable_tx.votelst),
        voteKeyDilution: bigIntCodec.decodeOptional(encodeable_tx.votekd),
        stateProofKey: bytesCodec.decodeOptional(encodeable_tx.sprfkey),
        nonParticipation: booleanCodec.decodeOptional(encodeable_tx.nonpart),
      }
      break
  }

  return tx
}
