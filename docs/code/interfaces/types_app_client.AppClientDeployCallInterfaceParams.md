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
[src/types/app-client.ts:146](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L146)
=======
[src/types/app-client.ts:149](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L149)
>>>>>>> origin/main

___

### createOnCompleteAction

• `Optional` **createOnCompleteAction**: ``"no_op"`` \| ``"opt_in"`` \| ``"close_out"`` \| ``"update_application"`` \| ``"delete_application"`` \| `NoOpOC` \| `OptInOC` \| `CloseOutOC` \| `UpdateApplicationOC` \| `DeleteApplicationOC`

Override the on-completion action for the create call; defaults to NoOp

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:148](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L148)
=======
[src/types/app-client.ts:151](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L151)
>>>>>>> origin/main

___

### deleteArgs

• `Optional` **deleteArgs**: [`AppClientCallArgs`](../modules/types_app_client.md#appclientcallargs)

Any args to pass to any delete transaction that is issued as part of deployment

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:152](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L152)
=======
[src/types/app-client.ts:155](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L155)
>>>>>>> origin/main

___

### deployTimeParams

• `Optional` **deployTimeParams**: [`TealTemplateParams`](types_app.TealTemplateParams.md)

Any deploy-time parameters to replace in the TEAL code

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:144](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L144)
=======
[src/types/app-client.ts:147](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L147)
>>>>>>> origin/main

___

### updateArgs

• `Optional` **updateArgs**: [`AppClientCallArgs`](../modules/types_app_client.md#appclientcallargs)

Any args to pass to any update transaction that is issued as part of deployment

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:150](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L150)
=======
[src/types/app-client.ts:153](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L153)
>>>>>>> origin/main
