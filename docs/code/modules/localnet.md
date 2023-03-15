[@algorandfoundation/algokit-utils](../README.md) / localnet

# Module: localnet

## Table of contents

### Functions

- [getKmdWalletAccount](localnet.md#getkmdwalletaccount)
- [getLocalNetDispenserAccount](localnet.md#getlocalnetdispenseraccount)
- [getOrCreateKmdWalletAccount](localnet.md#getorcreatekmdwalletaccount)
- [isLocalNet](localnet.md#islocalnet)

## Functions

### getKmdWalletAccount

▸ **getKmdWalletAccount**(`walletAccount`, `algod`, `kmdClient?`): `Promise`<`Account` \| `undefined`\>

Returns an Algorand account with private key loaded from the given KMD wallet (identified by name).

**`See`**

**`Example`**

Get default funded account in a LocalNet

```
const defaultDispenserAccount = await getKmdWalletAccount(algod,
  'unencrypted-default-wallet',
  a => a.status !== 'Offline' && a.amount > 1_000_000_000
)
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `walletAccount` | `Object` | The details of the wallet, with: * `name`: The name of the wallet to retrieve an account from * `predicate`: An optional filter to use to find the account (otherwise it will return a random account from the wallet) |
| `walletAccount.name` | `string` | - |
| `walletAccount.predicate?` | (`account`: `Record`<`string`, `any`\>) => `boolean` | - |
| `algod` | `default` | An algod client |
| `kmdClient?` | `default` | A KMD client, if not specified then a default KMD client will be loaded from environment variables |

#### Returns

`Promise`<`Account` \| `undefined`\>

#### Defined in

[localnet.ts:90](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/localnet.ts#L90)

___

### getLocalNetDispenserAccount

▸ **getLocalNetDispenserAccount**(`algod`, `kmdClient?`): `Promise`<`Account`\>

Returns an Algorand account with private key loaded for the default LocalNet dispenser account (that can be used to fund other accounts)

**`See`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `algod` | `default` | An algod client |
| `kmdClient?` | `default` | A KMD client, if not specified then a default KMD client will be loaded from environment variables |

#### Returns

`Promise`<`Account`\>

#### Defined in

[localnet.ts:141](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/localnet.ts#L141)

___

### getOrCreateKmdWalletAccount

▸ **getOrCreateKmdWalletAccount**(`walletAccount`, `algod`, `kmdClient?`): `Promise`<`Account`\>

Gets an account with private key loaded from a KMD wallet of the given name, or alternatively creates one with funds in it via a KMD wallet of the given name.

This is useful to get idempotent accounts from a local sandbox without having to specify the private key (which will change when resetting the sandbox).

This significantly speeds up local dev time and improves experience since you can write code that *just works* first go without manual config in a fresh sandbox.

If this is used via

**`See`**

 - , then you can even use the same code that runs on production without changes for local development!
 - 
 - 

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `walletAccount` | `Object` | The wallet details with: * `name`: The name of the wallet to retrieve / create * `fundWith`: The number of Algos to fund the account with it it gets created, if not specified then 1000 Algos will be funded from the dispenser account |
| `walletAccount.fundWith?` | [`AlgoAmount`](../classes/algo_amount.AlgoAmount.md) | - |
| `walletAccount.name` | `string` | - |
| `algod` | `default` | An algod client |
| `kmdClient?` | `default` | A KMD client, if not specified then a default KMD client will be loaded from environment variables |

#### Returns

`Promise`<`Account`\>

An Algorand account with private key loaded - either one that already existed in the given KMD wallet, or a new one that is funded for you

#### Defined in

[localnet.ts:32](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/localnet.ts#L32)

___

### isLocalNet

▸ **isLocalNet**(`algod`): `Promise`<`boolean`\>

Returns true if the algod client is pointing to a LocalNet Algorand network

#### Parameters

| Name | Type |
| :------ | :------ |
| `algod` | `default` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[localnet.ts:9](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/localnet.ts#L9)
