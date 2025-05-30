[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-client](../README.md) / AppClientCreateOnComplete

# Type Alias: AppClientCreateOnComplete

> **AppClientCreateOnComplete** = `object`

Defined in: [src/types/app-client.ts:233](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L233)

On-complete action parameter for creating a contract using ApplicationClient

## Properties

### onCompleteAction?

> `optional` **onCompleteAction**: `Exclude`\<[`AppCallType`](../../app/type-aliases/AppCallType.md), `"clear_state"`\> \| `Exclude`\<`OnApplicationComplete`, `OnApplicationComplete.ClearStateOC`\>

Defined in: [src/types/app-client.ts:235](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L235)

Override the on-completion action for the create call; defaults to NoOp
