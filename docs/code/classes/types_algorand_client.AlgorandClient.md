[@algorandfoundation/algokit-utils](../README.md) / [types/algorand-client](../modules/types_algorand_client.md) / AlgorandClient

# Class: AlgorandClient

[types/algorand-client](../modules/types_algorand_client.md).AlgorandClient

A client that brokers easy access to Algorand functionality.

## Table of contents

### Constructors

- [constructor](types_algorand_client.AlgorandClient.md#constructor)

### Properties

- [\_accountManager](types_algorand_client.AlgorandClient.md#_accountmanager)
- [\_appDeployer](types_algorand_client.AlgorandClient.md#_appdeployer)
- [\_appManager](types_algorand_client.AlgorandClient.md#_appmanager)
- [\_assetManager](types_algorand_client.AlgorandClient.md#_assetmanager)
- [\_cachedSuggestedParams](types_algorand_client.AlgorandClient.md#_cachedsuggestedparams)
- [\_cachedSuggestedParamsExpiry](types_algorand_client.AlgorandClient.md#_cachedsuggestedparamsexpiry)
- [\_cachedSuggestedParamsTimeout](types_algorand_client.AlgorandClient.md#_cachedsuggestedparamstimeout)
- [\_clientManager](types_algorand_client.AlgorandClient.md#_clientmanager)
- [\_defaultValidityWindow](types_algorand_client.AlgorandClient.md#_defaultvaliditywindow)
- [\_transactionCreator](types_algorand_client.AlgorandClient.md#_transactioncreator)
- [\_transactionSender](types_algorand_client.AlgorandClient.md#_transactionsender)

### Accessors

- [account](types_algorand_client.AlgorandClient.md#account)
- [app](types_algorand_client.AlgorandClient.md#app)
- [appDeployer](types_algorand_client.AlgorandClient.md#appdeployer)
- [asset](types_algorand_client.AlgorandClient.md#asset)
- [client](types_algorand_client.AlgorandClient.md#client)
- [createTransaction](types_algorand_client.AlgorandClient.md#createtransaction)
- [send](types_algorand_client.AlgorandClient.md#send)

### Methods

- [getSuggestedParams](types_algorand_client.AlgorandClient.md#getsuggestedparams)
- [newGroup](types_algorand_client.AlgorandClient.md#newgroup)
- [setDefaultSigner](types_algorand_client.AlgorandClient.md#setdefaultsigner)
- [setDefaultValidityWindow](types_algorand_client.AlgorandClient.md#setdefaultvaliditywindow)
- [setSigner](types_algorand_client.AlgorandClient.md#setsigner)
- [setSignerFromAccount](types_algorand_client.AlgorandClient.md#setsignerfromaccount)
- [setSuggestedParamsCache](types_algorand_client.AlgorandClient.md#setsuggestedparamscache)
- [setSuggestedParamsCacheTimeout](types_algorand_client.AlgorandClient.md#setsuggestedparamscachetimeout)
- [defaultLocalNet](types_algorand_client.AlgorandClient.md#defaultlocalnet)
- [fromClients](types_algorand_client.AlgorandClient.md#fromclients)
- [fromConfig](types_algorand_client.AlgorandClient.md#fromconfig)
- [fromEnvironment](types_algorand_client.AlgorandClient.md#fromenvironment)
- [mainNet](types_algorand_client.AlgorandClient.md#mainnet)
- [testNet](types_algorand_client.AlgorandClient.md#testnet)

## Constructors

### constructor

• **new AlgorandClient**(`config`): [`AlgorandClient`](types_algorand_client.AlgorandClient.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`AlgoConfig`](../interfaces/types_network_client.AlgoConfig.md) \| [`AlgoSdkClients`](../interfaces/types_client_manager.AlgoSdkClients.md) |

#### Returns

[`AlgorandClient`](types_algorand_client.AlgorandClient.md)

#### Defined in

[src/types/algorand-client.ts:33](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L33)

## Properties

### \_accountManager

• `Private` **\_accountManager**: [`AccountManager`](types_account_manager.AccountManager.md)

#### Defined in

[src/types/algorand-client.ts:20](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L20)

___

### \_appDeployer

• `Private` **\_appDeployer**: [`AppDeployer`](types_app_deployer.AppDeployer.md)

#### Defined in

[src/types/algorand-client.ts:22](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L22)

___

### \_appManager

• `Private` **\_appManager**: [`AppManager`](types_app_manager.AppManager.md)

#### Defined in

[src/types/algorand-client.ts:21](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L21)

___

### \_assetManager

• `Private` **\_assetManager**: [`AssetManager`](types_asset_manager.AssetManager.md)

#### Defined in

[src/types/algorand-client.ts:23](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L23)

___

### \_cachedSuggestedParams

• `Private` `Optional` **\_cachedSuggestedParams**: `SuggestedParams`

#### Defined in

[src/types/algorand-client.ts:27](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L27)

___

### \_cachedSuggestedParamsExpiry

• `Private` `Optional` **\_cachedSuggestedParamsExpiry**: `Date`

#### Defined in

[src/types/algorand-client.ts:28](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L28)

___

### \_cachedSuggestedParamsTimeout

• `Private` **\_cachedSuggestedParamsTimeout**: `number` = `3_000`

#### Defined in

[src/types/algorand-client.ts:29](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L29)

___

### \_clientManager

• `Private` **\_clientManager**: [`ClientManager`](types_client_manager.ClientManager.md)

#### Defined in

[src/types/algorand-client.ts:19](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L19)

___

### \_defaultValidityWindow

• `Private` **\_defaultValidityWindow**: `undefined` \| `bigint` = `undefined`

#### Defined in

[src/types/algorand-client.ts:31](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L31)

___

### \_transactionCreator

• `Private` **\_transactionCreator**: [`AlgorandClientTransactionCreator`](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md)

#### Defined in

[src/types/algorand-client.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L25)

___

### \_transactionSender

• `Private` **\_transactionSender**: [`AlgorandClientTransactionSender`](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md)

#### Defined in

[src/types/algorand-client.ts:24](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L24)

## Accessors

### account

• `get` **account**(): [`AccountManager`](types_account_manager.AccountManager.md)

Get or create accounts that can sign transactions.

#### Returns

[`AccountManager`](types_account_manager.AccountManager.md)

#### Defined in

[src/types/algorand-client.ts:140](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L140)

___

### app

• `get` **app**(): [`AppManager`](types_app_manager.AppManager.md)

Methods for interacting with apps.

#### Returns

[`AppManager`](types_app_manager.AppManager.md)

#### Defined in

[src/types/algorand-client.ts:150](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L150)

___

### appDeployer

• `get` **appDeployer**(): [`AppDeployer`](types_app_deployer.AppDeployer.md)

Methods for deploying apps and managing app deployment metadata.

#### Returns

[`AppDeployer`](types_app_deployer.AppDeployer.md)

#### Defined in

[src/types/algorand-client.ts:155](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L155)

___

### asset

• `get` **asset**(): [`AssetManager`](types_asset_manager.AssetManager.md)

Methods for interacting with assets.

#### Returns

[`AssetManager`](types_asset_manager.AssetManager.md)

#### Defined in

[src/types/algorand-client.ts:145](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L145)

___

### client

• `get` **client**(): [`ClientManager`](types_client_manager.ClientManager.md)

Get clients, including algosdk clients and app clients.

#### Returns

[`ClientManager`](types_client_manager.ClientManager.md)

#### Defined in

[src/types/algorand-client.ts:135](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L135)

___

### createTransaction

• `get` **createTransaction**(): [`AlgorandClientTransactionCreator`](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md)

Methods for creating a transaction.

#### Returns

[`AlgorandClientTransactionCreator`](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md)

#### Defined in

[src/types/algorand-client.ts:180](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L180)

___

### send

• `get` **send**(): [`AlgorandClientTransactionSender`](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md)

Methods for sending a transaction.

#### Returns

[`AlgorandClientTransactionSender`](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md)

#### Defined in

[src/types/algorand-client.ts:173](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L173)

## Methods

### getSuggestedParams

▸ **getSuggestedParams**(): `Promise`\<`SuggestedParams`\>

Get suggested params for a transaction (either cached or from algod if the cache is stale or empty)

#### Returns

`Promise`\<`SuggestedParams`\>

#### Defined in

[src/types/algorand-client.ts:119](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L119)

___

### newGroup

▸ **newGroup**(): [`TransactionComposer`](types_composer.TransactionComposer.md)

Start a new `TransactionComposer` transaction group

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

#### Defined in

[src/types/algorand-client.ts:160](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L160)

___

### setDefaultSigner

▸ **setDefaultSigner**(`signer`): [`AlgorandClient`](types_algorand_client.AlgorandClient.md)

Sets the default signer to use if no other signer is specified.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The signer to use, either a `TransactionSigner` or a `TransactionSignerAccount` |

#### Returns

[`AlgorandClient`](types_algorand_client.AlgorandClient.md)

The `AlgorandClient` so method calls can be chained

#### Defined in

[src/types/algorand-client.ts:58](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L58)

___

### setDefaultValidityWindow

▸ **setDefaultValidityWindow**(`validityWindow`): [`AlgorandClient`](types_algorand_client.AlgorandClient.md)

Sets the default validity window for transactions.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `validityWindow` | `number` \| `bigint` | The number of rounds between the first and last valid rounds |

#### Returns

[`AlgorandClient`](types_algorand_client.AlgorandClient.md)

The `AlgorandClient` so method calls can be chained

#### Defined in

[src/types/algorand-client.ts:48](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L48)

___

### setSigner

▸ **setSigner**(`sender`, `signer`): [`AlgorandClient`](types_algorand_client.AlgorandClient.md)

Tracks the given signer against the given sender for later signing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sender` | `string` \| `Address` | The sender address to use this signer for |
| `signer` | `TransactionSigner` | The signer to sign transactions with for the given sender |

#### Returns

[`AlgorandClient`](types_algorand_client.AlgorandClient.md)

The `AlgorandClient` so method calls can be chained

#### Defined in

[src/types/algorand-client.ts:91](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L91)

___

### setSignerFromAccount

▸ **setSignerFromAccount**(`account`): [`AlgorandClient`](types_algorand_client.AlgorandClient.md)

Tracks the given account (object that encapsulates an address and a signer) for later signing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | [`MultisigAccount`](types_account.MultisigAccount.md) \| `default` \| [`SigningAccount`](types_account.SigningAccount.md) \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) \| `LogicSigAccount` | The account to register, which can be a `TransactionSignerAccount` or a `algosdk.Account`, `algosdk.LogicSigAccount`, `SigningAccount` or `MultisigAccount` |

#### Returns

[`AlgorandClient`](types_algorand_client.AlgorandClient.md)

The `AlgorandClient` so method calls can be chained

**`Example`**

```typescript
const accountManager = AlgorandClient.mainnet()
 .setSignerFromAccount(algosdk.generateAccount())
 .setSignerFromAccount(new algosdk.LogicSigAccount(program, args))
 .setSignerFromAccount(new SigningAccount(mnemonic, sender))
 .setSignerFromAccount(new MultisigAccount({version: 1, threshold: 1, addrs: ["ADDRESS1...", "ADDRESS2..."]}, [account1, account2]))
 .setSignerFromAccount({addr: "SENDERADDRESS", signer: transactionSigner})
```

#### Defined in

[src/types/algorand-client.ts:78](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L78)

___

### setSuggestedParamsCache

▸ **setSuggestedParamsCache**(`suggestedParams`, `until?`): [`AlgorandClient`](types_algorand_client.AlgorandClient.md)

Sets a cache value to use for suggested transaction params.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `suggestedParams` | `SuggestedParams` | The suggested params to use |
| `until?` | `Date` | A date until which to cache, or if not specified then the timeout is used |

#### Returns

[`AlgorandClient`](types_algorand_client.AlgorandClient.md)

The `AlgorandClient` so method calls can be chained

#### Defined in

[src/types/algorand-client.ts:102](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L102)

___

### setSuggestedParamsCacheTimeout

▸ **setSuggestedParamsCacheTimeout**(`timeout`): [`AlgorandClient`](types_algorand_client.AlgorandClient.md)

Sets the timeout for caching suggested params.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `timeout` | `number` | The timeout in milliseconds |

#### Returns

[`AlgorandClient`](types_algorand_client.AlgorandClient.md)

The `AlgorandClient` so method calls can be chained

#### Defined in

[src/types/algorand-client.ts:113](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L113)

___

### defaultLocalNet

▸ **defaultLocalNet**(): [`AlgorandClient`](types_algorand_client.AlgorandClient.md)

Returns an `AlgorandClient` pointing at default LocalNet ports and API token.

#### Returns

[`AlgorandClient`](types_algorand_client.AlgorandClient.md)

The `AlgorandClient`

#### Defined in

[src/types/algorand-client.ts:190](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L190)

___

### fromClients

▸ **fromClients**(`clients`): [`AlgorandClient`](types_algorand_client.AlgorandClient.md)

Returns an `AlgorandClient` pointing to the given client(s).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `clients` | [`AlgoSdkClients`](../interfaces/types_client_manager.AlgoSdkClients.md) | The clients to use |

#### Returns

[`AlgorandClient`](types_algorand_client.AlgorandClient.md)

The `AlgorandClient`

#### Defined in

[src/types/algorand-client.ts:227](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L227)

___

### fromConfig

▸ **fromConfig**(`config`): [`AlgorandClient`](types_algorand_client.AlgorandClient.md)

Returns an `AlgorandClient` from the given config.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`AlgoConfig`](../interfaces/types_network_client.AlgoConfig.md) | The config to use |

#### Returns

[`AlgorandClient`](types_algorand_client.AlgorandClient.md)

The `AlgorandClient`

#### Defined in

[src/types/algorand-client.ts:257](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L257)

___

### fromEnvironment

▸ **fromEnvironment**(): [`AlgorandClient`](types_algorand_client.AlgorandClient.md)

Returns an `AlgorandClient` loading the configuration from environment variables.

Retrieve configurations from environment variables when defined or get default LocalNet configuration if they aren't defined.

Expects to be called from a Node.js environment.

If `process.env.ALGOD_SERVER` is defined it will use that along with optional `process.env.ALGOD_PORT` and `process.env.ALGOD_TOKEN`.

If `process.env.INDEXER_SERVER` is defined it will use that along with optional `process.env.INDEXER_PORT` and `process.env.INDEXER_TOKEN`.

If either aren't defined it will use the default LocalNet config.

It will return a KMD configuration that uses `process.env.KMD_PORT` (or port 4002) if `process.env.ALGOD_SERVER` is defined,
otherwise it will use the default LocalNet config unless it detects testnet or mainnet.

#### Returns

[`AlgorandClient`](types_algorand_client.AlgorandClient.md)

The `AlgorandClient`

#### Defined in

[src/types/algorand-client.ts:248](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L248)

___

### mainNet

▸ **mainNet**(): [`AlgorandClient`](types_algorand_client.AlgorandClient.md)

Returns an `AlgorandClient` pointing at MainNet using AlgoNode.

#### Returns

[`AlgorandClient`](types_algorand_client.AlgorandClient.md)

The `AlgorandClient`

#### Defined in

[src/types/algorand-client.ts:214](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L214)

___

### testNet

▸ **testNet**(): [`AlgorandClient`](types_algorand_client.AlgorandClient.md)

Returns an `AlgorandClient` pointing at TestNet using AlgoNode.

#### Returns

[`AlgorandClient`](types_algorand_client.AlgorandClient.md)

The `AlgorandClient`

#### Defined in

[src/types/algorand-client.ts:202](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L202)
