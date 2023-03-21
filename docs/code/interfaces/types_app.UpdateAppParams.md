[@algorandfoundation/algokit-utils](../README.md) / [types/app](../modules/types_app.md) / UpdateAppParams

# Interface: UpdateAppParams

[types/app](../modules/types_app.md).UpdateAppParams

Parameters that are passed in when updating an app.

## Hierarchy

- `CreateOrUpdateAppParams`

  ↳ **`UpdateAppParams`**

## Table of contents

### Properties

- [appIndex](types_app.UpdateAppParams.md#appindex)
- [approvalProgram](types_app.UpdateAppParams.md#approvalprogram)
- [args](types_app.UpdateAppParams.md#args)
- [clearStateProgram](types_app.UpdateAppParams.md#clearstateprogram)
- [from](types_app.UpdateAppParams.md#from)
- [maxFee](types_app.UpdateAppParams.md#maxfee)
- [maxRoundsToWaitForConfirmation](types_app.UpdateAppParams.md#maxroundstowaitforconfirmation)
- [note](types_app.UpdateAppParams.md#note)
- [skipSending](types_app.UpdateAppParams.md#skipsending)
- [skipWaiting](types_app.UpdateAppParams.md#skipwaiting)
- [suppressLog](types_app.UpdateAppParams.md#suppresslog)
- [transactionParams](types_app.UpdateAppParams.md#transactionparams)

## Properties

### appIndex

• **appIndex**: `number`

The index of the app to update

#### Defined in

types/app.ts:105

___

### approvalProgram

• **approvalProgram**: `string` \| `Uint8Array`

The approval program as raw teal (string) or compiled teal, base 64 encoded as a byte array (Uint8Array)

#### Inherited from

CreateOrUpdateAppParams.approvalProgram

#### Defined in

types/app.ts:85

___

### args

• `Optional` **args**: [`AppCallArgs`](../modules/types_app.md#appcallargs)

The arguments passed in to the app call

#### Inherited from

CreateOrUpdateAppParams.args

#### Defined in

types/app.ts:93

___

### clearStateProgram

• **clearStateProgram**: `string` \| `Uint8Array`

The clear state program as raw teal (string) or compiled teal, base 64 encoded as a byte array (Uint8Array)

#### Inherited from

CreateOrUpdateAppParams.clearStateProgram

#### Defined in

types/app.ts:87

___

### from

• **from**: [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom)

The account (with private key loaded) that will send the µALGOs

#### Inherited from

CreateOrUpdateAppParams.from

#### Defined in

types/app.ts:83

___

### maxFee

• `Optional` **maxFee**: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

The maximum fee that you are happy to pay (default: unbounded) - if this is set it's possible the transaction could get rejected during network congestion

#### Inherited from

CreateOrUpdateAppParams.maxFee

#### Defined in

types/transaction.ts:32

___

### maxRoundsToWaitForConfirmation

• `Optional` **maxRoundsToWaitForConfirmation**: `number`

The maximum number of rounds to wait for confirmation, only applies if `skipWaiting` is `undefined` or `false`, default: wait up to 5 rounds

#### Inherited from

CreateOrUpdateAppParams.maxRoundsToWaitForConfirmation

#### Defined in

types/transaction.ts:34

___

### note

• `Optional` **note**: [`TransactionNote`](../modules/types_transaction.md#transactionnote)

The (optional) transaction note

#### Inherited from

CreateOrUpdateAppParams.note

#### Defined in

types/app.ts:91

___

### skipSending

• `Optional` **skipSending**: `boolean`

Whether to skip signing and sending the transaction to the chain (default: transaction signed and sent to chain)
  (and instead just return the raw transaction, e.g. so you can add it to a group of transactions)

#### Inherited from

CreateOrUpdateAppParams.skipSending

#### Defined in

types/transaction.ts:26

___

### skipWaiting

• `Optional` **skipWaiting**: `boolean`

Whether to skip waiting for the submitted transaction (only relevant if `skipSending` is `false` or unset)

#### Inherited from

CreateOrUpdateAppParams.skipWaiting

#### Defined in

types/transaction.ts:28

___

### suppressLog

• `Optional` **suppressLog**: `boolean`

Whether to suppress log messages from transaction send, default: do not suppress

#### Inherited from

CreateOrUpdateAppParams.suppressLog

#### Defined in

types/transaction.ts:30

___

### transactionParams

• `Optional` **transactionParams**: `SuggestedParams`

Optional transaction parameters

#### Inherited from

CreateOrUpdateAppParams.transactionParams

#### Defined in

types/app.ts:89
