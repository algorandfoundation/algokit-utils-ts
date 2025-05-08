[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / assetBulkOptOut

# Function: ~~assetBulkOptOut()~~

> **assetBulkOptOut**(`optOut`, `algod`): `Promise`\<`Record`\<`number`, `string`\>\>

Defined in: [src/asset.ts:157](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/asset.ts#L157)

## Parameters

### optOut

[`AssetBulkOptInOutParams`](../../types/asset/interfaces/AssetBulkOptInOutParams.md)

The bulk opt-out request.

### algod

`AlgodClient`

An instance of the Algodv2 client used to interact with the Algorand blockchain.

## Returns

`Promise`\<`Record`\<`number`, `string`\>\>

A record object containing asset IDs as keys and their corresponding transaction IDs as values.

## Deprecated

use `algorand.asset.bulkOptOut()` instead

Opt out of multiple assets in Algorand blockchain.

## Throws

If there is an error during the opt-out process.

## Example

```ts
algokit.bulkOptOut({ account: account, assetIds: [12345, 67890] }, algod)
```
