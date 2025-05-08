[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / assetOptIn

# Function: ~~assetOptIn()~~

> **assetOptIn**(`optIn`, `algod`): `Promise`\<[`SendTransactionResult`](../../types/transaction/interfaces/SendTransactionResult.md)\>

Defined in: [src/asset.ts:67](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/asset.ts#L67)

## Parameters

### optIn

[`AssetOptInParams`](../../types/asset/interfaces/AssetOptInParams.md)

The opt-in definition

### algod

`AlgodClient`

An algod client

## Returns

`Promise`\<[`SendTransactionResult`](../../types/transaction/interfaces/SendTransactionResult.md)\>

The transaction object and optionally the confirmation if it was sent to the chain (`skipSending` is `false` or unset)

## Deprecated

use `algorand.send.assetOptIn()` / `algorand.createTransaction.assetOptIn()` instead

Opt-in an account to an asset.

## Example

```typescript
await algokit.assetOptIn({ account, assetId }, algod)
```
