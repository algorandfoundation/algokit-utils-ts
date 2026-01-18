[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-client](../README.md) / AppClientCompilationParams

# Interface: AppClientCompilationParams

Defined in: [src/types/app-client.ts:207](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-client.ts#L207)

## Properties

### deletable?

> `optional` **deletable**: `boolean`

Defined in: [src/types/app-client.ts:213](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-client.ts#L213)

Whether or not the contract should have deploy-time permanence control set, undefined = ignore

***

### deployTimeParams?

> `optional` **deployTimeParams**: [`TealTemplateParams`](../../app/interfaces/TealTemplateParams.md)

Defined in: [src/types/app-client.ts:209](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-client.ts#L209)

Any deploy-time parameters to replace in the TEAL code

***

### updatable?

> `optional` **updatable**: `boolean`

Defined in: [src/types/app-client.ts:211](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-client.ts#L211)

Whether or not the contract should have deploy-time immutability control set, undefined = ignore
