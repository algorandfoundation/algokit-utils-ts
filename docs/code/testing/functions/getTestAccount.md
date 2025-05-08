[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [testing](../README.md) / getTestAccount

# Function: getTestAccount()

## Call Signature

> **getTestAccount**(`params`, `algod`, `kmd?`): `Promise`\<`Address` & `Account` & [`TransactionSignerAccount`](../../types/account/interfaces/TransactionSignerAccount.md)\>

Defined in: [src/testing/account.ts:21](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/account.ts#L21)

### Parameters

#### params

[`GetTestAccountParams`](../../types/testing/interfaces/GetTestAccountParams.md)

The config for the test account to generate

#### algod

`AlgodClient`

An algod client

#### kmd?

`KmdClient`

A KMD client, if not specified then a default KMD client will be loaded from environment variables and if not found fallback to the default LocalNet KMD client

### Returns

`Promise`\<`Address` & `Account` & [`TransactionSignerAccount`](../../types/account/interfaces/TransactionSignerAccount.md)\>

The account, with private key loaded

### Deprecated

Use `getTestAccount(params, algorandClient)` instead. The `algorandClient` object can be created using `AlgorandClient.fromClients({ algod, kmd })`.

Creates an ephemeral Algorand account for the purposes of testing.
Returns a newly created random test account that is funded from the dispenser
DO NOT USE THIS TO CREATE A MAINNET ACCOUNT!
Note: By default this will log the mnemonic of the account.

## Call Signature

> **getTestAccount**(`params`, `algorand`): `Promise`\<`Address` & `Account` & [`TransactionSignerAccount`](../../types/account/interfaces/TransactionSignerAccount.md)\>

Defined in: [src/testing/account.ts:35](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/account.ts#L35)

Creates an ephemeral Algorand account for the purposes of testing.
Returns a newly created random test account that is funded from the dispenser
DO NOT USE THIS TO CREATE A MAINNET ACCOUNT!
Note: By default this will log the mnemonic of the account.

### Parameters

#### params

[`GetTestAccountParams`](../../types/testing/interfaces/GetTestAccountParams.md)

The config for the test account to generate

#### algorand

[`AlgorandClient`](../../types/algorand-client/classes/AlgorandClient.md)

An AlgorandClient client

### Returns

`Promise`\<`Address` & `Account` & [`TransactionSignerAccount`](../../types/account/interfaces/TransactionSignerAccount.md)\>

The account, with private key loaded
