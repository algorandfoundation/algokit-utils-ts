[@algorandfoundation/algokit-utils](../README.md) / [types/app](../modules/types_app.md) / UpdateAppParams

# Interface: UpdateAppParams

[types/app](../modules/types_app.md).UpdateAppParams

**`Deprecated`**

Use `TransactionComposer` to construct update app transactions instead.

Parameters that are passed in when updating an app.

## Hierarchy

- `CreateOrUpdateAppParams`

  ↳ **`UpdateAppParams`**

## Table of contents

### Properties

- [appId](types_app.UpdateAppParams.md#appid)
- [approvalProgram](types_app.UpdateAppParams.md#approvalprogram)
- [args](types_app.UpdateAppParams.md#args)
- [atc](types_app.UpdateAppParams.md#atc)
- [clearStateProgram](types_app.UpdateAppParams.md#clearstateprogram)
- [fee](types_app.UpdateAppParams.md#fee)
- [from](types_app.UpdateAppParams.md#from)
- [maxFee](types_app.UpdateAppParams.md#maxfee)
- [maxRoundsToWaitForConfirmation](types_app.UpdateAppParams.md#maxroundstowaitforconfirmation)
- [note](types_app.UpdateAppParams.md#note)
- [populateAppCallResources](types_app.UpdateAppParams.md#populateappcallresources)
- [skipSending](types_app.UpdateAppParams.md#skipsending)
- [skipWaiting](types_app.UpdateAppParams.md#skipwaiting)
- [suppressLog](types_app.UpdateAppParams.md#suppresslog)
- [transactionParams](types_app.UpdateAppParams.md#transactionparams)

## Properties

### appId

• **appId**: `number` \| `bigint`

The id of the app to update

#### Defined in

[src/types/app.ts:156](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L156)

___

### approvalProgram

• **approvalProgram**: `string` \| `Uint8Array`

The approval program as raw teal (string) or compiled teal, base 64 encoded as a byte array (Uint8Array)

#### Inherited from

CreateOrUpdateAppParams.approvalProgram

#### Defined in

[src/types/app.ts:128](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L128)

___

### args

• `Optional` **args**: [`AppCallArgs`](../modules/types_app.md#appcallargs)

The arguments passed in to the app call

#### Inherited from

CreateOrUpdateAppParams.args

#### Defined in

[src/types/app.ts:136](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L136)

___

### atc

• `Optional` **atc**: `AtomicTransactionComposer`

An optional `AtomicTransactionComposer` to add the transaction to, if specified then `skipSending: undefined` has the same effect as `skipSending: true`

#### Inherited from

CreateOrUpdateAppParams.atc

#### Defined in

[src/types/transaction.ts:49](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L49)

___

### clearStateProgram

• **clearStateProgram**: `string` \| `Uint8Array`

The clear state program as raw teal (string) or compiled teal, base 64 encoded as a byte array (Uint8Array)

#### Inherited from

CreateOrUpdateAppParams.clearStateProgram

#### Defined in

[src/types/app.ts:130](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L130)

___

### fee

• `Optional` **fee**: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

The flat fee you want to pay, useful for covering extra fees in a transaction group or app call

#### Inherited from

CreateOrUpdateAppParams.fee

#### Defined in

[src/types/transaction.ts:53](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L53)

___

### from

• **from**: [`TransactionSignerAccount`](types_account.TransactionSignerAccount.md)

The account (with private key loaded) that will send the transaction

#### Inherited from

CreateOrUpdateAppParams.from

#### Defined in

[src/types/app.ts:126](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L126)

___

### maxFee

• `Optional` **maxFee**: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

The maximum fee that you are happy to pay (default: unbounded) - if this is set it's possible the transaction could get rejected during network congestion

#### Inherited from

CreateOrUpdateAppParams.maxFee

#### Defined in

[src/types/transaction.ts:55](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L55)

___

### maxRoundsToWaitForConfirmation

• `Optional` **maxRoundsToWaitForConfirmation**: `number`

The maximum number of rounds to wait for confirmation, only applies if `skipWaiting` is `undefined` or `false`, default: wait up to 5 rounds

#### Inherited from

CreateOrUpdateAppParams.maxRoundsToWaitForConfirmation

#### Defined in

[src/types/transaction.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L57)

___

### note

• `Optional` **note**: [`TransactionNote`](../modules/types_transaction.md#transactionnote)

The (optional) transaction note

#### Inherited from

CreateOrUpdateAppParams.note

#### Defined in

[src/types/app.ts:134](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L134)

___

### populateAppCallResources

• `Optional` **populateAppCallResources**: `boolean`

Whether to use simulate to automatically populate app call resources in the txn objects. Defaults to true when there are app calls in the group.

#### Inherited from

CreateOrUpdateAppParams.populateAppCallResources

#### Defined in

[src/types/transaction.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L59)

___

### skipSending

• `Optional` **skipSending**: `boolean`

Whether to skip signing and sending the transaction to the chain (default: transaction signed and sent to chain, unless `atc` specified)
and instead just return the raw transaction, e.g. so you can add it to a group of transactions

#### Inherited from

CreateOrUpdateAppParams.skipSending

#### Defined in

[src/types/transaction.ts:45](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L45)

___

### skipWaiting

• `Optional` **skipWaiting**: `boolean`

Whether to skip waiting for the submitted transaction (only relevant if `skipSending` is `false` or unset)

#### Inherited from

CreateOrUpdateAppParams.skipWaiting

#### Defined in

[src/types/transaction.ts:47](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L47)

___

### suppressLog

• `Optional` **suppressLog**: `boolean`

Whether to suppress log messages from transaction send, default: do not suppress

#### Inherited from

CreateOrUpdateAppParams.suppressLog

#### Defined in

[src/types/transaction.ts:51](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L51)

___

### transactionParams

• `Optional` **transactionParams**: `Object`

Optional transaction parameters

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `consensusVersion` | `string` | ConsensusVersion indicates the consensus protocol version as of LastRound. |
| `fee` | `bigint` | Fee is the suggested transaction fee Fee is in units of micro-Algos per byte. Fee may fall to zero but transactions must still have a fee of at least MinTxnFee for the current network protocol. |
| `firstValid` | `bigint` | - |
| `flatFee` | `boolean` | - |
| `genesisHash` | `Uint8Array` | GenesisHash is the hash of the genesis block. |
| `genesisId` | `string` | GenesisID is an ID listed in the genesis block. |
| `lastValid` | `bigint` | - |
| `minFee` | `bigint` | The minimum transaction fee (not per byte) required for the txn to validate for the current network protocol. |

#### Inherited from

CreateOrUpdateAppParams.transactionParams

#### Defined in

[src/types/app.ts:132](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L132)
