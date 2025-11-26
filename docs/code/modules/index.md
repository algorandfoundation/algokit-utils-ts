[@algorandfoundation/algokit-utils](../README.md) / index

# Module: index

## Table of contents

### References

- [ALGOKIT\_DIR](index.md#algokit_dir)
- [AVMTracesEventData](index.md#avmtraceseventdata)
- [AlgorandClient](index.md#algorandclient)
- [DEFAULT\_MAX\_SEARCH\_DEPTH](index.md#default_max_search_depth)
- [EventDataMap](index.md#eventdatamap)
- [EventType](index.md#eventtype)
- [SOURCES\_DIR](index.md#sources_dir)
- [TEAL\_FILE\_EXT](index.md#teal_file_ext)
- [TEAL\_SOURCEMAP\_EXT](index.md#teal_sourcemap_ext)
- [TealSourceDebugEventData](index.md#tealsourcedebugeventdata)
- [TealSourcesDebugEventData](index.md#tealsourcesdebugeventdata)

### Namespaces

- [indexer](index.indexer.md)

### Interfaces

- [TransactionWithSigner](../interfaces/index.TransactionWithSigner.md)

### Variables

- [ALGORAND\_MIN\_TX\_FEE](index.md#algorand_min_tx_fee)
- [Config](index.md#config)
- [MAX\_APP\_CALL\_ACCOUNT\_REFERENCES](index.md#max_app_call_account_references)
- [MAX\_APP\_CALL\_FOREIGN\_REFERENCES](index.md#max_app_call_foreign_references)
- [MAX\_TRANSACTION\_GROUP\_SIZE](index.md#max_transaction_group_size)

### Functions

- [algo](index.md#algo)
- [algos](index.md#algos)
- [encodeLease](index.md#encodelease)
- [getABIReturnValue](index.md#getabireturnvalue)
- [microAlgo](index.md#microalgo)
- [microAlgos](index.md#microalgos)
- [performTransactionComposerSimulate](index.md#performtransactioncomposersimulate)
- [populateAppCallResources](index.md#populateappcallresources)
- [prepareGroupForSending](index.md#preparegroupforsending)
- [sendTransactionComposer](index.md#sendtransactioncomposer)
- [transactionFees](index.md#transactionfees)
- [waitForConfirmation](index.md#waitforconfirmation)

## References

### ALGOKIT\_DIR

Re-exports [ALGOKIT_DIR](types_debugging.md#algokit_dir)

___

### AVMTracesEventData

Re-exports [AVMTracesEventData](../interfaces/types_debugging.AVMTracesEventData.md)

___

### AlgorandClient

Re-exports [AlgorandClient](../classes/types_algorand_client.AlgorandClient.md)

___

### DEFAULT\_MAX\_SEARCH\_DEPTH

Re-exports [DEFAULT_MAX_SEARCH_DEPTH](types_debugging.md#default_max_search_depth)

___

### EventDataMap

Re-exports [EventDataMap](types_lifecycle_events.md#eventdatamap)

___

### EventType

Re-exports [EventType](../enums/types_lifecycle_events.EventType.md)

___

### SOURCES\_DIR

Re-exports [SOURCES_DIR](types_debugging.md#sources_dir)

___

### TEAL\_FILE\_EXT

Re-exports [TEAL_FILE_EXT](types_debugging.md#teal_file_ext)

___

### TEAL\_SOURCEMAP\_EXT

Re-exports [TEAL_SOURCEMAP_EXT](types_debugging.md#teal_sourcemap_ext)

___

### TealSourceDebugEventData

Re-exports [TealSourceDebugEventData](../interfaces/types_debugging.TealSourceDebugEventData.md)

___

### TealSourcesDebugEventData

Re-exports [TealSourcesDebugEventData](../interfaces/types_debugging.TealSourcesDebugEventData.md)

## Variables

### ALGORAND\_MIN\_TX\_FEE

• `Const` **ALGORAND\_MIN\_TX\_FEE**: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

#### Defined in

[src/amount.ts:93](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L93)

___

### Config

• `Const` **Config**: [`UpdatableConfig`](../classes/types_config.UpdatableConfig.md)

The AlgoKit config. To update it use the configure method.

#### Defined in

[src/config.ts:4](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/config.ts#L4)

___

### MAX\_APP\_CALL\_ACCOUNT\_REFERENCES

• `Const` **MAX\_APP\_CALL\_ACCOUNT\_REFERENCES**: ``4``

#### Defined in

[src/transaction/transaction.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L25)

___

### MAX\_APP\_CALL\_FOREIGN\_REFERENCES

• `Const` **MAX\_APP\_CALL\_FOREIGN\_REFERENCES**: ``8``

#### Defined in

[src/transaction/transaction.ts:24](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L24)

___

### MAX\_TRANSACTION\_GROUP\_SIZE

• `Const` **MAX\_TRANSACTION\_GROUP\_SIZE**: ``16``

#### Defined in

[src/transaction/transaction.ts:23](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L23)

## Functions

### algo

▸ **algo**(`algos`): [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

Returns an amount of Algo using AlgoAmount

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `algos` | `number` \| `bigint` | The amount of Algo |

#### Returns

[`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

#### Defined in

[src/amount.ts:68](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L68)

___

### algos

▸ **algos**(`algos`): [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

Returns an amount of Algo using AlgoAmount

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `algos` | `number` \| `bigint` | The amount of Algo |

#### Returns

[`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

#### Defined in

[src/amount.ts:61](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L61)

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

[src/transaction/transaction.ts:35](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L35)

___

### getABIReturnValue

▸ **getABIReturnValue**(`result`, `type`): [`ABIReturn`](types_app.md#abireturn)

Takes an algosdk `ABIResult` and converts it to an `ABIReturn`.
Converts `bigint`'s for Uint's < 64 to `number` for easier use.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `result` | `ABIResult` | The `ABIReturn` |
| `type` | `ABIReturnType` | - |

#### Returns

[`ABIReturn`](types_app.md#abireturn)

#### Defined in

[src/transaction/transaction.ts:141](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L141)

___

### microAlgo

▸ **microAlgo**(`microAlgos`): [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

Returns an amount of µAlgo using AlgoAmount

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `microAlgos` | `number` \| `bigint` | The amount of µAlgo |

#### Returns

[`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

#### Defined in

[src/amount.ts:82](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L82)

___

### microAlgos

▸ **microAlgos**(`microAlgos`): [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

Returns an amount of µAlgo using AlgoAmount

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `microAlgos` | `number` \| `bigint` | The amount of µAlgo |

#### Returns

[`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

#### Defined in

[src/amount.ts:75](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L75)

___

### performTransactionComposerSimulate

▸ **performTransactionComposerSimulate**(`composer`, `options?`): `Promise`\<`SimulateTransaction`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `composer` | [`TransactionComposer`](../classes/types_composer.TransactionComposer.md) | The TransactionComposer with transaction(s) loaded. |
| `options?` | [`RawSimulateOptions`](types_composer.md#rawsimulateoptions) | - |

#### Returns

`Promise`\<`SimulateTransaction`\>

The simulation result, which includes various details about how the transactions would be processed.

**`Deprecated`**

Use `composer.simulate` with
 - `allowEmptySignatures` flag set to true
 - `throwOnFailure` flag set to false

Performs a simulation of the transactions loaded into the given TransactionComposer.
Uses empty transaction signers for all transactions.

#### Defined in

[src/transaction/perform-transaction-composer-simulate.ts:14](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/perform-transaction-composer-simulate.ts#L14)

___

### populateAppCallResources

▸ **populateAppCallResources**(`composer`): `Promise`\<[`TransactionComposer`](../classes/types_composer.TransactionComposer.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `composer` | [`TransactionComposer`](../classes/types_composer.TransactionComposer.md) | The composer containing the txn group |

#### Returns

`Promise`\<[`TransactionComposer`](../classes/types_composer.TransactionComposer.md)\>

A new composer with the resources populated into the transactions

**`Deprecated`**

Use `composer.build()` directly
Take an existing Transaction Composer and return a new one with the required
app call resources populated into it

#### Defined in

[src/transaction/transaction.ts:81](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L81)

___

### prepareGroupForSending

▸ **prepareGroupForSending**(`composer`, `sendParams`, `additionalAtcContext?`): `Promise`\<[`TransactionComposer`](../classes/types_composer.TransactionComposer.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `composer` | [`TransactionComposer`](../classes/types_composer.TransactionComposer.md) | The Transaction Composer containing the txn group |
| `sendParams` | [`SendParams`](../interfaces/types_transaction.SendParams.md) | The send params for the transaction group |
| `additionalAtcContext?` | [`AdditionalTransactionComposerContext`](../interfaces/types_transaction.AdditionalTransactionComposerContext.md) | Additional context used to determine how best to change the transactions in the group |

#### Returns

`Promise`\<[`TransactionComposer`](../classes/types_composer.TransactionComposer.md)\>

A new Transaction Composer with the changes applied

**`Deprecated`**

Use `composer.setMaxFees()` instead if you need to set max fees for transactions.
Use `composer.build()` instead if you need to build transactions with resource population.

Take an existing Transaction Composer and return a new one with changes applied to the transactions
based on the supplied sendParams to prepare it for sending.

#### Defined in

[src/transaction/transaction.ts:102](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L102)

___

### sendTransactionComposer

▸ **sendTransactionComposer**(`atcSend`): `Promise`\<[`SendTransactionComposerResults`](../interfaces/types_transaction.SendTransactionComposerResults.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `atcSend` | [`TransactionComposerToSend`](../interfaces/types_transaction.TransactionComposerToSend.md) | The parameters controlling the send, including `atc` The `TransactionComposer` and params to control send behaviour |

#### Returns

`Promise`\<[`SendTransactionComposerResults`](../interfaces/types_transaction.SendTransactionComposerResults.md)\>

An object with transaction IDs, transactions, group transaction ID (`groupTransactionId`) if more than 1 transaction sent, and (if `skipWaiting` is `false` or unset) confirmation (`confirmation`)

**`Deprecated`**

Use `composer.send()` directly
Signs and sends transactions that have been collected by an `TransactionComposer`.

#### Defined in

[src/transaction/transaction.ts:128](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L128)

___

### transactionFees

▸ **transactionFees**(`numberOfTransactions`): [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

Returns an amount of µAlgo to cover standard fees for the given number of transactions using AlgoAmount

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `numberOfTransactions` | `number` | The of standard transaction fees to return the amount of Algo |

#### Returns

[`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

#### Defined in

[src/amount.ts:89](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L89)

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

[src/transaction/transaction.ts:174](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L174)
