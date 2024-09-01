[@algorandfoundation/algokit-utils](../README.md) / [types/app-manager](../modules/types_app_manager.md) / AppManager

# Class: AppManager

[types/app-manager](../modules/types_app_manager.md).AppManager

Allows management of application information.

## Table of contents

### Constructors

- [constructor](types_app_manager.AppManager.md#constructor)

### Properties

- [\_algod](types_app_manager.AppManager.md#_algod)
- [\_compilationResults](types_app_manager.AppManager.md#_compilationresults)

### Methods

- [compileTeal](types_app_manager.AppManager.md#compileteal)
- [getBoxNames](types_app_manager.AppManager.md#getboxnames)
- [getBoxValue](types_app_manager.AppManager.md#getboxvalue)
- [getBoxValueFromABIType](types_app_manager.AppManager.md#getboxvaluefromabitype)
- [getBoxValues](types_app_manager.AppManager.md#getboxvalues)
- [getBoxValuesFromABIType](types_app_manager.AppManager.md#getboxvaluesfromabitype)
- [getById](types_app_manager.AppManager.md#getbyid)
- [getCompilationResult](types_app_manager.AppManager.md#getcompilationresult)
- [getLocalState](types_app_manager.AppManager.md#getlocalstate)
- [decodeAppState](types_app_manager.AppManager.md#decodeappstate)
- [getABIReturn](types_app_manager.AppManager.md#getabireturn)
- [getBoxReference](types_app_manager.AppManager.md#getboxreference)

## Constructors

### constructor

• **new AppManager**(`algod`): [`AppManager`](types_app_manager.AppManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `algod` | `default` |

#### Returns

[`AppManager`](types_app_manager.AppManager.md)

#### Defined in

[src/types/app-manager.ts:94](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L94)

## Properties

### \_algod

• `Private` **\_algod**: `default`

#### Defined in

[src/types/app-manager.ts:92](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L92)

___

### \_compilationResults

• `Private` **\_compilationResults**: `Record`\<`string`, [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md)\> = `{}`

#### Defined in

[src/types/app-manager.ts:98](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L98)

## Methods

### compileTeal

▸ **compileTeal**(`tealCode`): `Promise`\<[`CompiledTeal`](../interfaces/types_app.CompiledTeal.md)\>

Compiles the given TEAL using algod and returns the result, including source map.

The result of this compilation is also cached keyed by the TEAL
 code so it can be retrieved via `getCompilationResult`.

This function is re-entrant; it will only compile the same code once.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tealCode` | `string` | The TEAL code |

#### Returns

`Promise`\<[`CompiledTeal`](../interfaces/types_app.CompiledTeal.md)\>

The information about the compiled file

#### Defined in

[src/types/app-manager.ts:111](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L111)

___

### getBoxNames

▸ **getBoxNames**(`appId`): `Promise`\<[`BoxName`](../interfaces/types_app.BoxName.md)[]\>

Returns the names of the current boxes for the given app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appId` | `bigint` | The ID of the app return box names for |

#### Returns

`Promise`\<[`BoxName`](../interfaces/types_app.BoxName.md)[]\>

The current box names

#### Defined in

[src/types/app-manager.ts:190](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L190)

___

### getBoxValue

▸ **getBoxValue**(`appId`, `boxName`): `Promise`\<`Uint8Array`\>

Returns the value of the given box name for the given app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appId` | `bigint` | The ID of the app return box names for |
| `boxName` | [`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) | The name of the box to return either as a string, binary array or `BoxName` |

#### Returns

`Promise`\<`Uint8Array`\>

The current box value as a byte array

#### Defined in

[src/types/app-manager.ts:207](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L207)

___

### getBoxValueFromABIType

▸ **getBoxValueFromABIType**(`request`): `Promise`\<`ABIValue`\>

Returns the value of the given box name for the given app decoded based on the given ABI type.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`BoxValueRequestParams`](../interfaces/types_app_manager.BoxValueRequestParams.md) | The parameters for the box value request |

#### Returns

`Promise`\<`ABIValue`\>

The current box value as an ABI value

#### Defined in

[src/types/app-manager.ts:228](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L228)

___

### getBoxValues

▸ **getBoxValues**(`appId`, `boxNames`): `Promise`\<`Uint8Array`[]\>

Returns the value of the given box names for the given app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appId` | `bigint` | The ID of the app return box names for |
| `boxNames` | [`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier)[] | The names of the boxes to return either as a string, binary array or `BoxName` |

#### Returns

`Promise`\<`Uint8Array`[]\>

The current box values as a byte array in the same order as the passed in box names

#### Defined in

[src/types/app-manager.ts:219](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L219)

___

### getBoxValuesFromABIType

▸ **getBoxValuesFromABIType**(`request`): `Promise`\<`ABIValue`[]\>

Returns the value of the given box names for the given app decoded based on the given ABI type.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`BoxValuesRequestParams`](../interfaces/types_app_manager.BoxValuesRequestParams.md) | The parameters for the box value request |

#### Returns

`Promise`\<`ABIValue`[]\>

The current box values as an ABI value in the same order as the passed in box names

#### Defined in

[src/types/app-manager.ts:239](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L239)

___

### getById

▸ **getById**(`appId`): `Promise`\<[`AppInformation`](../interfaces/types_app_manager.AppInformation.md)\>

Returns the current app information for the app with the given ID.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appId` | `bigint` | The ID of the app |

#### Returns

`Promise`\<[`AppInformation`](../interfaces/types_app_manager.AppInformation.md)\>

The app information

**`Example`**

```typescript
const appInfo = await appManager.getById(12353n);
```

#### Defined in

[src/types/app-manager.ts:149](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L149)

___

### getCompilationResult

▸ **getCompilationResult**(`tealCode`): `undefined` \| [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md)

Returns a previous compilation result.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tealCode` | `string` | The TEAL code |

#### Returns

`undefined` \| [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md)

The information about the previously compiled file
 or `undefined` if that TEAL code wasn't previously compiled

#### Defined in

[src/types/app-manager.ts:134](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L134)

___

### getLocalState

▸ **getLocalState**(`appId`, `address`): `Promise`\<[`AppState`](../interfaces/types_app.AppState.md)\>

Returns the current local state values for the given app ID and account address

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appId` | `bigint` | The ID of the app to return local state for |
| `address` | `string` | The string address of the account to get local state for the given app |

#### Returns

`Promise`\<[`AppState`](../interfaces/types_app.AppState.md)\>

The current local state for the given (app, account) combination

#### Defined in

[src/types/app-manager.ts:173](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L173)

___

### decodeAppState

▸ **decodeAppState**(`state`): [`AppState`](../interfaces/types_app.AppState.md)

Converts an array of global/local state values from the algod api to a more friendly
generic object keyed by the UTF-8 value of the key.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | \{ `key`: `string` ; `value`: `TealValue` \| `EvalDelta`  }[] | A `global-state`, `local-state`, `global-state-deltas` or `local-state-deltas` |

#### Returns

[`AppState`](../interfaces/types_app.AppState.md)

An object keyeed by the UTF-8 representation of the key with various parsings of the values

#### Defined in

[src/types/app-manager.ts:268](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L268)

___

### getABIReturn

▸ **getABIReturn**(`confirmation`, `method`): `undefined` \| [`ABIReturn`](../modules/types_app.md#abireturn)

Returns any ABI return values for the given app call arguments and transaction confirmation.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `confirmation` | `undefined` \| `PendingTransactionResponse` | The transaction confirmation from algod |
| `method` | `undefined` \| `ABIMethod` | The ABI method |

#### Returns

`undefined` \| [`ABIReturn`](../modules/types_app.md#abireturn)

The return value for the method call

#### Defined in

[src/types/app-manager.ts:316](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L316)

___

### getBoxReference

▸ **getBoxReference**(`boxId`): `BoxReference`

Returns a `algosdk.BoxReference` given a `BoxIdentifier` or `BoxReference`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `boxId` | [`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md) | The box to return a reference for |

#### Returns

`BoxReference`

The box reference ready to pass into a `algosdk.Transaction`

#### Defined in

[src/types/app-manager.ts:249](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L249)
