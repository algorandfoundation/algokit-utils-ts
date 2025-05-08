[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / transferAsset

# Function: ~~transferAsset()~~

> **transferAsset**(`transfer`, `algod`): `Promise`\<[`SendTransactionResult`](../../types/transaction/interfaces/SendTransactionResult.md)\>

Defined in: [src/transfer/transfer.ts:90](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transfer/transfer.ts#L90)

## Parameters

### transfer

[`TransferAssetParams`](../../types/transfer/interfaces/TransferAssetParams.md)

The transfer definition

### algod

`AlgodClient`

An algod client

## Returns

`Promise`\<[`SendTransactionResult`](../../types/transaction/interfaces/SendTransactionResult.md)\>

The transaction object and optionally the confirmation if it was sent to the chain (`skipSending` is `false` or unset)

## Deprecated

Use `algorand.send.assetTransfer()` / `algorand.createTransaction.assetTransfer()` instead

Transfer asset between two accounts.

## Example

```typescript
await algokit.transferAsset({ from, to, assetId, amount }, algod)
```
