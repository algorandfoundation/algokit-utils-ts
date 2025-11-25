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
- [compileTealTemplate](types_app_manager.AppManager.md#compiletealtemplate)
- [getBoxNames](types_app_manager.AppManager.md#getboxnames)
- [getBoxValue](types_app_manager.AppManager.md#getboxvalue)
- [getBoxValueFromABIType](types_app_manager.AppManager.md#getboxvaluefromabitype)
- [getBoxValues](types_app_manager.AppManager.md#getboxvalues)
- [getBoxValuesFromABIType](types_app_manager.AppManager.md#getboxvaluesfromabitype)
- [getById](types_app_manager.AppManager.md#getbyid)
- [getCompilationResult](types_app_manager.AppManager.md#getcompilationresult)
- [getGlobalState](types_app_manager.AppManager.md#getglobalstate)
- [getLocalState](types_app_manager.AppManager.md#getlocalstate)
- [decodeAppState](types_app_manager.AppManager.md#decodeappstate)
- [getABIReturn](types_app_manager.AppManager.md#getabireturn)
- [getBoxReference](types_app_manager.AppManager.md#getboxreference)
- [replaceTealTemplateDeployTimeControlParams](types_app_manager.AppManager.md#replacetealtemplatedeploytimecontrolparams)
- [replaceTealTemplateParams](types_app_manager.AppManager.md#replacetealtemplateparams)
- [stripTealComments](types_app_manager.AppManager.md#striptealcomments)

## Constructors

### constructor

• **new AppManager**(`algod`): [`AppManager`](types_app_manager.AppManager.md)

Creates an `AppManager`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `algod` | `AlgodClient` | An algod instance |

#### Returns

[`AppManager`](types_app_manager.AppManager.md)

#### Defined in

[src/types/app-manager.ts:108](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L108)

## Properties

### \_algod

• `Private` **\_algod**: `AlgodClient`

#### Defined in

[src/types/app-manager.ts:101](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L101)

___

### \_compilationResults

• `Private` **\_compilationResults**: `Record`\<`string`, [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md)\> = `{}`

#### Defined in

[src/types/app-manager.ts:102](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L102)

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

**`Example`**

```typescript
const compiled = await appManager.compileTeal(tealProgram)
```

#### Defined in

[src/types/app-manager.ts:127](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L127)

___

### compileTealTemplate

▸ **compileTealTemplate**(`tealTemplateCode`, `templateParams?`, `deploymentMetadata?`): `Promise`\<[`CompiledTeal`](../interfaces/types_app.CompiledTeal.md)\>

Performs template substitution of a teal template and compiles it, returning the compiled result.

Looks for `TMPL_{parameter}` for template replacements and replaces AlgoKit deploy-time control parameters
if deployment metadata is specified.

* `TMPL_UPDATABLE` for updatability / immutability control
* `TMPL_DELETABLE` for deletability / permanence control

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tealTemplateCode` | `string` | The TEAL logic to compile |
| `templateParams?` | [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) | Any parameters to replace in the .teal file before compiling |
| `deploymentMetadata?` | `Object` | The deployment metadata the app will be deployed with |
| `deploymentMetadata.deletable?` | `boolean` | - |
| `deploymentMetadata.updatable?` | `boolean` | - |

#### Returns

`Promise`\<[`CompiledTeal`](../interfaces/types_app.CompiledTeal.md)\>

The information about the compiled code

**`Example`**

```typescript
const compiled = await appManager.compileTealTemplate(tealTemplate, { TMPL_APP_ID: 12345n }, { updatable: true, deletable: false })
```

#### Defined in

[src/types/app-manager.ts:163](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L163)

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

**`Example`**

```typescript
const boxNames = await appManager.getBoxNames(12353n);
```

#### Defined in

[src/types/app-manager.ts:280](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L280)

___

### getBoxValue

▸ **getBoxValue**(`appId`, `boxName`): `Promise`\<`Uint8Array`\>

Returns the value of the given box name for the given app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appId` | `bigint` | The ID of the app return box names for |
| `boxName` | [`BoxName`](../interfaces/types_app.BoxName.md) \| [`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) | The name of the box to return either as a string, binary array or `BoxName` |

#### Returns

`Promise`\<`Uint8Array`\>

The current box value as a byte array

**`Example`**

```typescript
const boxValue = await appManager.getBoxValue(12353n, 'boxName');
```

#### Defined in

[src/types/app-manager.ts:301](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L301)

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

**`Example`**

```typescript
const boxValue = await appManager.getBoxValueFromABIType({ appId: 12353n, boxName: 'boxName', type: new ABIUintType(32) });
```

#### Defined in

[src/types/app-manager.ts:331](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L331)

___

### getBoxValues

▸ **getBoxValues**(`appId`, `boxNames`): `Promise`\<`Uint8Array`[]\>

Returns the value of the given box names for the given app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appId` | `bigint` | The ID of the app return box names for |
| `boxNames` | ([`BoxName`](../interfaces/types_app.BoxName.md) \| [`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier))[] | The names of the boxes to return either as a string, binary array or `BoxName` |

#### Returns

`Promise`\<`Uint8Array`[]\>

The current box values as a byte array in the same order as the passed in box names

**`Example`**

```typescript
const boxValues = await appManager.getBoxValues(12353n, ['boxName1', 'boxName2']);
```

#### Defined in

[src/types/app-manager.ts:318](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L318)

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

**`Example`**

```typescript
const boxValues = await appManager.getBoxValuesFromABIType({ appId: 12353n, boxNames: ['boxName1', 'boxName2'], type: new ABIUintType(32) });
```

#### Defined in

[src/types/app-manager.ts:346](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L346)

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

[src/types/app-manager.ts:204](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L204)

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

**`Example`**

```typescript
const compiled = appManager.getCompilationResult(tealProgram)
```

#### Defined in

[src/types/app-manager.ts:189](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L189)

___

### getGlobalState

▸ **getGlobalState**(`appId`): `Promise`\<[`AppState`](../interfaces/types_app.AppState.md)\>

Returns the current global state values for the given app ID and account address

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appId` | `bigint` | The ID of the app to return global state for |

#### Returns

`Promise`\<[`AppState`](../interfaces/types_app.AppState.md)\>

The current global state for the given app

**`Example`**

```typescript
const globalState = await appManager.getGlobalState(12353n);
```

#### Defined in

[src/types/app-manager.ts:236](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L236)

___

### getLocalState

▸ **getLocalState**(`appId`, `address`): `Promise`\<[`AppState`](../interfaces/types_app.AppState.md)\>

Returns the current local state values for the given app ID and account address

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appId` | `bigint` | The ID of the app to return local state for |
| `address` | `ReadableAddress` | The string address of the account to get local state for the given app |

#### Returns

`Promise`\<[`AppState`](../interfaces/types_app.AppState.md)\>

The current local state for the given (app, account) combination

**`Example`**

```typescript
const localState = await appManager.getLocalState(12353n, 'ACCOUNTADDRESS');
```

#### Defined in

[src/types/app-manager.ts:251](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L251)

___

### decodeAppState

▸ **decodeAppState**(`state`): [`AppState`](../interfaces/types_app.AppState.md)

Converts an array of global/local state values from the algod api to a more friendly
generic object keyed by the UTF-8 value of the key.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | \{ `key`: `Uint8Array` ; `value`: `TealValue` \| `EvalDelta`  }[] | A `global-state`, `local-state`, `global-state-deltas` or `local-state-deltas` |

#### Returns

[`AppState`](../interfaces/types_app.AppState.md)

An object keyeed by the UTF-8 representation of the key with various parsings of the values

**`Example`**

```typescript
const stateValues = AppManager.decodeAppState(state);
```

#### Defined in

[src/types/app-manager.ts:378](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L378)

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

**`Example`**

```typescript
const returnValue = AppManager.getABIReturn(confirmation, ABIMethod.fromSignature('hello(string)void'));
```

#### Defined in

[src/types/app-manager.ts:431](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L431)

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

**`Example`**

```typescript
const boxRef = AppManager.getBoxReference('boxName');
```

#### Defined in

[src/types/app-manager.ts:360](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L360)

___

### replaceTealTemplateDeployTimeControlParams

▸ **replaceTealTemplateDeployTimeControlParams**(`tealTemplateCode`, `params`): `string`

Replaces AlgoKit deploy-time deployment control parameters within the given TEAL template code.

* `TMPL_UPDATABLE` for updatability / immutability control
* `TMPL_DELETABLE` for deletability / permanence control

Note: If these values are defined, but the corresponding `TMPL_*` value
 isn't in the teal code it will throw an exception.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tealTemplateCode` | `string` | The TEAL template code to substitute |
| `params` | `Object` | The deploy-time deployment control parameter value to replace |
| `params.deletable?` | `boolean` | - |
| `params.updatable?` | `boolean` | - |

#### Returns

`string`

The replaced TEAL code

**`Example`**

```typescript
const tealCode = AppManager.replaceTealTemplateDeployTimeControlParams(tealTemplate, { updatable: true, deletable: false });
```

#### Defined in

[src/types/app-manager.ts:465](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L465)

___

### replaceTealTemplateParams

▸ **replaceTealTemplateParams**(`tealTemplateCode`, `templateParams?`): `string`

Performs template substitution of a teal file.

Looks for `TMPL_{parameter}` for template replacements.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tealTemplateCode` | `string` | The TEAL template code to make parameter replacements in |
| `templateParams?` | [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) | Any parameters to replace in the teal code |

#### Returns

`string`

The TEAL code with replacements

**`Example`**

```typescript
const tealCode = AppManager.replaceTealTemplateParams(tealTemplate, { TMPL_APP_ID: 12345n });
```

#### Defined in

[src/types/app-manager.ts:500](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L500)

___

### stripTealComments

▸ **stripTealComments**(`tealCode`): `string`

Remove comments from TEAL code (useful to reduce code size before compilation).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tealCode` | `string` | The TEAL logic to strip |

#### Returns

`string`

The TEAL without comments

**`Example`**

```typescript
const stripped = AppManager.stripTealComments(tealProgram);
```

#### Defined in

[src/types/app-manager.ts:539](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L539)
