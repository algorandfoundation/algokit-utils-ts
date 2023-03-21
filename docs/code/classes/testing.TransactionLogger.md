[@algorandfoundation/algokit-utils](../README.md) / [testing](../modules/testing.md) / TransactionLogger

# Class: TransactionLogger

[testing](../modules/testing.md).TransactionLogger

Allows you to keep track of Algorand transaction IDs by wrapping an

**`See`**

Algodv2 in a proxy.
Useful for automated tests.

## Table of contents

### Constructors

- [constructor](testing.TransactionLogger.md#constructor)

### Properties

- [\_sentTransactionIds](testing.TransactionLogger.md#_senttransactionids)

### Accessors

- [sentTransactionIds](testing.TransactionLogger.md#senttransactionids)

### Methods

- [capture](testing.TransactionLogger.md#capture)
- [clear](testing.TransactionLogger.md#clear)
- [logRawTransaction](testing.TransactionLogger.md#lograwtransaction)
- [waitForIndexer](testing.TransactionLogger.md#waitforindexer)

## Constructors

### constructor

• **new TransactionLogger**()

## Properties

### \_sentTransactionIds

• `Private` **\_sentTransactionIds**: `string`[] = `[]`

#### Defined in

testing/transaction-logger.ts:9

## Accessors

### sentTransactionIds

• `get` **sentTransactionIds**(): readonly `string`[]

The list of transaction IDs that has been logged thus far.

#### Returns

readonly `string`[]

#### Defined in

testing/transaction-logger.ts:14

## Methods

### capture

▸ **capture**(`algod`): `default`

Return a proxy that wraps the given Algodv2 with this transaction logger.

**`See`**

 - Algodv2 to wrap
 - Algodv2, any transactions sent using this algod instance will be logged by this transaction logger

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `algod` | `default` | The |

#### Returns

`default`

The wrapped

#### Defined in

testing/transaction-logger.ts:45

___

### clear

▸ **clear**(): `void`

Clear all logged IDs.

#### Returns

`void`

#### Defined in

testing/transaction-logger.ts:21

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

testing/transaction-logger.ts:28

___

### waitForIndexer

▸ **waitForIndexer**(`indexer`): `Promise`<`void`\>

Wait until all logged transactions IDs appear in the given

**`See`**

Indexer.

#### Parameters

| Name | Type |
| :------ | :------ |
| `indexer` | `default` |

#### Returns

`Promise`<`void`\>

#### Defined in

testing/transaction-logger.ts:50
