import type { Transaction } from '../../algokit_transact'
import { TransactionType } from '../../algokit_transact'

export enum ABITransactionType {
  /**
   * Any transaction type
   */
  any = 'txn',

  /**
   * Payment transaction type
   */
  pay = 'pay',

  /**
   * Key registration transaction type
   */
  keyreg = 'keyreg',

  /**
   * Asset configuration transaction type
   */
  acfg = 'acfg',

  /**
   * Asset transfer transaction type
   */
  axfer = 'axfer',

  /**
   * Asset freeze transaction type
   */
  afrz = 'afrz',

  /**
   * Application transaction type
   */
  appl = 'appl',
}

export function abiTypeIsTransaction(type: any): type is ABITransactionType {
  return (
    type === ABITransactionType.any ||
    type === ABITransactionType.pay ||
    type === ABITransactionType.keyreg ||
    type === ABITransactionType.acfg ||
    type === ABITransactionType.axfer ||
    type === ABITransactionType.afrz ||
    type === ABITransactionType.appl
  )
}

export function abiCheckTransactionType(type: ABITransactionType, txn: Transaction): boolean {
  if (type === ABITransactionType.any) {
    return true
  }

  // TODO: check this conversion
  // Map ABI transaction types to numeric TransactionType enum
  const typeMap: Record<ABITransactionType, TransactionType | null> = {
    [ABITransactionType.any]: null,
    [ABITransactionType.pay]: TransactionType.Payment,
    [ABITransactionType.keyreg]: TransactionType.KeyRegistration,
    [ABITransactionType.acfg]: TransactionType.AssetConfig,
    [ABITransactionType.axfer]: TransactionType.AssetTransfer,
    [ABITransactionType.afrz]: TransactionType.AssetFreeze,
    [ABITransactionType.appl]: TransactionType.AppCall,
  }

  const expectedType = typeMap[type]
  return expectedType !== null && txn.transactionType === expectedType
}
