[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / rekeyAccount

# Function: ~~rekeyAccount()~~

> **rekeyAccount**(`rekey`, `algod`): `Promise`\<[`SendTransactionResult`](../../types/transaction/interfaces/SendTransactionResult.md)\>

Defined in: [src/transfer/transfer.ts:125](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transfer/transfer.ts#L125)

## Parameters

### rekey

[`AlgoRekeyParams`](../../types/transfer/interfaces/AlgoRekeyParams.md)

The rekey definition

### algod

`AlgodClient`

An algod client

## Returns

`Promise`\<[`SendTransactionResult`](../../types/transaction/interfaces/SendTransactionResult.md)\>

The transaction object and optionally the confirmation if it was sent to the chain (`skipSending` is `false` or unset)

## Deprecated

Use `algorand.account.rekeyAccount()` instead

Rekey an account to a new address.

**Note:** Please be careful with this function and be sure to read the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying).

## Example

```typescript
await algokit.rekeyAccount({ from, rekeyTo }, algod)
```
