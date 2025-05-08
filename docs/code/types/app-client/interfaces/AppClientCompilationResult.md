[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-client](../README.md) / AppClientCompilationResult

# Interface: AppClientCompilationResult

Defined in: [src/types/app-client.ts:280](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L280)

The result of asking an `AppClient` to compile a program.

Always contains the compiled bytecode, and may contain the result of compiling TEAL (including sourcemap) if it was available.

## Extends

- `Partial`\<[`AppCompilationResult`](../../app/interfaces/AppCompilationResult.md)\>

## Properties

### approvalProgram

> **approvalProgram**: `Uint8Array`

Defined in: [src/types/app-client.ts:282](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L282)

The compiled bytecode of the approval program, ready to deploy to algod

***

### clearStateProgram

> **clearStateProgram**: `Uint8Array`

Defined in: [src/types/app-client.ts:284](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L284)

The compiled bytecode of the clear state program, ready to deploy to algod

***

### compiledApproval?

> `optional` **compiledApproval**: [`CompiledTeal`](../../app/interfaces/CompiledTeal.md)

Defined in: [src/types/app.ts:335](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L335)

The result of compiling the approval program

#### Inherited from

`Partial.compiledApproval`

***

### compiledClear?

> `optional` **compiledClear**: [`CompiledTeal`](../../app/interfaces/CompiledTeal.md)

Defined in: [src/types/app.ts:337](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L337)

The result of compiling the clear state program

#### Inherited from

`Partial.compiledClear`
