[@algorandfoundation/algokit-utils](../README.md) / [testing](../modules/testing.md) / AlgorandTestAutomationContext

# Interface: AlgorandTestAutomationContext

[testing](../modules/testing.md).AlgorandTestAutomationContext

Test automation context.

## Table of contents

### Properties

- [algod](testing.AlgorandTestAutomationContext.md#algod)
- [algorand](testing.AlgorandTestAutomationContext.md#algorand)
- [generateAccount](testing.AlgorandTestAutomationContext.md#generateaccount)
- [indexer](testing.AlgorandTestAutomationContext.md#indexer)
- [kmd](testing.AlgorandTestAutomationContext.md#kmd)
- [testAccount](testing.AlgorandTestAutomationContext.md#testaccount)
- [transactionLogger](testing.AlgorandTestAutomationContext.md#transactionlogger)
- [waitForIndexer](testing.AlgorandTestAutomationContext.md#waitforindexer)
- [waitForIndexerTransaction](testing.AlgorandTestAutomationContext.md#waitforindexertransaction)

## Properties

### algod

• **algod**: `AlgodClient`

Algod client instance that will log transactions in `transactionLogger`

#### Defined in

[src/testing/types.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L25)

___

### algorand

• **algorand**: [`AlgorandClient`](../classes/index.AlgorandClient.md)

An AlgorandClient instance loaded with the current context, including testAccount and any generated accounts loaded as signers

#### Defined in

[src/testing/types.ts:23](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L23)

___

### generateAccount

• **generateAccount**: (`params`: [`GetTestAccountParams`](testing.GetTestAccountParams.md)) => `Promise`\<[`Address`](../classes/index.Address.md) & \{ `addr`: `Readonly`\<[`Address`](../classes/index.Address.md)\> ; `lsigSigner`: `DelegatedLsigSigner` ; `mxBytesSigner`: `MxBytesSigner` ; `programDataSigner`: `ProgramDataSigner` ; `signer`: `TransactionSigner`  }\>

Generate and fund an additional ephemerally created account

#### Type declaration

▸ (`params`): `Promise`\<[`Address`](../classes/index.Address.md) & \{ `addr`: `Readonly`\<[`Address`](../classes/index.Address.md)\> ; `lsigSigner`: `DelegatedLsigSigner` ; `mxBytesSigner`: `MxBytesSigner` ; `programDataSigner`: `ProgramDataSigner` ; `signer`: `TransactionSigner`  }\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`GetTestAccountParams`](testing.GetTestAccountParams.md) |

##### Returns

`Promise`\<[`Address`](../classes/index.Address.md) & \{ `addr`: `Readonly`\<[`Address`](../classes/index.Address.md)\> ; `lsigSigner`: `DelegatedLsigSigner` ; `mxBytesSigner`: `MxBytesSigner` ; `programDataSigner`: `ProgramDataSigner` ; `signer`: `TransactionSigner`  }\>

#### Defined in

[src/testing/types.ts:35](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L35)

___

### indexer

• **indexer**: `IndexerClient`

Indexer client instance

#### Defined in

[src/testing/types.ts:27](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L27)

___

### kmd

• **kmd**: `KmdClient`

KMD client instance

#### Defined in

[src/testing/types.ts:29](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L29)

___

### testAccount

• **testAccount**: [`Address`](../classes/index.Address.md) & \{ `addr`: `Readonly`\<[`Address`](../classes/index.Address.md)\> ; `lsigSigner`: `DelegatedLsigSigner` ; `mxBytesSigner`: `MxBytesSigner` ; `programDataSigner`: `ProgramDataSigner` ; `signer`: `TransactionSigner`  }

Default, funded test account that is ephemerally created

#### Defined in

[src/testing/types.ts:33](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L33)

___

### transactionLogger

• **transactionLogger**: [`TransactionLogger`](../classes/testing.TransactionLogger.md)

Transaction logger that will log transaction IDs for all transactions issued by `algod`

#### Defined in

[src/testing/types.ts:31](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L31)

___

### waitForIndexer

• **waitForIndexer**: () => `Promise`\<`void`\>

Wait for the indexer to catch up with all transactions logged by `transactionLogger`

#### Type declaration

▸ (): `Promise`\<`void`\>

##### Returns

`Promise`\<`void`\>

#### Defined in

[src/testing/types.ts:37](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L37)

___

### waitForIndexerTransaction

• **waitForIndexerTransaction**: (`transactionId`: `string`) => `Promise`\<`TransactionResponse`\>

Wait for the indexer to catch up with the given transaction ID

#### Type declaration

▸ (`transactionId`): `Promise`\<`TransactionResponse`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `transactionId` | `string` |

##### Returns

`Promise`\<`TransactionResponse`\>

#### Defined in

[src/testing/types.ts:39](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L39)
