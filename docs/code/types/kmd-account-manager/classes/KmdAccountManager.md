[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/kmd-account-manager](../README.md) / KmdAccountManager

# Class: KmdAccountManager

Defined in: [src/types/kmd-account-manager.ts:10](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/kmd-account-manager.ts#L10)

Provides abstractions over a [KMD](https://github.com/algorand/go-algorand/blob/master/daemon/kmd/README.md) instance
that makes it easier to get and manage accounts using KMD.

## Constructors

### Constructor

> **new KmdAccountManager**(`clientManager`): `KmdAccountManager`

Defined in: [src/types/kmd-account-manager.ts:18](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/kmd-account-manager.ts#L18)

Create a new KMD manager.

#### Parameters

##### clientManager

[`ClientManager`](../../client-manager/classes/ClientManager.md)

A ClientManager client to use for algod and kmd clients

#### Returns

`KmdAccountManager`

## Methods

### getLocalNetDispenserAccount()

> **getLocalNetDispenserAccount**(): `Promise`\<[`TransactionSignerAccount`](../../account/interfaces/TransactionSignerAccount.md) & `object`\>

Defined in: [src/types/kmd-account-manager.ts:186](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/kmd-account-manager.ts#L186)

Returns an Algorand account with private key loaded for the default LocalNet dispenser account (that can be used to fund other accounts).

#### Returns

`Promise`\<[`TransactionSignerAccount`](../../account/interfaces/TransactionSignerAccount.md) & `object`\>

The default LocalNet dispenser account

#### Example

```typescript
const dispenser = await kmdAccountManager.getLocalNetDispenserAccount()
```

***

### getOrCreateWalletAccount()

> **getOrCreateWalletAccount**(`name`, `fundWith?`): `Promise`\<[`TransactionSignerAccount`](../../account/interfaces/TransactionSignerAccount.md) & `object`\>

Defined in: [src/types/kmd-account-manager.ts:135](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/kmd-account-manager.ts#L135)

Gets an account with private key loaded from a KMD wallet of the given name, or alternatively creates one with funds in it via a KMD wallet of the given name.

This is useful to get idempotent accounts from LocalNet without having to specify the private key (which will change when resetting the LocalNet).

This significantly speeds up local dev time and improves experience since you can write code that *just works* first go without manual config in a fresh LocalNet.

If this is used via `mnemonicAccountFromEnvironment`, then you can even use the same code that runs on production without changes for local development!

#### Parameters

##### name

`string`

The name of the wallet to retrieve / create

##### fundWith?

[`AlgoAmount`](../../amount/classes/AlgoAmount.md)

The number of Algo to fund the account with when it gets created, if not specified then 1000 ALGO will be funded from the dispenser account

#### Returns

`Promise`\<[`TransactionSignerAccount`](../../account/interfaces/TransactionSignerAccount.md) & `object`\>

An Algorand account with private key loaded - either one that already existed in the given KMD wallet, or a new one that is funded for you

#### Example

```typescript
// Idempotently get (if exists) or create (if it doesn't exist yet) an account by name using KMD
// if creating it then fund it with 2 ALGO from the default dispenser account
const newAccount = await kmdAccountManager.getOrCreateWalletAccount('account1', (2).algo())
// This will return the same account as above since the name matches
const existingAccount = await kmdAccountManager.getOrCreateWalletAccount('account1')
```

***

### getWalletAccount()

> **getWalletAccount**(`walletName`, `predicate?`, `sender?`): `Promise`\<`undefined` \| [`TransactionSignerAccount`](../../account/interfaces/TransactionSignerAccount.md) & `object`\>

Defined in: [src/types/kmd-account-manager.ts:62](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/kmd-account-manager.ts#L62)

Returns an Algorand signing account with private key loaded from the given KMD wallet (identified by name).

#### Parameters

##### walletName

`string`

The name of the wallet to retrieve an account from

##### predicate?

(`account`) => `boolean`

An optional filter to use to find the account (otherwise it will return a random account from the wallet)

##### sender?

The optional sender address to use this signer for (aka a rekeyed account)

`string` | `Address`

#### Returns

`Promise`\<`undefined` \| [`TransactionSignerAccount`](../../account/interfaces/TransactionSignerAccount.md) & `object`\>

The signing account (with private key loaded) or undefined if no matching wallet or account was found

#### Example

```typescript
const defaultDispenserAccount = await kmdAccountManager.getWalletAccount(
  'unencrypted-default-wallet',
  a => a.status !== 'Offline' && a.amount > 1_000_000_000
)
```

***

### kmd()

> **kmd**(): `Promise`\<`KmdClient`\>

Defined in: [src/types/kmd-account-manager.ts:27](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/kmd-account-manager.ts#L27)

#### Returns

`Promise`\<`KmdClient`\>
