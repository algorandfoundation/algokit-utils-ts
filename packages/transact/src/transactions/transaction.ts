import {
  MAX_TX_GROUP_SIZE,
  ModelSerializer,
  SIGNATURE_ENCODING_INCR,
  TRANSACTION_DOMAIN_SEPARATOR,
  TRANSACTION_GROUP_DOMAIN_SEPARATOR,
  TRANSACTION_ID_LENGTH,
  concatArrays,
  hash,
} from '@algorandfoundation/algokit-common'
import base32 from 'hi-base32'
import { decodeMsgpack, encodeMsgpack } from '../encoding/msgpack'
import { AppCallTransactionFields, validateAppCallTransaction } from './app-call'
import { AssetConfigTransactionFields, validateAssetConfigTransaction } from './asset-config'
import { AssetFreezeTransactionFields, validateAssetFreezeTransaction } from './asset-freeze'
import { AssetTransferTransactionFields, validateAssetTransferTransaction } from './asset-transfer'
import { TransactionValidationError, getValidationErrorMessage } from './common'
import { HeartbeatTransactionFields } from './heartbeat'
import { KeyRegistrationTransactionFields, validateKeyRegistrationTransaction } from './key-registration'
import { PaymentTransactionFields } from './payment'
import { StateProofTransactionFields } from './state-proof'
import { TransactionMeta } from './transaction-meta'

/**
 * Represents a complete Algorand transaction.
 *
 * This structure contains the fields that are present in every transaction,
 * regardless of transaction type, plus transaction-type-specific fields.
 */
export type Transaction = {
  /**
   * The type of transaction
   */
  type: TransactionType

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

  /**
   * Heartbeat specific fields
   */
  heartbeat?: HeartbeatTransactionFields

  /**
   * State proof specific fields
   */
  stateProof?: StateProofTransactionFields
}

/**
 * Supported transaction types
 */
export enum TransactionType {
  /**
   * Payment transaction
   */
  Payment = 'pay',
  /**
   * Key registration transaction
   */
  KeyRegistration = 'keyreg',
  /**
   * Asset configuration transaction
   */
  AssetConfig = 'acfg',
  /**
   * Asset transfer transaction
   */
  AssetTransfer = 'axfer',
  /**
   * Asset freeze transaction
   */
  AssetFreeze = 'afrz',
  /**
   * Application transaction
   */
  AppCall = 'appl',
  /**
   * State proof transaction
   */
  StateProof = 'stpf',
  /**
   * Heartbeat transaction
   */
  Heartbeat = 'hb',
}

export type FeeParams = {
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
  return decoded.type
}

/**
 * Encode the transaction with the domain separation (e.g. "TX") prefix
 *
 * @param transaction - The transaction to encode
 * @returns The MsgPack encoded bytes or an error if encoding fails.
 */
export function encodeTransaction(transaction: Transaction): Uint8Array {
  const rawBytes = encodeTransactionRaw(transaction)

  // Add domain separation prefix
  const prefixBytes = new TextEncoder().encode(TRANSACTION_DOMAIN_SEPARATOR)
  return concatArrays(prefixBytes, rawBytes)
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
 * Validate a transaction
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
    transaction.heartbeat,
    transaction.stateProof,
  ]

  // Count fields that are set (not undefined)
  // Special case: for KeyRegistration type, allow keyRegistration field to be undefined
  // (offline key registration has all fields optional)
  const setFieldsCount = typeFields.filter((field) => field !== undefined).length

  if (setFieldsCount === 0 && transaction.type !== TransactionType.KeyRegistration) {
    throw new Error('No transaction type specific field is set')
  }

  if (setFieldsCount > 1) {
    throw new Error('Multiple transaction type specific fields set')
  }

  // Perform type-specific validation where applicable
  let typeName = 'Transaction'
  const errors = new Array<TransactionValidationError>()
  if (transaction.assetTransfer) {
    typeName = 'Asset transfer'
    errors.push(...validateAssetTransferTransaction(transaction.assetTransfer))
  } else if (transaction.assetConfig) {
    typeName = 'Asset config'
    errors.push(...validateAssetConfigTransaction(transaction.assetConfig))
  } else if (transaction.appCall) {
    typeName = 'App call'
    errors.push(...validateAppCallTransaction(transaction.appCall))
  } else if (transaction.keyRegistration) {
    typeName = 'Key registration'
    errors.push(...validateKeyRegistrationTransaction(transaction.keyRegistration))
  } else if (transaction.assetFreeze) {
    typeName = 'Asset freeze'
    errors.push(...validateAssetFreezeTransaction(transaction.assetFreeze))
  }

  if (errors.length > 0) {
    const errorMessages = errors.map((e) => getValidationErrorMessage(e))
    throw new Error(`${typeName} validation failed: ${errorMessages.join('\n')}`)
  }
}

/**
 * Encode the transaction without the domain separation (e.g. "TX") prefix
 * This is useful for encoding the transaction for signing with tools that automatically add "TX" prefix to the transaction bytes.
 */
export function encodeTransactionRaw(transaction: Transaction): Uint8Array {
  validateTransaction(transaction)
  const encodingData = ModelSerializer.encode(transaction, TransactionMeta, 'msgpack')
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

  const decodedData = decodeMsgpack(hasPrefix ? encoded_transaction.slice(prefixBytes.length) : encoded_transaction)
  return ModelSerializer.decode<Transaction>(decodedData, TransactionMeta, 'msgpack')
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
  const group = computeGroup(transactions)
  return transactions.map((tx) => ({
    ...tx,
    group,
  }))
}

export function assignFee(transaction: Transaction, feeParams: FeeParams): Transaction {
  const fee = calculateFee(transaction, feeParams)
  return {
    ...transaction,
    fee,
  }
}

function computeGroup(transactions: Transaction[]): Uint8Array {
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

  const prefixedBytes = concatArrays(prefixBytes, encodedBytes)
  return hash(prefixedBytes)
}

export function calculateFee(transaction: Transaction, feeParams: FeeParams): bigint {
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
    throw new Error(`Transaction fee ${calculatedFee} µALGO is greater than maxFee ${feeParams.maxFee} µALGO`)
  }

  return calculatedFee
}
