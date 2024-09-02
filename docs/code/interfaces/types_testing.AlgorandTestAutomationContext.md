[@algorandfoundation/algokit-utils](../README.md) / [types/testing](../modules/types_testing.md) / AlgorandTestAutomationContext

# Interface: AlgorandTestAutomationContext

[types/testing](../modules/types_testing.md).AlgorandTestAutomationContext

Test automation context.

## Table of contents

### Properties

- [algod](types_testing.AlgorandTestAutomationContext.md#algod)
- [algorand](types_testing.AlgorandTestAutomationContext.md#algorand)
- [generateAccount](types_testing.AlgorandTestAutomationContext.md#generateaccount)
- [indexer](types_testing.AlgorandTestAutomationContext.md#indexer)
- [kmd](types_testing.AlgorandTestAutomationContext.md#kmd)
- [testAccount](types_testing.AlgorandTestAutomationContext.md#testaccount)
- [transactionLogger](types_testing.AlgorandTestAutomationContext.md#transactionlogger)
- [waitForIndexer](types_testing.AlgorandTestAutomationContext.md#waitforindexer)
- [waitForIndexerTransaction](types_testing.AlgorandTestAutomationContext.md#waitforindexertransaction)

## Properties

### algod

• **algod**: `default`

Algod client instance that will log transactions in `transactionLogger`

#### Defined in

[src/types/testing.ts:22](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L22)

___

### algorand

• **algorand**: [`AlgorandClient`](../classes/types_algorand_client.AlgorandClient.md)

An AlgorandClient instance loaded with the current context, including testAccount and any generated accounts loaded as signers

#### Defined in

[src/types/testing.ts:20](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L20)

___

### generateAccount

• **generateAccount**: (`params`: [`GetTestAccountParams`](types_testing.GetTestAccountParams.md)) => `Promise`\<`default` & [`TransactionSignerAccount`](types_account.TransactionSignerAccount.md)\>

Generate and fund an additional ephemerally created account

#### Type declaration

▸ (`params`): `Promise`\<`default` & [`TransactionSignerAccount`](types_account.TransactionSignerAccount.md)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`GetTestAccountParams`](types_testing.GetTestAccountParams.md) |

##### Returns

`Promise`\<`default` & [`TransactionSignerAccount`](types_account.TransactionSignerAccount.md)\>

#### Defined in

[src/types/testing.ts:32](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L32)

___

### indexer

• **indexer**: `default`

Indexer client instance

#### Defined in

[src/types/testing.ts:24](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L24)

___

### kmd

• **kmd**: `default`

KMD client instance

#### Defined in

[src/types/testing.ts:26](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L26)

___

### testAccount

• **testAccount**: `default` & [`TransactionSignerAccount`](types_account.TransactionSignerAccount.md)

Default, funded test account that is ephemerally created

#### Defined in

[src/types/testing.ts:30](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L30)

___

### transactionLogger

• **transactionLogger**: [`TransactionLogger`](../classes/testing.TransactionLogger.md)

Transaction logger that will log transaction IDs for all transactions issued by `algod`

#### Defined in

[src/types/testing.ts:28](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L28)

___

### waitForIndexer

• **waitForIndexer**: () => `Promise`\<`void`\>

Wait for the indexer to catch up with all transactions logged by `transactionLogger`

#### Type declaration

▸ (): `Promise`\<`void`\>

##### Returns

`Promise`\<`void`\>

#### Defined in

[src/types/testing.ts:34](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L34)

___

### waitForIndexerTransaction

• **waitForIndexerTransaction**: (`transactionId`: `string`) => `Promise`\<[`TransactionLookupResult`](types_indexer.TransactionLookupResult.md)\>

Wait for the indexer to catch up with the given transaction ID

#### Type declaration

▸ (`transactionId`): `Promise`\<[`TransactionLookupResult`](types_indexer.TransactionLookupResult.md)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `transactionId` | `string` |

##### Returns

`Promise`\<[`TransactionLookupResult`](types_indexer.TransactionLookupResult.md)\>

#### Defined in

[src/types/testing.ts:36](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L36)
