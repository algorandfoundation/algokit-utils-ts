[algotstest](../README.md) / [deploy-app](../modules/deploy_app.md) / AppDeploymentParams

# Interface: AppDeploymentParams

[deploy-app](../modules/deploy_app.md).AppDeploymentParams

The parameters to deploy an app

## Hierarchy

- `Omit`<`Omit`<`Omit`<`Omit`<[`CreateAppParams`](app.CreateAppParams.md), ``"args"``\>, ``"note"``\>, ``"skipSending"``\>, ``"skipWaiting"``\>

  ↳ **`AppDeploymentParams`**

## Table of contents

### Properties

- [approvalProgram](deploy_app.AppDeploymentParams.md#approvalprogram)
- [clearStateProgram](deploy_app.AppDeploymentParams.md#clearstateprogram)
- [createArgs](deploy_app.AppDeploymentParams.md#createargs)
- [deleteArgs](deploy_app.AppDeploymentParams.md#deleteargs)
- [deployTimeParameters](deploy_app.AppDeploymentParams.md#deploytimeparameters)
- [existingDeployments](deploy_app.AppDeploymentParams.md#existingdeployments)
- [from](deploy_app.AppDeploymentParams.md#from)
- [maxFee](deploy_app.AppDeploymentParams.md#maxfee)
- [maxRoundsToWaitForConfirmation](deploy_app.AppDeploymentParams.md#maxroundstowaitforconfirmation)
- [metadata](deploy_app.AppDeploymentParams.md#metadata)
- [onSchemaBreak](deploy_app.AppDeploymentParams.md#onschemabreak)
- [onUpdate](deploy_app.AppDeploymentParams.md#onupdate)
- [schema](deploy_app.AppDeploymentParams.md#schema)
- [suppressLog](deploy_app.AppDeploymentParams.md#suppresslog)
- [transactionParams](deploy_app.AppDeploymentParams.md#transactionparams)
- [updateArgs](deploy_app.AppDeploymentParams.md#updateargs)

## Properties

### approvalProgram

• **approvalProgram**: `string` \| `Uint8Array`

The approval program as raw teal (string) or compiled teal, base 64 encoded as a byte array (Uint8Array)

#### Inherited from

Omit.approvalProgram

#### Defined in

[app.ts:61](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/app.ts#L61)

___

### clearStateProgram

• **clearStateProgram**: `string` \| `Uint8Array`

The clear state program as raw teal (string) or compiled teal, base 64 encoded as a byte array (Uint8Array)

#### Inherited from

Omit.clearStateProgram

#### Defined in

[app.ts:63](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/app.ts#L63)

___

### createArgs

• `Optional` **createArgs**: [`AppCallArgs`](app.AppCallArgs.md)

Any args to pass to any create transaction that is issued as part of deployment

#### Defined in

[deploy-app.ts:86](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/deploy-app.ts#L86)

___

### deleteArgs

• `Optional` **deleteArgs**: [`AppCallArgs`](app.AppCallArgs.md)

Any args to pass to any delete transaction that is issued as part of deployment

#### Defined in

[deploy-app.ts:90](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/deploy-app.ts#L90)

___

### deployTimeParameters

• `Optional` **deployTimeParameters**: [`TealTemplateParameters`](deploy_app.TealTemplateParameters.md)

Any deploy-time parameters to replace in the TEAL code

#### Defined in

[deploy-app.ts:78](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/deploy-app.ts#L78)

___

### existingDeployments

• `Optional` **existingDeployments**: [`AppLookup`](deploy_app.AppLookup.md)

Optional cached value of the existing apps for the given creator

#### Defined in

[deploy-app.ts:84](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/deploy-app.ts#L84)

___

### from

• **from**: [`SendTransactionFrom`](../modules/transaction.md#sendtransactionfrom)

The account (with private key loaded) that will send the µALGOs

#### Inherited from

Omit.from

#### Defined in

[app.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/app.ts#L59)

___

### maxFee

• `Optional` **maxFee**: [`AlgoAmount`](../classes/algo_amount.AlgoAmount.md)

The maximum fee that you are happy to pay (default: unbounded) - if this is set it's possible the transaction could get rejected during network congestion

#### Inherited from

Omit.maxFee

#### Defined in

[transaction.ts:134](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/transaction.ts#L134)

___

### maxRoundsToWaitForConfirmation

• `Optional` **maxRoundsToWaitForConfirmation**: `number`

The maximum number of rounds to wait for confirmation, only applies if `skipWaiting` is `undefined` or `false`, default: wait up to 5 rounds

#### Inherited from

Omit.maxRoundsToWaitForConfirmation

#### Defined in

[transaction.ts:136](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/transaction.ts#L136)

___

### metadata

• **metadata**: [`AppDeployMetadata`](deploy_app.AppDeployMetadata.md)

The deployment metadata

#### Defined in

[deploy-app.ts:76](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/deploy-app.ts#L76)

___

### onSchemaBreak

• `Optional` **onSchemaBreak**: ``"delete"`` \| [`OnSchemaBreak`](../enums/deploy_app.OnSchemaBreak.md) \| ``"fail"``

What action to perform if a schema break is detected

#### Defined in

[deploy-app.ts:80](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/deploy-app.ts#L80)

___

### onUpdate

• `Optional` **onUpdate**: ``"delete"`` \| ``"fail"`` \| [`OnUpdate`](../enums/deploy_app.OnUpdate.md) \| ``"update"``

What action to perform if a TEAL update is detected

#### Defined in

[deploy-app.ts:82](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/deploy-app.ts#L82)

___

### schema

• **schema**: [`AppStorageSchema`](app.AppStorageSchema.md)

The storage schema to request for the created app

#### Inherited from

Omit.schema

#### Defined in

[app.ts:75](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/app.ts#L75)

___

### suppressLog

• `Optional` **suppressLog**: `boolean`

Whether to suppress log messages from transaction send, default: do not suppress

#### Inherited from

Omit.suppressLog

#### Defined in

[transaction.ts:132](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/transaction.ts#L132)

___

### transactionParams

• `Optional` **transactionParams**: `SuggestedParams`

Optional transaction parameters

#### Inherited from

Omit.transactionParams

#### Defined in

[app.ts:65](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/app.ts#L65)

___

### updateArgs

• `Optional` **updateArgs**: [`AppCallArgs`](app.AppCallArgs.md)

Any args to pass to any update transaction that is issued as part of deployment

#### Defined in

[deploy-app.ts:88](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/deploy-app.ts#L88)
