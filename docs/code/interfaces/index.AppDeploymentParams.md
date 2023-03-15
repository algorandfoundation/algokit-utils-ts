[@algorandfoundation/algokit-utils](../README.md) / [index](../modules/index.md) / AppDeploymentParams

# Interface: AppDeploymentParams

[index](../modules/index.md).AppDeploymentParams

The parameters to deploy an app

## Hierarchy

- `Omit`<[`CreateAppParams`](index.CreateAppParams.md), ``"args"`` \| ``"note"`` \| ``"skipSending"`` \| ``"skipWaiting"``\>

  ↳ **`AppDeploymentParams`**

## Table of contents

### Properties

- [approvalProgram](index.AppDeploymentParams.md#approvalprogram)
- [clearStateProgram](index.AppDeploymentParams.md#clearstateprogram)
- [createArgs](index.AppDeploymentParams.md#createargs)
- [deleteArgs](index.AppDeploymentParams.md#deleteargs)
- [deployTimeParameters](index.AppDeploymentParams.md#deploytimeparameters)
- [existingDeployments](index.AppDeploymentParams.md#existingdeployments)
- [from](index.AppDeploymentParams.md#from)
- [maxFee](index.AppDeploymentParams.md#maxfee)
- [maxRoundsToWaitForConfirmation](index.AppDeploymentParams.md#maxroundstowaitforconfirmation)
- [metadata](index.AppDeploymentParams.md#metadata)
- [onSchemaBreak](index.AppDeploymentParams.md#onschemabreak)
- [onUpdate](index.AppDeploymentParams.md#onupdate)
- [schema](index.AppDeploymentParams.md#schema)
- [suppressLog](index.AppDeploymentParams.md#suppresslog)
- [transactionParams](index.AppDeploymentParams.md#transactionparams)
- [updateArgs](index.AppDeploymentParams.md#updateargs)

## Properties

### approvalProgram

• **approvalProgram**: `string` \| `Uint8Array`

The approval program as raw teal (string) or compiled teal, base 64 encoded as a byte array (Uint8Array)

#### Inherited from

Omit.approvalProgram

#### Defined in

[app.ts:98](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L98)

___

### clearStateProgram

• **clearStateProgram**: `string` \| `Uint8Array`

The clear state program as raw teal (string) or compiled teal, base 64 encoded as a byte array (Uint8Array)

#### Inherited from

Omit.clearStateProgram

#### Defined in

[app.ts:100](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L100)

___

### createArgs

• `Optional` **createArgs**: [`AppCallArgs`](../modules/index.md#appcallargs)

Any args to pass to any create transaction that is issued as part of deployment

#### Defined in

[deploy-app.ts:86](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L86)

___

### deleteArgs

• `Optional` **deleteArgs**: [`AppCallArgs`](../modules/index.md#appcallargs)

Any args to pass to any delete transaction that is issued as part of deployment

#### Defined in

[deploy-app.ts:90](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L90)

___

### deployTimeParameters

• `Optional` **deployTimeParameters**: [`TealTemplateParameters`](index.TealTemplateParameters.md)

Any deploy-time parameters to replace in the TEAL code

#### Defined in

[deploy-app.ts:78](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L78)

___

### existingDeployments

• `Optional` **existingDeployments**: [`AppLookup`](index.AppLookup.md)

Optional cached value of the existing apps for the given creator

#### Defined in

[deploy-app.ts:84](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L84)

___

### from

• **from**: [`SendTransactionFrom`](../modules/index.md#sendtransactionfrom)

The account (with private key loaded) that will send the µALGOs

#### Inherited from

Omit.from

#### Defined in

[app.ts:96](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L96)

___

### maxFee

• `Optional` **maxFee**: [`AlgoAmount`](../classes/index.AlgoAmount.md)

The maximum fee that you are happy to pay (default: unbounded) - if this is set it's possible the transaction could get rejected during network congestion

#### Inherited from

Omit.maxFee

#### Defined in

[transaction.ts:141](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L141)

___

### maxRoundsToWaitForConfirmation

• `Optional` **maxRoundsToWaitForConfirmation**: `number`

The maximum number of rounds to wait for confirmation, only applies if `skipWaiting` is `undefined` or `false`, default: wait up to 5 rounds

#### Inherited from

Omit.maxRoundsToWaitForConfirmation

#### Defined in

[transaction.ts:143](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L143)

___

### metadata

• **metadata**: [`AppDeployMetadata`](index.AppDeployMetadata.md)

The deployment metadata

#### Defined in

[deploy-app.ts:76](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L76)

___

### onSchemaBreak

• `Optional` **onSchemaBreak**: [`OnSchemaBreak`](../enums/index.OnSchemaBreak.md) \| ``"replace"`` \| ``"fail"``

What action to perform if a schema break is detected

#### Defined in

[deploy-app.ts:80](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L80)

___

### onUpdate

• `Optional` **onUpdate**: ``"replace"`` \| ``"fail"`` \| [`OnUpdate`](../enums/index.OnUpdate.md) \| ``"update"``

What action to perform if a TEAL update is detected

#### Defined in

[deploy-app.ts:82](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L82)

___

### schema

• **schema**: [`AppStorageSchema`](index.AppStorageSchema.md)

The storage schema to request for the created app

#### Inherited from

Omit.schema

#### Defined in

[app.ts:112](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L112)

___

### suppressLog

• `Optional` **suppressLog**: `boolean`

Whether to suppress log messages from transaction send, default: do not suppress

#### Inherited from

Omit.suppressLog

#### Defined in

[transaction.ts:139](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L139)

___

### transactionParams

• `Optional` **transactionParams**: `SuggestedParams`

Optional transaction parameters

#### Inherited from

Omit.transactionParams

#### Defined in

[app.ts:102](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L102)

___

### updateArgs

• `Optional` **updateArgs**: [`AppCallArgs`](../modules/index.md#appcallargs)

Any args to pass to any update transaction that is issued as part of deployment

#### Defined in

[deploy-app.ts:88](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L88)
