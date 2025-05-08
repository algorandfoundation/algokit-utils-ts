[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getLocalNetDispenserAccount

# Function: ~~getLocalNetDispenserAccount()~~

> **getLocalNetDispenserAccount**(`algod`, `kmd?`): `Promise`\<`Account`\>

Defined in: [src/localnet/get-localnet-dispenser-account.ts:15](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/localnet/get-localnet-dispenser-account.ts#L15)

## Parameters

### algod

`AlgodClient`

An algod client

### kmd?

`KmdClient`

A KMD client, if not specified then a default KMD client will be loaded from environment variables

## Returns

`Promise`\<`Account`\>

## Deprecated

Use `algorand.account.kmd.getLocalNetDispenserAccount()` instead.

Returns an Algorand account with private key loaded for the default LocalNet dispenser account (that can be used to fund other accounts)
