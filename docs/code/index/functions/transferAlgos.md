[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / transferAlgos

# Function: ~~transferAlgos()~~

> **transferAlgos**(`transfer`, `algod`): `Promise`\<[`SendTransactionResult`](../../types/transaction/interfaces/SendTransactionResult.md)\>

Defined in: [src/transfer/transfer-algos.ts:22](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transfer/transfer-algos.ts#L22)

## Parameters

### transfer

[`AlgoTransferParams`](../../types/transfer/interfaces/AlgoTransferParams.md)

The transfer definition

### algod

`AlgodClient`

An algod client

## Returns

`Promise`\<[`SendTransactionResult`](../../types/transaction/interfaces/SendTransactionResult.md)\>

The transaction object and optionally the confirmation if it was sent to the chain (`skipSending` is `false` or unset)

## Deprecated

Use `algorand.send.payment()` / `algorand.createTransaction.payment()` instead

Transfer Algo between two accounts.

## Example

```typescript
await algokit.transferAlgos({ from, to, amount: algokit.algo(1) }, algod)
```
