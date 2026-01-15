[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-client](../README.md) / AppClientCreateOnComplete

# Type Alias: AppClientCreateOnComplete

> **AppClientCreateOnComplete** = `object`

Defined in: [src/types/app-client.ts:217](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L217)

On-complete action parameter for creating a contract using ApplicationClient

## Properties

### onCompleteAction?

> `optional` **onCompleteAction**: `Exclude`\<[`OnApplicationComplete`](../../../Packages/Transact/enumerations/OnApplicationComplete.md), [`ClearState`](../../../Packages/Transact/enumerations/OnApplicationComplete.md#clearstate)\>

Defined in: [src/types/app-client.ts:219](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L219)

Override the on-completion action for the create call; defaults to NoOp
