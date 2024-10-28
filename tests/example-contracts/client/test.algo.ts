// Sourced from https://github.com/joe-p/algokit-client

import { Contract } from '@algorandfoundation/tealscript'

export default class TestContract extends Contract {
  /**
   * Calculates the sum of two numbers
   *
   * @param a
   * @param b
   * @returns The sum of a and b
   */
  private getSum(a: number, b: number): number {
    return a + b
  }

  /**
   * Calculates the difference between two numbers
   *
   * @param a
   * @param b
   * @returns The difference between a and b.
   */
  private getDifference(a: number, b: number): number {
    return a >= b ? a - b : b - a
  }

  /**
   * A method that takes two numbers and does either addition or subtraction
   *
   * @param a The first number
   * @param b The second number
   * @param operation The operation to perform. Can be either 'sum' or 'difference'
   *
   * @returns The result of the operation
   */
  doMath(a: number, b: number, operation: string): number {
    let result: number

    if (operation === 'sum') {
      result = this.getSum(a, b)
    } else if (operation === 'difference') {
      result = this.getDifference(a, b)
    } else throw Error('Invalid operation')

    return result
  }

  txnArg(txn: PayTxn): Address {
    return txn.sender
  }

  helloWorld(): string {
    return 'Hello, World!'
  }

  methodArg(call: AppCallTxn): AppID {
    return call.applicationID
  }

  nestedTxnArg(txn: PayTxn, call: AppCallTxn): AppID {
    return call.applicationID
  }

  doubleNestedTxnArg(txn0: PayTxn, call1: AppCallTxn, txn2: PayTxn, call3: AppCallTxn): AppID {
    return call1.applicationID
  }
}
