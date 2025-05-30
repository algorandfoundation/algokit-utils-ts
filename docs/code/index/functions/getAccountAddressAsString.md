[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getAccountAddressAsString

# Function: ~~getAccountAddressAsString()~~

> **getAccountAddressAsString**(`addressEncodedInB64`): `string`

Defined in: [src/account/account.ts:128](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/account/account.ts#L128)

## Parameters

### addressEncodedInB64

`string`

The base64 encoded version of the underlying byte array of the address public key

## Returns

`string`

## Deprecated

Use `algosdk.encodeAddress` instead.

Returns the string address of an Algorand account from a base64 encoded version of the underlying byte array of the address public key
