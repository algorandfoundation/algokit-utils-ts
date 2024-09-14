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

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:168](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L168)
=======
[src/types/app-client.ts:155](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L155)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:169](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L169)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:167](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L167)
>>>>>>> de5873b (chore: draft tests)

___

### allowUpdate

• `Optional` **allowUpdate**: `boolean`

Whether or not to allow updates in the contract using the deploy-time updatability control if present in your contract.
If this is not specified then it will automatically be determined based on the AppSpec definition

#### Inherited from

[AppClientDeployCoreParams](types_app_client.AppClientDeployCoreParams.md).[allowUpdate](types_app_client.AppClientDeployCoreParams.md#allowupdate)

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:164](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L164)
=======
[src/types/app-client.ts:151](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L151)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:165](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L165)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:163](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L163)
>>>>>>> de5873b (chore: draft tests)

___

### createArgs

• `Optional` **createArgs**: [`AppClientCallArgs`](../modules/types_app_client.md#appclientcallargs)

Any args to pass to any create transaction that is issued as part of deployment

#### Inherited from

[AppClientDeployCallInterfaceParams](types_app_client.AppClientDeployCallInterfaceParams.md).[createArgs](types_app_client.AppClientDeployCallInterfaceParams.md#createargs)

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:180](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L180)
=======
[src/types/app-client.ts:167](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L167)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:181](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L181)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:179](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L179)
>>>>>>> de5873b (chore: draft tests)

___

### createOnCompleteAction

• `Optional` **createOnCompleteAction**: ``"no_op"`` \| ``"opt_in"`` \| ``"close_out"`` \| ``"update_application"`` \| ``"delete_application"`` \| `NoOpOC` \| `OptInOC` \| `CloseOutOC` \| `UpdateApplicationOC` \| `DeleteApplicationOC`

Override the on-completion action for the create call; defaults to NoOp

#### Inherited from

[AppClientDeployCallInterfaceParams](types_app_client.AppClientDeployCallInterfaceParams.md).[createOnCompleteAction](types_app_client.AppClientDeployCallInterfaceParams.md#createoncompleteaction)

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:182](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L182)
=======
[src/types/app-client.ts:169](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L169)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:183](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L183)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:181](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L181)
>>>>>>> de5873b (chore: draft tests)

___

### deleteArgs

• `Optional` **deleteArgs**: [`AppClientCallArgs`](../modules/types_app_client.md#appclientcallargs)

Any args to pass to any delete transaction that is issued as part of deployment

#### Inherited from

[AppClientDeployCallInterfaceParams](types_app_client.AppClientDeployCallInterfaceParams.md).[deleteArgs](types_app_client.AppClientDeployCallInterfaceParams.md#deleteargs)

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:186](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L186)
=======
[src/types/app-client.ts:173](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L173)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:187](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L187)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:185](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L185)
>>>>>>> de5873b (chore: draft tests)

___

### deployTimeParams

• `Optional` **deployTimeParams**: [`TealTemplateParams`](types_app.TealTemplateParams.md)

Any deploy-time parameters to replace in the TEAL code

#### Inherited from

[AppClientDeployCallInterfaceParams](types_app_client.AppClientDeployCallInterfaceParams.md).[deployTimeParams](types_app_client.AppClientDeployCallInterfaceParams.md#deploytimeparams)

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:178](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L178)
=======
[src/types/app-client.ts:165](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L165)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:179](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L179)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:177](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L177)
>>>>>>> de5873b (chore: draft tests)

___

### onSchemaBreak

• `Optional` **onSchemaBreak**: [`OnSchemaBreak`](../enums/types_app.OnSchemaBreak.md) \| ``"replace"`` \| ``"fail"`` \| ``"append"``

What action to perform if a schema break is detected

#### Inherited from

[AppClientDeployCoreParams](types_app_client.AppClientDeployCoreParams.md).[onSchemaBreak](types_app_client.AppClientDeployCoreParams.md#onschemabreak)

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:170](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L170)
=======
[src/types/app-client.ts:157](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L157)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:171](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L171)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:169](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L169)
>>>>>>> de5873b (chore: draft tests)

___

### onUpdate

• `Optional` **onUpdate**: ``"replace"`` \| ``"fail"`` \| ``"append"`` \| [`OnUpdate`](../enums/types_app.OnUpdate.md) \| ``"update"``

What action to perform if a TEAL update is detected

#### Inherited from

[AppClientDeployCoreParams](types_app_client.AppClientDeployCoreParams.md).[onUpdate](types_app_client.AppClientDeployCoreParams.md#onupdate)

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:172](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L172)
=======
[src/types/app-client.ts:159](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L159)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:173](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L173)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:171](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L171)
>>>>>>> de5873b (chore: draft tests)

___

### schema

• `Optional` **schema**: `Partial`\<[`AppStorageSchema`](types_app.AppStorageSchema.md)\>

Any overrides for the storage schema to request for the created app; by default the schema indicated by the app spec is used.

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:192](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L192)
=======
[src/types/app-client.ts:179](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L179)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:193](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L193)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:191](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L191)
>>>>>>> de5873b (chore: draft tests)

___

### sendParams

• `Optional` **sendParams**: `Omit`\<[`SendTransactionParams`](types_transaction.SendTransactionParams.md), ``"skipSending"`` \| ``"skipWaiting"``\>

Parameters to control transaction sending

#### Inherited from

[AppClientDeployCoreParams](types_app_client.AppClientDeployCoreParams.md).[sendParams](types_app_client.AppClientDeployCoreParams.md#sendparams)

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:160](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L160)
=======
[src/types/app-client.ts:147](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L147)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:161](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L161)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:159](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L159)
>>>>>>> de5873b (chore: draft tests)

___

### sender

• `Optional` **sender**: [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom)

The optional sender to send the transaction from, will use the application client's default sender by default if specified

#### Inherited from

[AppClientDeployCoreParams](types_app_client.AppClientDeployCoreParams.md).[sender](types_app_client.AppClientDeployCoreParams.md#sender)

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:158](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L158)
=======
[src/types/app-client.ts:145](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L145)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:159](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L159)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:157](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L157)
>>>>>>> de5873b (chore: draft tests)

___

### updateArgs

• `Optional` **updateArgs**: [`AppClientCallArgs`](../modules/types_app_client.md#appclientcallargs)

Any args to pass to any update transaction that is issued as part of deployment

#### Inherited from

[AppClientDeployCallInterfaceParams](types_app_client.AppClientDeployCallInterfaceParams.md).[updateArgs](types_app_client.AppClientDeployCallInterfaceParams.md#updateargs)

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:184](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L184)
=======
[src/types/app-client.ts:171](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L171)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:185](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L185)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:183](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L183)
>>>>>>> de5873b (chore: draft tests)

___

### version

• `Optional` **version**: `string`

The version of the contract, uses "1.0" by default

#### Inherited from

[AppClientDeployCoreParams](types_app_client.AppClientDeployCoreParams.md).[version](types_app_client.AppClientDeployCoreParams.md#version)

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:156](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L156)
=======
[src/types/app-client.ts:143](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L143)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:157](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L157)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:155](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L155)
>>>>>>> de5873b (chore: draft tests)
