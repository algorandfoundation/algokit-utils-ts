[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getDispenserAccount

# Function: ~~getDispenserAccount()~~

> **getDispenserAccount**(`algod`, `kmd?`): `Promise`\<`Address` & [`TransactionSignerAccount`](../../types/account/interfaces/TransactionSignerAccount.md) & `object`\>

Defined in: [src/account/get-dispenser-account.ts:19](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/account/get-dispenser-account.ts#L19)

## Parameters

### algod

`AlgodClient`

An algod client

### kmd?

`KmdClient`

A KMD client, if not specified then a default KMD client will be loaded from environment variables

## Returns

`Promise`\<`Address` & [`TransactionSignerAccount`](../../types/account/interfaces/TransactionSignerAccount.md) & `object`\>

## Deprecated

Use `algorand.account.dispenserFromEnvironment()` or `new AccountManager(clientManager).dispenserFromEnvironment()` instead

Returns an account (with private key loaded) that can act as a dispenser

If running on LocalNet then it will return the default dispenser account automatically,
 otherwise it will load the account mnemonic stored in process.env.DISPENSER_MNEMONIC
