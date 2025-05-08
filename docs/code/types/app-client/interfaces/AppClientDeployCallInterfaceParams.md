[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-client](../README.md) / AppClientDeployCallInterfaceParams

# Interface: AppClientDeployCallInterfaceParams

Defined in: [src/types/app-client.ts:178](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L178)

Call interface parameters to pass into ApplicationClient.deploy

## Extended by

- [`AppClientDeployParams`](AppClientDeployParams.md)

## Properties

### createArgs?

> `optional` **createArgs**: [`AppClientCallArgs`](../type-aliases/AppClientCallArgs.md)

Defined in: [src/types/app-client.ts:182](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L182)

Any args to pass to any create transaction that is issued as part of deployment

***

### createOnCompleteAction?

> `optional` **createOnCompleteAction**: `"no_op"` \| `"opt_in"` \| `"close_out"` \| `"update_application"` \| `"delete_application"` \| `NoOpOC` \| `OptInOC` \| `CloseOutOC` \| `UpdateApplicationOC` \| `DeleteApplicationOC`

Defined in: [src/types/app-client.ts:184](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L184)

Override the on-completion action for the create call; defaults to NoOp

***

### deleteArgs?

> `optional` **deleteArgs**: [`AppClientCallArgs`](../type-aliases/AppClientCallArgs.md)

Defined in: [src/types/app-client.ts:188](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L188)

Any args to pass to any delete transaction that is issued as part of deployment

***

### deployTimeParams?

> `optional` **deployTimeParams**: [`TealTemplateParams`](../../app/interfaces/TealTemplateParams.md)

Defined in: [src/types/app-client.ts:180](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L180)

Any deploy-time parameters to replace in the TEAL code

***

### updateArgs?

> `optional` **updateArgs**: [`AppClientCallArgs`](../type-aliases/AppClientCallArgs.md)

Defined in: [src/types/app-client.ts:186](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L186)

Any args to pass to any update transaction that is issued as part of deployment
