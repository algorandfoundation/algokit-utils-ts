import { Address, decodeMsgpack } from '@algorandfoundation/algokit-common'
import { assert, describe, test } from 'vitest'
import { OnApplicationComplete } from '../src/transactions/app-call'
import { decodeTransaction, encodeTransactionRaw, Transaction, transactionCodec } from '../src/transactions/transaction'
import { TransactionType } from '../src/transactions/transaction-type'

const emptyReference = { box: { appId: 0n, name: new Uint8Array() } }
const namedReference = { box: { appId: 0n, name: new TextEncoder().encode('weights') } }

function appCall(accessReferences = [emptyReference, namedReference, emptyReference]): Transaction {
  return new Transaction({
    sender: Address.fromString('BH55E5RMBD4GYWXGX5W5PJ5JAHPGM5OXKDQH5DC4O2MGI7NW4H6VOE4CP4'),
    firstValid: 322575n,
    lastValid: 322575n,
    fee: 1000n,
    genesisId: 'testnet-v1.0',
    genesisHash: new Uint8Array(Buffer.from('SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=', 'base64')),
    type: TransactionType.AppCall,
    appCall: {
      appId: 111n,
      onComplete: OnApplicationComplete.NoOp,
      accessReferences,
    },
  })
}

describe('Empty access list references', () => {
  test('canonically encodes and decodes empty references', () => {
    const encoded = encodeTransactionRaw(appCall())
    const wireTransaction = decodeMsgpack(encoded, {
      useMap: false,
      rawBinaryStringKeys: false,
      rawBinaryStringValues: true,
    }) as unknown as { al: unknown[] }
    assert.deepStrictEqual(wireTransaction.al, [{}, { b: { n: namedReference.box.name } }, {}])

    const decoded = decodeTransaction(encoded)
    assert.deepStrictEqual(decoded.appCall?.accessReferences, [emptyReference, namedReference, emptyReference])
    assert.deepStrictEqual(encodeTransactionRaw(decoded), encoded)
  })

  test('decodes a non-canonical empty box reference for compatibility', () => {
    const encoded = transactionCodec.encode(appCall([]), 'msgpack')
    encoded.al = [{ b: {} }]

    const decoded = transactionCodec.decode(encoded, 'msgpack')
    assert.deepStrictEqual(decoded.appCall?.accessReferences, [emptyReference])
  })
})
