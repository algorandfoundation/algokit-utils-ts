[algotstest](../README.md) / account

# Module: account

## Table of contents

### Variables

- [DISPENSER\_ACCOUNT](account.md#dispenser_account)

### Functions

- [getAccount](account.md#getaccount)
- [getAccountAddressAsString](account.md#getaccountaddressasstring)
- [getAccountAddressAsUint8Array](account.md#getaccountaddressasuint8array)
- [getAccountFromMnemonic](account.md#getaccountfrommnemonic)
- [getDispenserAccount](account.md#getdispenseraccount)
- [getTestAccount](account.md#gettestaccount)

## Variables

### DISPENSER\_ACCOUNT

• `Const` **DISPENSER\_ACCOUNT**: ``"DISPENSER"``

The account name identifier used for fund dispensing in test environments

#### Defined in

[account.ts:12](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/account.ts#L12)

## Functions

### getAccount

▸ **getAccount**(`account`, `algod`, `kmdClient?`): `Promise`<`Account` \| [`SigningAccount`](../classes/transaction.SigningAccount.md)\>

Returns an Algorand account with private key loaded by convention based on the given name identifier.

Note: This function expects to run in a Node.js environment.

## Convention:
* **Non-LocalNet:** will load process.env['{NAME}_MNEMONIC'] as a mnemonic secret; **Note: Be careful how the mnemonic is handled**,
 never commit it into source control and ideally load it via a secret storage service rather than the file system.
  If process.env['{NAME}_SENDER'] is defined then it will use that for the sender address (i.e. to support rekeyed accounts)
* **LocalNet:** will load the account from a KMD wallet called {NAME} and if that wallet doesn't exist it will create it and fund the account for you

This allows you to write code that will work seamlessly in production and local development (LocalNet) without manual config locally (including when you reset the LocalNet).

**`Example`**

Default

If you have a mnemonic secret loaded into `process.env.ACCOUNT_MNEMONIC` then you can call the following to get that private key loaded into an account object:
```
const account = await getAccount('ACCOUNT', algod)
```

If that code runs against LocalNet then a wallet called `ACCOUNT` will automatically be created with an account that is automatically funded with 1000 (default) ALGOs from the default LocalNet dispenser.

**`See`**

 - 
 - 

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | `string` \| { `fundWith?`: [`AlgoAmount`](../classes/algo_amount.AlgoAmount.md) ; `name`: `string`  } | The details of the account to get, wither the name identifier (string) or an object with: * `name`: The name identifier of the account * `fundWith`: The amount to fund the account with it it gets created (when targeting LocalNet), if not specified then 1000 Algos will be funded from the dispenser account |
| `algod` | `default` | An algod client |
| `kmdClient?` | `default` | An optional KMD client to use to create an account (when targeting LocalNet), if not specified then a default KMD client will be loaded from environment variables |

#### Returns

`Promise`<`Account` \| [`SigningAccount`](../classes/transaction.SigningAccount.md)\>

The requested account with private key loaded from the environment variables or when targeting LocalNet from KMD (idempotently creating and funding the account)

#### Defined in

[account.ts:55](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/account.ts#L55)

___

### getAccountAddressAsString

▸ **getAccountAddressAsString**(`addressEncodedInB64`): `string`

Returns the string address of an Algorand account from a base64 encoded version of the underlying byte array of the address public key

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `addressEncodedInB64` | `string` | The base64 encoded version of the underlying byte array of the address public key |

#### Returns

`string`

#### Defined in

[account.ts:150](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/account.ts#L150)

___

### getAccountAddressAsUint8Array

▸ **getAccountAddressAsUint8Array**(`account`): `Uint8Array`

Returns an account's address as a byte array

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | `string` \| `default` | Either an account (with private key loaded) or the string address of an account |

#### Returns

`Uint8Array`

#### Defined in

[account.ts:142](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/account.ts#L142)

___

### getAccountFromMnemonic

▸ **getAccountFromMnemonic**(`mnemonicSecret`): `Account`

Returns an Algorand account with secret key loaded (i.e. that can sign transactions) by taking the mnemonic secret.

This is a wrapper around algosdk.mnemonicToSecretKey to provide a more friendly/obvious name.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mnemonicSecret` | `string` | The mnemonic secret representing the private key of an account; **Note: Be careful how the mnemonic is handled**, never commit it into source control and ideally load it from the environment (ideally via a secret storage service) rather than the file system. |

#### Returns

`Account`

#### Defined in

[account.ts:21](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/account.ts#L21)

___

### getDispenserAccount

▸ **getDispenserAccount**(`algod`): `Promise`<`default` \| [`SigningAccount`](../classes/transaction.SigningAccount.md)\>

Returns an account (with private key loaded) that can act as a dispenser

If running on Sandbox then it will return the default dispenser account automatically,
 otherwise it will load the account mnemonic stored in process.env.DISPENSER_MNEMONIC

**`See`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<`default` \| [`SigningAccount`](../classes/transaction.SigningAccount.md)\>

#### Defined in

[account.ts:161](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/account.ts#L161)

___

### getTestAccount

▸ **getTestAccount**(`param0`, `algod`): `Promise`<`Account`\>

Creates an ephemeral Algorand account for the purposes of testing.
Returns a newly created random test account that is funded from the dispenser

**`See`**

DO NOT USE THIS TO CREATE A MAINNET ACCOUNT!
Note: By default this will log the mnemonic of the account.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `param0` | `GetTestAccountParams` | The config for the test account to generate |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<`Account`\>

The account, with private key loaded

#### Defined in

[account.ts:115](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/account.ts#L115)
