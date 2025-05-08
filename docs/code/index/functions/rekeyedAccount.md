[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / rekeyedAccount

# Function: ~~rekeyedAccount()~~

> **rekeyedAccount**(`signer`, `sender`): [`SigningAccount`](../../types/account/classes/SigningAccount.md)

Defined in: [src/account/account.ts:36](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/account/account.ts#L36)

## Parameters

### signer

`Account`

The account, with private key loaded, that is signing

### sender

`string`

The address of the rekeyed account that will act as a sender

## Returns

[`SigningAccount`](../../types/account/classes/SigningAccount.md)

The SigningAccount wrapper

## Deprecated

Use `algorand.account.rekeyed(sender, account)` or `new SigningAccount(account, sender)` instead.

Returns an account wrapper that supports a rekeyed account.
