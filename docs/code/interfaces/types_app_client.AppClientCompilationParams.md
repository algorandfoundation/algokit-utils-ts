[@algorandfoundation/algokit-utils](../README.md) / [types/app-client](../modules/types_app_client.md) / AppClientCompilationParams

# Interface: AppClientCompilationParams

[types/app-client](../modules/types_app_client.md).AppClientCompilationParams

## Table of contents

### Properties

- [deletable](types_app_client.AppClientCompilationParams.md#deletable)
- [deployTimeParams](types_app_client.AppClientCompilationParams.md#deploytimeparams)
- [updatable](types_app_client.AppClientCompilationParams.md#updatable)

## Properties

### deletable

• `Optional` **deletable**: `boolean`

Whether or not the contract should have deploy-time permanence control set, undefined = ignore

#### Defined in

[src/types/app-client.ts:232](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L232)

___

### deployTimeParams

• `Optional` **deployTimeParams**: [`TealTemplateParams`](types_app.TealTemplateParams.md)

Any deploy-time parameters to replace in the TEAL code

#### Defined in

[src/types/app-client.ts:228](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L228)

___

### updatable

• `Optional` **updatable**: `boolean`

Whether or not the contract should have deploy-time immutability control set, undefined = ignore

#### Defined in

[src/types/app-client.ts:230](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L230)
