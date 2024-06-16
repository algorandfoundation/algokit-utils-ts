[@algorandfoundation/algokit-utils](../README.md) / [types/asset-manager](../modules/types_asset_manager.md) / AssetManager

# Class: AssetManager

[types/asset-manager](../modules/types_asset_manager.md).AssetManager

Allows management of asset information.

## Table of contents

### Constructors

- [constructor](types_asset_manager.AssetManager.md#constructor)

### Properties

- [\_clientManager](types_asset_manager.AssetManager.md#_clientmanager)

### Methods

- [getById](types_asset_manager.AssetManager.md#getbyid)

## Constructors

### constructor

• **new AssetManager**(`clientManager`): [`AssetManager`](types_asset_manager.AssetManager.md)

Create a new asset manager.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `clientManager` | [`ClientManager`](types_client_manager.ClientManager.md) | The ClientManager client to use for algod client |

#### Returns

[`AssetManager`](types_asset_manager.AssetManager.md)

**`Example`**

```typescript
const assetManager = new AssetManager(clientManager)
```

#### Defined in

[src/types/asset-manager.ts:137](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L137)

## Properties

### \_clientManager

• `Private` **\_clientManager**: [`ClientManager`](types_client_manager.ClientManager.md)

#### Defined in

[src/types/asset-manager.ts:127](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L127)

## Methods

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

[src/types/asset-manager.ts:152](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L152)
