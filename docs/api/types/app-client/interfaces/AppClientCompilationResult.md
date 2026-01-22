[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-client](../README.md) / AppClientCompilationResult

# Interface: AppClientCompilationResult

Defined in: [src/types/app-client.ts:265](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L265)

The result of asking an `AppClient` to compile a program.

Always contains the compiled bytecode, and may contain the result of compiling TEAL (including sourcemap) if it was available.

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extends

- `Partial`\<[`AppCompilationResult`](../../app/interfaces/AppCompilationResult.md)\>

## Properties

### approvalProgram

> **approvalProgram**: `Uint8Array`

Defined in: [src/types/app-client.ts:267](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L267)

The compiled bytecode of the approval program, ready to deploy to algod

***

### clearStateProgram

> **clearStateProgram**: `Uint8Array`

Defined in: [src/types/app-client.ts:269](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L269)

The compiled bytecode of the clear state program, ready to deploy to algod

***

### compiledApproval?

> `optional` **compiledApproval**: [`CompiledTeal`](../../app/interfaces/CompiledTeal.md)

Defined in: [src/types/app.ts:215](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L215)

#### Inherited from

[`AppCompilationResult`](../../app/interfaces/AppCompilationResult.md).[`compiledApproval`](../../app/interfaces/AppCompilationResult.md#compiledapproval)

***

### compiledClear?

> `optional` **compiledClear**: [`CompiledTeal`](../../app/interfaces/CompiledTeal.md)

Defined in: [src/types/app.ts:216](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L216)

#### Inherited from

[`AppCompilationResult`](../../app/interfaces/AppCompilationResult.md).[`compiledClear`](../../app/interfaces/AppCompilationResult.md#compiledclear)
