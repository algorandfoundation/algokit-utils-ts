[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-client](../README.md) / AppClientDeployCallInterfaceParams

# Interface: AppClientDeployCallInterfaceParams

Defined in: [src/types/app-client.ts:163](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L163)

Call interface parameters to pass into ApplicationClient.deploy

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extended by

- [`AppClientDeployParams`](AppClientDeployParams.md)

## Properties

### createArgs?

> `optional` **createArgs**: [`AppClientCallArgs`](../type-aliases/AppClientCallArgs.md)

Defined in: [src/types/app-client.ts:167](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L167)

Any args to pass to any create transaction that is issued as part of deployment

***

### createOnCompleteAction?

> `optional` **createOnCompleteAction**: [`NoOp`](../../../Subpaths/transact/enumerations/OnApplicationComplete.md#noop) \| [`OptIn`](../../../Subpaths/transact/enumerations/OnApplicationComplete.md#optin) \| [`CloseOut`](../../../Subpaths/transact/enumerations/OnApplicationComplete.md#closeout) \| [`UpdateApplication`](../../../Subpaths/transact/enumerations/OnApplicationComplete.md#updateapplication) \| [`DeleteApplication`](../../../Subpaths/transact/enumerations/OnApplicationComplete.md#deleteapplication)

Defined in: [src/types/app-client.ts:169](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L169)

Override the on-completion action for the create call; defaults to NoOp

***

### deleteArgs?

> `optional` **deleteArgs**: [`AppClientCallArgs`](../type-aliases/AppClientCallArgs.md)

Defined in: [src/types/app-client.ts:173](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L173)

Any args to pass to any delete transaction that is issued as part of deployment

***

### deployTimeParams?

> `optional` **deployTimeParams**: [`TealTemplateParams`](../../app/interfaces/TealTemplateParams.md)

Defined in: [src/types/app-client.ts:165](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L165)

Any deploy-time parameters to replace in the TEAL code

***

### updateArgs?

> `optional` **updateArgs**: [`AppClientCallArgs`](../type-aliases/AppClientCallArgs.md)

Defined in: [src/types/app-client.ts:171](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L171)

Any args to pass to any update transaction that is issued as part of deployment
