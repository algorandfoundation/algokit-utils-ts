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
- [rekeyAccount](types_account_manager.AccountManager.md#rekeyaccount)
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

[src/types/account-manager.ts:71](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L71)

## Properties

### \_accounts

• `Private` **\_accounts**: `Object` = `{}`

#### Index signature

▪ [address: `string`]: [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md)

#### Defined in

[src/types/account-manager.ts:60](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L60)

___

### \_clientManager

• `Private` **\_clientManager**: [`ClientManager`](types_client_manager.ClientManager.md)

#### Defined in

[src/types/account-manager.ts:58](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L58)

___

### \_defaultSigner

• `Private` `Optional` **\_defaultSigner**: `TransactionSigner`

#### Defined in

[src/types/account-manager.ts:61](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L61)

___

### \_kmdAccountManager

• `Private` **\_kmdAccountManager**: [`KmdAccountManager`](types_kmd_account_manager.KmdAccountManager.md)

#### Defined in

[src/types/account-manager.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L59)

## Accessors

### kmd

• `get` **kmd**(): [`KmdAccountManager`](types_kmd_account_manager.KmdAccountManager.md)

KMD account manager that allows you to easily get and create accounts using KMD.

#### Returns

[`KmdAccountManager`](types_kmd_account_manager.KmdAccountManager.md)

#### Defined in

[src/types/account-manager.ts:85](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L85)

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

[src/types/account-manager.ts:76](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L76)

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

[src/types/account-manager.ts:667](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L667)

___

### assetBulkOptIn

▸ **assetBulkOptIn**(`account`, `assetIds`, `options?`): `Promise`\<[`BulkAssetOptInOutResult`](../interfaces/types_account_manager.BulkAssetOptInOutResult.md)[]\>

Opt an account in to a list of Algorand Standard Assets.

Transactions will be sent in batches of 16 as transaction groups.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | `string` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The account to opt-in |
| `assetIds` | `bigint`[] | The list of asset IDs to opt-in to |
| `options?` | `Omit`\<[`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams), ``"sender"``\> & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md) | Any parameters to control the transaction or execution of the transaction |

#### Returns

`Promise`\<[`BulkAssetOptInOutResult`](../interfaces/types_account_manager.BulkAssetOptInOutResult.md)[]\>

An array of records matching asset ID to transaction ID of the opt in

**`Example`**

```typescript
// Basic example
algorand.account.assetBulkOptIn("ACCOUNTADDRESS", [12345n, 67890n])
// With configuration
algorand.account.assetBulkOptIn("ACCOUNTADDRESS", [12345n, 67890n], { maxFee: (1000).microAlgos(), suppressLog: true })
```

#### Defined in

[src/types/account-manager.ts:479](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L479)

___

### assetBulkOptOut

▸ **assetBulkOptOut**(`account`, `assetIds`, `options?`): `Promise`\<[`BulkAssetOptInOutResult`](../interfaces/types_account_manager.BulkAssetOptInOutResult.md)[]\>

Opt an account out of a list of Algorand Standard Assets.

Transactions will be sent in batches of 16 as transaction groups.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | `string` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The account to opt-in |
| `assetIds` | `bigint`[] | The list of asset IDs to opt-out of |
| `options?` | `Omit`\<[`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams), ``"sender"``\> & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md) & \{ `ensureZeroBalance?`: `boolean`  } | Any parameters to control the transaction or execution of the transaction |

#### Returns

`Promise`\<[`BulkAssetOptInOutResult`](../interfaces/types_account_manager.BulkAssetOptInOutResult.md)[]\>

An array of records matching asset ID to transaction ID of the opt in

**`Example`**

```typescript
// Basic example
algorand.account.assetBulkOptOut("ACCOUNTADDRESS", [12345n, 67890n])
// With configuration
algorand.account.assetBulkOptOut("ACCOUNTADDRESS", [12345n, 67890n], { ensureZeroBalance: true, maxFee: (1000).microAlgos(), suppressLog: true })
```

#### Defined in

[src/types/account-manager.ts:531](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L531)

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

[src/types/account-manager.ts:438](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L438)

___

### ensureFunded

▸ **ensureFunded**(`accountToFund`, `dispenserAccount`, `minSpendingBalance`, `options?`): `Promise`\<`undefined` \| [`SendAtomicTransactionComposerResults`](../interfaces/types_transaction.SendAtomicTransactionComposerResults.md) & [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) & [`EnsureFundedResult`](../interfaces/types_account_manager.EnsureFundedResult.md)\>

Funds a given account using a dispenser account as a funding source such that
the given account has a certain amount of Algos free to spend (accounting for
Algos locked in minimum balance requirement).

https://developer.algorand.org/docs/get-details/accounts/#minimum-balance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `accountToFund` | `string` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The account to fund |
| `dispenserAccount` | `string` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The account to use as a dispenser funding source |
| `minSpendingBalance` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The minimum balance of Algos that the account should have available to spend (i.e. on top of minimum balance requirement) |
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

[src/types/account-manager.ts:700](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L700)

___

### ensureFundedFromEnvironment

▸ **ensureFundedFromEnvironment**(`accountToFund`, `minSpendingBalance`, `options?`): `Promise`\<`undefined` \| [`SendAtomicTransactionComposerResults`](../interfaces/types_transaction.SendAtomicTransactionComposerResults.md) & [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) & [`EnsureFundedResult`](../interfaces/types_account_manager.EnsureFundedResult.md)\>

Funds a given account using a dispenser account retrieved from the environment,
per the `dispenserFromEnvironment` method, as a funding source such that
the given account has a certain amount of Algos free to spend (accounting for
Algos locked in minimum balance requirement).

**Note:** requires a Node.js environment to execute.

The dispenser account is retrieved from the account mnemonic stored in
process.env.DISPENSER_MNEMONIC and optionally process.env.DISPENSER_SENDER
if it's a rekeyed account, or against default LocalNet if no environment variables present.

https://developer.algorand.org/docs/get-details/accounts/#minimum-balance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `accountToFund` | `string` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The account to fund |
| `minSpendingBalance` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The minimum balance of Algos that the account should have available to spend (i.e. on top of minimum balance requirement) |
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

[src/types/account-manager.ts:762](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L762)

___

### ensureFundedFromTestNetDispenserApi

▸ **ensureFundedFromTestNetDispenserApi**(`accountToFund`, `dispenserClient`, `minSpendingBalance`, `options`): `Promise`\<`undefined` \| [`EnsureFundedResult`](../interfaces/types_account_manager.EnsureFundedResult.md)\>

Funds a given account using the TestNet Dispenser API as a funding source such that
the account has a certain amount of algos free to spend (accounting for Algos locked
in minimum balance requirement).

https://developer.algorand.org/docs/get-details/accounts/#minimum-balance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `accountToFund` | `string` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The account to fund |
| `dispenserClient` | [`TestNetDispenserApiClient`](types_dispenser_client.TestNetDispenserApiClient.md) | The TestNet dispenser funding client |
| `minSpendingBalance` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The minimum balance of Algos that the account should have available to spend (i.e. on top of minimum balance requirement) |
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

[src/types/account-manager.ts:818](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L818)

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
const account = await account.fromEnvironment('MY_ACCOUNT', algod)
```

If that code runs against LocalNet then a wallet called `MY_ACCOUNT` will automatically be created with an account that is automatically funded with 1000 (default) Algos from the default LocalNet dispenser.
If not running against LocalNet then it will use proces.env.MY_ACCOUNT_MNEMONIC as the private key and (if present) process.env.MY_ACCOUNT_SENDER as the sender address.

#### Defined in

[src/types/account-manager.ts:331](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L331)

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

[src/types/account-manager.ts:367](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L367)

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
const account = await account.fromMnemonic("mnemonic secret ...")
const rekeyedAccount = await account.fromMnemonic("mnemonic secret ...", "SENDERADDRESS...")
```

#### Defined in

[src/types/account-manager.ts:283](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L283)

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
const account = accountManager.random()
const sender = account.addr
// ...
// Returns the `TransactionSignerAccount` for `sender` that has previously been registered
const account = accountManager.getAccount(sender)
```

#### Defined in

[src/types/account-manager.ts:198](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L198)

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

[src/types/account-manager.ts:257](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L257)

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

[src/types/account-manager.ts:217](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L217)

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

[src/types/account-manager.ts:177](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L177)

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

[src/types/account-manager.ts:457](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L457)

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

[src/types/account-manager.ts:405](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L405)

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

[src/types/account-manager.ts:390](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L390)

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

[src/types/account-manager.ts:418](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L418)

___

### rekeyAccount

▸ **rekeyAccount**(`account`, `rekeyTo`, `options?`): `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client.md#sendsingletransactionresult)\>

Rekey an account to a new address.

**Note:** Please be careful with this function and be sure to read the [official rekey guidance](https://developer.algorand.org/docs/get-details/accounts/rekey/).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | `string` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The account to rekey |
| `rekeyTo` | `string` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The account address or signing account of the account that will be used to authorise transactions for the rekeyed account going forward. If a signing account is provided that will now be tracked as the signer for `account` in this `AccountManager` |
| `options?` | `Omit`\<[`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams), ``"sender"``\> & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md) | Any parameters to control the transaction or execution of the transaction |

#### Returns

`Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client.md#sendsingletransactionresult)\>

The result of the transaction and the transaction that was sent

**`Example`**

```typescript
await algorand.account.rekeyAccount({account: "ACCOUNTADDRESS", rekeyTo: "NEWADDRESS"})
```

**`Example`**

```typescript
await algorand.account.rekeyAccount({account: account1, rekeyTo: newSignerAccount})
```

**`Example`**

```typescript
await algorand.account.rekeyAccount({
  account: "ACCOUNTADDRESS",
  rekeyTo: "NEWADDRESS",
  lease: 'lease',
  note: 'note',
  firstValidRound: 1000n,
  validityWindow: 10,
  extraFee: (1000).microAlgos(),
  staticFee: (1000).microAlgos(),
  // Max fee doesn't make sense with extraFee AND staticFee
  //  already specified, but here for completeness
  maxFee: (3000).microAlgos(),
  maxRoundsToWaitForConfirmation: 5,
  suppressLog: true,
})
```

#### Defined in

[src/types/account-manager.ts:642](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L642)

___

### rekeyed

▸ **rekeyed**(`sender`, `account`): [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: \{ `addr`: `string` = sender; `signer`: `TransactionSigner` = account.signer }  }

Tracks and returns an Algorand account that is a rekeyed version of the given account to a new sender.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sender` | `string` | The sender address to use as the new sender |
| `account` | [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The account to use as the signer for this new rekeyed account |

#### Returns

[`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) & \{ `account`: \{ `addr`: `string` = sender; `signer`: `TransactionSigner` = account.signer }  }

The account

**`Example`**

```typescript
const account = await account.fromMnemonic("mnemonic secret ...")
const rekeyedAccount = await account.rekeyed("SENDERADDRESS...", account)
```

#### Defined in

[src/types/account-manager.ts:300](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L300)

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

[src/types/account-manager.ts:105](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L105)

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

[src/types/account-manager.ts:159](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L159)

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

[src/types/account-manager.ts:143](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L143)

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

[src/types/account-manager.ts:114](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L114)
