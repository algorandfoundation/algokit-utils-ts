[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / mnemonicAccountFromEnvironment

# Function: ~~mnemonicAccountFromEnvironment()~~

> **mnemonicAccountFromEnvironment**(`account`, `algod`, `kmdClient?`): `Promise`\<`Account` \| [`SigningAccount`](../../types/account/classes/SigningAccount.md)\>

Defined in: [src/account/account.ts:97](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/account/account.ts#L97)

## Parameters

### account

The details of the account to get, either the name identifier (string) or an object with:
  * `name`: string: The name identifier of the account
  * `fundWith`: The amount to fund the account with when it gets created (when targeting LocalNet), if not specified then 1000 ALGO will be funded from the dispenser account

`string` | \{ `fundWith?`: [`AlgoAmount`](../../types/amount/classes/AlgoAmount.md); `name`: `string`; \}

### algod

`AlgodClient`

An algod client

### kmdClient?

`KmdClient`

An optional KMD client to use to create an account (when targeting LocalNet), if not specified then a default KMD client will be loaded from environment variables

## Returns

`Promise`\<`Account` \| [`SigningAccount`](../../types/account/classes/SigningAccount.md)\>

The requested account with private key loaded from the environment variables or when targeting LocalNet from KMD (idempotently creating and funding the account)

## Deprecated

Use `algorand.account.fromEnvironment(name, fundWith)` or `new AccountManager(clientManager).fromEnvironment()` instead.

Returns an Algorand account with private key loaded by convention from environment variables based on the given name identifier.

Note: This function expects to run in a Node.js environment.

## Convention:
* **Non-LocalNet:** will load process.env['{NAME}_MNEMONIC'] as a mnemonic secret; **Note: Be careful how the mnemonic is handled**,
 never commit it into source control and ideally load it via a secret storage service rather than the file system.
  If process.env['{NAME}_SENDER'] is defined then it will use that for the sender address (i.e. to support rekeyed accounts)
* **LocalNet:** will load the account from a KMD wallet called {NAME} and if that wallet doesn't exist it will create it and fund the account for you

This allows you to write code that will work seamlessly in production and local development (LocalNet) without manual config locally (including when you reset the LocalNet).

## Example

If you have a mnemonic secret loaded into `process.env.MY_ACCOUNT_MNEMONIC` then you can call the following to get that private key loaded into an account object:
```typescript
const account = await mnemonicAccountFromEnvironment('MY_ACCOUNT', algod)
```

If that code runs against LocalNet then a wallet called `MY_ACCOUNT` will automatically be created with an account that is automatically funded with 1000 (default) ALGO from the default LocalNet dispenser.
If not running against LocalNet then it will use proces.env.MY_ACCOUNT_MNEMONIC as the private key and (if present) process.env.MY_ACCOUNT_SENDER as the sender address.
