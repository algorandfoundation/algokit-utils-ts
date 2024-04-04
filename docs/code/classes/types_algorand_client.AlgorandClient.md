[@algorandfoundation/algokit-utils](../README.md) / [types/algorand-client](../modules/types_algorand_client.md) / AlgorandClient

# Class: AlgorandClient

[types/algorand-client](../modules/types_algorand_client.md).AlgorandClient

A client that brokers easy access to Algorand functionality.

Note: this class is a new Beta feature and may be subject to change.

## Table of contents

### Constructors

- [constructor](types_algorand_client.AlgorandClient.md#constructor)

### Properties

- [\_accountManager](types_algorand_client.AlgorandClient.md#_accountmanager)
- [\_cachedSuggestedParams](types_algorand_client.AlgorandClient.md#_cachedsuggestedparams)
- [\_cachedSuggestedParamsExpiry](types_algorand_client.AlgorandClient.md#_cachedsuggestedparamsexpiry)
- [\_cachedSuggestedParamsTimeout](types_algorand_client.AlgorandClient.md#_cachedsuggestedparamstimeout)
- [\_clientManager](types_algorand_client.AlgorandClient.md#_clientmanager)
- [\_defaultValidityWindow](types_algorand_client.AlgorandClient.md#_defaultvaliditywindow)
- [send](types_algorand_client.AlgorandClient.md#send)
- [transactions](types_algorand_client.AlgorandClient.md#transactions)

### Accessors

- [account](types_algorand_client.AlgorandClient.md#account)
- [client](types_algorand_client.AlgorandClient.md#client)

### Methods

- [\_send](types_algorand_client.AlgorandClient.md#_send)
- [\_transaction](types_algorand_client.AlgorandClient.md#_transaction)
- [getSuggestedParams](types_algorand_client.AlgorandClient.md#getsuggestedparams)
- [newGroup](types_algorand_client.AlgorandClient.md#newgroup)
- [setDefaultSigner](types_algorand_client.AlgorandClient.md#setdefaultsigner)
- [setDefaultValidityWindow](types_algorand_client.AlgorandClient.md#setdefaultvaliditywindow)
- [setSigner](types_algorand_client.AlgorandClient.md#setsigner)
- [setSignerFromAccount](types_algorand_client.AlgorandClient.md#setsignerfromaccount)
- [setSuggestedParams](types_algorand_client.AlgorandClient.md#setsuggestedparams)
- [setSuggestedParamsTimeout](types_algorand_client.AlgorandClient.md#setsuggestedparamstimeout)
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

[src/types/algorand-client.ts:29](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L29)

## Properties

### \_accountManager

• `Private` **\_accountManager**: [`AccountManager`](types_account_manager.AccountManager.md)

#### Defined in

[src/types/algorand-client.ts:21](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L21)

___

### \_cachedSuggestedParams

• `Private` `Optional` **\_cachedSuggestedParams**: `SuggestedParams`

#### Defined in

[src/types/algorand-client.ts:23](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L23)

___

### \_cachedSuggestedParamsExpiry

• `Private` `Optional` **\_cachedSuggestedParamsExpiry**: `Date`

#### Defined in

[src/types/algorand-client.ts:24](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L24)

___

### \_cachedSuggestedParamsTimeout

• `Private` **\_cachedSuggestedParamsTimeout**: `number` = `3_000`

#### Defined in

[src/types/algorand-client.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L25)

___

### \_clientManager

• `Private` **\_clientManager**: [`ClientManager`](types_client_manager.ClientManager.md)

#### Defined in

[src/types/algorand-client.ts:20](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L20)

___

### \_defaultValidityWindow

• `Private` **\_defaultValidityWindow**: `number` = `10`

#### Defined in

[src/types/algorand-client.ts:27](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L27)

___

### send

• **send**: `Object`

Methods for sending a single transaction.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `appCall` | (`params`: [`AppCallParams`](../modules/types_composer.md#appcallparams), `config?`: [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client.md#sendsingletransactionresult)\> | - |
| `assetConfig` | (`params`: [`AssetConfigParams`](../modules/types_composer.md#assetconfigparams), `config?`: [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client.md#sendsingletransactionresult)\> | - |
| `assetCreate` | (`params`: [`AssetCreateParams`](../modules/types_composer.md#assetcreateparams), `config?`: [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client.md#sendsingletransactionresult)\> | - |
| `assetDestroy` | (`params`: [`AssetDestroyParams`](../modules/types_composer.md#assetdestroyparams), `config?`: [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client.md#sendsingletransactionresult)\> | - |
| `assetFreeze` | (`params`: [`AssetFreezeParams`](../modules/types_composer.md#assetfreezeparams), `config?`: [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client.md#sendsingletransactionresult)\> | - |
| `assetOptIn` | (`params`: [`AssetOptInParams`](../modules/types_composer.md#assetoptinparams), `config?`: [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client.md#sendsingletransactionresult)\> | - |
| `assetTransfer` | (`params`: [`AssetTransferParams`](../modules/types_composer.md#assettransferparams), `config?`: [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client.md#sendsingletransactionresult)\> | - |
| `methodCall` | (`params`: [`MethodCallParams`](../modules/types_composer.md#methodcallparams), `config?`: [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client.md#sendsingletransactionresult)\> | - |
| `onlineKeyRegistration` | (`params`: [`OnlineKeyRegistrationParams`](../modules/types_composer.md#onlinekeyregistrationparams), `config?`: [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client.md#sendsingletransactionresult)\> | - |
| `payment` | (`params`: [`PaymentParams`](../modules/types_composer.md#paymentparams), `config?`: [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client.md#sendsingletransactionresult)\> | - |

#### Defined in

[src/types/algorand-client.ts:171](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L171)

___

### transactions

• **transactions**: `Object`

Methods for building transactions

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `appCall` | (`params`: [`AppCallParams`](../modules/types_composer.md#appcallparams)) => `Promise`\<`Transaction`\> | - |
| `assetConfig` | (`params`: [`AssetConfigParams`](../modules/types_composer.md#assetconfigparams)) => `Promise`\<`Transaction`\> | - |
| `assetCreate` | (`params`: [`AssetCreateParams`](../modules/types_composer.md#assetcreateparams)) => `Promise`\<`Transaction`\> | - |
| `assetDestroy` | (`params`: [`AssetDestroyParams`](../modules/types_composer.md#assetdestroyparams)) => `Promise`\<`Transaction`\> | - |
| `assetFreeze` | (`params`: [`AssetFreezeParams`](../modules/types_composer.md#assetfreezeparams)) => `Promise`\<`Transaction`\> | - |
| `assetOptIn` | (`params`: [`AssetOptInParams`](../modules/types_composer.md#assetoptinparams)) => `Promise`\<`Transaction`\> | - |
| `assetTransfer` | (`params`: [`AssetTransferParams`](../modules/types_composer.md#assettransferparams)) => `Promise`\<`Transaction`\> | - |
| `methodCall` | (`params`: [`MethodCallParams`](../modules/types_composer.md#methodcallparams)) => `Promise`\<`Transaction`[]\> | - |
| `onlineKeyRegistration` | (`params`: [`OnlineKeyRegistrationParams`](../modules/types_composer.md#onlinekeyregistrationparams)) => `Promise`\<`Transaction`\> | - |
| `payment` | (`params`: [`PaymentParams`](../modules/types_composer.md#paymentparams)) => `Promise`\<`Transaction`\> | - |

#### Defined in

[src/types/algorand-client.ts:247](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L247)

## Accessors

### account

• `get` **account**(): [`AccountManager`](types_account_manager.AccountManager.md)

Get or create accounts that can sign transactions.

#### Returns

[`AccountManager`](types_account_manager.AccountManager.md)

#### Defined in

[src/types/algorand-client.ts:119](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L119)

___

### client

• `get` **client**(): [`ClientManager`](types_client_manager.ClientManager.md)

Get clients, including algosdk clients and app clients.

#### Returns

[`ClientManager`](types_client_manager.ClientManager.md)

#### Defined in

[src/types/algorand-client.ts:114](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L114)

## Methods

### \_send

▸ **_send**\<`T`\>(`c`, `log?`): (`params`: `T`, `config?`: [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client.md#sendsingletransactionresult)\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `c` | (`c`: [`default`](types_composer.default.md)) => (`params`: `T`) => [`default`](types_composer.default.md) |
| `log?` | `Object` |
| `log.postLog?` | (`params`: `T`, `result`: [`SendSingleTransactionResult`](../modules/types_algorand_client.md#sendsingletransactionresult)) => `string` |
| `log.preLog?` | (`params`: `T`, `transaction`: `Transaction`) => `string` |

#### Returns

`fn`

▸ (`params`, `config?`): `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client.md#sendsingletransactionresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `T` |
| `config?` | [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md) |

##### Returns

`Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client.md#sendsingletransactionresult)\>

#### Defined in

[src/types/algorand-client.ts:133](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L133)

___

### \_transaction

▸ **_transaction**\<`T`\>(`c`): (`params`: `T`) => `Promise`\<`Transaction`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `c` | (`c`: [`default`](types_composer.default.md)) => (`params`: `T`) => [`default`](types_composer.default.md) |

#### Returns

`fn`

▸ (`params`): `Promise`\<`Transaction`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `T` |

##### Returns

`Promise`\<`Transaction`\>

#### Defined in

[src/types/algorand-client.ts:236](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L236)

___

### getSuggestedParams

▸ **getSuggestedParams**(): `Promise`\<`SuggestedParams`\>

Get suggested params for a transaction (either cached or from algod if the cache is stale or empty)

#### Returns

`Promise`\<`SuggestedParams`\>

#### Defined in

[src/types/algorand-client.ts:98](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L98)

___

### newGroup

▸ **newGroup**(): [`default`](types_composer.default.md)

Start a new `AlgokitComposer` transaction group

#### Returns

[`default`](types_composer.default.md)

#### Defined in

[src/types/algorand-client.ts:124](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L124)

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

[src/types/algorand-client.ts:49](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L49)

___

### setDefaultValidityWindow

▸ **setDefaultValidityWindow**(`validityWindow`): [`AlgorandClient`](types_algorand_client.AlgorandClient.md)

Sets the default validity window for transactions.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `validityWindow` | `number` | The number of rounds between the first and last valid rounds |

#### Returns

[`AlgorandClient`](types_algorand_client.AlgorandClient.md)

The `AlgorandClient` so method calls can be chained

#### Defined in

[src/types/algorand-client.ts:39](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L39)

___

### setSigner

▸ **setSigner**(`sender`, `signer`): [`AlgorandClient`](types_algorand_client.AlgorandClient.md)

Tracks the given account for later signing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sender` | `string` | The sender address to use this signer for |
| `signer` | `TransactionSigner` | The signer to sign transactions with for the given sender |

#### Returns

[`AlgorandClient`](types_algorand_client.AlgorandClient.md)

The `AlgorandClient` so method calls can be chained

#### Defined in

[src/types/algorand-client.ts:70](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L70)

___

### setSignerFromAccount

▸ **setSignerFromAccount**(`account`): [`AlgorandClient`](types_algorand_client.AlgorandClient.md)

Tracks the given account for later signing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom) | The account to register |

#### Returns

[`AlgorandClient`](types_algorand_client.AlgorandClient.md)

The `AlgorandClient` so method calls can be chained

#### Defined in

[src/types/algorand-client.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L59)

___

### setSuggestedParams

▸ **setSuggestedParams**(`suggestedParams`, `until?`): [`AlgorandClient`](types_algorand_client.AlgorandClient.md)

Sets a cache value to use for suggested params.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `suggestedParams` | `SuggestedParams` | The suggested params to use |
| `until?` | `Date` | A date until which to cache, or if not specified then the timeout is used |

#### Returns

[`AlgorandClient`](types_algorand_client.AlgorandClient.md)

The `AlgorandClient` so method calls can be chained

#### Defined in

[src/types/algorand-client.ts:81](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L81)

___

### setSuggestedParamsTimeout

▸ **setSuggestedParamsTimeout**(`timeout`): [`AlgorandClient`](types_algorand_client.AlgorandClient.md)

Sets the timeout for caching suggested params.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `timeout` | `number` | The timeout in milliseconds |

#### Returns

[`AlgorandClient`](types_algorand_client.AlgorandClient.md)

The `AlgorandClient` so method calls can be chained

#### Defined in

[src/types/algorand-client.ts:92](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L92)

___

### defaultLocalNet

▸ **defaultLocalNet**(): [`AlgorandClient`](types_algorand_client.AlgorandClient.md)

Returns an `AlgorandClient` pointing at default LocalNet ports and API token.

#### Returns

[`AlgorandClient`](types_algorand_client.AlgorandClient.md)

The `AlgorandClient`

#### Defined in

[src/types/algorand-client.ts:278](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L278)

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

[src/types/algorand-client.ts:315](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L315)

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

[src/types/algorand-client.ts:336](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L336)

___

### fromEnvironment

▸ **fromEnvironment**(): [`AlgorandClient`](types_algorand_client.AlgorandClient.md)

Returns an `AlgorandClient` loading the configuration from environment variables.

Retrieve configurations from environment variables when defined or get defaults.

Expects to be called from a Node.js environment.

#### Returns

[`AlgorandClient`](types_algorand_client.AlgorandClient.md)

The `AlgorandClient`

#### Defined in

[src/types/algorand-client.ts:327](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L327)

___

### mainNet

▸ **mainNet**(): [`AlgorandClient`](types_algorand_client.AlgorandClient.md)

Returns an `AlgorandClient` pointing at MainNet using AlgoNode.

#### Returns

[`AlgorandClient`](types_algorand_client.AlgorandClient.md)

The `AlgorandClient`

#### Defined in

[src/types/algorand-client.ts:302](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L302)

___

### testNet

▸ **testNet**(): [`AlgorandClient`](types_algorand_client.AlgorandClient.md)

Returns an `AlgorandClient` pointing at TestNet using AlgoNode.

#### Returns

[`AlgorandClient`](types_algorand_client.AlgorandClient.md)

The `AlgorandClient`

#### Defined in

[src/types/algorand-client.ts:290](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L290)
