[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getOrCreateKmdWalletAccount

# Function: ~~getOrCreateKmdWalletAccount()~~

> **getOrCreateKmdWalletAccount**(`walletAccount`, `algod`, `kmdClient?`): `Promise`\<`Account`\>

Defined in: [src/localnet/get-or-create-kmd-wallet-account.ts:28](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/localnet/get-or-create-kmd-wallet-account.ts#L28)

## Parameters

### walletAccount

The wallet details with:
  * `name`: The name of the wallet to retrieve / create
  * `fundWith`: The number of Algo to fund the account with when it gets created, if not specified then 1000 ALGO will be funded from the dispenser account

#### fundWith?

[`AlgoAmount`](../../types/amount/classes/AlgoAmount.md)

#### name

`string`

### algod

`AlgodClient`

An algod client

### kmdClient?

`KmdClient`

A KMD client, if not specified then a default KMD client will be loaded from environment variables

## Returns

`Promise`\<`Account`\>

An Algorand account with private key loaded - either one that already existed in the given KMD wallet, or a new one that is funded for you

## Deprecated

use `algorand.account.kmd.getOrCreateWalletAccount(name, fundWith)` or `new KMDAccountManager(clientManager).getOrCreateWalletAccount(name, fundWith)` instead.

Gets an account with private key loaded from a KMD wallet of the given name, or alternatively creates one with funds in it via a KMD wallet of the given name.

This is useful to get idempotent accounts from LocalNet without having to specify the private key (which will change when resetting the LocalNet).

This significantly speeds up local dev time and improves experience since you can write code that *just works* first go without manual config in a fresh LocalNet.

If this is used via `mnemonicAccountFromEnvironment`, then you can even use the same code that runs on production without changes for local development!
