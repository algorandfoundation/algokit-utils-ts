[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-client](../README.md) / AppClientDeployCallInterfaceParams

# Interface: AppClientDeployCallInterfaceParams

Defined in: [src/types/app-client.ts:162](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L162)

Call interface parameters to pass into ApplicationClient.deploy

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extended by

- [`AppClientDeployParams`](AppClientDeployParams.md)

## Properties

### createArgs?

> `optional` **createArgs**: [`AppClientCallArgs`](../type-aliases/AppClientCallArgs.md)

Defined in: [src/types/app-client.ts:166](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L166)

Any args to pass to any create transaction that is issued as part of deployment

***

### createOnCompleteAction?

> `optional` **createOnCompleteAction**: [`NoOp`](../../../Subpaths/transact/enumerations/OnApplicationComplete.md#noop) \| [`OptIn`](../../../Subpaths/transact/enumerations/OnApplicationComplete.md#optin) \| [`CloseOut`](../../../Subpaths/transact/enumerations/OnApplicationComplete.md#closeout) \| [`UpdateApplication`](../../../Subpaths/transact/enumerations/OnApplicationComplete.md#updateapplication) \| [`DeleteApplication`](../../../Subpaths/transact/enumerations/OnApplicationComplete.md#deleteapplication)

Defined in: [src/types/app-client.ts:168](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L168)

Override the on-completion action for the create call; defaults to NoOp

***

### deleteArgs?

> `optional` **deleteArgs**: [`AppClientCallArgs`](../type-aliases/AppClientCallArgs.md)

Defined in: [src/types/app-client.ts:172](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L172)

Any args to pass to any delete transaction that is issued as part of deployment

***

### deployTimeParams?

> `optional` **deployTimeParams**: [`TealTemplateParams`](../../app/interfaces/TealTemplateParams.md)

Defined in: [src/types/app-client.ts:164](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L164)

Any deploy-time parameters to replace in the TEAL code

***

### updateArgs?

> `optional` **updateArgs**: [`AppClientCallArgs`](../type-aliases/AppClientCallArgs.md)

Defined in: [src/types/app-client.ts:170](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L170)

Any args to pass to any update transaction that is issued as part of deployment
