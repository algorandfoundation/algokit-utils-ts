[algotstest](../README.md) / app

# Module: app

## Table of contents

### Interfaces

- [AppCallArgs](../interfaces/app.AppCallArgs.md)
- [AppCallParams](../interfaces/app.AppCallParams.md)
- [AppReference](../interfaces/app.AppReference.md)
- [AppStorageSchema](../interfaces/app.AppStorageSchema.md)
- [BoxReference](../interfaces/app.BoxReference.md)
- [CompiledTeal](../interfaces/app.CompiledTeal.md)
- [CreateAppParams](../interfaces/app.CreateAppParams.md)
- [UpdateAppParams](../interfaces/app.UpdateAppParams.md)

### Variables

- [APP\_PAGE\_MAX\_SIZE](app.md#app_page_max_size)

### Functions

- [callApp](app.md#callapp)
- [compileTeal](app.md#compileteal)
- [createApp](app.md#createapp)
- [getAppArgsForTransaction](app.md#getappargsfortransaction)
- [getAppByIndex](app.md#getappbyindex)
- [updateApp](app.md#updateapp)

## Variables

### APP\_PAGE\_MAX\_SIZE

• `Const` **APP\_PAGE\_MAX\_SIZE**: ``2048``

#### Defined in

[app.ts:16](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/app.ts#L16)

## Functions

### callApp

▸ **callApp**(`call`, `algod`): `Promise`<[`SendTransactionResult`](../interfaces/transaction.SendTransactionResult.md)\>

Issues a call to a given app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | [`AppCallParams`](../interfaces/app.AppCallParams.md) | The call details. |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<[`SendTransactionResult`](../interfaces/transaction.SendTransactionResult.md)\>

The result of the call

#### Defined in

[app.ts:204](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/app.ts#L204)

___

### compileTeal

▸ **compileTeal**(`tealCode`, `algod`): `Promise`<[`CompiledTeal`](../interfaces/app.CompiledTeal.md)\>

Compiles the given TEAL using algod and returns the result.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tealCode` | `string` | The TEAL code |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<[`CompiledTeal`](../interfaces/app.CompiledTeal.md)\>

The information about the compiled file

#### Defined in

[app.ts:276](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/app.ts#L276)

___

### createApp

▸ **createApp**(`create`, `algod`): `Promise`<[`SendTransactionResult`](../interfaces/transaction.SendTransactionResult.md) & [`AppReference`](../interfaces/app.AppReference.md)\>

Creates a smart contract app, returns the details of the created app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `create` | [`CreateAppParams`](../interfaces/app.CreateAppParams.md) | The parameters to create the app with |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<[`SendTransactionResult`](../interfaces/transaction.SendTransactionResult.md) & [`AppReference`](../interfaces/app.AppReference.md)\>

The details of the created app, or the transaction to create it if `skipSending`

#### Defined in

[app.ts:131](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/app.ts#L131)

___

### getAppArgsForTransaction

▸ **getAppArgsForTransaction**(`args?`): `undefined` \| { `accounts`: `undefined` \| `string`[] = args.accounts; `appArgs`: `undefined` \| `Uint8Array`[] ; `boxes`: `undefined` \| `BoxReference`[] ; `foreignApps`: `undefined` \| `number`[] = args.apps; `foreignAssets`: `undefined` \| `number`[] = args.assets; `lease`: `undefined` \| `Uint8Array`  }

Returns the app args ready to load onto an app

**`See`**

object

#### Parameters

| Name | Type |
| :------ | :------ |
| `args?` | [`AppCallArgs`](../interfaces/app.AppCallArgs.md) |

#### Returns

`undefined` \| { `accounts`: `undefined` \| `string`[] = args.accounts; `appArgs`: `undefined` \| `Uint8Array`[] ; `boxes`: `undefined` \| `BoxReference`[] ; `foreignApps`: `undefined` \| `number`[] = args.apps; `foreignAssets`: `undefined` \| `number`[] = args.assets; `lease`: `undefined` \| `Uint8Array`  }

#### Defined in

[app.ts:239](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/app.ts#L239)

___

### getAppByIndex

▸ **getAppByIndex**(`appIndex`, `algod`): `Promise`<[`ApplicationResponse`](../interfaces/algod_type.ApplicationResponse.md)\>

Gets the current data for the given app from algod.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appIndex` | `number` | The index of the app |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<[`ApplicationResponse`](../interfaces/algod_type.ApplicationResponse.md)\>

The data about the app

#### Defined in

[app.ts:265](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/app.ts#L265)

___

### updateApp

▸ **updateApp**(`update`, `algod`): `Promise`<[`SendTransactionResult`](../interfaces/transaction.SendTransactionResult.md)\>

Updates a smart contract app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `update` | [`UpdateAppParams`](../interfaces/app.UpdateAppParams.md) | The parameters to update the app with |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<[`SendTransactionResult`](../interfaces/transaction.SendTransactionResult.md)\>

The transaction

#### Defined in

[app.ts:174](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/app.ts#L174)
