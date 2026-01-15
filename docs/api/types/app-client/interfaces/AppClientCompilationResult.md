[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-client](../README.md) / AppClientCompilationResult

# Interface: AppClientCompilationResult

Defined in: [src/types/app-client.ts:264](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L264)

The result of asking an `AppClient` to compile a program.

Always contains the compiled bytecode, and may contain the result of compiling TEAL (including sourcemap) if it was available.

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extends

- `Partial`\<[`AppCompilationResult`](../../app/interfaces/AppCompilationResult.md)\>

## Properties

### approvalProgram

> **approvalProgram**: `Uint8Array`

Defined in: [src/types/app-client.ts:266](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L266)

The compiled bytecode of the approval program, ready to deploy to algod

***

### clearStateProgram

> **clearStateProgram**: `Uint8Array`

Defined in: [src/types/app-client.ts:268](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L268)

The compiled bytecode of the clear state program, ready to deploy to algod

***

### compiledApproval?

> `optional` **compiledApproval**: [`CompiledTeal`](../../app/interfaces/CompiledTeal.md)

Defined in: [src/types/app.ts:216](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L216)

The result of compiling the approval program

#### Inherited from

[`AppCompilationResult`](../../app/interfaces/AppCompilationResult.md).[`compiledApproval`](../../app/interfaces/AppCompilationResult.md#compiledapproval)

***

### compiledClear?

> `optional` **compiledClear**: [`CompiledTeal`](../../app/interfaces/CompiledTeal.md)

Defined in: [src/types/app.ts:218](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L218)

The result of compiling the clear state program

#### Inherited from

[`AppCompilationResult`](../../app/interfaces/AppCompilationResult.md).[`compiledClear`](../../app/interfaces/AppCompilationResult.md#compiledclear)
