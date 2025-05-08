[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getKmdWalletAccount

# Function: ~~getKmdWalletAccount()~~

> **getKmdWalletAccount**(`walletAccount`, `algod`, `kmdClient?`): `Promise`\<`undefined` \| `Account`\>

Defined in: [src/localnet/get-kmd-wallet-account.ts:27](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/localnet/get-kmd-wallet-account.ts#L27)

## Parameters

### walletAccount

The details of the wallet, with:
  * `name`: The name of the wallet to retrieve an account from
  * `predicate`: An optional filter to use to find the account (otherwise it will return a random account from the wallet)

#### name

`string`

#### predicate?

(`account`) => `boolean`

### algod

`AlgodClient`

An algod client

### kmdClient?

`KmdClient`

A KMD client, if not specified then a default KMD client will be loaded from environment variables

## Returns

`Promise`\<`undefined` \| `Account`\>

## Deprecated

use `algorand.account.kmd.getWalletAccount(name, predicate)` or `new KMDAccountManager(clientManager).getWalletAccount(name, predicate)` instead.

Returns an Algorand account with private key loaded from the given KMD wallet (identified by name).

## Example

```typescript
const defaultDispenserAccount = await getKmdWalletAccount(algod,
  'unencrypted-default-wallet',
  a => a.status !== 'Offline' && a.amount > 1_000_000_000
)
```
