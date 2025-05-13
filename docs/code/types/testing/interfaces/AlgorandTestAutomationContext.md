[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/testing](../README.md) / AlgorandTestAutomationContext

# Interface: AlgorandTestAutomationContext

Defined in: [src/types/testing.ts:18](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L18)

Test automation context.

## Properties

### algod

> **algod**: `AlgodClient`

Defined in: [src/types/testing.ts:22](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L22)

Algod client instance that will log transactions in `transactionLogger`

***

### algorand

> **algorand**: [`AlgorandClient`](../../algorand-client/classes/AlgorandClient.md)

Defined in: [src/types/testing.ts:20](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L20)

An AlgorandClient instance loaded with the current context, including testAccount and any generated accounts loaded as signers

***

### generateAccount()

> **generateAccount**: (`params`) => `Promise`\<`Address` & `Account` & [`TransactionSignerAccount`](../../account/interfaces/TransactionSignerAccount.md)\>

Defined in: [src/types/testing.ts:32](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L32)

Generate and fund an additional ephemerally created account

#### Parameters

##### params

[`GetTestAccountParams`](GetTestAccountParams.md)

#### Returns

`Promise`\<`Address` & `Account` & [`TransactionSignerAccount`](../../account/interfaces/TransactionSignerAccount.md)\>

***

### indexer

> **indexer**: `IndexerClient`

Defined in: [src/types/testing.ts:24](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L24)

Indexer client instance

***

### kmd

> **kmd**: `KmdClient`

Defined in: [src/types/testing.ts:26](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L26)

KMD client instance

***

### testAccount

> **testAccount**: `Address` & [`TransactionSignerAccount`](../../account/interfaces/TransactionSignerAccount.md) & `Account`

Defined in: [src/types/testing.ts:30](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L30)

Default, funded test account that is ephemerally created

***

### transactionLogger

> **transactionLogger**: [`TransactionLogger`](../../../testing/classes/TransactionLogger.md)

Defined in: [src/types/testing.ts:28](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L28)

Transaction logger that will log transaction IDs for all transactions issued by `algod`

***

### waitForIndexer()

> **waitForIndexer**: () => `Promise`\<`void`\>

Defined in: [src/types/testing.ts:34](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L34)

Wait for the indexer to catch up with all transactions logged by `transactionLogger`

#### Returns

`Promise`\<`void`\>

***

### waitForIndexerTransaction()

> **waitForIndexerTransaction**: (`transactionId`) => `Promise`\<`TransactionResponse`\>

Defined in: [src/types/testing.ts:36](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L36)

Wait for the indexer to catch up with the given transaction ID

#### Parameters

##### transactionId

`string`

#### Returns

`Promise`\<`TransactionResponse`\>
