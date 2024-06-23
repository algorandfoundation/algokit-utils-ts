[@algorandfoundation/algokit-utils](../README.md) / [types/algorand-client](../modules/types_algorand_client.md) / AlgorandClient

# Class: AlgorandClient

[types/algorand-client](../modules/types_algorand_client.md).AlgorandClient

A client that brokers easy access to Algorand functionality.

## Table of contents

### Constructors

- [constructor](types_algorand_client.AlgorandClient.md#constructor)

### Properties

- [\_accountManager](types_algorand_client.AlgorandClient.md#_accountmanager)
- [\_assetManager](types_algorand_client.AlgorandClient.md#_assetmanager)
- [\_cachedSuggestedParams](types_algorand_client.AlgorandClient.md#_cachedsuggestedparams)
- [\_cachedSuggestedParamsExpiry](types_algorand_client.AlgorandClient.md#_cachedsuggestedparamsexpiry)
- [\_cachedSuggestedParamsTimeout](types_algorand_client.AlgorandClient.md#_cachedsuggestedparamstimeout)
- [\_clientManager](types_algorand_client.AlgorandClient.md#_clientmanager)
- [\_defaultValidityWindow](types_algorand_client.AlgorandClient.md#_defaultvaliditywindow)
- [send](types_algorand_client.AlgorandClient.md#send)
- [transactions](types_algorand_client.AlgorandClient.md#transactions)

### Accessors

- [account](types_algorand_client.AlgorandClient.md#account)
- [asset](types_algorand_client.AlgorandClient.md#asset)
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

[src/types/algorand-client.ts:31](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L31)

## Properties

### \_accountManager

• `Private` **\_accountManager**: [`AccountManager`](types_account_manager.AccountManager.md)

#### Defined in

[src/types/algorand-client.ts:22](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L22)

___

### \_assetManager

• `Private` **\_assetManager**: [`AssetManager`](types_asset_manager.AssetManager.md)

#### Defined in

[src/types/algorand-client.ts:23](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L23)

___

### \_cachedSuggestedParams

• `Private` `Optional` **\_cachedSuggestedParams**: `SuggestedParams`

#### Defined in

[src/types/algorand-client.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L25)

___

### \_cachedSuggestedParamsExpiry

• `Private` `Optional` **\_cachedSuggestedParamsExpiry**: `Date`

#### Defined in

[src/types/algorand-client.ts:26](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L26)

___

### \_cachedSuggestedParamsTimeout

• `Private` **\_cachedSuggestedParamsTimeout**: `number` = `3_000`

#### Defined in

[src/types/algorand-client.ts:27](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L27)

___

### \_clientManager

• `Private` **\_clientManager**: [`ClientManager`](types_client_manager.ClientManager.md)

#### Defined in

[src/types/algorand-client.ts:21](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L21)

___

### \_defaultValidityWindow

• `Private` **\_defaultValidityWindow**: `number` = `10`

#### Defined in

[src/types/algorand-client.ts:29](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L29)

___

### send

• **send**: `Object`

Methods for sending a single transaction.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `appCall` | (`params`: [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `accountReferences?`: `string`[] ; `appId?`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram?`: `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: `BoxReference`[] ; `clearProgram?`: `Uint8Array` ; `extraPages?`: `number` ; `onComplete?`: `OnApplicationComplete` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalUints`: `number` ; `localByteSlices`: `number` ; `localUints`: `number`  }  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client.md#sendsingletransactionresult)\> | - |
| `assetConfig` | (`params`: [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `assetId`: `bigint` ; `clawback?`: `string` ; `freeze?`: `string` ; `manager`: `undefined` \| `string` ; `reserve?`: `string`  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client.md#sendsingletransactionresult)\> | - |
| `assetCreate` | (`params`: [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `assetName?`: `string` ; `clawback?`: `string` ; `decimals?`: `number` ; `defaultFrozen?`: `boolean` ; `freeze?`: `string` ; `manager?`: `string` ; `metadataHash?`: `string` \| `Uint8Array` ; `reserve?`: `string` ; `total`: `bigint` ; `unitName?`: `string` ; `url?`: `string`  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<\{ `assetId`: `bigint` ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> | - |
| `assetDestroy` | (`params`: [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `assetId`: `bigint`  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client.md#sendsingletransactionresult)\> | - |
| `assetFreeze` | (`params`: [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `account`: `string` ; `assetId`: `bigint` ; `frozen`: `boolean`  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client.md#sendsingletransactionresult)\> | - |
| `assetOptIn` | (`params`: [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `assetId`: `bigint`  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client.md#sendsingletransactionresult)\> | - |
| `assetOptOut` | (`params`: `Omit`\<[`AssetOptOutParams`](../modules/types_composer.md#assetoptoutparams), ``"creator"``\> & \{ `creator?`: `string` ; `ensureZeroBalance`: `boolean`  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client.md#sendsingletransactionresult)\> | - |
| `assetTransfer` | (`params`: [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `amount`: `bigint` ; `assetId`: `bigint` ; `clawbackTarget?`: `string` ; `closeAssetTo?`: `string` ; `receiver`: `string`  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client.md#sendsingletransactionresult)\> | - |
| `methodCall` | (`params`: [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & `Omit`\<[`AppCallParams`](../modules/types_composer.md#appcallparams), ``"args"``\> & \{ `appId`: `bigint` ; `args?`: (`TransactionWithSigner` \| `Transaction` \| `ABIValue` \| `Promise`\<`Transaction`\> \| [`MethodCallParams`](../modules/types_composer.md#methodcallparams))[] ; `method`: `ABIMethod`  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client.md#sendsingletransactionresult)\> | - |
| `onlineKeyRegistration` | (`params`: [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `selectionKey`: `Uint8Array` ; `stateProofKey?`: `Uint8Array` ; `voteFirst`: `bigint` ; `voteKey`: `Uint8Array` ; `voteKeyDilution`: `bigint` ; `voteLast`: `bigint`  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client.md#sendsingletransactionresult)\> | - |
| `payment` | (`params`: [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` ; `receiver`: `string`  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client.md#sendsingletransactionresult)\> | - |

#### Defined in

[src/types/algorand-client.ts:191](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L191)

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
| `assetOptOut` | (`params`: [`AssetOptOutParams`](../modules/types_composer.md#assetoptoutparams)) => `Promise`\<`Transaction`\> | - |
| `assetTransfer` | (`params`: [`AssetTransferParams`](../modules/types_composer.md#assettransferparams)) => `Promise`\<`Transaction`\> | - |
| `methodCall` | (`params`: [`MethodCallParams`](../modules/types_composer.md#methodcallparams)) => `Promise`\<`Transaction`[]\> | - |
| `onlineKeyRegistration` | (`params`: [`OnlineKeyRegistrationParams`](../modules/types_composer.md#onlinekeyregistrationparams)) => `Promise`\<`Transaction`\> | - |
| `payment` | (`params`: [`PaymentParams`](../modules/types_composer.md#paymentparams)) => `Promise`\<`Transaction`\> | - |

#### Defined in

[src/types/algorand-client.ts:603](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L603)

## Accessors

### account

• `get` **account**(): [`AccountManager`](types_account_manager.AccountManager.md)

Get or create accounts that can sign transactions.

#### Returns

[`AccountManager`](types_account_manager.AccountManager.md)

#### Defined in

[src/types/algorand-client.ts:134](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L134)

___

### asset

• `get` **asset**(): [`AssetManager`](types_asset_manager.AssetManager.md)

Methods for interacting with assets.

#### Returns

[`AssetManager`](types_asset_manager.AssetManager.md)

#### Defined in

[src/types/algorand-client.ts:139](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L139)

___

### client

• `get` **client**(): [`ClientManager`](types_client_manager.ClientManager.md)

Get clients, including algosdk clients and app clients.

#### Returns

[`ClientManager`](types_client_manager.ClientManager.md)

#### Defined in

[src/types/algorand-client.ts:129](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L129)

## Methods

### \_send

▸ **_send**\<`T`\>(`c`, `log?`): (`params`: `T` & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client.md#sendsingletransactionresult)\>

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

▸ (`params`): `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client.md#sendsingletransactionresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `T` & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md) |

##### Returns

`Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client.md#sendsingletransactionresult)\>

#### Defined in

[src/types/algorand-client.ts:153](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L153)

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

[src/types/algorand-client.ts:592](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L592)

___

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

[src/types/algorand-client.ts:144](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L144)

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

[src/types/algorand-client.ts:52](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L52)

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

[src/types/algorand-client.ts:42](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L42)

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

[src/types/algorand-client.ts:72](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L72)

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

[src/types/algorand-client.ts:889](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L889)

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

[src/types/algorand-client.ts:926](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L926)

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

[src/types/algorand-client.ts:956](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L956)

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

[src/types/algorand-client.ts:947](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L947)

___

### mainNet

▸ **mainNet**(): [`AlgorandClient`](types_algorand_client.AlgorandClient.md)

Returns an `AlgorandClient` pointing at MainNet using AlgoNode.

#### Returns

[`AlgorandClient`](types_algorand_client.AlgorandClient.md)

The `AlgorandClient`

#### Defined in

[src/types/algorand-client.ts:913](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L913)

___

### testNet

▸ **testNet**(): [`AlgorandClient`](types_algorand_client.AlgorandClient.md)

Returns an `AlgorandClient` pointing at TestNet using AlgoNode.

#### Returns

[`AlgorandClient`](types_algorand_client.AlgorandClient.md)

The `AlgorandClient`

#### Defined in

[src/types/algorand-client.ts:901](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L901)
