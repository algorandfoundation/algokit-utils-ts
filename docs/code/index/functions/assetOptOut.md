[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / assetOptOut

# Function: ~~assetOptOut()~~

> **assetOptOut**(`optOut`, `algod`): `Promise`\<[`SendTransactionResult`](../../types/transaction/interfaces/SendTransactionResult.md)\>

Defined in: [src/asset.ts:98](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/asset.ts#L98)

## Parameters

### optOut

[`AssetOptOutParams`](../../types/asset/interfaces/AssetOptOutParams.md)

The opt-in definition

### algod

`AlgodClient`

An algod client

## Returns

`Promise`\<[`SendTransactionResult`](../../types/transaction/interfaces/SendTransactionResult.md)\>

The transaction object and optionally the confirmation if it was sent to the chain (`skipSending` is `false` or unset)

## Deprecated

use `algorand.send.assetOptOut()` / `algorand.createTransaction.assetOptOut()` instead

Opt-out an account from an asset.

## Example

```typescript
await algokit.assetOptOut({ account, assetId, assetCreatorAddress }, algod)
```
