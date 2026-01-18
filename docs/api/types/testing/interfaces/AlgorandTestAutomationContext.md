[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/testing](../README.md) / AlgorandTestAutomationContext

# Interface: AlgorandTestAutomationContext

Defined in: [src/types/testing.ts:21](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/testing.ts#L21)

Test automation context.

## Properties

### algod

> **algod**: [`AlgodClient`](../../../Subpaths/algod-client/classes/AlgodClient.md)

Defined in: [src/types/testing.ts:25](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/testing.ts#L25)

Algod client instance that will log transactions in `transactionLogger`

***

### algorand

> **algorand**: [`AlgorandClient`](../../algorand-client/classes/AlgorandClient.md)

Defined in: [src/types/testing.ts:23](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/testing.ts#L23)

An AlgorandClient instance loaded with the current context, including testAccount and any generated accounts loaded as signers

***

### generateAccount()

> **generateAccount**: (`params`) => `Promise`\<[`Address`](../../../algokit-utils/classes/Address.md) & `object`\>

Defined in: [src/types/testing.ts:35](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/testing.ts#L35)

Generate and fund an additional ephemerally created account

#### Parameters

##### params

[`GetTestAccountParams`](GetTestAccountParams.md)

#### Returns

`Promise`\<[`Address`](../../../algokit-utils/classes/Address.md) & `object`\>

***

### indexer

> **indexer**: [`IndexerClient`](../../../Subpaths/indexer-client/classes/IndexerClient.md)

Defined in: [src/types/testing.ts:27](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/testing.ts#L27)

Indexer client instance

***

### kmd

> **kmd**: [`KmdClient`](../../../Subpaths/kmd-client/classes/KmdClient.md)

Defined in: [src/types/testing.ts:29](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/testing.ts#L29)

KMD client instance

***

### testAccount

> **testAccount**: [`Address`](../../../algokit-utils/classes/Address.md) & `object`

Defined in: [src/types/testing.ts:33](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/testing.ts#L33)

Default, funded test account that is ephemerally created

#### Type Declaration

##### addr

> **addr**: `Readonly`\<[`Address`](../../../algokit-utils/classes/Address.md)\>

##### lsigSigner

> **lsigSigner**: [`DelegatedLsigSigner`](../../../Subpaths/transact/type-aliases/DelegatedLsigSigner.md)

##### mxBytesSigner

> **mxBytesSigner**: [`MxBytesSigner`](../../../Subpaths/transact/type-aliases/MxBytesSigner.md)

##### programDataSigner

> **programDataSigner**: [`ProgramDataSigner`](../../../Subpaths/transact/type-aliases/ProgramDataSigner.md)

##### signer

> **signer**: [`TransactionSigner`](../../../Subpaths/transact/type-aliases/TransactionSigner.md)

***

### transactionLogger

> **transactionLogger**: [`TransactionLogger`](../../../Subpaths/testing/classes/TransactionLogger.md)

Defined in: [src/types/testing.ts:31](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/testing.ts#L31)

Transaction logger that will log transaction IDs for all transactions issued by `algod`

***

### waitForIndexer()

> **waitForIndexer**: () => `Promise`\<`void`\>

Defined in: [src/types/testing.ts:37](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/testing.ts#L37)

Wait for the indexer to catch up with all transactions logged by `transactionLogger`

#### Returns

`Promise`\<`void`\>

***

### waitForIndexerTransaction()

> **waitForIndexerTransaction**: (`transactionId`) => `Promise`\<[`TransactionResponse`](../../../Subpaths/indexer-client/type-aliases/TransactionResponse.md)\>

Defined in: [src/types/testing.ts:39](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/testing.ts#L39)

Wait for the indexer to catch up with the given transaction ID

#### Parameters

##### transactionId

`string`

#### Returns

`Promise`\<[`TransactionResponse`](../../../Subpaths/indexer-client/type-aliases/TransactionResponse.md)\>
