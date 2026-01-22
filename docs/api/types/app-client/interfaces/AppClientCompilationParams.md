[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-client](../README.md) / AppClientCompilationParams

# Interface: AppClientCompilationParams

Defined in: [src/types/app-client.ts:208](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L208)

## Properties

### deletable?

> `optional` **deletable**: `boolean`

Defined in: [src/types/app-client.ts:214](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L214)

Whether or not the contract should have deploy-time permanence control set, undefined = ignore

***

### deployTimeParams?

> `optional` **deployTimeParams**: [`TealTemplateParams`](../../app/interfaces/TealTemplateParams.md)

Defined in: [src/types/app-client.ts:210](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L210)

Any deploy-time parameters to replace in the TEAL code

***

### updatable?

> `optional` **updatable**: `boolean`

Defined in: [src/types/app-client.ts:212](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L212)

Whether or not the contract should have deploy-time immutability control set, undefined = ignore
