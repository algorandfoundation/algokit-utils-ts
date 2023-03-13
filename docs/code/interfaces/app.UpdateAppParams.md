[algotstest](../README.md) / [app](../modules/app.md) / UpdateAppParams

# Interface: UpdateAppParams

[app](../modules/app.md).UpdateAppParams

Parameters that are passed in when updating an app.

## Hierarchy

- `CreateOrUpdateAppParams`

  ↳ **`UpdateAppParams`**

## Table of contents

### Properties

- [appIndex](app.UpdateAppParams.md#appindex)
- [approvalProgram](app.UpdateAppParams.md#approvalprogram)
- [args](app.UpdateAppParams.md#args)
- [clearStateProgram](app.UpdateAppParams.md#clearstateprogram)
- [from](app.UpdateAppParams.md#from)
- [maxFee](app.UpdateAppParams.md#maxfee)
- [maxRoundsToWaitForConfirmation](app.UpdateAppParams.md#maxroundstowaitforconfirmation)
- [note](app.UpdateAppParams.md#note)
- [skipSending](app.UpdateAppParams.md#skipsending)
- [skipWaiting](app.UpdateAppParams.md#skipwaiting)
- [suppressLog](app.UpdateAppParams.md#suppresslog)
- [transactionParams](app.UpdateAppParams.md#transactionparams)

## Properties

### appIndex

• **appIndex**: `number`

The index of the app to update

#### Defined in

[app.ts:81](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/app.ts#L81)

___

### approvalProgram

• **approvalProgram**: `string` \| `Uint8Array`

The approval program as raw teal (string) or compiled teal, base 64 encoded as a byte array (Uint8Array)

#### Inherited from

CreateOrUpdateAppParams.approvalProgram

#### Defined in

[app.ts:61](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/app.ts#L61)

___

### args

• `Optional` **args**: [`AppCallArgs`](app.AppCallArgs.md)

The arguments passed in to the app call

#### Inherited from

CreateOrUpdateAppParams.args

#### Defined in

[app.ts:69](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/app.ts#L69)

___

### clearStateProgram

• **clearStateProgram**: `string` \| `Uint8Array`

The clear state program as raw teal (string) or compiled teal, base 64 encoded as a byte array (Uint8Array)

#### Inherited from

CreateOrUpdateAppParams.clearStateProgram

#### Defined in

[app.ts:63](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/app.ts#L63)

___

### from

• **from**: [`SendTransactionFrom`](../modules/transaction.md#sendtransactionfrom)

The account (with private key loaded) that will send the µALGOs

#### Inherited from

CreateOrUpdateAppParams.from

#### Defined in

[app.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/app.ts#L59)

___

### maxFee

• `Optional` **maxFee**: [`AlgoAmount`](../classes/algo_amount.AlgoAmount.md)

The maximum fee that you are happy to pay (default: unbounded) - if this is set it's possible the transaction could get rejected during network congestion

#### Inherited from

CreateOrUpdateAppParams.maxFee

#### Defined in

[transaction.ts:134](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/transaction.ts#L134)

___

### maxRoundsToWaitForConfirmation

• `Optional` **maxRoundsToWaitForConfirmation**: `number`

The maximum number of rounds to wait for confirmation, only applies if `skipWaiting` is `undefined` or `false`, default: wait up to 5 rounds

#### Inherited from

CreateOrUpdateAppParams.maxRoundsToWaitForConfirmation

#### Defined in

[transaction.ts:136](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/transaction.ts#L136)

___

### note

• `Optional` **note**: [`TransactionNote`](../modules/transaction.md#transactionnote)

The (optional) transaction note

#### Inherited from

CreateOrUpdateAppParams.note

#### Defined in

[app.ts:67](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/app.ts#L67)

___

### skipSending

• `Optional` **skipSending**: `boolean`

Whether to skip signing and sending the transaction to the chain (default: transaction signed and sent to chain)
  (and instead just return the raw transaction, e.g. so you can add it to a group of transactions)

#### Inherited from

CreateOrUpdateAppParams.skipSending

#### Defined in

[transaction.ts:128](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/transaction.ts#L128)

___

### skipWaiting

• `Optional` **skipWaiting**: `boolean`

Whether to skip waiting for the submitted transaction (only relevant if `skipSending` is `false` or unset)

#### Inherited from

CreateOrUpdateAppParams.skipWaiting

#### Defined in

[transaction.ts:130](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/transaction.ts#L130)

___

### suppressLog

• `Optional` **suppressLog**: `boolean`

Whether to suppress log messages from transaction send, default: do not suppress

#### Inherited from

CreateOrUpdateAppParams.suppressLog

#### Defined in

[transaction.ts:132](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/transaction.ts#L132)

___

### transactionParams

• `Optional` **transactionParams**: `SuggestedParams`

Optional transaction parameters

#### Inherited from

CreateOrUpdateAppParams.transactionParams

#### Defined in

[app.ts:65](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/app.ts#L65)
