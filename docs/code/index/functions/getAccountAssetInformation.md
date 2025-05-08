[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getAccountAssetInformation

# Function: ~~getAccountAssetInformation()~~

> **getAccountAssetInformation**(`sender`, `assetId`, `algod`): `Promise`\<[`AccountAssetInformation`](../../types/account/type-aliases/AccountAssetInformation.md)\>

Defined in: [src/account/account.ts:201](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/account/account.ts#L201)

## Parameters

### sender

The address of the sender/account to look up

`string` | [`SendTransactionFrom`](../../types/transaction/type-aliases/SendTransactionFrom.md)

### assetId

The ID of the asset to return a holding for

`number` | `bigint`

### algod

`AlgodClient`

The algod instance

## Returns

`Promise`\<[`AccountAssetInformation`](../../types/account/type-aliases/AccountAssetInformation.md)\>

The account asset holding information

## Deprecated

Use `algorand.asset.getAccountInformation(sender, assetId)` or `new AssetManager(...).getAccountInformation(sender, assetId)` instead.

Returns the given sender account's asset holding for a given asset.

## Example

```typescript
const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
const assetId = 123345;
const accountInfo = await account.getAccountAssetInformation(address, assetId, algod);
```

[Response data schema details](https://dev.algorand.co/reference/rest-apis/algod/#accountassetinformation)
