[@algorandfoundation/algokit-utils](../README.md) / [types/app-client](../modules/types_app_client.md) / AppClientDeployCallInterfaceParams

# Interface: AppClientDeployCallInterfaceParams

[types/app-client](../modules/types_app_client.md).AppClientDeployCallInterfaceParams

Call interface parameters to pass into ApplicationClient.deploy

## Hierarchy

- **`AppClientDeployCallInterfaceParams`**

  ↳ [`AppClientDeployParams`](types_app_client.AppClientDeployParams.md)

## Table of contents

### Properties

- [createArgs](types_app_client.AppClientDeployCallInterfaceParams.md#createargs)
- [createOnCompleteAction](types_app_client.AppClientDeployCallInterfaceParams.md#createoncompleteaction)
- [deleteArgs](types_app_client.AppClientDeployCallInterfaceParams.md#deleteargs)
- [deployTimeParams](types_app_client.AppClientDeployCallInterfaceParams.md#deploytimeparams)
- [updateArgs](types_app_client.AppClientDeployCallInterfaceParams.md#updateargs)

## Properties

### createArgs

• `Optional` **createArgs**: [`AppClientCallArgs`](../modules/types_app_client.md#appclientcallargs)

Any args to pass to any create transaction that is issued as part of deployment

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:180](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L180)
=======
[src/types/app-client.ts:167](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L167)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### createOnCompleteAction

• `Optional` **createOnCompleteAction**: ``"no_op"`` \| ``"opt_in"`` \| ``"close_out"`` \| ``"update_application"`` \| ``"delete_application"`` \| `NoOpOC` \| `OptInOC` \| `CloseOutOC` \| `UpdateApplicationOC` \| `DeleteApplicationOC`

Override the on-completion action for the create call; defaults to NoOp

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:182](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L182)
=======
[src/types/app-client.ts:169](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L169)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### deleteArgs

• `Optional` **deleteArgs**: [`AppClientCallArgs`](../modules/types_app_client.md#appclientcallargs)

Any args to pass to any delete transaction that is issued as part of deployment

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:186](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L186)
=======
[src/types/app-client.ts:173](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L173)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### deployTimeParams

• `Optional` **deployTimeParams**: [`TealTemplateParams`](types_app.TealTemplateParams.md)

Any deploy-time parameters to replace in the TEAL code

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:178](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L178)
=======
[src/types/app-client.ts:165](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L165)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### updateArgs

• `Optional` **updateArgs**: [`AppClientCallArgs`](../modules/types_app_client.md#appclientcallargs)

Any args to pass to any update transaction that is issued as part of deployment

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:184](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L184)
=======
[src/types/app-client.ts:171](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L171)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
