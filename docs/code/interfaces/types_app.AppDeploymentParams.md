[@algorandfoundation/algokit-utils](../README.md) / [types/app](../modules/types_app.md) / AppDeploymentParams

# Interface: AppDeploymentParams

[types/app](../modules/types_app.md).AppDeploymentParams

The parameters to deploy an app

## Hierarchy

- `Omit`<[`CreateAppParams`](types_app.CreateAppParams.md), ``"args"`` \| ``"note"`` \| ``"skipSending"`` \| ``"skipWaiting"`` \| ``"atc"``\>

  ↳ **`AppDeploymentParams`**

## Table of contents

### Properties

- [approvalProgram](types_app.AppDeploymentParams.md#approvalprogram)
- [clearStateProgram](types_app.AppDeploymentParams.md#clearstateprogram)
- [createArgs](types_app.AppDeploymentParams.md#createargs)
- [deleteArgs](types_app.AppDeploymentParams.md#deleteargs)
- [deployTimeParams](types_app.AppDeploymentParams.md#deploytimeparams)
- [existingDeployments](types_app.AppDeploymentParams.md#existingdeployments)
- [fee](types_app.AppDeploymentParams.md#fee)
- [from](types_app.AppDeploymentParams.md#from)
- [maxFee](types_app.AppDeploymentParams.md#maxfee)
- [maxRoundsToWaitForConfirmation](types_app.AppDeploymentParams.md#maxroundstowaitforconfirmation)
- [metadata](types_app.AppDeploymentParams.md#metadata)
- [onCompleteAction](types_app.AppDeploymentParams.md#oncompleteaction)
- [onSchemaBreak](types_app.AppDeploymentParams.md#onschemabreak)
- [onUpdate](types_app.AppDeploymentParams.md#onupdate)
- [schema](types_app.AppDeploymentParams.md#schema)
- [suppressLog](types_app.AppDeploymentParams.md#suppresslog)
- [transactionParams](types_app.AppDeploymentParams.md#transactionparams)
- [updateArgs](types_app.AppDeploymentParams.md#updateargs)

## Properties

### approvalProgram

• **approvalProgram**: `string` \| `Uint8Array`

The approval program as raw teal (string) or compiled teal, base 64 encoded as a byte array (Uint8Array)

#### Inherited from

Omit.approvalProgram

#### Defined in

[src/types/app.ts:115](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L115)

___

### clearStateProgram

• **clearStateProgram**: `string` \| `Uint8Array`

The clear state program as raw teal (string) or compiled teal, base 64 encoded as a byte array (Uint8Array)

#### Inherited from

Omit.clearStateProgram

#### Defined in

[src/types/app.ts:117](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L117)

___

### createArgs

• `Optional` **createArgs**: [`AppCallArgs`](../modules/types_app.md#appcallargs)

Any args to pass to any create transaction that is issued as part of deployment

#### Defined in

[src/types/app.ts:289](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L289)

___

### deleteArgs

• `Optional` **deleteArgs**: [`AppCallArgs`](../modules/types_app.md#appcallargs)

Any args to pass to any delete transaction that is issued as part of deployment

#### Defined in

[src/types/app.ts:293](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L293)

___

### deployTimeParams

• `Optional` **deployTimeParams**: [`TealTemplateParams`](types_app.TealTemplateParams.md)

Any deploy-time parameters to replace in the TEAL code

#### Defined in

[src/types/app.ts:281](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L281)

___

### existingDeployments

• `Optional` **existingDeployments**: [`AppLookup`](types_app.AppLookup.md)

Optional cached value of the existing apps for the given creator

#### Defined in

[src/types/app.ts:287](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L287)

___

### fee

• `Optional` **fee**: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

The flat fee you want to pay, useful for covering extra fees in a transaction group or app call

#### Inherited from

Omit.fee

#### Defined in

[src/types/transaction.ts:35](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L35)

___

### from

• **from**: [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom)

The account (with private key loaded) that will send the transaction

#### Inherited from

Omit.from

#### Defined in

[src/types/app.ts:113](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L113)

___

### maxFee

• `Optional` **maxFee**: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

The maximum fee that you are happy to pay (default: unbounded) - if this is set it's possible the transaction could get rejected during network congestion

#### Inherited from

Omit.maxFee

#### Defined in

[src/types/transaction.ts:37](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L37)

___

### maxRoundsToWaitForConfirmation

• `Optional` **maxRoundsToWaitForConfirmation**: `number`

The maximum number of rounds to wait for confirmation, only applies if `skipWaiting` is `undefined` or `false`, default: wait up to 5 rounds

#### Inherited from

Omit.maxRoundsToWaitForConfirmation

#### Defined in

[src/types/transaction.ts:39](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L39)

___

### metadata

• **metadata**: [`AppDeployMetadata`](types_app.AppDeployMetadata.md)

The deployment metadata

#### Defined in

[src/types/app.ts:279](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L279)

___

### onCompleteAction

• `Optional` **onCompleteAction**: ``"no_op"`` \| ``"opt_in"`` \| ``"close_out"`` \| ``"update_application"`` \| ``"delete_application"`` \| `NoOpOC` \| `OptInOC` \| `CloseOutOC` \| `UpdateApplicationOC` \| `DeleteApplicationOC`

Override the on-completion action for the create call; defaults to NoOp

#### Inherited from

Omit.onCompleteAction

#### Defined in

[src/types/app.ts:131](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L131)

___

### onSchemaBreak

• `Optional` **onSchemaBreak**: [`OnSchemaBreak`](../enums/types_app.OnSchemaBreak.md) \| ``"replace"`` \| ``"fail"``

What action to perform if a schema break is detected

#### Defined in

[src/types/app.ts:283](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L283)

___

### onUpdate

• `Optional` **onUpdate**: ``"replace"`` \| ``"fail"`` \| [`OnUpdate`](../enums/types_app.OnUpdate.md) \| ``"update"``

What action to perform if a TEAL update is detected

#### Defined in

[src/types/app.ts:285](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L285)

___

### schema

• **schema**: [`AppStorageSchema`](types_app.AppStorageSchema.md)

The storage schema to request for the created app

#### Inherited from

Omit.schema

#### Defined in

[src/types/app.ts:129](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L129)

___

### suppressLog

• `Optional` **suppressLog**: `boolean`

Whether to suppress log messages from transaction send, default: do not suppress

#### Inherited from

Omit.suppressLog

#### Defined in

[src/types/transaction.ts:33](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L33)

___

### transactionParams

• `Optional` **transactionParams**: `SuggestedParams`

Optional transaction parameters

#### Inherited from

Omit.transactionParams

#### Defined in

[src/types/app.ts:119](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L119)

___

### updateArgs

• `Optional` **updateArgs**: [`AppCallArgs`](../modules/types_app.md#appcallargs)

Any args to pass to any update transaction that is issued as part of deployment

#### Defined in

[src/types/app.ts:291](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L291)
