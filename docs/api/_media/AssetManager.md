[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/asset-manager](../README.md) / AssetManager

# Class: AssetManager

Defined in: [src/types/asset-manager.ts:139](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L139)

Allows management of asset information.

## Constructors

### Constructor

> **new AssetManager**(`algod`, `newGroup`): `AssetManager`

Defined in: [src/types/asset-manager.ts:152](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L152)

Create a new asset manager.

#### Parameters

##### algod

[`AlgodClient`](../../../Subpaths/algod-client/classes/AlgodClient.md)

An algod client

##### newGroup

(`config?`) => [`TransactionComposer`](../../composer/classes/TransactionComposer.md)

A function that creates a new `TransactionComposer` transaction group

#### Returns

`AssetManager`

#### Example

```typescript
const assetManager = new AssetManager(algod, () => new TransactionComposer({algod, () => signer, () => suggestedParams}))
```

## Methods

### bulkOptIn()

> **bulkOptIn**(`account`, `assetIds`, `options?`): `Promise`\<[`BulkAssetOptInOutResult`](../interfaces/BulkAssetOptInOutResult.md)[]\>

Defined in: [src/types/asset-manager.ts:229](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L229)

Opt an account in to a list of Algorand Standard Assets.

Transactions will be sent in batches of 16 as transaction groups.

#### Parameters

##### account

The account to opt-in

`string` | [`Address`](../../../algokit-utils/classes/Address.md)

##### assetIds

`bigint`[]

The list of asset IDs to opt-in to

##### options?

`Omit`\<[`CommonTransactionParams`](../../composer/type-aliases/CommonTransactionParams.md), `"sender"`\> & [`SendParams`](../../transaction/interfaces/SendParams.md)

Any parameters to control the transaction or execution of the transaction

#### Returns

`Promise`\<[`BulkAssetOptInOutResult`](../interfaces/BulkAssetOptInOutResult.md)[]\>

An array of records matching asset ID to transaction ID of the opt in

#### Example

```ts
// Opt an account into multiple assets at once
const assetIds = [dummyAssetId]
await algorand.asset.bulkOptIn(secondAccount, assetIds)
```

#### See

[Full working example](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.asset.spec.ts)

***

### bulkOptOut()

> **bulkOptOut**(`account`, `assetIds`, `options?`): `Promise`\<[`BulkAssetOptInOutResult`](../interfaces/BulkAssetOptInOutResult.md)[]\>

Defined in: [src/types/asset-manager.ts:275](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L275)

Opt an account out of a list of Algorand Standard Assets.

Transactions will be sent in batches of 16 as transaction groups.

#### Parameters

##### account

The account to opt-in

`string` | [`Address`](../../../algokit-utils/classes/Address.md)

##### assetIds

`bigint`[]

The list of asset IDs to opt-out of

##### options?

`Omit`\<[`CommonTransactionParams`](../../composer/type-aliases/CommonTransactionParams.md), `"sender"`\> & [`SendParams`](../../transaction/interfaces/SendParams.md) & `object`

Any parameters to control the transaction or execution of the transaction

#### Returns

`Promise`\<[`BulkAssetOptInOutResult`](../interfaces/BulkAssetOptInOutResult.md)[]\>

An array of records matching asset ID to transaction ID of the opt in

#### Example

```ts
// Opt an account out of multiple assets at once
await algorand.asset.bulkOptOut(secondAccount, assetIds)
```

#### See

[Full working example](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.asset.spec.ts)

***

### getAccountInformation()

> **getAccountInformation**(`sender`, `assetId`): `Promise`\<[`AccountAssetInformation`](../../account/type-aliases/AccountAssetInformation.md)\>

Defined in: [src/types/asset-manager.ts:205](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L205)

Returns the given sender account's asset holding for a given asset.

#### Parameters

##### sender

The address of the sender/account to look up

`string` | [`Address`](../../../algokit-utils/classes/Address.md)

##### assetId

`bigint`

The ID of the asset to return a holding for

#### Returns

`Promise`\<[`AccountAssetInformation`](../../account/type-aliases/AccountAssetInformation.md)\>

The account asset holding information

#### Example

```typescript
const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
const assetId = 123345n;
const accountInfo = await assetManager.getAccountInformation(address, assetId);
```

[Response data schema details](https://dev.algorand.co/reference/rest-apis/algod/#accountassetinformation)

***

### getById()

> **getById**(`assetId`): `Promise`\<[`AssetInformation`](../interfaces/AssetInformation.md)\>

Defined in: [src/types/asset-manager.ts:167](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L167)

Returns the current asset information for the asset with the given ID.

#### Parameters

##### assetId

`bigint`

The ID of the asset

#### Returns

`Promise`\<[`AssetInformation`](../interfaces/AssetInformation.md)\>

The asset information

#### Example

```ts
// Get asset information by ID
const assetData = await algorand.asset.getById(result.assetId)

// Access asset properties
const creator = assetData.creator
const total = assetData.total
const decimals = assetData.decimals
```

#### See

[Full working example](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.asset.spec.ts)
