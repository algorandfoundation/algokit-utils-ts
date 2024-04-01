[@algorandfoundation/algokit-utils](../README.md) / [types/algorand-client](../modules/types_algorand_client.md) / AlgorandClient

# Class: AlgorandClient

[types/algorand-client](../modules/types_algorand_client.md).AlgorandClient

A client that brokers easy access to Algorand functionality.

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

[src/types/algorand-client.ts:44](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L44)

## Properties

### \_accountManager

• `Private` **\_accountManager**: [`AccountManager`](types_account_manager.AccountManager.md)

#### Defined in

[src/types/algorand-client.ts:36](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L36)

___

### \_cachedSuggestedParams

• `Private` `Optional` **\_cachedSuggestedParams**: `SuggestedParams`

#### Defined in

[src/types/algorand-client.ts:38](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L38)

___

### \_cachedSuggestedParamsExpiry

• `Private` `Optional` **\_cachedSuggestedParamsExpiry**: `Date`

#### Defined in

[src/types/algorand-client.ts:39](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L39)

___

### \_cachedSuggestedParamsTimeout

• `Private` **\_cachedSuggestedParamsTimeout**: `number` = `3_000`

#### Defined in

[src/types/algorand-client.ts:40](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L40)

___

### \_clientManager

• `Private` **\_clientManager**: [`ClientManager`](types_client_manager.ClientManager.md)

#### Defined in

[src/types/algorand-client.ts:35](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L35)

___

### \_defaultValidityWindow

• `Private` **\_defaultValidityWindow**: `number` = `10`

#### Defined in

[src/types/algorand-client.ts:42](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L42)

___

### send

• **send**: `Object`

Methods for sending a transaction

#### Type declaration

| Name | Type |
| :------ | :------ |
| `appCall` | (`params`: [`AppCallParams`](../modules/types_composer.md#appcallparams)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations?`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txId`: `string` ; `txIds`: `string`[]  }\> |
| `assetConfig` | (`params`: [`AssetConfigParams`](../modules/types_composer.md#assetconfigparams)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations?`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txId`: `string` ; `txIds`: `string`[]  }\> |
| `assetCreate` | (`params`: [`AssetCreateParams`](../modules/types_composer.md#assetcreateparams)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations?`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txId`: `string` ; `txIds`: `string`[]  }\> |
| `assetDestroy` | (`params`: [`AssetDestroyParams`](../modules/types_composer.md#assetdestroyparams)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations?`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txId`: `string` ; `txIds`: `string`[]  }\> |
| `assetFreeze` | (`params`: [`AssetFreezeParams`](../modules/types_composer.md#assetfreezeparams)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations?`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txId`: `string` ; `txIds`: `string`[]  }\> |
| `assetOptIn` | (`params`: [`AssetOptInParams`](../modules/types_composer.md#assetoptinparams)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations?`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txId`: `string` ; `txIds`: `string`[]  }\> |
| `assetTransfer` | (`params`: [`AssetTransferParams`](../modules/types_composer.md#assettransferparams)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations?`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txId`: `string` ; `txIds`: `string`[]  }\> |
| `methodCall` | (`params`: [`MethodCallParams`](../modules/types_composer.md#methodcallparams)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations?`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txId`: `string` ; `txIds`: `string`[]  }\> |
| `onlineKeyReg` | (`params`: [`OnlineKeyRegParams`](../modules/types_composer.md#onlinekeyregparams)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations?`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txId`: `string` ; `txIds`: `string`[]  }\> |
| `payment` | (`params`: [`PayTxnParams`](../modules/types_composer.md#paytxnparams)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations?`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txId`: `string` ; `txIds`: `string`[]  }\> |

#### Defined in

[src/types/algorand-client.ts:151](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L151)

___

### transactions

• **transactions**: `Object`

Methods for building transactions

#### Type declaration

| Name | Type |
| :------ | :------ |
| `appCall` | (`params`: [`AppCallParams`](../modules/types_composer.md#appcallparams)) => `Promise`\<`Transaction`\> |
| `assetConfig` | (`params`: [`AssetConfigParams`](../modules/types_composer.md#assetconfigparams)) => `Promise`\<`Transaction`\> |
| `assetCreate` | (`params`: [`AssetCreateParams`](../modules/types_composer.md#assetcreateparams)) => `Promise`\<`Transaction`\> |
| `assetDestroy` | (`params`: [`AssetDestroyParams`](../modules/types_composer.md#assetdestroyparams)) => `Promise`\<`Transaction`\> |
| `assetFreeze` | (`params`: [`AssetFreezeParams`](../modules/types_composer.md#assetfreezeparams)) => `Promise`\<`Transaction`\> |
| `assetOptIn` | (`params`: [`AssetOptInParams`](../modules/types_composer.md#assetoptinparams)) => `Promise`\<`Transaction`\> |
| `assetTransfer` | (`params`: [`AssetTransferParams`](../modules/types_composer.md#assettransferparams)) => `Promise`\<`Transaction`\> |
| `methodCall` | (`params`: [`MethodCallParams`](../modules/types_composer.md#methodcallparams)) => `Promise`\<`Transaction`[]\> |
| `onlineKeyReg` | (`params`: [`OnlineKeyRegParams`](../modules/types_composer.md#onlinekeyregparams)) => `Promise`\<`Transaction`\> |
| `payment` | (`params`: [`PayTxnParams`](../modules/types_composer.md#paytxnparams)) => `Promise`\<`Transaction`\> |

#### Defined in

[src/types/algorand-client.ts:187](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L187)

## Accessors

### account

• `get` **account**(): [`AccountManager`](types_account_manager.AccountManager.md)

Get or create accounts that can sign transactions.

#### Returns

[`AccountManager`](types_account_manager.AccountManager.md)

#### Defined in

[src/types/algorand-client.ts:134](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L134)

___

### client

• `get` **client**(): [`ClientManager`](types_client_manager.ClientManager.md)

Get clients, including algosdk clients and app clients.

#### Returns

[`ClientManager`](types_client_manager.ClientManager.md)

#### Defined in

[src/types/algorand-client.ts:129](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L129)

## Methods

### getSuggestedParams

▸ **getSuggestedParams**(): `Promise`\<`SuggestedParams`\>

Get suggested params for a transaction (either cached or from algod if the cache is stale or empty)

#### Returns

`Promise`\<`SuggestedParams`\>

#### Defined in

[src/types/algorand-client.ts:113](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L113)

___

### newGroup

▸ **newGroup**(): [`default`](types_composer.default.md)

Start a new `AlgokitComposer` transaction group

#### Returns

[`default`](types_composer.default.md)

#### Defined in

[src/types/algorand-client.ts:139](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L139)

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

[src/types/algorand-client.ts:64](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L64)

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

[src/types/algorand-client.ts:54](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L54)

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

[src/types/algorand-client.ts:85](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L85)

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

[src/types/algorand-client.ts:74](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L74)

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

[src/types/algorand-client.ts:96](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L96)

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

[src/types/algorand-client.ts:107](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L107)

___

### defaultLocalNet

▸ **defaultLocalNet**(): [`AlgorandClient`](types_algorand_client.AlgorandClient.md)

Returns an `AlgorandClient` pointing at default LocalNet ports and API token.

#### Returns

[`AlgorandClient`](types_algorand_client.AlgorandClient.md)

The `AlgorandClient`

#### Defined in

[src/types/algorand-client.ts:226](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L226)

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

[src/types/algorand-client.ts:263](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L263)

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

[src/types/algorand-client.ts:284](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L284)

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

[src/types/algorand-client.ts:275](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L275)

___

### mainNet

▸ **mainNet**(): [`AlgorandClient`](types_algorand_client.AlgorandClient.md)

Returns an `AlgorandClient` pointing at MainNet using AlgoNode.

#### Returns

[`AlgorandClient`](types_algorand_client.AlgorandClient.md)

The `AlgorandClient`

#### Defined in

[src/types/algorand-client.ts:250](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L250)

___

### testNet

▸ **testNet**(): [`AlgorandClient`](types_algorand_client.AlgorandClient.md)

Returns an `AlgorandClient` pointing at TestNet using AlgoNode.

#### Returns

[`AlgorandClient`](types_algorand_client.AlgorandClient.md)

The `AlgorandClient`

#### Defined in

[src/types/algorand-client.ts:238](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L238)
