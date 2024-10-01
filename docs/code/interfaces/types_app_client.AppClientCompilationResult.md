[@algorandfoundation/algokit-utils](../README.md) / [types/app-client](../modules/types_app_client.md) / AppClientCompilationResult

# Interface: AppClientCompilationResult

[types/app-client](../modules/types_app_client.md).AppClientCompilationResult

The result of asking an `AppClient` to compile a program.

## Table of contents

### Properties

- [approvalProgram](types_app_client.AppClientCompilationResult.md#approvalprogram)
- [approvalProgramCompilationResult](types_app_client.AppClientCompilationResult.md#approvalprogramcompilationresult)
- [clearStateProgram](types_app_client.AppClientCompilationResult.md#clearstateprogram)
- [clearStateProgramCompilationResult](types_app_client.AppClientCompilationResult.md#clearstateprogramcompilationresult)

## Properties

### approvalProgram

• **approvalProgram**: `Uint8Array`

The compiled bytecode of the approval program, ready to deploy to algod

#### Defined in

[src/types/app-client.ts:278](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L278)

___

### approvalProgramCompilationResult

• `Optional` **approvalProgramCompilationResult**: [`CompiledTeal`](types_app.CompiledTeal.md)

The result of compilation of the approval program, including source map, if TEAL code was compiled

#### Defined in

[src/types/app-client.ts:282](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L282)

___

### clearStateProgram

• **clearStateProgram**: `Uint8Array`

The compiled bytecode of the clear state program, ready to deploy to algod

#### Defined in

[src/types/app-client.ts:280](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L280)

___

### clearStateProgramCompilationResult

• `Optional` **clearStateProgramCompilationResult**: [`CompiledTeal`](types_app.CompiledTeal.md)

The result of compilation of the clear state program, including source map, if TEAL code was compiled

#### Defined in

[src/types/app-client.ts:284](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L284)
