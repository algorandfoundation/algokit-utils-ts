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
- [\_kmdAccountManager](types_account_manager.AccountManager.md#_kmdaccountmanager)

### Accessors

- [kmd](types_account_manager.AccountManager.md#kmd)

### Methods

- [\_getComposer](types_account_manager.AccountManager.md#_getcomposer)
- [\_getEnsureFundedAmount](types_account_manager.AccountManager.md#_getensurefundedamount)
- [assetBulkOptIn](types_account_manager.AccountManager.md#assetbulkoptin)
- [assetBulkOptOut](types_account_manager.AccountManager.md#assetbulkoptout)
- [dispenserFromEnvironment](types_account_manager.AccountManager.md#dispenserfromenvironment)
- [ensureFunded](types_account_manager.AccountManager.md#ensurefunded)
- [ensureFundedFromEnvironment](types_account_manager.AccountManager.md#ensurefundedfromenvironment)
- [ensureFundedFromTestNetDispenserApi](types_account_manager.AccountManager.md#ensurefundedfromtestnetdispenserapi)
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
- [rekeyed](types_account_manager.AccountManager.md#rekeyed)
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

**`Example`**

```typescript
const accountManager = new AccountManager(clientManager)
```

#### Defined in

[src/types/account-manager.ts:63](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L63)

## Properties

### \_accounts

• `Private` **\_accounts**: `Object` = `{}`

#### Index signature

▪ [address: `string`]: [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md)

#### Defined in

[src/types/account-manager.ts:52](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L52)

___

### \_clientManager

• `Private` **\_clientManager**: [`ClientManager`](types_client_manager.ClientManager.md)

#### Defined in

[src/types/account-manager.ts:50](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L50)

___

### \_defaultSigner

• `Private` `Optional` **\_defaultSigner**: `TransactionSigner`

#### Defined in

[src/types/account-manager.ts:53](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L53)

___

### \_kmdAccountManager

• `Private` **\_kmdAccountManager**: [`KmdAccountManager`](types_kmd_account_manager.KmdAccountManager.md)

#### Defined in

[src/types/account-manager.ts:51](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L51)

## Accessors

### kmd

• `get` **kmd**(): [`KmdAccountManager`](types_kmd_account_manager.KmdAccountManager.md)

KMD account manager that allows you to easily get and create accounts using KMD.

#### Returns

[`KmdAccountManager`](types_kmd_account_manager.KmdAccountManager.md)

#### Defined in

[src/types/account-manager.ts:77](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L77)

## Methods

### \_getComposer

▸ **_getComposer**(`getSuggestedParams?`): [`default`](types_composer.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `getSuggestedParams?` | () => `Promise`\<`SuggestedParams`\> |

#### Returns

[`default`](types_composer.default.md)

#### Defined in

[src/types/account-manager.ts:68](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L68)

___

### \_getEnsureFundedAmount

▸ **_getEnsureFundedAmount**(`sender`, `minSpendingBalance`, `minFundingIncrement?`): `Promise`\<`undefined` \| [`AlgoAmount`](types_amount.AlgoAmount.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sender` | `string` |
| `minSpendingBalance` | [`AlgoAmount`](types_amount.AlgoAmount.md) |
| `minFundingIncrement?` | [`AlgoAmount`](types_amount.AlgoAmount.md) |

#### Returns

`Promise`\<`undefined` \| [`AlgoAmount`](types_amount.AlgoAmount.md)\>

#### Defined in

[src/types/account-manager.ts:593](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L593)

___

### assetBulkOptIn

▸ **assetBulkOptIn**(`account`, `assetIds`, `options?`): `Promise`\<[`BulkAssetOptInOutResult`](../interfaces/types_account_manager.BulkAssetOptInOutResult.md)[]\>

Opt an account in to a list of Algorand Standard Assets.

Transactions will be sent in batches of 16 as transaction groups.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | `string` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The account to opt-in |
| `assetIds` | (`number` \| `bigint`)[] | The list of asset IDs to opt-in to |
| `options?` | `Omit`\<[`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams), ``"sender"``\> & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md) | Any parameters to control the transaction or execution of the transaction |

#### Returns

`Promise`\<[`BulkAssetOptInOutResult`](../interfaces/types_account_manager.BulkAssetOptInOutResult.md)[]\>

An array of records matching asset ID to transaction ID of the opt in

**`Example`**

```typescript
// Basic example
algorand.account.assetBulkOptIn("ACCOUNTADDRESS", [12345, 67890])
// With configuration
algorand.account.assetBulkOptIn("ACCOUNTADDRESS", [12345, 67890], { maxFee: (1000).microAlgos(), suppressLog: true })
```

#### Defined in

[src/types/account-manager.ts:470](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L470)

___

### assetBulkOptOut

▸ **assetBulkOptOut**(`account`, `assetIds`, `options?`): `Promise`\<[`BulkAssetOptInOutResult`](../interfaces/types_account_manager.BulkAssetOptInOutResult.md)[]\>

Opt an account out of a list of Algorand Standard Assets.

Transactions will be sent in batches of 16 as transaction groups.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | `string` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The account to opt-in |
| `assetIds` | (`number` \| `bigint`)[] | The list of asset IDs to opt-out of |
| `options?` | `Omit`\<[`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams), ``"sender"``\> & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md) & \{ `ensureZeroBalance`: `boolean`  } | Any parameters to control the transaction or execution of the transaction |

#### Returns

`Promise`\<[`BulkAssetOptInOutResult`](../interfaces/types_account_manager.BulkAssetOptInOutResult.md)[]\>

An array of records matching asset ID to transaction ID of the opt in

**`Example`**

```typescript
// Basic example
algorand.account.assetBulkOptOut("ACCOUNTADDRESS", [12345, 67890])
// With configuration
algorand.account.assetBulkOptOut("ACCOUNTADDRESS", [12345, 67890], { maxFee: (1000).microAlgos(), suppressLog: true })
```

#### Defined in

[src/types/account-manager.ts:522](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L522)

___

### dispenserFromEnvironment

▸ **dispenserFromEnvironment**(): `Promise`\<[`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: [`SigningAccount`](types_account.SigningAccount.md)  }\>

Returns an account (with private key loaded) that can act as a dispenser from
environment variables, or against default LocalNet if no environment variables present.

Note: requires a Node.js environment to execute.

If present, it will load the account mnemonic stored in process.env.DISPENSER_MNEMONIC and optionally
process.env.DISPENSER_SENDER if it's a rekeyed account.

#### Returns

`Promise`\<[`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: [`SigningAccount`](types_account.SigningAccount.md)  }\>

The account

**`Example`**

```typescript
const account = await account.dispenserFromEnvironment()
```

#### Defined in

[src/types/account-manager.ts:429](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L429)

___

### ensureFunded

▸ **ensureFunded**(`accountToFund`, `dispenserAccount`, `minSpendingBalance`, `options?`): `Promise`\<`undefined` \| [`SendAtomicTransactionComposerResults`](../interfaces/types_transaction.SendAtomicTransactionComposerResults.md) & [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) & [`EnsureFundedResult`](../interfaces/types_account_manager.EnsureFundedResult.md)\>

Funds a given account using a dispenser account as a funding source such that
the given account has a certain amount of algos free to spend (accounting for
ALGOs locked in minimum balance requirement).

https://developer.algorand.org/docs/get-details/accounts/#minimum-balance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `accountToFund` | `string` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The account to fund |
| `dispenserAccount` | `string` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The account to use as a dispenser funding source |
| `minSpendingBalance` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The minimum balance of ALGOs that the account should have available to spend (i.e. on top of minimum balance requirement) |
| `options?` | \{ `minFundingIncrement?`: [`AlgoAmount`](types_amount.AlgoAmount.md)  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md) & `Omit`\<[`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams), ``"sender"``\> | Optional parameters to control the funding increment, transaction or execution of the transaction |

#### Returns

`Promise`\<`undefined` \| [`SendAtomicTransactionComposerResults`](../interfaces/types_transaction.SendAtomicTransactionComposerResults.md) & [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) & [`EnsureFundedResult`](../interfaces/types_account_manager.EnsureFundedResult.md)\>

- The result of executing the dispensing transaction and the `amountFunded` if funds were needed.
- `undefined` if no funds were needed.

**`Example`**

```typescript
// Basic example
await algorand.account.ensureFunded("ACCOUNTADDRESS", "DISPENSERADDRESS", algokit.algos(1))
// With configuration
await algorand.account.ensureFunded("ACCOUNTADDRESS", "DISPENSERADDRESS", algokit.algos(1),
 { minFundingIncrement: algokit.algos(2), fee: (1000).microAlgos(), suppressLog: true }
)
```

#### Defined in

[src/types/account-manager.ts:626](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L626)

___

### ensureFundedFromEnvironment

▸ **ensureFundedFromEnvironment**(`accountToFund`, `minSpendingBalance`, `options?`): `Promise`\<`undefined` \| [`SendAtomicTransactionComposerResults`](../interfaces/types_transaction.SendAtomicTransactionComposerResults.md) & [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) & [`EnsureFundedResult`](../interfaces/types_account_manager.EnsureFundedResult.md)\>

Funds a given account using a dispenser account retrieved from the environment,
per the `dispenserFromEnvironment` method, as a funding source such that
the given account has a certain amount of algos free to spend (accounting for
ALGOs locked in minimum balance requirement).

**Note:** requires a Node.js environment to execute.

The dispenser account is retrieved from the account mnemonic stored in
process.env.DISPENSER_MNEMONIC and optionally process.env.DISPENSER_SENDER
if it's a rekeyed account, or against default LocalNet if no environment variables present.

https://developer.algorand.org/docs/get-details/accounts/#minimum-balance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `accountToFund` | `string` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The account to fund |
| `minSpendingBalance` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The minimum balance of ALGOs that the account should have available to spend (i.e. on top of minimum balance requirement) |
| `options?` | \{ `minFundingIncrement?`: [`AlgoAmount`](types_amount.AlgoAmount.md)  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md) & `Omit`\<[`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams), ``"sender"``\> | Optional parameters to control the funding increment, transaction or execution of the transaction |

#### Returns

`Promise`\<`undefined` \| [`SendAtomicTransactionComposerResults`](../interfaces/types_transaction.SendAtomicTransactionComposerResults.md) & [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) & [`EnsureFundedResult`](../interfaces/types_account_manager.EnsureFundedResult.md)\>

- The result of executing the dispensing transaction and the `amountFunded` if funds were needed.
- `undefined` if no funds were needed.

**`Example`**

```typescript
// Basic example
await algorand.account.ensureFundedFromEnvironment("ACCOUNTADDRESS", algokit.algos(1))
// With configuration
await algorand.account.ensureFundedFromEnvironment("ACCOUNTADDRESS", algokit.algos(1),
 { minFundingIncrement: algokit.algos(2), fee: (1000).microAlgos(), suppressLog: true }
)
```

#### Defined in

[src/types/account-manager.ts:688](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L688)

___

### ensureFundedFromTestNetDispenserApi

▸ **ensureFundedFromTestNetDispenserApi**(`accountToFund`, `dispenserClient`, `minSpendingBalance`, `options`): `Promise`\<`undefined` \| [`EnsureFundedResult`](../interfaces/types_account_manager.EnsureFundedResult.md)\>

Funds a given account using the TestNet Dispenser API as a funding source such that
the account has a certain amount of algos free to spend (accounting for ALGOs locked
in minimum balance requirement).

https://developer.algorand.org/docs/get-details/accounts/#minimum-balance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `accountToFund` | `string` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The account to fund |
| `dispenserClient` | [`TestNetDispenserApiClient`](types_dispenser_client.TestNetDispenserApiClient.md) | The TestNet dispenser funding client |
| `minSpendingBalance` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The minimum balance of ALGOs that the account should have available to spend (i.e. on top of minimum balance requirement) |
| `options` | `Object` | Optional parameters to control the funding increment, transaction or execution of the transaction |
| `options.minFundingIncrement?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | - |

#### Returns

`Promise`\<`undefined` \| [`EnsureFundedResult`](../interfaces/types_account_manager.EnsureFundedResult.md)\>

- The result of executing the dispensing transaction and the `amountFunded` if funds were needed.
- `undefined` if no funds were needed.

**`Example`**

```typescript
// Basic example
await algorand.account.ensureFundedUsingDispenserAPI("ACCOUNTADDRESS", algorand.client.getTestNetDispenserFromEnvironment(), algokit.algos(1))
// With configuration
await algorand.account.ensureFundedUsingDispenserAPI("ACCOUNTADDRESS", algorand.client.getTestNetDispenserFromEnvironment(), algokit.algos(1),
 { minFundingIncrement: algokit.algos(2) }
)
```

#### Defined in

[src/types/account-manager.ts:744](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L744)

___

### fromEnvironment

▸ **fromEnvironment**(`name`, `fundWith?`): `Promise`\<[`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: [`SigningAccount`](types_account.SigningAccount.md)  }\>

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

`Promise`\<[`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: [`SigningAccount`](types_account.SigningAccount.md)  }\>

The account

**`Example`**

If you have a mnemonic secret loaded into `process.env.MY_ACCOUNT_MNEMONIC` then you can call the following to get that private key loaded into an account object:
```typescript
const account = await accountManager.fromEnvironment('MY_ACCOUNT')
```

If that code runs against LocalNet then a wallet called `MY_ACCOUNT` will automatically be created with an account that is automatically funded with 1000 (default) ALGOs from the default LocalNet dispenser.
If not running against LocalNet then it will use proces.env.MY_ACCOUNT_MNEMONIC as the private key and (if present) process.env.MY_ACCOUNT_SENDER as the sender address.

#### Defined in

[src/types/account-manager.ts:322](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L322)

___

### fromKmd

▸ **fromKmd**(`name`, `predicate?`, `sender?`): `Promise`\<[`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: [`SigningAccount`](types_account.SigningAccount.md)  }\>

Tracks and returns an Algorand account with private key loaded from the given KMD wallet (identified by name).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the wallet to retrieve an account from |
| `predicate?` | (`account`: `Record`\<`string`, `any`\>) => `boolean` | An optional filter to use to find the account (otherwise it will return a random account from the wallet) |
| `sender?` | `string` | The optional sender address to use this signer for (aka a rekeyed account) |

#### Returns

`Promise`\<[`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: [`SigningAccount`](types_account.SigningAccount.md)  }\>

The account

**`Example`**

```typescript
const defaultDispenserAccount = await account.fromKmd('unencrypted-default-wallet',
  a => a.status !== 'Offline' && a.amount > 1_000_000_000
)
```

#### Defined in

[src/types/account-manager.ts:358](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L358)

___

### fromMnemonic

▸ **fromMnemonic**(`mnemonicSecret`, `sender?`): [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: [`SigningAccount`](types_account.SigningAccount.md)  }

Tracks and returns an Algorand account with secret key loaded (i.e. that can sign transactions) by taking the mnemonic secret.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mnemonicSecret` | `string` | The mnemonic secret representing the private key of an account; **Note: Be careful how the mnemonic is handled**, never commit it into source control and ideally load it from the environment (ideally via a secret storage service) rather than the file system. |
| `sender?` | `string` | The optional sender address to use this signer for (aka a rekeyed account) |

#### Returns

[`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: [`SigningAccount`](types_account.SigningAccount.md)  }

The account

**`Example`**

```typescript
const account = accountManager.fromMnemonic("mnemonic secret ...")
const rekeyedAccount = accountManager.fromMnemonic("mnemonic secret ...", "SENDERADDRESS...")
```

#### Defined in

[src/types/account-manager.ts:274](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L274)

___

### getAccount

▸ **getAccount**(`sender`): [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md)

Returns the `TransactionSignerAccount` for the given sender address.

If no signer has been registered for that address then an error is thrown.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sender` | `string` | The sender address |

#### Returns

[`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md)

The `TransactionSignerAccount` or throws an error if not found

**`Example`**

```typescript
const sender = accountManager.random().addr
// ...
// Returns the `TransactionSignerAccount` for `sender` that has previously been registered
const account = accountManager.getAccount(sender)
```

#### Defined in

[src/types/account-manager.ts:189](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L189)

___

### getAssetInformation

▸ **getAssetInformation**(`sender`, `assetId`): `Promise`\<\{ `assetId`: `bigint` ; `balance`: `bigint` ; `frozen`: `boolean` ; `round`: `bigint`  }\>

Returns the given sender account's asset holding for a given asset.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sender` | `string` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The address of the sender/account to look up |
| `assetId` | `number` \| `bigint` | The ID of the asset to return a holding for |

#### Returns

`Promise`\<\{ `assetId`: `bigint` ; `balance`: `bigint` ; `frozen`: `boolean` ; `round`: `bigint`  }\>

The account asset holding information

**`Example`**

```typescript
const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
const assetId = 123345;
const accountInfo = await accountManager.getAssetInformation(address, assetId);
```

[Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/#get-v2accountsaddressassetsasset-id)

#### Defined in

[src/types/account-manager.ts:248](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L248)

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

[src/types/account-manager.ts:208](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L208)

___

### getSigner

▸ **getSigner**(`sender`): `TransactionSigner`

Returns the `TransactionSigner` for the given sender address, ready to sign a transaction for that sender.

If no signer has been registered for that address then the default signer is used if registered and
if not then an error is thrown.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sender` | `string` | The sender address |

#### Returns

`TransactionSigner`

The `TransactionSigner` or throws an error if not found and no default signer is set

**`Example`**

```typescript
const signer = accountManager.getSigner("SENDERADDRESS")
```

#### Defined in

[src/types/account-manager.ts:169](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L169)

___

### localNetDispenser

▸ **localNetDispenser**(): `Promise`\<[`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: [`SigningAccount`](types_account.SigningAccount.md)  }\>

Returns an Algorand account with private key loaded for the default LocalNet dispenser account (that can be used to fund other accounts).

#### Returns

`Promise`\<[`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: [`SigningAccount`](types_account.SigningAccount.md)  }\>

The account

**`Example`**

```typescript
const account = await account.localNetDispenser()
```

#### Defined in

[src/types/account-manager.ts:448](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L448)

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
const account = account.logicsig(program, [new Uint8Array(3, ...)])
```

#### Defined in

[src/types/account-manager.ts:396](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L396)

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
const account = accountManager.multisig({version: 1, threshold: 1, addrs: ["ADDRESS1...", "ADDRESS2..."]},
 [(await accountManager.fromEnvironment('ACCOUNT1')).account])
```

#### Defined in

[src/types/account-manager.ts:381](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L381)

___

### random

▸ **random**(): [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: `default`  }

Tracks and returns a new, random Algorand account with secret key loaded.

#### Returns

[`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: `default`  }

The account

**`Example`**

```typescript
const account = account.random()
```

#### Defined in

[src/types/account-manager.ts:409](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L409)

___

### rekeyed

▸ **rekeyed**(`account`, `sender`): [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: \{ `addr`: `string` = sender; `signer`: `TransactionSigner` = account.signer }  }

Tracks and returns an Algorand account that is a rekeyed version of the given account to a new sender.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The account to use as the signer for this new rekeyed account |
| `sender` | `string` | The sender address to use as the new sender |

#### Returns

[`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: \{ `addr`: `string` = sender; `signer`: `TransactionSigner` = account.signer }  }

The account

**`Example`**

```typescript
const account = account.fromMnemonic("mnemonic secret ...")
const rekeyedAccount = accountManager.rekeyed(account, "SENDERADDRESS...")
```

#### Defined in

[src/types/account-manager.ts:291](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L291)

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

**`Example`**

```typescript
const signer = accountManager.random() // Can be anything that returns a `algosdk.TransactionSigner` or `TransactionSignerAccount`
accountManager.setDefaultSigner(signer)

// When signing a transaction, if there is no signer registered for the sender then the default signer will be used
const signer = accountManager.getSigner("{SENDERADDRESS}")
```

#### Defined in

[src/types/account-manager.ts:97](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L97)

___

### setSigner

▸ **setSigner**(`sender`, `signer`): [`AccountManager`](types_account_manager.AccountManager.md)

Tracks the given `algosdk.TransactionSigner` against the given sender address for later signing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sender` | `string` | The sender address to use this signer for |
| `signer` | `TransactionSigner` | The `algosdk.TransactionSigner` to sign transactions with for the given sender |

#### Returns

[`AccountManager`](types_account_manager.AccountManager.md)

The `AccountManager` instance for method chaining

**`Example`**

```typescript
const accountManager = new AccountManager(clientManager)
 .setSigner("SENDERADDRESS", transactionSigner)
```

#### Defined in

[src/types/account-manager.ts:151](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L151)

___

### setSignerFromAccount

▸ **setSignerFromAccount**(`account`): [`AccountManager`](types_account_manager.AccountManager.md)

Tracks the given account for later signing.

Note: If you are generating accounts via the various methods on `AccountManager`
(like `random`, `fromMnemonic`, `logicsig`, etc.) then they automatically get tracked.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | [`MultisigAccount`](types_account.MultisigAccount.md) \| `default` \| [`SigningAccount`](types_account.SigningAccount.md) \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) \| `LogicSigAccount` | The account to register, which can be a `TransactionSignerAccount` or a `algosdk.Account`, `algosdk.LogicSigAccount`, `SigningAccount` or `MultisigAccount` |

#### Returns

[`AccountManager`](types_account_manager.AccountManager.md)

The `AccountManager` instance for method chaining

**`Example`**

```typescript
const accountManager = new AccountManager(clientManager)
 .setSignerFromAccount(algosdk.generateAccount())
 .setSignerFromAccount(new algosdk.LogicSigAccount(program, args))
 .setSignerFromAccount(new SigningAccount(mnemonic, sender))
 .setSignerFromAccount(new MultisigAccount({version: 1, threshold: 1, addrs: ["ADDRESS1...", "ADDRESS2..."]}, [account1, account2]))
 .setSignerFromAccount({addr: "SENDERADDRESS", signer: transactionSigner})
```

#### Defined in

[src/types/account-manager.ts:135](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L135)

___

### signerAccount

▸ **signerAccount**\<`T`\>(`account`): [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: `T`  }

Records the given account (that can sign) against the address of the provided account for later
retrieval and returns a `TransactionSignerAccount` along with the original account in an `account` property.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`MultisigAccount`](types_account.MultisigAccount.md) \| `default` \| [`SigningAccount`](types_account.SigningAccount.md) \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) \| `LogicSigAccount` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `account` | `T` |

#### Returns

[`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: `T`  }

#### Defined in

[src/types/account-manager.ts:106](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L106)
