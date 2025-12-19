import { Address, EMPTY_SIGNATURE, encodeMsgpack } from '@algorandfoundation/algokit-common'
import { describe, expect, test } from 'vitest'
import { encodeSignedTransaction } from './signed-transaction'
import {
  TXN_SYMBOL,
  Transaction,
  TransactionParams,
  decodeTransaction,
  encodeTransaction,
  encodeTransactionRaw,
  estimateTransactionSize,
  validateTransaction,
} from './transaction'
import { TransactionType } from './transaction-type'

const VALID_ADDRESS_1 = Address.fromString('424ZV7KBBUJ52DUKP2KLQ6I5GBOHKBXOW7Q7UQIOOYNDWYRM4EKOSMVVRI')

describe('Transaction Validation', () => {
  describe('Core transaction validation', () => {
    test('should throw error when multiple transaction type specific fields are set', () => {
      const transaction = new Transaction({
        type: TransactionType.Payment,
        sender: VALID_ADDRESS_1,
        firstValid: 1000n,
        lastValid: 2000n,
        payment: {
          amount: 1000n,
          receiver: VALID_ADDRESS_1,
        },
        assetTransfer: {
          assetId: 123n,
          amount: 1000n,
          receiver: VALID_ADDRESS_1,
        },
      })

      expect(() => validateTransaction(transaction)).toThrow('Multiple transaction type specific fields set')
    })

    test('should validate valid payment transaction', () => {
      const transaction = new Transaction({
        type: TransactionType.Payment,
        sender: VALID_ADDRESS_1,
        firstValid: 1000n,
        lastValid: 2000n,
        payment: {
          amount: 1000n,
          receiver: VALID_ADDRESS_1,
        },
      })

      expect(() => validateTransaction(transaction)).not.toThrow()
    })

    test.each([
      ['encodeTransaction', (params: TransactionParams) => encodeTransaction(new Transaction(params))],
      ['encodeTransactionRaw', (params: TransactionParams) => encodeTransactionRaw(new Transaction(params))],
      ['estimateTransactionSize', (params: TransactionParams) => estimateTransactionSize(new Transaction(params))],
      ['txId', (params: TransactionParams) => new Transaction(params).txId()],
      [
        'encodeSignedTransaction',
        (params: TransactionParams) => encodeSignedTransaction({ txn: new Transaction(params), sig: EMPTY_SIGNATURE }),
      ],
    ])('should validate when calling %s', (_, sut) => {
      const transaction: TransactionParams = {
        type: TransactionType.AssetTransfer,
        sender: VALID_ADDRESS_1,
        firstValid: 1000n,
        lastValid: 2000n,
        genesisHash: new Uint8Array(32).fill(1),
        genesisId: 'testnet-v1.0',
        assetTransfer: {
          assetId: 0n,
          amount: 1000n,
          receiver: VALID_ADDRESS_1,
        },
      }

      expect(() => sut(transaction)).toThrow('Asset transfer validation failed: Asset ID must not be 0')
    })
  })
})

describe('txId', () => {
  test('throws when computing txId without genesisHash', () => {
    const transaction = new Transaction({
      type: TransactionType.Payment,
      sender: VALID_ADDRESS_1,
      firstValid: 1000n,
      lastValid: 2000n,
      payment: {
        amount: 1000n,
        receiver: VALID_ADDRESS_1,
      },
    })

    expect(() => transaction.txId()).toThrow('Cannot compute transaction id without genesis hash')
  })

  test('should compute txId when genesisHash is present', () => {
    const transaction = new Transaction({
      type: TransactionType.Payment,
      sender: VALID_ADDRESS_1,
      firstValid: 1000n,
      lastValid: 2000n,
      genesisHash: new Uint8Array(32).fill(1),
      payment: {
        amount: 1000n,
        receiver: VALID_ADDRESS_1,
      },
    })

    expect(() => transaction.txId()).not.toThrow()
    expect(transaction.txId()).toMatch(/^[A-Z2-7]{52}$/)
  })
})

describe('decodeTransaction', () => {
  test('should successfully decode transaction with unknown type', () => {
    const addressBytes = new Uint8Array([
      230, 185, 154, 253, 65, 13, 19, 221, 14, 138, 126, 148, 184, 121, 29, 48, 92, 117, 6, 238, 183, 225, 250, 65, 14, 118, 26, 59, 98, 44,
      225, 20,
    ])
    const wireTransaction = {
      amt: 1000,
      fv: 1000,
      lv: 2000,
      rcv: addressBytes,
      snd: addressBytes,
      type: 'xyz', // An unknown transaction type
    }
    const encodedTransaction = encodeMsgpack(wireTransaction)

    const decodedTransaction = decodeTransaction(encodedTransaction)

    expect(decodedTransaction).toMatchInlineSnapshot(`
      Transaction {
        "appCall": undefined,
        "assetConfig": undefined,
        "assetFreeze": undefined,
        "assetTransfer": undefined,
        "fee": undefined,
        "firstValid": 1000n,
        "genesisHash": undefined,
        "genesisId": undefined,
        "group": undefined,
        "heartbeat": undefined,
        "keyRegistration": undefined,
        "lastValid": 2000n,
        "lease": undefined,
        "note": undefined,
        "payment": undefined,
        "rekeyTo": undefined,
        "sender": Address {
          "publicKey": Uint8Array [
            230,
            185,
            154,
            253,
            65,
            13,
            19,
            221,
            14,
            138,
            126,
            148,
            184,
            121,
            29,
            48,
            92,
            117,
            6,
            238,
            183,
            225,
            250,
            65,
            14,
            118,
            26,
            59,
            98,
            44,
            225,
            20,
          ],
          Symbol(algokit_common:Address): true,
        },
        "stateProof": undefined,
        "type": "unknown",
        Symbol(algokit_transact:Transaction): true,
      }
    `)
  })
})

// Compile-time check: Ensure Transaction class has all keys from TransactionParams
// This will error if a field is added to TransactionParams but not to Transaction
type _AssertTransactionHasAllParamsKeys =
  Exclude<keyof TransactionParams, keyof Transaction> extends never
    ? true
    : { error: 'Transaction class is missing keys from TransactionParams'; missing: Exclude<keyof TransactionParams, keyof Transaction> }
const _checkTransactionKeys: _AssertTransactionHasAllParamsKeys = true
void _checkTransactionKeys

// Compile-time check: Ensure TransactionParams has all keys from Transaction (excluding internal symbol and methods)
// This will error if a field is added to Transaction but not to TransactionParams
type TransactionPropertyKeys = Exclude<keyof Transaction, typeof TXN_SYMBOL | 'txId'>
type _AssertParamsHasAllTransactionKeys =
  Exclude<TransactionPropertyKeys, keyof TransactionParams> extends never
    ? true
    : {
        error: 'TransactionParams is missing keys from Transaction class'
        missing: Exclude<TransactionPropertyKeys, keyof TransactionParams>
      }
const _checkParamsKeys: _AssertParamsHasAllTransactionKeys = true
void _checkParamsKeys
