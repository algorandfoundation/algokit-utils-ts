[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getAccountAddressAsUint8Array

# Function: ~~getAccountAddressAsUint8Array()~~

> **getAccountAddressAsUint8Array**(`account`): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [src/account/account.ts:117](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/account/account.ts#L117)

## Parameters

### account

Either an account (with private key loaded) or the string address of an account

`string` | [`SendTransactionFrom`](../../types/transaction/type-aliases/SendTransactionFrom.md)

## Returns

`Uint8Array`\<`ArrayBufferLike`\>

## Deprecated

Use `algosdk.decodeAddress` instead.

Returns an account's address as a byte array
