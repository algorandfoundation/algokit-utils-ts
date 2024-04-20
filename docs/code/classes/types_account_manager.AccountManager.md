[@algorandfoundation/algokit-utils](../README.md) / [types/account-manager](../modules/types_account_manager.md) / AccountManager

# Class: AccountManager

[types/account-manager](../modules/types_account_manager.md).AccountManager

Creates and keeps track of signing accounts that can sign transactions for a sending address.

## Table of contents

### Constructors

- [constructor](types_account_manager.AccountManager.md#constructor)

### Properties

- [\_accounts](types_account_manager.AccountManager.md#_accounts)
- [\_clientManager](types_account_manager.AccountManager.md#_clientmanager)
- [\_defaultSigner](types_account_manager.AccountManager.md#_defaultsigner)

### Methods

- [dispenser](types_account_manager.AccountManager.md#dispenser)
- [fromEnvironment](types_account_manager.AccountManager.md#fromenvironment)
- [fromKmd](types_account_manager.AccountManager.md#fromkmd)
- [fromMnemonic](types_account_manager.AccountManager.md#frommnemonic)
- [getAccount](types_account_manager.AccountManager.md#getaccount)
- [getAssetInformation](types_account_manager.AccountManager.md#getassetinformation)
- [getInformation](types_account_manager.AccountManager.md#getinformation)
- [getSigner](types_account_manager.AccountManager.md#getsigner)
- [localNetDispenser](types_account_manager.AccountManager.md#localnetdispenser)
- [logicsig](types_account_manager.AccountManager.md#logicsig)
- [multisig](types_account_manager.AccountManager.md#multisig)
- [random](types_account_manager.AccountManager.md#random)
- [setDefaultSigner](types_account_manager.AccountManager.md#setdefaultsigner)
- [setSigner](types_account_manager.AccountManager.md#setsigner)
- [setSignerFromAccount](types_account_manager.AccountManager.md#setsignerfromaccount)
- [signerAccount](types_account_manager.AccountManager.md#signeraccount)

## Constructors

### constructor

• **new AccountManager**(`clientManager`): [`AccountManager`](types_account_manager.AccountManager.md)

Create a new account manager.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `clientManager` | [`ClientManager`](types_client_manager.ClientManager.md) | The ClientManager client to use for algod and kmd clients |

#### Returns

[`AccountManager`](types_account_manager.AccountManager.md)

#### Defined in

[src/types/account-manager.ts:31](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L31)

## Properties

### \_accounts

• `Private` **\_accounts**: `Object` = `{}`

#### Index signature

▪ [address: `string`]: [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md)

#### Defined in

[src/types/account-manager.ts:24](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L24)

___

### \_clientManager

• `Private` **\_clientManager**: [`ClientManager`](types_client_manager.ClientManager.md)

#### Defined in

[src/types/account-manager.ts:23](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L23)

___

### \_defaultSigner

• `Private` `Optional` **\_defaultSigner**: `TransactionSigner`

#### Defined in

[src/types/account-manager.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L25)

## Methods

### dispenser

▸ **dispenser**(): `Promise`\<[`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: `default` \| [`SigningAccount`](types_account.SigningAccount.md)  }\>

Returns an account (with private key loaded) that can act as a dispenser.

#### Returns

`Promise`\<[`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: `default` \| [`SigningAccount`](types_account.SigningAccount.md)  }\>

The account

**`Example`**

```typescript
const account = await account.dispenser()
```
If running on LocalNet then it will return the default dispenser account automatically,
 otherwise it will load the account mnemonic stored in process.env.DISPENSER_MNEMONIC.

#### Defined in

[src/types/account-manager.ts:274](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L274)

___

### fromEnvironment

▸ **fromEnvironment**(`name`, `fundWith?`): `Promise`\<[`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: `default` \| [`SigningAccount`](types_account.SigningAccount.md)  }\>

Tracks and returns an Algorand account with private key loaded by convention from environment variables based on the given name identifier.

Note: This function expects to run in a Node.js environment.

## Convention:
* **Non-LocalNet:** will load process.env['{NAME}_MNEMONIC'] as a mnemonic secret; **Note: Be careful how the mnemonic is handled**,
 never commit it into source control and ideally load it via a secret storage service rather than the file system.
  If process.env['{NAME}_SENDER'] is defined then it will use that for the sender address (i.e. to support rekeyed accounts)
* **LocalNet:** will load the account from a KMD wallet called {NAME} and if that wallet doesn't exist it will create it and fund the account for you

This allows you to write code that will work seamlessly in production and local development (LocalNet) without manual config locally (including when you reset the LocalNet).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name identifier of the account |
| `fundWith?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The optional amount to fund the account with when it gets created (when targeting LocalNet), if not specified then 1000 Algos will be funded from the dispenser account |

#### Returns

`Promise`\<[`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: `default` \| [`SigningAccount`](types_account.SigningAccount.md)  }\>

The account

**`Example`**

If you have a mnemonic secret loaded into `process.env.MY_ACCOUNT_MNEMONIC` then you can call the following to get that private key loaded into an account object:
```typescript
const account = await account.fromEnvironment('MY_ACCOUNT', algod)
```

If that code runs against LocalNet then a wallet called `MY_ACCOUNT` will automatically be created with an account that is automatically funded with 1000 (default) ALGOs from the default LocalNet dispenser.
If not running against LocalNet then it will use proces.env.MY_ACCOUNT_MNEMONIC as the private key and (if present) process.env.MY_ACCOUNT_SENDER as the sender address.

#### Defined in

[src/types/account-manager.ts:189](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L189)

___

### fromKmd

▸ **fromKmd**(`name`, `predicate?`, `sender?`): `Promise`\<[`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: `default` \| [`SigningAccount`](types_account.SigningAccount.md)  }\>

Tracks and returns an Algorand account with private key loaded from the given KMD wallet (identified by name).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the wallet to retrieve an account from |
| `predicate?` | (`account`: `Record`\<`string`, `any`\>) => `boolean` | An optional filter to use to find the account (otherwise it will return a random account from the wallet) |
| `sender?` | `string` | The optional sender address to use this signer for (aka a rekeyed account) |

#### Returns

`Promise`\<[`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: `default` \| [`SigningAccount`](types_account.SigningAccount.md)  }\>

The account

**`Example`**

```typescript
const defaultDispenserAccount = await account.fromKmd('unencrypted-default-wallet',
  a => a.status !== 'Offline' && a.amount > 1_000_000_000
)
```

#### Defined in

[src/types/account-manager.ts:208](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L208)

___

### fromMnemonic

▸ **fromMnemonic**(`mnemonicSecret`, `sender?`): [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: `default` \| [`SigningAccount`](types_account.SigningAccount.md)  }

Tracks and returns an Algorand account with secret key loaded (i.e. that can sign transactions) by taking the mnemonic secret.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mnemonicSecret` | `string` | The mnemonic secret representing the private key of an account; **Note: Be careful how the mnemonic is handled**, never commit it into source control and ideally load it from the environment (ideally via a secret storage service) rather than the file system. |
| `sender?` | `string` | The optional sender address to use this signer for (aka a rekeyed account) |

#### Returns

[`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: `default` \| [`SigningAccount`](types_account.SigningAccount.md)  }

The account

**`Example`**

```typescript
const account = await account.fromMnemonic("mnemonic secret ...")
const rekeyedAccount = await account.fromMnemonic("mnemonic secret ...", "SENDERADDRESS...")
```

#### Defined in

[src/types/account-manager.ts:157](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L157)

___

### getAccount

▸ **getAccount**(`sender`): [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md)

Returns the `TransactionSignerAccount` for the given sender address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sender` | `string` | The sender address |

#### Returns

[`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md)

The `TransactionSignerAccount` or throws an error if not found

#### Defined in

[src/types/account-manager.ts:102](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L102)

___

### getAssetInformation

▸ **getAssetInformation**(`sender`, `assetId`): `Promise`\<[`AccountAssetInformation`](../modules/types_account.md#accountassetinformation)\>

Returns the given sender account's asset holding for a given asset.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sender` | `string` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The address of the sender/account to look up |
| `assetId` | `number` \| `bigint` | The ID of the asset to return a holding for |

#### Returns

`Promise`\<[`AccountAssetInformation`](../modules/types_account.md#accountassetinformation)\>

The account asset holding information

**`Example`**

```typescript
const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
const assetId = 123345;
const accountInfo = await accountManager.getAccountAssetInformation(address, assetId);
```

[Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/#get-v2accountsaddressassetsasset-id)

#### Defined in

[src/types/account-manager.ts:140](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L140)

___

### getInformation

▸ **getInformation**(`sender`): `Promise`\<[`AccountInformation`](../modules/types_account.md#accountinformation)\>

Returns the given sender account's current status, balance and spendable amounts.

[Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/#get-v2accountsaddress)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sender` | `string` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The account / address to look up |

#### Returns

`Promise`\<[`AccountInformation`](../modules/types_account.md#accountinformation)\>

The account information

**`Example`**

```typescript
const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
const accountInfo = await accountManager.getInformation(address);
```

#### Defined in

[src/types/account-manager.ts:121](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L121)

___

### getSigner

▸ **getSigner**(`sender`): `TransactionSigner`

Returns the `TransactionSigner` for the given sender address.

If no signer has been registered for that address then the default signer is used if registered.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sender` | `string` | The sender address |

#### Returns

`TransactionSigner`

The `TransactionSigner` or throws an error if not found

#### Defined in

[src/types/account-manager.ts:91](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L91)

___

### localNetDispenser

▸ **localNetDispenser**(): `Promise`\<[`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: `default`  }\>

Returns an Algorand account with private key loaded for the default LocalNet dispenser account (that can be used to fund other accounts).

#### Returns

`Promise`\<[`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: `default`  }\>

The account

**`Example`**

```typescript
const account = await account.localNetDispenser()
```

#### Defined in

[src/types/account-manager.ts:287](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L287)

___

### logicsig

▸ **logicsig**(`program`, `args?`): [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: `LogicSigAccount`  }

Tracks and returns an account that represents a logic signature.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `program` | `Uint8Array` | The bytes that make up the compiled logic signature |
| `args?` | `Uint8Array`[] | The (binary) arguments to pass into the logic signature |

#### Returns

[`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: `LogicSigAccount`  }

A logic signature account wrapper

**`Example`**

```typescript
const account = await account.logicsig(program, [new Uint8Array(3, ...)])
```

#### Defined in

[src/types/account-manager.ts:246](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L246)

___

### multisig

▸ **multisig**(`multisigParams`, `signingAccounts`): [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: [`MultisigAccount`](types_account.MultisigAccount.md)  }

Tracks and returns an account that supports partial or full multisig signing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `multisigParams` | `MultisigMetadata` | The parameters that define the multisig account |
| `signingAccounts` | (`default` \| [`SigningAccount`](types_account.SigningAccount.md))[] | The signers that are currently present |

#### Returns

[`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: [`MultisigAccount`](types_account.MultisigAccount.md)  }

A multisig account wrapper

**`Example`**

```typescript
const account = await account.multisig({version: 1, threshold: 1, addrs: ["ADDRESS1...", "ADDRESS2..."]},
 await account.fromEnvironment('ACCOUNT1'))
```

#### Defined in

[src/types/account-manager.ts:231](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L231)

___

### random

▸ **random**(): [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: `default`  }

Tracks and returns a new, random Algorand account with secret key loaded.

#### Returns

[`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: `default`  }

The account

**`Example`**

```typescript
const account = await account.random()
```

#### Defined in

[src/types/account-manager.ts:259](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L259)

___

### setDefaultSigner

▸ **setDefaultSigner**(`signer`): [`AccountManager`](types_account_manager.AccountManager.md)

Sets the default signer to use if no other signer is specified.

If this isn't set an a transaction needs signing for a given sender
then an error will be thrown from `getSigner` / `getAccount`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The signer to use, either a `TransactionSigner` or a `TransactionSignerAccount` |

#### Returns

[`AccountManager`](types_account_manager.AccountManager.md)

The `AccountManager` so method calls can be chained

#### Defined in

[src/types/account-manager.ts:43](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L43)

___

### setSigner

▸ **setSigner**(`sender`, `signer`): [`AccountManager`](types_account_manager.AccountManager.md)

Tracks the given account for later signing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sender` | `string` | The sender address to use this signer for |
| `signer` | `TransactionSigner` | The signer to sign transactions with for the given sender |

#### Returns

[`AccountManager`](types_account_manager.AccountManager.md)

The `AccountManager` instance for method chaining

#### Defined in

[src/types/account-manager.ts:78](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L78)

___

### setSignerFromAccount

▸ **setSignerFromAccount**(`account`): [`AccountManager`](types_account_manager.AccountManager.md)

Tracks the given account for later signing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom) | The account to register, which can be a `TransactionSignerAccount` or any `SendTransactionFrom` compatible account object |

#### Returns

[`AccountManager`](types_account_manager.AccountManager.md)

The `AccountManager` instance for method chaining

#### Defined in

[src/types/account-manager.ts:67](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L67)

___

### signerAccount

▸ **signerAccount**\<`T`\>(`account`): [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: `T`  }

Records the given account against the address of the account for later
retrieval and returns a `TransactionSignerAccount`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `account` | `T` |

#### Returns

[`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: `T`  }

#### Defined in

[src/types/account-manager.ts:52](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L52)
