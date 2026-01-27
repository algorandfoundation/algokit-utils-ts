[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-client](../README.md) / AppClientCreateOnComplete

# Type Alias: AppClientCreateOnComplete

> **AppClientCreateOnComplete** = `object`

Defined in: [src/types/app-client.ts:218](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L218)

On-complete action parameter for creating a contract using ApplicationClient

## Properties

### onCompleteAction?

> `optional` **onCompleteAction**: `Exclude`\<[`OnApplicationComplete`](../../../Subpaths/transact/enumerations/OnApplicationComplete.md), [`ClearState`](../../../Subpaths/transact/enumerations/OnApplicationComplete.md#clearstate)\>

Defined in: [src/types/app-client.ts:220](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L220)

Override the on-completion action for the create call; defaults to NoOp
