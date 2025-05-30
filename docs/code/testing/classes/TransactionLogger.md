[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [testing](../README.md) / TransactionLogger

# Class: TransactionLogger

Defined in: [src/testing/transaction-logger.ts:11](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/transaction-logger.ts#L11)

Allows you to keep track of Algorand transaction IDs by wrapping an `Algodv2` in a proxy.
Useful for automated tests.

## Constructors

### Constructor

> **new TransactionLogger**(): `TransactionLogger`

#### Returns

`TransactionLogger`

## Accessors

### sentTransactionIds

#### Get Signature

> **get** **sentTransactionIds**(): readonly `string`[]

Defined in: [src/testing/transaction-logger.ts:17](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/transaction-logger.ts#L17)

The list of transaction IDs that has been logged thus far.

##### Returns

readonly `string`[]

## Methods

### capture()

> **capture**(`algod`): `AlgodClient`

Defined in: [src/testing/transaction-logger.ts:48](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/transaction-logger.ts#L48)

Return a proxy that wraps the given Algodv2 with this transaction logger.

#### Parameters

##### algod

`AlgodClient`

The `Algodv2` to wrap

#### Returns

`AlgodClient`

The wrapped `Algodv2`, any transactions sent using this algod instance will be logged by this transaction logger

***

### clear()

> **clear**(): `void`

Defined in: [src/testing/transaction-logger.ts:24](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/transaction-logger.ts#L24)

Clear all logged IDs.

#### Returns

`void`

***

### logRawTransaction()

> **logRawTransaction**(`signedTransactions`): `void`

Defined in: [src/testing/transaction-logger.ts:31](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/transaction-logger.ts#L31)

The method that captures raw transactions and stores the transaction IDs.

#### Parameters

##### signedTransactions

`Uint8Array`\<`ArrayBufferLike`\> | `Uint8Array`\<`ArrayBufferLike`\>[]

#### Returns

`void`

***

### waitForIndexer()

> **waitForIndexer**(`indexer`): `Promise`\<`void`\>

Defined in: [src/testing/transaction-logger.ts:53](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/transaction-logger.ts#L53)

Wait until all logged transactions IDs appear in the given `Indexer`.

#### Parameters

##### indexer

`IndexerClient`

#### Returns

`Promise`\<`void`\>
