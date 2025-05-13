[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-client](../README.md) / AppClientCompilationParams

# Interface: AppClientCompilationParams

Defined in: [src/types/app-client.ts:223](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L223)

## Properties

### deletable?

> `optional` **deletable**: `boolean`

Defined in: [src/types/app-client.ts:229](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L229)

Whether or not the contract should have deploy-time permanence control set, undefined = ignore

***

### deployTimeParams?

> `optional` **deployTimeParams**: [`TealTemplateParams`](../../app/interfaces/TealTemplateParams.md)

Defined in: [src/types/app-client.ts:225](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L225)

Any deploy-time parameters to replace in the TEAL code

***

### updatable?

> `optional` **updatable**: `boolean`

Defined in: [src/types/app-client.ts:227](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L227)

Whether or not the contract should have deploy-time immutability control set, undefined = ignore
