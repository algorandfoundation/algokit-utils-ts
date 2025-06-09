[@algorandfoundation/algokit-utils](../README.md) / [testing](../modules/testing.md) / TransactionLogger

# Class: TransactionLogger

[testing](../modules/testing.md).TransactionLogger

Allows you to keep track of Algorand transaction IDs by wrapping an `Algodv2` in a proxy.
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

[src/testing/transaction-logger.ts:14](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/transaction-logger.ts#L14)

___

### \_sentTransactionIds

• `Private` **\_sentTransactionIds**: `string`[] = `[]`

#### Defined in

[src/testing/transaction-logger.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/transaction-logger.ts#L13)

## Accessors

### sentTransactionIds

• `get` **sentTransactionIds**(): readonly `string`[]

The list of transaction IDs that has been logged thus far.

#### Returns

readonly `string`[]

#### Defined in

[src/testing/transaction-logger.ts:27](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/transaction-logger.ts#L27)

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

[src/testing/transaction-logger.ts:16](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/transaction-logger.ts#L16)

___

### capture

▸ **capture**(`algod`): `AlgodClient`

Return a proxy that wraps the given Algodv2 with this transaction logger.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `algod` | `AlgodClient` | The `Algodv2` to wrap |

#### Returns

`AlgodClient`

The wrapped `Algodv2`, any transactions sent using this algod instance will be logged by this transaction logger

#### Defined in

[src/testing/transaction-logger.ts:54](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/transaction-logger.ts#L54)

___

### clear

▸ **clear**(): `void`

Clear all logged IDs.

#### Returns

`void`

#### Defined in

[src/testing/transaction-logger.ts:34](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/transaction-logger.ts#L34)

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

[src/testing/transaction-logger.ts:41](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/transaction-logger.ts#L41)

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

[src/testing/transaction-logger.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/transaction-logger.ts#L59)
