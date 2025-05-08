[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / randomAccount

# Function: ~~randomAccount()~~

> **randomAccount**(): `Account`

Defined in: [src/account/account.ts:60](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/account/account.ts#L60)

## Returns

`Account`

## Deprecated

Use `algorand.account.random()` or `algosdk.generateAccount()` instead.

Returns a new, random Algorand account with secret key loaded.

This is a wrapper around algosdk.generateAccount to provide a more friendly/obvious name.
