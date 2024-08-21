[@algorandfoundation/algokit-utils](../README.md) / [types/asset-manager](../modules/types_asset_manager.md) / AssetManager

# Class: AssetManager

[types/asset-manager](../modules/types_asset_manager.md).AssetManager

Allows management of asset information.

## Table of contents

### Constructors

- [constructor](types_asset_manager.AssetManager.md#constructor)

### Properties

- [\_accountManager](types_asset_manager.AssetManager.md#_accountmanager)
- [\_clientManager](types_asset_manager.AssetManager.md#_clientmanager)

### Methods

- [\_getComposer](types_asset_manager.AssetManager.md#_getcomposer)
- [bulkOptIn](types_asset_manager.AssetManager.md#bulkoptin)
- [bulkOptOut](types_asset_manager.AssetManager.md#bulkoptout)
- [getAccountInformation](types_asset_manager.AssetManager.md#getaccountinformation)
- [getById](types_asset_manager.AssetManager.md#getbyid)

## Constructors

### constructor

• **new AssetManager**(`clientManager`, `accountManager`): [`AssetManager`](types_asset_manager.AssetManager.md)

Create a new asset manager.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `clientManager` | [`ClientManager`](types_client_manager.ClientManager.md) | The ClientManager client to use for algod client |
| `accountManager` | [`AccountManager`](types_account_manager.AccountManager.md) | - |

#### Returns

[`AssetManager`](types_asset_manager.AssetManager.md)

**`Example`**

```typescript
const assetManager = new AssetManager(clientManager)
```

#### Defined in

[src/types/asset-manager.ts:152](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L152)

## Properties

### \_accountManager

• `Private` **\_accountManager**: [`AccountManager`](types_account_manager.AccountManager.md)

#### Defined in

[src/types/asset-manager.ts:142](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L142)

___

### \_clientManager

• `Private` **\_clientManager**: [`ClientManager`](types_client_manager.ClientManager.md)

#### Defined in

[src/types/asset-manager.ts:141](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L141)

## Methods

### \_getComposer

▸ **_getComposer**(`getSuggestedParams?`): [`default`](types_composer.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `getSuggestedParams?` | () => `Promise`\<`SuggestedParams`\> |

#### Returns

[`default`](types_composer.default.md)

#### Defined in

[src/types/asset-manager.ts:157](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L157)

___

### bulkOptIn

▸ **bulkOptIn**(`account`, `assetIds`, `options?`): `Promise`\<[`BulkAssetOptInOutResult`](../interfaces/types_asset_manager.BulkAssetOptInOutResult.md)[]\>

Opt an account in to a list of Algorand Standard Assets.

Transactions will be sent in batches of 16 as transaction groups.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | `string` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The account to opt-in |
| `assetIds` | `bigint`[] | The list of asset IDs to opt-in to |
| `options?` | `Omit`\<[`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams), ``"sender"``\> & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md) | Any parameters to control the transaction or execution of the transaction |

#### Returns

`Promise`\<[`BulkAssetOptInOutResult`](../interfaces/types_asset_manager.BulkAssetOptInOutResult.md)[]\>

An array of records matching asset ID to transaction ID of the opt in

**`Example`**

```typescript
// Basic example
algorand.asset.bulkOptIn("ACCOUNTADDRESS", [12345n, 67890n])
// With configuration
algorand.asset.bulkOptIn("ACCOUNTADDRESS", [12345n, 67890n], { maxFee: (1000).microAlgos(), suppressLog: true })
```

#### Defined in

[src/types/asset-manager.ts:244](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L244)

___

### bulkOptOut

▸ **bulkOptOut**(`account`, `assetIds`, `options?`): `Promise`\<[`BulkAssetOptInOutResult`](../interfaces/types_asset_manager.BulkAssetOptInOutResult.md)[]\>

Opt an account out of a list of Algorand Standard Assets.

Transactions will be sent in batches of 16 as transaction groups.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | `string` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The account to opt-in |
| `assetIds` | `bigint`[] | The list of asset IDs to opt-out of |
| `options?` | `Omit`\<[`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams), ``"sender"``\> & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md) & \{ `ensureZeroBalance?`: `boolean`  } | Any parameters to control the transaction or execution of the transaction |

#### Returns

`Promise`\<[`BulkAssetOptInOutResult`](../interfaces/types_asset_manager.BulkAssetOptInOutResult.md)[]\>

An array of records matching asset ID to transaction ID of the opt in

**`Example`**

```typescript
// Basic example
algorand.asset.bulkOptOut("ACCOUNTADDRESS", [12345n, 67890n])
// With configuration
algorand.asset.bulkOptOut("ACCOUNTADDRESS", [12345n, 67890n], { ensureZeroBalance: true, maxFee: (1000).microAlgos(), suppressLog: true })
```

#### Defined in

[src/types/asset-manager.ts:296](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L296)

___

### getAccountInformation

▸ **getAccountInformation**(`sender`, `assetId`): `Promise`\<[`AccountAssetInformation`](../modules/types_account.md#accountassetinformation)\>

Returns the given sender account's asset holding for a given asset.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sender` | `string` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The address of the sender/account to look up |
| `assetId` | `bigint` | The ID of the asset to return a holding for |

#### Returns

`Promise`\<[`AccountAssetInformation`](../modules/types_account.md#accountassetinformation)\>

The account asset holding information

**`Example`**

```typescript
const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
const assetId = 123345n;
const accountInfo = await algorand.asset.getAccountInformation(address, assetId);
```

[Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/#get-v2accountsaddressassetsasset-id)

#### Defined in

[src/types/asset-manager.ts:214](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L214)

___

### getById

▸ **getById**(`assetId`): `Promise`\<[`AssetInformation`](../interfaces/types_asset_manager.AssetInformation.md)\>

Returns the current asset information for the asset with the given ID.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `assetId` | `bigint` | The ID of the asset |

#### Returns

`Promise`\<[`AssetInformation`](../interfaces/types_asset_manager.AssetInformation.md)\>

The asset information

**`Example`**

```typescript
const assetInfo = await assetManager.getById(12353n);
```

#### Defined in

[src/types/asset-manager.ts:176](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L176)
