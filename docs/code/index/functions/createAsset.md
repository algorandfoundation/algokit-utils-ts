[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / createAsset

# Function: ~~createAsset()~~

> **createAsset**(`create`, `algod`): `Promise`\<[`SendTransactionResult`](../../types/transaction/interfaces/SendTransactionResult.md) & `object`\>

Defined in: [src/asset.ts:23](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/asset.ts#L23)

## Parameters

### create

[`CreateAssetParams`](../../types/asset/interfaces/CreateAssetParams.md)

The asset creation definition

### algod

`AlgodClient`

An algod client

## Returns

`Promise`\<[`SendTransactionResult`](../../types/transaction/interfaces/SendTransactionResult.md) & `object`\>

The transaction object and optionally the confirmation if it was sent to the chain (`skipSending` is `false` or unset)

## Deprecated

use `algorand.send.assetCreate()` / `algorand.createTransaction.assetCreate()` instead

Create an Algorand Standard Asset (ASA).

## Example

```typescript
await algokit.createAsset({ creator: account, total: 1, decimals: 0, name: 'My asset' }, algod)
```
