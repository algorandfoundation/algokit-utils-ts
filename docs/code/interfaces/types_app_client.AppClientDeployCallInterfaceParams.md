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

[src/types/app-client.ts:128](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L128)

___

### createOnCompleteAction

• `Optional` **createOnCompleteAction**: ``"no_op"`` \| ``"opt_in"`` \| ``"close_out"`` \| ``"update_application"`` \| ``"delete_application"`` \| `NoOpOC` \| `OptInOC` \| `CloseOutOC` \| `UpdateApplicationOC` \| `DeleteApplicationOC`

Override the on-completion action for the create call; defaults to NoOp

#### Defined in

[src/types/app-client.ts:130](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L130)

___

### deleteArgs

• `Optional` **deleteArgs**: [`AppClientCallArgs`](../modules/types_app_client.md#appclientcallargs)

Any args to pass to any delete transaction that is issued as part of deployment

#### Defined in

[src/types/app-client.ts:134](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L134)

___

### deployTimeParams

• `Optional` **deployTimeParams**: [`TealTemplateParams`](types_app.TealTemplateParams.md)

Any deploy-time parameters to replace in the TEAL code

#### Defined in

[src/types/app-client.ts:126](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L126)

___

### updateArgs

• `Optional` **updateArgs**: [`AppClientCallArgs`](../modules/types_app_client.md#appclientcallargs)

Any args to pass to any update transaction that is issued as part of deployment

#### Defined in

[src/types/app-client.ts:132](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L132)
