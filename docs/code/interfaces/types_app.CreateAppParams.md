[@algorandfoundation/algokit-utils](../README.md) / [types/app](../modules/types_app.md) / CreateAppParams

# Interface: CreateAppParams

[types/app](../modules/types_app.md).CreateAppParams

Parameters that are passed in when creating an app.

## Hierarchy

- `CreateOrUpdateAppParams`

  ↳ **`CreateAppParams`**

## Table of contents

### Properties

- [approvalProgram](types_app.CreateAppParams.md#approvalprogram)
- [args](types_app.CreateAppParams.md#args)
- [clearStateProgram](types_app.CreateAppParams.md#clearstateprogram)
- [fee](types_app.CreateAppParams.md#fee)
- [from](types_app.CreateAppParams.md#from)
- [maxFee](types_app.CreateAppParams.md#maxfee)
- [maxRoundsToWaitForConfirmation](types_app.CreateAppParams.md#maxroundstowaitforconfirmation)
- [note](types_app.CreateAppParams.md#note)
- [schema](types_app.CreateAppParams.md#schema)
- [skipSending](types_app.CreateAppParams.md#skipsending)
- [skipWaiting](types_app.CreateAppParams.md#skipwaiting)
- [suppressLog](types_app.CreateAppParams.md#suppresslog)
- [transactionParams](types_app.CreateAppParams.md#transactionparams)

## Properties

### approvalProgram

• **approvalProgram**: `string` \| `Uint8Array`

The approval program as raw teal (string) or compiled teal, base 64 encoded as a byte array (Uint8Array)

#### Inherited from

CreateOrUpdateAppParams.approvalProgram

#### Defined in

[types/app.ts:85](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L85)

___

### args

• `Optional` **args**: [`AppCallArgs`](../modules/types_app.md#appcallargs)

The arguments passed in to the app call

#### Inherited from

CreateOrUpdateAppParams.args

#### Defined in

[types/app.ts:93](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L93)

___

### clearStateProgram

• **clearStateProgram**: `string` \| `Uint8Array`

The clear state program as raw teal (string) or compiled teal, base 64 encoded as a byte array (Uint8Array)

#### Inherited from

CreateOrUpdateAppParams.clearStateProgram

#### Defined in

[types/app.ts:87](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L87)

___

### fee

• `Optional` **fee**: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

The flat fee you want to pay, useful for covering extra fees in a transaction group or app call

#### Inherited from

CreateOrUpdateAppParams.fee

#### Defined in

[types/transaction.ts:32](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L32)

___

### from

• **from**: [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom)

The account (with private key loaded) that will send the µALGOs

#### Inherited from

CreateOrUpdateAppParams.from

#### Defined in

[types/app.ts:83](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L83)

___

### maxFee

• `Optional` **maxFee**: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

The maximum fee that you are happy to pay (default: unbounded) - if this is set it's possible the transaction could get rejected during network congestion

#### Inherited from

CreateOrUpdateAppParams.maxFee

#### Defined in

[types/transaction.ts:34](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L34)

___

### maxRoundsToWaitForConfirmation

• `Optional` **maxRoundsToWaitForConfirmation**: `number`

The maximum number of rounds to wait for confirmation, only applies if `skipWaiting` is `undefined` or `false`, default: wait up to 5 rounds

#### Inherited from

CreateOrUpdateAppParams.maxRoundsToWaitForConfirmation

#### Defined in

[types/transaction.ts:36](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L36)

___

### note

• `Optional` **note**: [`TransactionNote`](../modules/types_transaction.md#transactionnote)

The (optional) transaction note

#### Inherited from

CreateOrUpdateAppParams.note

#### Defined in

[types/app.ts:91](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L91)

___

### schema

• **schema**: [`AppStorageSchema`](types_app.AppStorageSchema.md)

The storage schema to request for the created app

#### Defined in

[types/app.ts:99](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L99)

___

### skipSending

• `Optional` **skipSending**: `boolean`

Whether to skip signing and sending the transaction to the chain (default: transaction signed and sent to chain)
  (and instead just return the raw transaction, e.g. so you can add it to a group of transactions)

#### Inherited from

CreateOrUpdateAppParams.skipSending

#### Defined in

[types/transaction.ts:26](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L26)

___

### skipWaiting

• `Optional` **skipWaiting**: `boolean`

Whether to skip waiting for the submitted transaction (only relevant if `skipSending` is `false` or unset)

#### Inherited from

CreateOrUpdateAppParams.skipWaiting

#### Defined in

[types/transaction.ts:28](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L28)

___

### suppressLog

• `Optional` **suppressLog**: `boolean`

Whether to suppress log messages from transaction send, default: do not suppress

#### Inherited from

CreateOrUpdateAppParams.suppressLog

#### Defined in

[types/transaction.ts:30](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L30)

___

### transactionParams

• `Optional` **transactionParams**: `SuggestedParams`

Optional transaction parameters

#### Inherited from

CreateOrUpdateAppParams.transactionParams

#### Defined in

[types/app.ts:89](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L89)
