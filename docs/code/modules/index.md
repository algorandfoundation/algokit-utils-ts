[@algorandfoundation/algokit-utils](../README.md) / index

# Module: index

## Table of contents

### Enumerations

- [EventType](../enums/index.EventType.md)

### Classes

- [Address](../classes/index.Address.md)
- [AlgoAmount](../classes/index.AlgoAmount.md)
- [AlgorandClient](../classes/index.AlgorandClient.md)

### Interfaces

- [AdditionalTransactionComposerContext](../interfaces/index.AdditionalTransactionComposerContext.md)
- [Addressable](../interfaces/index.Addressable.md)
- [ConfirmedTransactionResult](../interfaces/index.ConfirmedTransactionResult.md)
- [ConfirmedTransactionResults](../interfaces/index.ConfirmedTransactionResults.md)
- [SendParams](../interfaces/index.SendParams.md)
- [SendTransactionComposerResults](../interfaces/index.SendTransactionComposerResults.md)
- [SendTransactionParams](../interfaces/index.SendTransactionParams.md)
- [SendTransactionResult](../interfaces/index.SendTransactionResult.md)
- [SendTransactionResults](../interfaces/index.SendTransactionResults.md)
- [TransactionComposerToSend](../interfaces/index.TransactionComposerToSend.md)
- [TransactionGroupToSend](../interfaces/index.TransactionGroupToSend.md)
- [TransactionToSign](../interfaces/index.TransactionToSign.md)
- [TransactionWithSigner](../interfaces/index.TransactionWithSigner.md)

### Type Aliases

- [AVMTracesEventData](index.md#avmtraceseventdata)
- [Arc2TransactionNote](index.md#arc2transactionnote)
- [EventDataMap](index.md#eventdatamap)
- [ReadableAddress](index.md#readableaddress)
- [SendSingleTransactionResult](index.md#sendsingletransactionresult)
- [SendTransactionFrom](index.md#sendtransactionfrom)
- [TealSourceDebugEventData](index.md#tealsourcedebugeventdata)
- [TealSourcesDebugEventData](index.md#tealsourcesdebugeventdata)
- [TransactionNote](index.md#transactionnote)
- [TransactionNoteData](index.md#transactionnotedata)

### Variables

- [ALGOKIT\_DIR](index.md#algokit_dir)
- [ALGORAND\_MIN\_TX\_FEE](index.md#algorand_min_tx_fee)
- [ALGORAND\_ZERO\_ADDRESS\_STRING](index.md#algorand_zero_address_string)
- [Config](index.md#config)
- [DEFAULT\_MAX\_SEARCH\_DEPTH](index.md#default_max_search_depth)
- [SOURCES\_DIR](index.md#sources_dir)
- [TEAL\_FILE\_EXT](index.md#teal_file_ext)
- [TEAL\_SOURCEMAP\_EXT](index.md#teal_sourcemap_ext)

### Functions

- [algo](index.md#algo)
- [algos](index.md#algos)
- [decodeAddress](index.md#decodeaddress)
- [encodeAddress](index.md#encodeaddress)
- [encodeLease](index.md#encodelease)
- [getAddress](index.md#getaddress)
- [getApplicationAddress](index.md#getapplicationaddress)
- [getOptionalAddress](index.md#getoptionaladdress)
- [microAlgo](index.md#microalgo)
- [microAlgos](index.md#microalgos)
- [performTransactionComposerSimulate](index.md#performtransactioncomposersimulate)
- [populateAppCallResources](index.md#populateappcallresources)
- [prepareGroupForSending](index.md#preparegroupforsending)
- [sendTransactionComposer](index.md#sendtransactioncomposer)
- [transactionFees](index.md#transactionfees)
- [waitForConfirmation](index.md#waitforconfirmation)

## Type Aliases

### AVMTracesEventData

Ƭ **AVMTracesEventData**: `Object`

Represents the data for AVM traces debug events emitted whenever a transaction is simulated in debug mode

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `simulateResponse` | `SimulateResponse` | The simulation response from Algod |

#### Defined in

[src/debugging.ts:47](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/debugging.ts#L47)

___

### Arc2TransactionNote

Ƭ **Arc2TransactionNote**: \{ `dAppName`: `string` ; `data`: `string` ; `format`: ``"m"`` \| ``"b"`` \| ``"u"``  } \| \{ `dAppName`: `string` ; `data`: [`TransactionNoteData`](index.md#transactionnotedata) ; `format`: ``"j"``  }

ARC-0002 compatible transaction note components https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0002.md

#### Defined in

[src/transaction/types.ts:12](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L12)

___

### EventDataMap

Ƭ **EventDataMap**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `AppCompiled` | [`TealSourcesDebugEventData`](index.md#tealsourcesdebugeventdata) |
| `TxnGroupSimulated` | [`AVMTracesEventData`](index.md#avmtraceseventdata) |

#### Defined in

[src/lifecycle-events.ts:8](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/lifecycle-events.ts#L8)

___

### ReadableAddress

Ƭ **ReadableAddress**: [`Addressable`](../interfaces/index.Addressable.md) \| [`Address`](../classes/index.Address.md) \| `string`

#### Defined in

[packages/common/src/address.ts:137](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/common/src/address.ts#L137)

___

### SendSingleTransactionResult

Ƭ **SendSingleTransactionResult**: `Expand`\<[`SendTransactionComposerResults`](../interfaces/index.SendTransactionComposerResults.md) & [`ConfirmedTransactionResult`](../interfaces/index.ConfirmedTransactionResult.md)\>

Result from sending a single transaction.

#### Defined in

[src/transaction/types.ts:46](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L46)

___

### SendTransactionFrom

Ƭ **SendTransactionFrom**: `AddressWithTransactionSigner`

**`Deprecated`**

Use `SendingAddress` instead

#### Defined in

[src/transaction/types.ts:98](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L98)

___

### TealSourceDebugEventData

Ƭ **TealSourceDebugEventData**: `Object`

Represents the data for a single TEAL source

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `appName` | `string` | The name of the application |
| `compiledTeal` | `Expand`\<`Omit`\<`CompiledTeal`, ``"sourceMap"``\> & \{ `sourceMap`: `SourceMap`  }\> | The compiled TEAL code |
| `fileName` | `string` | The name of the file |

#### Defined in

[src/debugging.ts:27](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/debugging.ts#L27)

___

### TealSourcesDebugEventData

Ƭ **TealSourcesDebugEventData**: `Object`

Represents the data for multiple TEAL sources debug events emitted whenever an app is compiled as part of a deploy in debug mode

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `sources` | [`TealSourceDebugEventData`](index.md#tealsourcedebugeventdata)[] | An array of TEAL source debug event data |

#### Defined in

[src/debugging.ts:39](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/debugging.ts#L39)

___

### TransactionNote

Ƭ **TransactionNote**: `Uint8Array` \| [`TransactionNoteData`](index.md#transactionnotedata) \| [`Arc2TransactionNote`](index.md#arc2transactionnote)

#### Defined in

[src/transaction/types.ts:8](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L8)

___

### TransactionNoteData

Ƭ **TransactionNoteData**: `string` \| ``null`` \| `undefined` \| `number` \| `any`[] \| `Record`\<`string`, `any`\>

#### Defined in

[src/transaction/types.ts:10](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L10)

## Variables

### ALGOKIT\_DIR

• `Const` **ALGOKIT\_DIR**: ``".algokit"``

The directory name for AlgoKit project related files

#### Defined in

[src/debugging.ts:10](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/debugging.ts#L10)

___

### ALGORAND\_MIN\_TX\_FEE

• `Const` **ALGORAND\_MIN\_TX\_FEE**: [`AlgoAmount`](../classes/index.AlgoAmount.md)

#### Defined in

[src/amount.ts:196](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L196)

___

### ALGORAND\_ZERO\_ADDRESS\_STRING

• `Const` **ALGORAND\_ZERO\_ADDRESS\_STRING**: ``"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ"``

#### Defined in

[packages/common/src/address.ts:9](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/common/src/address.ts#L9)

___

### Config

• `Const` **Config**: `UpdatableConfig`

The AlgoKit config. To update it use the configure method.

#### Defined in

[src/config.ts:4](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/config.ts#L4)

___

### DEFAULT\_MAX\_SEARCH\_DEPTH

• `Const` **DEFAULT\_MAX\_SEARCH\_DEPTH**: ``10``

The default maximum search depth for file operations

#### Defined in

[src/debugging.ts:22](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/debugging.ts#L22)

___

### SOURCES\_DIR

• `Const` **SOURCES\_DIR**: ``"sources"``

The directory name for debug source files

#### Defined in

[src/debugging.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/debugging.ts#L13)

___

### TEAL\_FILE\_EXT

• `Const` **TEAL\_FILE\_EXT**: ``".teal"``

The file extension for TEAL files

#### Defined in

[src/debugging.ts:16](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/debugging.ts#L16)

___

### TEAL\_SOURCEMAP\_EXT

• `Const` **TEAL\_SOURCEMAP\_EXT**: ``".teal.map"``

The file extension for TEAL source map files

#### Defined in

[src/debugging.ts:19](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/debugging.ts#L19)

## Functions

### algo

▸ **algo**(`algos`): [`AlgoAmount`](../classes/index.AlgoAmount.md)

Returns an amount of Algo using AlgoAmount

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `algos` | `number` \| `bigint` | The amount of Algo |

#### Returns

[`AlgoAmount`](../classes/index.AlgoAmount.md)

#### Defined in

[src/amount.ts:171](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L171)

___

### algos

▸ **algos**(`algos`): [`AlgoAmount`](../classes/index.AlgoAmount.md)

Returns an amount of Algo using AlgoAmount

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `algos` | `number` \| `bigint` | The amount of Algo |

#### Returns

[`AlgoAmount`](../classes/index.AlgoAmount.md)

#### Defined in

[src/amount.ts:164](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L164)

___

### decodeAddress

▸ **decodeAddress**(`address`): [`Address`](../classes/index.Address.md)

decodeAddress takes an Algorand address in string form and decodes it into a Uint8Array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | an Algorand address with checksum. |

#### Returns

[`Address`](../classes/index.Address.md)

the decoded form of the address's public key and checksum

#### Defined in

[packages/common/src/address.ts:189](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/common/src/address.ts#L189)

___

### encodeAddress

▸ **encodeAddress**(`address`): `string`

encodeAddress takes an Algorand address as a Uint8Array and encodes it into a string with checksum.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Uint8Array` | a raw Algorand address |

#### Returns

`string`

the address and checksum encoded as a string.

#### Defined in

[packages/common/src/address.ts:198](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/common/src/address.ts#L198)

___

### encodeLease

▸ **encodeLease**(`lease?`): `Uint8Array` \| `undefined`

Encodes a transaction lease into a 32-byte array ready to be included in an Algorand transaction.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `lease?` | `string` \| `Uint8Array` | The transaction lease as a string or binary array or null/undefined if there is no lease |

#### Returns

`Uint8Array` \| `undefined`

the transaction lease ready for inclusion in a transaction or `undefined` if there is no lease

**`Throws`**

if the length of the data is > 32 bytes or empty

**`Example`**

```ts
algokit.encodeLease('UNIQUE_ID')
```

**`Example`**

```ts
algokit.encodeLease(new Uint8Array([1, 2, 3]))
```

#### Defined in

[src/transaction/transaction.ts:23](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L23)

___

### getAddress

▸ **getAddress**(`addr`): [`Address`](../classes/index.Address.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `addr` | [`ReadableAddress`](index.md#readableaddress) |

#### Returns

[`Address`](../classes/index.Address.md)

#### Defined in

[packages/common/src/address.ts:139](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/common/src/address.ts#L139)

___

### getApplicationAddress

▸ **getApplicationAddress**(`appID`): [`Address`](../classes/index.Address.md)

Get the escrow address of an application.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appID` | `number` \| `bigint` | The ID of the application. |

#### Returns

[`Address`](../classes/index.Address.md)

The address corresponding to that application's escrow account.

#### Defined in

[packages/common/src/address.ts:178](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/common/src/address.ts#L178)

___

### getOptionalAddress

▸ **getOptionalAddress**(`addr`): [`Address`](../classes/index.Address.md) \| `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `addr` | `undefined` \| [`ReadableAddress`](index.md#readableaddress) |

#### Returns

[`Address`](../classes/index.Address.md) \| `undefined`

#### Defined in

[packages/common/src/address.ts:149](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/common/src/address.ts#L149)

___

### microAlgo

▸ **microAlgo**(`microAlgos`): [`AlgoAmount`](../classes/index.AlgoAmount.md)

Returns an amount of µAlgo using AlgoAmount

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `microAlgos` | `number` \| `bigint` | The amount of µAlgo |

#### Returns

[`AlgoAmount`](../classes/index.AlgoAmount.md)

#### Defined in

[src/amount.ts:185](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L185)

___

### microAlgos

▸ **microAlgos**(`microAlgos`): [`AlgoAmount`](../classes/index.AlgoAmount.md)

Returns an amount of µAlgo using AlgoAmount

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `microAlgos` | `number` \| `bigint` | The amount of µAlgo |

#### Returns

[`AlgoAmount`](../classes/index.AlgoAmount.md)

#### Defined in

[src/amount.ts:178](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L178)

___

### performTransactionComposerSimulate

▸ **performTransactionComposerSimulate**(`composer`, `options?`): `Promise`\<`SimulateResponse`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `composer` | `TransactionComposer` | The TransactionComposer with transaction(s) loaded. |
| `options?` | `RawSimulateOptions` | - |

#### Returns

`Promise`\<`SimulateResponse`\>

The simulation result, which includes various details about how the transactions would be processed.

**`Deprecated`**

Use `composer.simulate` with
 - `allowEmptySignatures` flag set to true
 - `resultOnFailure` flag set to true

Performs a simulation of the transactions loaded into the given TransactionComposer.
Uses empty transaction signers for all transactions.

#### Defined in

[src/transaction/perform-transaction-composer-simulate.ts:14](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/perform-transaction-composer-simulate.ts#L14)

___

### populateAppCallResources

▸ **populateAppCallResources**(`composer`): `Promise`\<`TransactionComposer`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `composer` | `TransactionComposer` | The composer containing the txn group |

#### Returns

`Promise`\<`TransactionComposer`\>

A new composer with the resources populated into the transactions

**`Deprecated`**

Use `composer.build()` directly
Take an existing Transaction Composer and return a new one with the required
app call resources populated into it

#### Defined in

[src/transaction/transaction.ts:69](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L69)

___

### prepareGroupForSending

▸ **prepareGroupForSending**(`composer`, `sendParams`, `additionalContext?`): `Promise`\<`TransactionComposer`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `composer` | `TransactionComposer` | The Transaction Composer containing the txn group |
| `sendParams` | [`SendParams`](../interfaces/index.SendParams.md) | The send params for the transaction group |
| `additionalContext?` | [`AdditionalTransactionComposerContext`](../interfaces/index.AdditionalTransactionComposerContext.md) | Additional context used to determine how best to change the transactions in the group |

#### Returns

`Promise`\<`TransactionComposer`\>

A new Transaction Composer with the changes applied

**`Deprecated`**

Use `composer.setMaxFees()` instead if you need to set max fees for transactions.
Use `composer.build()` instead if you need to build transactions with resource population.

Take an existing Transaction Composer and return a new one with changes applied to the transactions
based on the supplied sendParams to prepare it for sending.

#### Defined in

[src/transaction/transaction.ts:90](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L90)

___

### sendTransactionComposer

▸ **sendTransactionComposer**(`atcSend`): `Promise`\<[`SendTransactionComposerResults`](../interfaces/index.SendTransactionComposerResults.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `atcSend` | [`TransactionComposerToSend`](../interfaces/index.TransactionComposerToSend.md) | The parameters controlling the send, including `atc` The `TransactionComposer` and params to control send behaviour |

#### Returns

`Promise`\<[`SendTransactionComposerResults`](../interfaces/index.SendTransactionComposerResults.md)\>

An object with transaction IDs, transactions, group transaction ID (`groupTransactionId`) if more than 1 transaction sent, and (if `skipWaiting` is `false` or unset) confirmation (`confirmation`)

**`Deprecated`**

Use `composer.send()` directly
Signs and sends transactions that have been collected by an `TransactionComposer`.

#### Defined in

[src/transaction/transaction.ts:116](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L116)

___

### transactionFees

▸ **transactionFees**(`numberOfTransactions`): [`AlgoAmount`](../classes/index.AlgoAmount.md)

Returns an amount of µAlgo to cover standard fees for the given number of transactions using AlgoAmount

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `numberOfTransactions` | `number` | The of standard transaction fees to return the amount of Algo |

#### Returns

[`AlgoAmount`](../classes/index.AlgoAmount.md)

#### Defined in

[src/amount.ts:192](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L192)

___

### waitForConfirmation

▸ **waitForConfirmation**(`transactionId`, `maxRoundsToWait`, `algod`): `Promise`\<`PendingTransactionResponse`\>

Wait until the transaction is confirmed or rejected, or until `timeout`
number of rounds have passed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transactionId` | `string` | The transaction ID to wait for |
| `maxRoundsToWait` | `number` \| `bigint` | Maximum number of rounds to wait |
| `algod` | `AlgodClient` | An algod client |

#### Returns

`Promise`\<`PendingTransactionResponse`\>

Pending transaction information

**`Throws`**

Throws an error if the transaction is not confirmed or rejected in the next `timeout` rounds

#### Defined in

[src/transaction/transaction.ts:135](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L135)
