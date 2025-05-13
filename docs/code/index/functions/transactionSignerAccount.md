[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / transactionSignerAccount

# Function: ~~transactionSignerAccount()~~

> **transactionSignerAccount**(`signer`, `sender`): [`TransactionSignerAccount`](../../types/account/interfaces/TransactionSignerAccount.md)

Defined in: [src/account/account.ts:48](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/account/account.ts#L48)

## Parameters

### signer

`TransactionSigner`

The transaction signer

### sender

`string`

The address of sender account

## Returns

[`TransactionSignerAccount`](../../types/account/interfaces/TransactionSignerAccount.md)

The SigningAccount wrapper

## Deprecated

Use `algorand.account.getSigner(sender)` (after previously registering the signer with `setSigner`) or `{ addr: sender, signer }` instead.

Returns an account wrapper that supports a transaction signer with associated sender address.
