import { PendingTransactionResponse } from '@algorandfoundation/algokit-algod-client'
import { ABIMethod, ABIValue } from './abi/index.js'

/** Represents the output from a successful ABI method call. */
export interface ABIResult {
  /** The TxID of the transaction that invoked the ABI method call. */
  txID: string
  /**
   * The raw bytes of the return value from the ABI method call. This will be empty if the method
   * does not return a value (return type "void").
   */
  rawReturnValue: Uint8Array
  /**
   * The method that was called for this result
   */
  method: ABIMethod
  /**
   * The return value from the ABI method call. This will be undefined if the method does not return
   * a value (return type "void"), or if the SDK was unable to decode the returned value.
   */
  returnValue?: ABIValue
  /** If the SDK was unable to decode a return value, the error will be here. */
  decodeError?: Error
  /** The pending transaction information from the method transaction */
  txInfo?: PendingTransactionResponse
}
