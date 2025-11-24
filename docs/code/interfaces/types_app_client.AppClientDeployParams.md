[@algorandfoundation/algokit-utils](../README.md) / [types/app-client](../modules/types_app_client.md) / AppClientDeployParams

# Interface: AppClientDeployParams

[types/app-client](../modules/types_app_client.md).AppClientDeployParams

Parameters to pass into ApplicationClient.deploy

## Hierarchy

- [`AppClientDeployCoreParams`](types_app_client.AppClientDeployCoreParams.md)

- [`AppClientDeployCallInterfaceParams`](types_app_client.AppClientDeployCallInterfaceParams.md)

  ↳ **`AppClientDeployParams`**

## Table of contents

### Properties

- [allowDelete](types_app_client.AppClientDeployParams.md#allowdelete)
- [allowUpdate](types_app_client.AppClientDeployParams.md#allowupdate)
- [createArgs](types_app_client.AppClientDeployParams.md#createargs)
- [createOnCompleteAction](types_app_client.AppClientDeployParams.md#createoncompleteaction)
- [deleteArgs](types_app_client.AppClientDeployParams.md#deleteargs)
- [deployTimeParams](types_app_client.AppClientDeployParams.md#deploytimeparams)
- [onSchemaBreak](types_app_client.AppClientDeployParams.md#onschemabreak)
- [onUpdate](types_app_client.AppClientDeployParams.md#onupdate)
- [schema](types_app_client.AppClientDeployParams.md#schema)
- [sendParams](types_app_client.AppClientDeployParams.md#sendparams)
- [sender](types_app_client.AppClientDeployParams.md#sender)
- [updateArgs](types_app_client.AppClientDeployParams.md#updateargs)
- [version](types_app_client.AppClientDeployParams.md#version)

## Properties

### allowDelete

• `Optional` **allowDelete**: `boolean`

Whether or not to allow deletes in the contract using the deploy-time deletability control if present in your contract.
If this is not specified then it will automatically be determined based on the AppSpec definition

#### Inherited from

[AppClientDeployCoreParams](types_app_client.AppClientDeployCoreParams.md).[allowDelete](types_app_client.AppClientDeployCoreParams.md#allowdelete)

#### Defined in

[src/types/app-client.ts:186](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L186)

___

### allowUpdate

• `Optional` **allowUpdate**: `boolean`

Whether or not to allow updates in the contract using the deploy-time updatability control if present in your contract.
If this is not specified then it will automatically be determined based on the AppSpec definition

#### Inherited from

[AppClientDeployCoreParams](types_app_client.AppClientDeployCoreParams.md).[allowUpdate](types_app_client.AppClientDeployCoreParams.md#allowupdate)

#### Defined in

[src/types/app-client.ts:182](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L182)

___

### createArgs

• `Optional` **createArgs**: [`AppClientCallArgs`](../modules/types_app_client.md#appclientcallargs)

Any args to pass to any create transaction that is issued as part of deployment

#### Inherited from

[AppClientDeployCallInterfaceParams](types_app_client.AppClientDeployCallInterfaceParams.md).[createArgs](types_app_client.AppClientDeployCallInterfaceParams.md#createargs)

#### Defined in

[src/types/app-client.ts:198](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L198)

___

### createOnCompleteAction

• `Optional` **createOnCompleteAction**: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` \| ``"no_op"`` \| ``"opt_in"`` \| ``"close_out"`` \| ``"update_application"`` \| ``"delete_application"``

Override the on-completion action for the create call; defaults to NoOp

#### Inherited from

[AppClientDeployCallInterfaceParams](types_app_client.AppClientDeployCallInterfaceParams.md).[createOnCompleteAction](types_app_client.AppClientDeployCallInterfaceParams.md#createoncompleteaction)

#### Defined in

[src/types/app-client.ts:200](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L200)

___

### deleteArgs

• `Optional` **deleteArgs**: [`AppClientCallArgs`](../modules/types_app_client.md#appclientcallargs)

Any args to pass to any delete transaction that is issued as part of deployment

#### Inherited from

[AppClientDeployCallInterfaceParams](types_app_client.AppClientDeployCallInterfaceParams.md).[deleteArgs](types_app_client.AppClientDeployCallInterfaceParams.md#deleteargs)

#### Defined in

[src/types/app-client.ts:204](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L204)

___

### deployTimeParams

• `Optional` **deployTimeParams**: [`TealTemplateParams`](types_app.TealTemplateParams.md)

Any deploy-time parameters to replace in the TEAL code

#### Inherited from

[AppClientDeployCallInterfaceParams](types_app_client.AppClientDeployCallInterfaceParams.md).[deployTimeParams](types_app_client.AppClientDeployCallInterfaceParams.md#deploytimeparams)

#### Defined in

[src/types/app-client.ts:196](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L196)

___

### onSchemaBreak

• `Optional` **onSchemaBreak**: ``"replace"`` \| [`OnSchemaBreak`](../enums/types_app.OnSchemaBreak.md) \| ``"fail"`` \| ``"append"``

What action to perform if a schema break is detected

#### Inherited from

[AppClientDeployCoreParams](types_app_client.AppClientDeployCoreParams.md).[onSchemaBreak](types_app_client.AppClientDeployCoreParams.md#onschemabreak)

#### Defined in

[src/types/app-client.ts:188](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L188)

___

### onUpdate

• `Optional` **onUpdate**: ``"replace"`` \| ``"update"`` \| ``"fail"`` \| ``"append"`` \| [`OnUpdate`](../enums/types_app.OnUpdate.md)

What action to perform if a TEAL update is detected

#### Inherited from

[AppClientDeployCoreParams](types_app_client.AppClientDeployCoreParams.md).[onUpdate](types_app_client.AppClientDeployCoreParams.md#onupdate)

#### Defined in

[src/types/app-client.ts:190](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L190)

___

### schema

• `Optional` **schema**: `Partial`\<[`AppStorageSchema`](types_app.AppStorageSchema.md)\>

Any overrides for the storage schema to request for the created app; by default the schema indicated by the app spec is used.

#### Defined in

[src/types/app-client.ts:210](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L210)

___

### sendParams

• `Optional` **sendParams**: `Omit`\<[`SendTransactionParams`](types_transaction.SendTransactionParams.md), ``"skipSending"`` \| ``"skipWaiting"``\>

Parameters to control transaction sending

#### Inherited from

[AppClientDeployCoreParams](types_app_client.AppClientDeployCoreParams.md).[sendParams](types_app_client.AppClientDeployCoreParams.md#sendparams)

#### Defined in

[src/types/app-client.ts:178](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L178)

___

### sender

• `Optional` **sender**: [`TransactionSignerAccount`](types_account.TransactionSignerAccount.md)

The optional sender to send the transaction from, will use the application client's default sender by default if specified

#### Inherited from

[AppClientDeployCoreParams](types_app_client.AppClientDeployCoreParams.md).[sender](types_app_client.AppClientDeployCoreParams.md#sender)

#### Defined in

[src/types/app-client.ts:176](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L176)

___

### updateArgs

• `Optional` **updateArgs**: [`AppClientCallArgs`](../modules/types_app_client.md#appclientcallargs)

Any args to pass to any update transaction that is issued as part of deployment

#### Inherited from

[AppClientDeployCallInterfaceParams](types_app_client.AppClientDeployCallInterfaceParams.md).[updateArgs](types_app_client.AppClientDeployCallInterfaceParams.md#updateargs)

#### Defined in

[src/types/app-client.ts:202](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L202)

___

### version

• `Optional` **version**: `string`

The version of the contract, uses "1.0" by default

#### Inherited from

[AppClientDeployCoreParams](types_app_client.AppClientDeployCoreParams.md).[version](types_app_client.AppClientDeployCoreParams.md#version)

#### Defined in

[src/types/app-client.ts:174](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L174)
