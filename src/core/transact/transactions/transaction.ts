import base32 from 'hi-base32'
import {
  MAX_TX_GROUP_SIZE,
  SIGNATURE_ENCODING_INCR,
  TRANSACTION_DOMAIN_SEPARATOR,
  TRANSACTION_GROUP_DOMAIN_SEPARATOR,
  TRANSACTION_ID_LENGTH,
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
export function getEncodedTransactionType(encoded_transaction: Uint8Array): TransactionType {
  const decoded = decodeTransaction(encoded_transaction)
  return decoded.transactionType
}

/**
 * Encode the transaction with the domain separation (e.g. "TX") prefix
 *
 * @param transaction - The transaction to encode
 * @returns The MsgPack encoded bytes or an error if encoding fails.
 */
export function encodeTransaction(transaction: Transaction): Uint8Array {
  validateTransaction(transaction)
  const rawBytes = encodeTransactionRaw(transaction)
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
 * @param transactions - A collection of transactions to encode
 * @returns A collection of MsgPack encoded bytes or an error if encoding fails.
 */
export function encodeTransactions(transactions: Transaction[]): Uint8Array[] {
  return transactions.map((tx) => encodeTransaction(tx))
}

/**
 * Validate a transaction structure
 */
export function validateTransaction(transaction: Transaction): void {
  if (!transaction.sender) {
    throw new Error('Transaction sender is required')
  }

  // Validate that only one transaction type specific field is set
  const typeFields = [
    transaction.payment,
    transaction.assetTransfer,
    transaction.assetConfig,
    transaction.appCall,
    transaction.keyRegistration,
    transaction.assetFreeze,
  ]

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
export function encodeTransactionRaw(transaction: Transaction): Uint8Array {
  validateTransaction(transaction)
  const encodingData = toTransactionDto(transaction)
  return encodeMsgpack(encodingData)
}

/**
 * Decodes MsgPack bytes into a transaction.
 *
 * # Parameters
 * * `encoded_transaction` - MsgPack encoded bytes representing a transaction.
 *
 * # Returns
 * A decoded transaction or an error if decoding fails.
 */
export function decodeTransaction(encoded_transaction: Uint8Array): Transaction {
  if (encoded_transaction.length === 0) {
    throw new Error('attempted to decode 0 bytes')
  }

  const prefixBytes = new TextEncoder().encode(TRANSACTION_DOMAIN_SEPARATOR)
  // Check if the transaction has the domain separation prefix
  let hasPrefix = true
  if (encoded_transaction.length < prefixBytes.length) {
    hasPrefix = false
  } else {
    for (let i = 0; i < prefixBytes.length; i++) {
      if (encoded_transaction[i] !== prefixBytes[i]) {
        hasPrefix = false
        break
      }
    }
  }

  const decodedData = decodeMsgpack<TransactionDto>(hasPrefix ? encoded_transaction.slice(prefixBytes.length) : encoded_transaction)
  return fromTransactionDto(decodedData)
}

/**
 * Decodes a collection of MsgPack bytes into a transaction collection.
 *
 * # Parameters
 * * `encoded_transaction` - A collection of MsgPack encoded bytes, each representing a transaction.
 *
 * # Returns
 * A collection of decoded transactions or an error if decoding fails.
 */
export function decodeTransactions(encoded_transactions: Uint8Array[]): Transaction[] {
  return encoded_transactions.map((et) => decodeTransaction(et))
}

/**
 * Return the size of the transaction in bytes as if it was already signed and encoded.
 * This is useful for estimating the fee for the transaction.
 */
export function estimateTransactionSize(transaction: Transaction): bigint {
  const encoded = encodeTransactionRaw(transaction)
  return BigInt(encoded.length + SIGNATURE_ENCODING_INCR)
}

/**
 * Get the raw 32-byte transaction ID for a transaction.
 */
export function getTransactionIdRaw(transaction: Transaction): Uint8Array {
  const encodedBytes = encodeTransaction(transaction)
  return hash(encodedBytes)
}

/**
 * Get the base32 transaction ID string for a transaction.
 */
export function getTransactionId(transaction: Transaction): string {
  const hash = getTransactionIdRaw(transaction)
  return base32.encode(hash).slice(0, TRANSACTION_ID_LENGTH)
}

/**
 * Groups a collection of transactions by calculating and assigning the group to each transaction.
 */
export function groupTransactions(transactions: Transaction[]): Transaction[] {
  const groupId = computeGroupId(transactions)
  return transactions.map((tx) => ({
    ...tx,
    group: groupId,
  }))
}

export function assignFee(transaction: Transaction, feeParams: FeeParams): Transaction {
  const fee = calculateFee(transaction, feeParams)
  return {
    ...transaction,
    fee,
  }
}

function computeGroupId(transactions: Transaction[]): Uint8Array {
  if (transactions.length === 0) {
    throw new Error('Transaction group size cannot be 0')
  }

  if (transactions.length > MAX_TX_GROUP_SIZE) {
    throw new Error(`Transaction group size exceeds the max limit of ${MAX_TX_GROUP_SIZE}`)
  }

  const txHashes = transactions.map((tx) => {
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

function calculateFee(transaction: Transaction, feeParams: FeeParams): bigint {
  let calculatedFee = 0n

  if (feeParams.feePerByte > 0n) {
    const estimatedSize = estimateTransactionSize(transaction)
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

export function toTransactionDto(transaction: Transaction): TransactionDto {
  const tx_dto: TransactionDto = {
    type: toTransactionTypeDto(transaction.transactionType),
    fv: bigIntCodec.encode(transaction.firstValid),
    lv: bigIntCodec.encode(transaction.lastValid),
    snd: addressCodec.encode(transaction.sender),
    gen: stringCodec.encode(transaction.genesisId),
    gh: bytesCodec.encode(transaction.genesisHash),
    fee: bigIntCodec.encode(transaction.fee),
    note: bytesCodec.encode(transaction.note),
    lx: bytesCodec.encode(transaction.lease),
    rekey: addressCodec.encode(transaction.rekeyTo),
    grp: bytesCodec.encode(transaction.group),
  }

  // Add transaction type specific fields
  if (transaction.payment) {
    tx_dto.amt = bigIntCodec.encode(transaction.payment.amount)
    tx_dto.rcv = addressCodec.encode(transaction.payment.receiver)
    tx_dto.close = addressCodec.encode(transaction.payment.closeRemainderTo)
  }

  if (transaction.assetTransfer) {
    tx_dto.xaid = bigIntCodec.encode(transaction.assetTransfer.assetId)
    tx_dto.aamt = bigIntCodec.encode(transaction.assetTransfer.amount)
    tx_dto.arcv = addressCodec.encode(transaction.assetTransfer.receiver)
    tx_dto.aclose = addressCodec.encode(transaction.assetTransfer.closeRemainderTo)
    tx_dto.asnd = addressCodec.encode(transaction.assetTransfer.assetSender)
  }

  if (transaction.assetConfig) {
    tx_dto.caid = bigIntCodec.encode(transaction.assetConfig.assetId)
    // Asset config field
    tx_dto.apar = assetParamsDtoCodec.encode({
      t: bigIntCodec.encode(transaction.assetConfig.total),
      dc: numberCodec.encode(transaction.assetConfig.decimals),
      df: booleanCodec.encode(transaction.assetConfig.defaultFrozen),
      un: stringCodec.encode(transaction.assetConfig.unitName),
      an: stringCodec.encode(transaction.assetConfig.assetName),
      au: stringCodec.encode(transaction.assetConfig.url),
      am: bytesCodec.encode(transaction.assetConfig.metadataHash),
      m: addressCodec.encode(transaction.assetConfig.manager),
      f: addressCodec.encode(transaction.assetConfig.freeze),
      c: addressCodec.encode(transaction.assetConfig.clawback),
      r: addressCodec.encode(transaction.assetConfig.reserve),
    })
  }

  if (transaction.assetFreeze) {
    tx_dto.faid = bigIntCodec.encode(transaction.assetFreeze.assetId)
    tx_dto.fadd = addressCodec.encode(transaction.assetFreeze.freezeTarget)
    tx_dto.afrz = booleanCodec.encode(transaction.assetFreeze.frozen)
  }

  if (transaction.appCall) {
    tx_dto.apid = bigIntCodec.encode(transaction.appCall.appId)
    tx_dto.apan = numberCodec.encode(toOnApplicationCompleteDto(transaction.appCall.onComplete))
    tx_dto.apap = bytesCodec.encode(transaction.appCall.approvalProgram)
    tx_dto.apsu = bytesCodec.encode(transaction.appCall.clearStateProgram)
    if (transaction.appCall.globalStateSchema) {
      tx_dto.apgs = stateSchemaDtoCodec.encode({
        nui: numberCodec.encode(transaction.appCall.globalStateSchema.numUints),
        nbs: numberCodec.encode(transaction.appCall.globalStateSchema.numByteSlices),
      })
    }
    if (transaction.appCall.localStateSchema) {
      tx_dto.apls = stateSchemaDtoCodec.encode({
        nui: numberCodec.encode(transaction.appCall.localStateSchema.numUints),
        nbs: numberCodec.encode(transaction.appCall.localStateSchema.numByteSlices),
      })
    }
    tx_dto.apaa = transaction.appCall.args?.map((arg) => bytesCodec.encode(arg) ?? bytesCodec.defaultValue())
    tx_dto.apat = transaction.appCall.accountReferences?.map((a) => addressCodec.encode(a) ?? addressCodec.defaultValue())
    tx_dto.apfa = transaction.appCall.appReferences?.map((a) => bigIntCodec.encode(a) ?? bigIntCodec.defaultValue())
    tx_dto.apas = transaction.appCall.assetReferences?.map((a) => bigIntCodec.encode(a) ?? bigIntCodec.defaultValue())
    tx_dto.apep = numberCodec.encode(transaction.appCall.extraProgramPages)
  }

  if (transaction.keyRegistration) {
    tx_dto.votekey = bytesCodec.encode(transaction.keyRegistration.voteKey)
    tx_dto.selkey = bytesCodec.encode(transaction.keyRegistration.selectionKey)
    tx_dto.votefst = bigIntCodec.encode(transaction.keyRegistration.voteFirst)
    tx_dto.votelst = bigIntCodec.encode(transaction.keyRegistration.voteLast)
    tx_dto.votekd = bigIntCodec.encode(transaction.keyRegistration.voteKeyDilution)
    tx_dto.sprfkey = bytesCodec.encode(transaction.keyRegistration.stateProofKey)
    tx_dto.nonpart = booleanCodec.encode(transaction.keyRegistration.nonParticipation)
  }

  return tx_dto
}

export function fromTransactionDto(transaction_dto: TransactionDto): Transaction {
  const transactionType = fromTransactionTypeDto(transaction_dto.type)

  const tx: Transaction = {
    transactionType,
    sender: addressCodec.decode(transaction_dto.snd),
    firstValid: bigIntCodec.decode(transaction_dto.fv),
    lastValid: bigIntCodec.decode(transaction_dto.lv),
    fee: bigIntCodec.decodeOptional(transaction_dto.fee),
    genesisId: stringCodec.decodeOptional(transaction_dto.gen),
    genesisHash: bytesCodec.decodeOptional(transaction_dto.gh),
    note: bytesCodec.decodeOptional(transaction_dto.note),
    lease: bytesCodec.decodeOptional(transaction_dto.lx),
    rekeyTo: addressCodec.decodeOptional(transaction_dto.rekey),
    group: bytesCodec.decodeOptional(transaction_dto.grp),
  }

  // Add transaction type specific fields
  switch (transactionType) {
    case 'Payment':
      tx.payment = {
        amount: bigIntCodec.decode(transaction_dto.amt),
        receiver: addressCodec.decode(transaction_dto.rcv),
        closeRemainderTo: addressCodec.decodeOptional(transaction_dto.close),
      }
      break
    case 'AssetTransfer':
      tx.assetTransfer = {
        assetId: bigIntCodec.decode(transaction_dto.xaid),
        amount: bigIntCodec.decode(transaction_dto.aamt),
        receiver: addressCodec.decode(transaction_dto.arcv),
        closeRemainderTo: addressCodec.decodeOptional(transaction_dto.aclose),
        assetSender: addressCodec.decodeOptional(transaction_dto.asnd),
      }
      break
    case 'AssetConfig':
      tx.assetConfig = {
        assetId: bigIntCodec.decode(transaction_dto.caid),
        ...(transaction_dto.apar !== undefined
          ? {
              total: bigIntCodec.decodeOptional(transaction_dto.apar.t),
              decimals: numberCodec.decodeOptional(transaction_dto.apar.dc),
              defaultFrozen: booleanCodec.decodeOptional(transaction_dto.apar.df),
              unitName: stringCodec.decodeOptional(transaction_dto.apar.un),
              assetName: stringCodec.decodeOptional(transaction_dto.apar.an),
              url: stringCodec.decodeOptional(transaction_dto.apar.au),
              metadataHash: bytesCodec.decodeOptional(transaction_dto.apar.am),
              manager: addressCodec.decodeOptional(transaction_dto.apar.m),
              reserve: addressCodec.decodeOptional(transaction_dto.apar.r),
              freeze: addressCodec.decodeOptional(transaction_dto.apar.f),
              clawback: addressCodec.decodeOptional(transaction_dto.apar.c),
            }
          : undefined),
      }
      break
    case 'AssetFreeze':
      tx.assetFreeze = {
        assetId: bigIntCodec.decode(transaction_dto.faid),
        freezeTarget: addressCodec.decode(transaction_dto.fadd),
        frozen: booleanCodec.decode(transaction_dto.afrz),
      }
      break
    case 'AppCall':
      tx.appCall = {
        appId: bigIntCodec.decode(transaction_dto.apid),
        onComplete: fromOnApplicationCompleteDto(transaction_dto.apan),
        approvalProgram: bytesCodec.decodeOptional(transaction_dto.apap),
        clearStateProgram: bytesCodec.decodeOptional(transaction_dto.apsu),
        args: transaction_dto.apaa?.map((arg) => bytesCodec.decode(arg)),
        accountReferences: transaction_dto.apat?.map((addr) => addressCodec.decode(addr)),
        appReferences: transaction_dto.apfa?.map((id) => bigIntCodec.decode(id)),
        assetReferences: transaction_dto.apas?.map((id) => bigIntCodec.decode(id)),
        extraProgramPages: numberCodec.decodeOptional(transaction_dto.apep),
        ...(transaction_dto.apgs !== undefined
          ? {
              globalStateSchema: stateSchemaCodec.decodeOptional({
                numUints: numberCodec.decode(transaction_dto.apgs.nui),
                numByteSlices: numberCodec.decode(transaction_dto.apgs.nbs),
              }),
            }
          : undefined),
        ...(transaction_dto.apls !== undefined
          ? {
              localStateSchema: stateSchemaCodec.decodeOptional({
                numUints: numberCodec.decode(transaction_dto.apls.nui),
                numByteSlices: numberCodec.decode(transaction_dto.apls.nbs),
              }),
            }
          : undefined),
      }
      break
    case 'KeyRegistration':
      tx.keyRegistration = {
        voteKey: bytesCodec.decodeOptional(transaction_dto.votekey),
        selectionKey: bytesCodec.decodeOptional(transaction_dto.selkey),
        voteFirst: bigIntCodec.decodeOptional(transaction_dto.votefst),
        voteLast: bigIntCodec.decodeOptional(transaction_dto.votelst),
        voteKeyDilution: bigIntCodec.decodeOptional(transaction_dto.votekd),
        stateProofKey: bytesCodec.decodeOptional(transaction_dto.sprfkey),
        nonParticipation: booleanCodec.decodeOptional(transaction_dto.nonpart),
      }
      break
  }

  return tx
}
