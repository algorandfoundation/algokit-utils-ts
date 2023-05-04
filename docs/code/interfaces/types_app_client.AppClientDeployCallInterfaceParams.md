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
- [deleteArgs](types_app_client.AppClientDeployCallInterfaceParams.md#deleteargs)
- [deployTimeParams](types_app_client.AppClientDeployCallInterfaceParams.md#deploytimeparams)
- [updateArgs](types_app_client.AppClientDeployCallInterfaceParams.md#updateargs)

## Properties

### createArgs

• `Optional` **createArgs**: [`AppClientCallArgs`](../modules/types_app_client.md#appclientcallargs)

Any args to pass to any create transaction that is issued as part of deployment

#### Defined in

[src/types/app-client.ts:123](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L123)

___

### deleteArgs

• `Optional` **deleteArgs**: [`AppClientCallArgs`](../modules/types_app_client.md#appclientcallargs)

Any args to pass to any delete transaction that is issued as part of deployment

#### Defined in

[src/types/app-client.ts:127](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L127)

___

### deployTimeParams

• `Optional` **deployTimeParams**: [`TealTemplateParams`](types_app.TealTemplateParams.md)

Any deploy-time parameters to replace in the TEAL code

#### Defined in

[src/types/app-client.ts:121](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L121)

___

### updateArgs

• `Optional` **updateArgs**: [`AppClientCallArgs`](../modules/types_app_client.md#appclientcallargs)

Any args to pass to any update transaction that is issued as part of deployment

#### Defined in

[src/types/app-client.ts:125](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L125)
