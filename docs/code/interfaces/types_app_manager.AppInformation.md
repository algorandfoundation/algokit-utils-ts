[@algorandfoundation/algokit-utils](../README.md) / [types/app-manager](../modules/types_app_manager.md) / AppInformation

# Interface: AppInformation

[types/app-manager](../modules/types_app_manager.md).AppInformation

Information about an app.

## Table of contents

### Properties

- [appAddress](types_app_manager.AppInformation.md#appaddress)
- [appId](types_app_manager.AppInformation.md#appid)
- [approvalProgram](types_app_manager.AppInformation.md#approvalprogram)
- [clearStateProgram](types_app_manager.AppInformation.md#clearstateprogram)
- [creator](types_app_manager.AppInformation.md#creator)
- [extraProgramPages](types_app_manager.AppInformation.md#extraprogrampages)
- [globalByteSlices](types_app_manager.AppInformation.md#globalbyteslices)
- [globalInts](types_app_manager.AppInformation.md#globalints)
- [globalState](types_app_manager.AppInformation.md#globalstate)
- [localByteSlices](types_app_manager.AppInformation.md#localbyteslices)
- [localInts](types_app_manager.AppInformation.md#localints)

## Properties

### appAddress

• **appAddress**: `string`

The escrow address that the app operates with.

#### Defined in

[src/types/app-manager.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L13)

___

### appId

• **appId**: `bigint`

The ID of the app.

#### Defined in

[src/types/app-manager.ts:11](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L11)

___

### approvalProgram

• **approvalProgram**: `Uint8Array`

Approval program.

#### Defined in

[src/types/app-manager.ts:17](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L17)

___

### clearStateProgram

• **clearStateProgram**: `Uint8Array`

Clear state program.

#### Defined in

[src/types/app-manager.ts:21](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L21)

___

### creator

• **creator**: `string`

The address that created this application. This is the address where the
parameters and global state for this application can be found.

#### Defined in

[src/types/app-manager.ts:26](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L26)

___

### extraProgramPages

• `Optional` **extraProgramPages**: `number`

Any extra pages that are needed for the smart contract.

#### Defined in

[src/types/app-manager.ts:40](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L40)

___

### globalByteSlices

• **globalByteSlices**: `number`

The number of allocated byte slices in global state.

#### Defined in

[src/types/app-manager.ts:38](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L38)

___

### globalInts

• **globalInts**: `number`

The number of allocated ints in global state.

#### Defined in

[src/types/app-manager.ts:36](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L36)

___

### globalState

• **globalState**: [`AppState`](types_app.AppState.md)

Current global state values.

#### Defined in

[src/types/app-manager.ts:30](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L30)

___

### localByteSlices

• **localByteSlices**: `number`

The number of allocated byte slices in per-user local state.

#### Defined in

[src/types/app-manager.ts:34](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L34)

___

### localInts

• **localInts**: `number`

The number of allocated ints in per-user local state.

#### Defined in

[src/types/app-manager.ts:32](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L32)