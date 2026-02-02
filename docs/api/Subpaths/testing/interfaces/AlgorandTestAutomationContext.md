[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/testing](../README.md) / AlgorandTestAutomationContext

# Interface: AlgorandTestAutomationContext

Defined in: [src/testing/types.ts:21](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/testing/types.ts#L21)

Test automation context.

## Properties

### algod

> **algod**: [`AlgodClient`](../../algod-client/classes/AlgodClient.md)

Defined in: [src/testing/types.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/testing/types.ts#L25)

Algod client instance that will log transactions in `transactionLogger`

***

### algorand

> **algorand**: [`AlgorandClient`](../../../algokit-utils/classes/AlgorandClient.md)

Defined in: [src/testing/types.ts:23](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/testing/types.ts#L23)

An AlgorandClient instance loaded with the current context, including testAccount and any generated accounts loaded as signers

***

### generateAccount()

> **generateAccount**: (`params`) => `Promise`\<[`Address`](../../../algokit-utils/classes/Address.md) & `object`\>

Defined in: [src/testing/types.ts:35](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/testing/types.ts#L35)

Generate and fund an additional ephemerally created account

#### Parameters

##### params

[`GetTestAccountParams`](GetTestAccountParams.md)

#### Returns

`Promise`\<[`Address`](../../../algokit-utils/classes/Address.md) & `object`\>

***

### indexer

> **indexer**: [`IndexerClient`](../../indexer-client/classes/IndexerClient.md)

Defined in: [src/testing/types.ts:27](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/testing/types.ts#L27)

Indexer client instance

***

### kmd

> **kmd**: [`KmdClient`](../../kmd-client/classes/KmdClient.md)

Defined in: [src/testing/types.ts:29](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/testing/types.ts#L29)

KMD client instance

***

### testAccount

> **testAccount**: [`Address`](../../../algokit-utils/classes/Address.md) & `object`

Defined in: [src/testing/types.ts:33](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/testing/types.ts#L33)

Default, funded test account that is ephemerally created

#### Type Declaration

##### addr

> **addr**: `Readonly`\<[`Address`](../../../algokit-utils/classes/Address.md)\>

##### lsigSigner

> **lsigSigner**: [`DelegatedLsigSigner`](../../transact/type-aliases/DelegatedLsigSigner.md)

##### mxBytesSigner

> **mxBytesSigner**: [`MxBytesSigner`](../../transact/type-aliases/MxBytesSigner.md)

##### programDataSigner

> **programDataSigner**: [`ProgramDataSigner`](../../transact/type-aliases/ProgramDataSigner.md)

##### signer

> **signer**: [`TransactionSigner`](../../transact/type-aliases/TransactionSigner.md)

***

### transactionLogger

> **transactionLogger**: [`TransactionLogger`](../classes/TransactionLogger.md)

Defined in: [src/testing/types.ts:31](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/testing/types.ts#L31)

Transaction logger that will log transaction IDs for all transactions issued by `algod`

***

### waitForIndexer()

> **waitForIndexer**: () => `Promise`\<`void`\>

Defined in: [src/testing/types.ts:37](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/testing/types.ts#L37)

Wait for the indexer to catch up with all transactions logged by `transactionLogger`

#### Returns

`Promise`\<`void`\>

***

### waitForIndexerTransaction()

> **waitForIndexerTransaction**: (`transactionId`) => `Promise`\<[`TransactionResponse`](../../indexer-client/type-aliases/TransactionResponse.md)\>

Defined in: [src/testing/types.ts:39](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/testing/types.ts#L39)

Wait for the indexer to catch up with the given transaction ID

#### Parameters

##### transactionId

`string`

#### Returns

`Promise`\<[`TransactionResponse`](../../indexer-client/type-aliases/TransactionResponse.md)\>
