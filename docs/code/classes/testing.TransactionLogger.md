[@algorandfoundation/algokit-utils](../README.md) / [testing](../modules/testing.md) / TransactionLogger

# Class: TransactionLogger

[testing](../modules/testing.md).TransactionLogger

Allows you to keep track of Algorand transaction IDs by wrapping an `AlgodClient` in a proxy.
Useful for automated tests.

## Table of contents

### Constructors

- [constructor](testing.TransactionLogger.md#constructor)

### Properties

- [\_latestLastValidRound](testing.TransactionLogger.md#_latestlastvalidround)
- [\_sentTransactionIds](testing.TransactionLogger.md#_senttransactionids)

### Accessors

- [sentTransactionIds](testing.TransactionLogger.md#senttransactionids)

### Methods

- [\_pushTxn](testing.TransactionLogger.md#_pushtxn)
- [capture](testing.TransactionLogger.md#capture)
- [clear](testing.TransactionLogger.md#clear)
- [logRawTransaction](testing.TransactionLogger.md#lograwtransaction)
- [waitForIndexer](testing.TransactionLogger.md#waitforindexer)

## Constructors

### constructor

• **new TransactionLogger**(): [`TransactionLogger`](testing.TransactionLogger.md)

#### Returns

[`TransactionLogger`](testing.TransactionLogger.md)

## Properties

### \_latestLastValidRound

• `Private` `Optional` **\_latestLastValidRound**: `bigint`

#### Defined in

[src/testing/transaction-logger.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/transaction-logger.ts#L13)

___

### \_sentTransactionIds

• `Private` **\_sentTransactionIds**: `string`[] = `[]`

#### Defined in

[src/testing/transaction-logger.ts:12](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/transaction-logger.ts#L12)

## Accessors

### sentTransactionIds

• `get` **sentTransactionIds**(): readonly `string`[]

The list of transaction IDs that has been logged thus far.

#### Returns

readonly `string`[]

#### Defined in

[src/testing/transaction-logger.ts:26](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/transaction-logger.ts#L26)

## Methods

### \_pushTxn

▸ **_pushTxn**(`stxn`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `stxn` | `Uint8Array` |

#### Returns

`void`

#### Defined in

[src/testing/transaction-logger.ts:15](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/transaction-logger.ts#L15)

___

### capture

▸ **capture**(`algod`): `AlgodClient`

Return a proxy that wraps the given AlgodClient with this transaction logger.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `algod` | `AlgodClient` | The `AlgodClient` to wrap |

#### Returns

`AlgodClient`

The wrapped `AlgodClient`, any transactions sent using this algod instance will be logged by this transaction logger

#### Defined in

[src/testing/transaction-logger.ts:53](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/transaction-logger.ts#L53)

___

### clear

▸ **clear**(): `void`

Clear all logged IDs.

#### Returns

`void`

#### Defined in

[src/testing/transaction-logger.ts:33](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/transaction-logger.ts#L33)

___

### logRawTransaction

▸ **logRawTransaction**(`signedTransactions`): `void`

The method that captures raw transactions and stores the transaction IDs.

#### Parameters

| Name | Type |
| :------ | :------ |
| `signedTransactions` | `Uint8Array` \| `Uint8Array`[] |

#### Returns

`void`

#### Defined in

[src/testing/transaction-logger.ts:40](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/transaction-logger.ts#L40)

___

### waitForIndexer

▸ **waitForIndexer**(`indexer`): `Promise`\<`void`\>

Wait until all logged transactions IDs appear in the given `Indexer`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `indexer` | `IndexerClient` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/testing/transaction-logger.ts:58](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/transaction-logger.ts#L58)
