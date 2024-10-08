[@algorandfoundation/algokit-utils](../README.md) / [types/app-client](../modules/types_app_client.md) / AppClientCompilationResult

# Interface: AppClientCompilationResult

[types/app-client](../modules/types_app_client.md).AppClientCompilationResult

The result of asking an `AppClient` to compile a program.

Always contains the compiled bytecode, and may contain the result of compiling TEAL (including sourcemap) if it was available.

## Hierarchy

- `Partial`\<[`AppCompilationResult`](types_app.AppCompilationResult.md)\>

  ↳ **`AppClientCompilationResult`**

## Table of contents

### Properties

- [approvalProgram](types_app_client.AppClientCompilationResult.md#approvalprogram)
- [clearStateProgram](types_app_client.AppClientCompilationResult.md#clearstateprogram)
- [compiledApproval](types_app_client.AppClientCompilationResult.md#compiledapproval)
- [compiledClear](types_app_client.AppClientCompilationResult.md#compiledclear)

## Properties

### approvalProgram

• **approvalProgram**: `Uint8Array`

The compiled bytecode of the approval program, ready to deploy to algod

#### Defined in

[src/types/app-client.ts:281](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L281)

___

### clearStateProgram

• **clearStateProgram**: `Uint8Array`

The compiled bytecode of the clear state program, ready to deploy to algod

#### Defined in

[src/types/app-client.ts:283](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L283)

___

### compiledApproval

• `Optional` **compiledApproval**: [`CompiledTeal`](types_app.CompiledTeal.md)

The result of compiling the approval program

#### Inherited from

Partial.compiledApproval

#### Defined in

[src/types/app.ts:336](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L336)

___

### compiledClear

• `Optional` **compiledClear**: [`CompiledTeal`](types_app.CompiledTeal.md)

The result of compiling the clear state program

#### Inherited from

Partial.compiledClear

#### Defined in

[src/types/app.ts:338](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L338)
