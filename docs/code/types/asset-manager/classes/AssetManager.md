[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/asset-manager](../README.md) / AssetManager

# Class: AssetManager

Defined in: [src/types/asset-manager.ts:138](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L138)

Allows management of asset information.

## Constructors

### Constructor

> **new AssetManager**(`algod`, `newGroup`): `AssetManager`

Defined in: [src/types/asset-manager.ts:151](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L151)

Create a new asset manager.

#### Parameters

##### algod

`AlgodClient`

An algod client

##### newGroup

() => [`TransactionComposer`](../../composer/classes/TransactionComposer.md)

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

Defined in: [src/types/asset-manager.ts:233](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L233)

Opt an account in to a list of Algorand Standard Assets.

Transactions will be sent in batches of 16 as transaction groups.

#### Parameters

##### account

The account to opt-in

`string` | `Address`

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

```typescript
// Basic example
assetManager.bulkOptIn("ACCOUNTADDRESS", [12345n, 67890n])
// With configuration
assetManager.bulkOptIn("ACCOUNTADDRESS", [12345n, 67890n], { maxFee: (1000).microAlgo(), suppressLog: true })
```

***

### bulkOptOut()

> **bulkOptOut**(`account`, `assetIds`, `options?`): `Promise`\<[`BulkAssetOptInOutResult`](../interfaces/BulkAssetOptInOutResult.md)[]\>

Defined in: [src/types/asset-manager.ts:283](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L283)

Opt an account out of a list of Algorand Standard Assets.

Transactions will be sent in batches of 16 as transaction groups.

#### Parameters

##### account

The account to opt-in

`string` | `Address`

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

```typescript
// Basic example
assetManager.bulkOptOut("ACCOUNTADDRESS", [12345n, 67890n])
// With configuration
assetManager.bulkOptOut("ACCOUNTADDRESS", [12345n, 67890n], { ensureZeroBalance: true, maxFee: (1000).microAlgo(), suppressLog: true })
```

***

### getAccountInformation()

> **getAccountInformation**(`sender`, `assetId`): `Promise`\<[`AccountAssetInformation`](../../account/type-aliases/AccountAssetInformation.md)\>

Defined in: [src/types/asset-manager.ts:205](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L205)

Returns the given sender account's asset holding for a given asset.

#### Parameters

##### sender

The address of the sender/account to look up

`string` | `Address`

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

```typescript
const assetInfo = await assetManager.getById(12353n);
```
