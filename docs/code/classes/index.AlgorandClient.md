[@algorandfoundation/algokit-utils](../README.md) / [index](../modules/index.md) / AlgorandClient

# Class: AlgorandClient

[index](../modules/index.md).AlgorandClient

A client that brokers easy access to Algorand functionality.

## Table of contents

### Constructors

- [constructor](index.AlgorandClient.md#constructor)

### Properties

- [\_accountManager](index.AlgorandClient.md#_accountmanager)
- [\_appDeployer](index.AlgorandClient.md#_appdeployer)
- [\_appManager](index.AlgorandClient.md#_appmanager)
- [\_assetManager](index.AlgorandClient.md#_assetmanager)
- [\_cachedSuggestedParams](index.AlgorandClient.md#_cachedsuggestedparams)
- [\_cachedSuggestedParamsExpiry](index.AlgorandClient.md#_cachedsuggestedparamsexpiry)
- [\_cachedSuggestedParamsTimeout](index.AlgorandClient.md#_cachedsuggestedparamstimeout)
- [\_clientManager](index.AlgorandClient.md#_clientmanager)
- [\_defaultValidityWindow](index.AlgorandClient.md#_defaultvaliditywindow)
- [\_errorTransformers](index.AlgorandClient.md#_errortransformers)
- [\_transactionCreator](index.AlgorandClient.md#_transactioncreator)
- [\_transactionSender](index.AlgorandClient.md#_transactionsender)

### Accessors

- [account](index.AlgorandClient.md#account)
- [app](index.AlgorandClient.md#app)
- [appDeployer](index.AlgorandClient.md#appdeployer)
- [asset](index.AlgorandClient.md#asset)
- [client](index.AlgorandClient.md#client)
- [createTransaction](index.AlgorandClient.md#createtransaction)
- [send](index.AlgorandClient.md#send)

### Methods

- [getSuggestedParams](index.AlgorandClient.md#getsuggestedparams)
- [newGroup](index.AlgorandClient.md#newgroup)
- [registerErrorTransformer](index.AlgorandClient.md#registererrortransformer)
- [setDefaultSigner](index.AlgorandClient.md#setdefaultsigner)
- [setDefaultValidityWindow](index.AlgorandClient.md#setdefaultvaliditywindow)
- [setSigner](index.AlgorandClient.md#setsigner)
- [setSignerFromAccount](index.AlgorandClient.md#setsignerfromaccount)
- [setSuggestedParamsCache](index.AlgorandClient.md#setsuggestedparamscache)
- [setSuggestedParamsCacheTimeout](index.AlgorandClient.md#setsuggestedparamscachetimeout)
- [unregisterErrorTransformer](index.AlgorandClient.md#unregistererrortransformer)
- [defaultLocalNet](index.AlgorandClient.md#defaultlocalnet)
- [fromClients](index.AlgorandClient.md#fromclients)
- [fromConfig](index.AlgorandClient.md#fromconfig)
- [fromEnvironment](index.AlgorandClient.md#fromenvironment)
- [mainNet](index.AlgorandClient.md#mainnet)
- [testNet](index.AlgorandClient.md#testnet)

## Constructors

### constructor

• **new AlgorandClient**(`config`): [`AlgorandClient`](index.AlgorandClient.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `AlgoConfig` \| `AlgoSdkClients` & `Partial`\<`AccountManagerConfig`\> |

#### Returns

[`AlgorandClient`](index.AlgorandClient.md)

#### Defined in

[src/algorand-client.ts:41](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L41)

## Properties

### \_accountManager

• `Private` **\_accountManager**: `AccountManager`

#### Defined in

[src/algorand-client.ts:21](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L21)

___

### \_appDeployer

• `Private` **\_appDeployer**: `AppDeployer`

#### Defined in

[src/algorand-client.ts:23](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L23)

___

### \_appManager

• `Private` **\_appManager**: `AppManager`

#### Defined in

[src/algorand-client.ts:22](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L22)

___

### \_assetManager

• `Private` **\_assetManager**: `AssetManager`

#### Defined in

[src/algorand-client.ts:24](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L24)

___

### \_cachedSuggestedParams

• `Private` `Optional` **\_cachedSuggestedParams**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `consensusVersion` | `string` | ConsensusVersion indicates the consensus protocol version as of LastRound. |
| `fee` | `bigint` | Fee is the suggested transaction fee Fee is in units of micro-Algos per byte. Fee may fall to zero but transactions must still have a fee of at least MinTxnFee for the current network protocol. |
| `firstValid` | `bigint` | - |
| `flatFee` | `boolean` | - |
| `genesisHash` | `Uint8Array` | GenesisHash is the hash of the genesis block. |
| `genesisId` | `string` | GenesisID is an ID listed in the genesis block. |
| `lastValid` | `bigint` | - |
| `minFee` | `bigint` | The minimum transaction fee (not per byte) required for the txn to validate for the current network protocol. |

#### Defined in

[src/algorand-client.ts:28](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L28)

___

### \_cachedSuggestedParamsExpiry

• `Private` `Optional` **\_cachedSuggestedParamsExpiry**: `Date`

#### Defined in

[src/algorand-client.ts:29](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L29)

___

### \_cachedSuggestedParamsTimeout

• `Private` **\_cachedSuggestedParamsTimeout**: `number` = `3_000`

#### Defined in

[src/algorand-client.ts:30](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L30)

___

### \_clientManager

• `Private` **\_clientManager**: `ClientManager`

#### Defined in

[src/algorand-client.ts:20](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L20)

___

### \_defaultValidityWindow

• `Private` **\_defaultValidityWindow**: `undefined` \| `bigint` = `undefined`

#### Defined in

[src/algorand-client.ts:32](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L32)

___

### \_errorTransformers

• `Private` **\_errorTransformers**: `Set`\<`ErrorTransformer`\>

A set of error transformers to use when an error is caught in simulate or execute
`registerErrorTransformer` and `unregisterErrorTransformer` can be used to add and remove
error transformers from the set.

#### Defined in

[src/algorand-client.ts:39](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L39)

___

### \_transactionCreator

• `Private` **\_transactionCreator**: `AlgorandClientTransactionCreator`

#### Defined in

[src/algorand-client.ts:26](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L26)

___

### \_transactionSender

• `Private` **\_transactionSender**: `AlgorandClientTransactionSender`

#### Defined in

[src/algorand-client.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L25)

## Accessors

### account

• `get` **account**(): `AccountManager`

Get or create accounts that can sign transactions.

#### Returns

`AccountManager`

The `AccountManager` instance.

**`Example`**

```ts
const accountManager = AlgorandClient.mainNet().account;
```

#### Defined in

[src/algorand-client.ts:183](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L183)

___

### app

• `get` **app**(): `AppManager`

Methods for interacting with apps.

#### Returns

`AppManager`

The `AppManager` instance.

**`Example`**

```ts
const appManager = AlgorandClient.mainNet().app;
```

#### Defined in

[src/algorand-client.ts:203](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L203)

___

### appDeployer

• `get` **appDeployer**(): `AppDeployer`

Methods for deploying apps and managing app deployment metadata.

#### Returns

`AppDeployer`

The `AppDeployer` instance.

**`Example`**

```ts
const deployer = AlgorandClient.mainNet().appDeployer;
```

#### Defined in

[src/algorand-client.ts:213](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L213)

___

### asset

• `get` **asset**(): `AssetManager`

Methods for interacting with assets.

#### Returns

`AssetManager`

The `AssetManager` instance.

**`Example`**

```ts
const assetManager = AlgorandClient.mainNet().asset;
```

#### Defined in

[src/algorand-client.ts:193](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L193)

___

### client

• `get` **client**(): `ClientManager`

Get clients, including algosdk clients and app clients.

#### Returns

`ClientManager`

The `ClientManager` instance.

**`Example`**

```ts
const clientManager = AlgorandClient.mainNet().client;
```

#### Defined in

[src/algorand-client.ts:173](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L173)

___

### createTransaction

• `get` **createTransaction**(): `AlgorandClientTransactionCreator`

Methods for creating a transaction.

#### Returns

`AlgorandClientTransactionCreator`

The `AlgorandClientTransactionCreator` instance.

**`Example`**

```ts
const payment = await AlgorandClient.mainNet().createTransaction.payment({
 sender: "SENDERADDRESS",
 receiver: "RECEIVERADDRESS",
 amount: algo(1)
})
```

#### Defined in

[src/algorand-client.ts:271](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L271)

___

### send

• `get` **send**(): `AlgorandClientTransactionSender`

Methods for sending a transaction.

#### Returns

`AlgorandClientTransactionSender`

The `AlgorandClientTransactionSender` instance.

**`Example`**

```ts
const result = await AlgorandClient.mainNet().send.payment({
 sender: "SENDERADDRESS",
 receiver: "RECEIVERADDRESS",
 amount: algo(1)
})
```

#### Defined in

[src/algorand-client.ts:257](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L257)

## Methods

### getSuggestedParams

▸ **getSuggestedParams**(): `Promise`\<\{ `consensusVersion`: `string` ; `fee`: `bigint` ; `firstValid`: `bigint` ; `flatFee`: `boolean` ; `genesisHash`: `Uint8Array` ; `genesisId`: `string` ; `lastValid`: `bigint` ; `minFee`: `bigint`  }\>

Get suggested params for a transaction (either cached or from algod if the cache is stale or empty)

#### Returns

`Promise`\<\{ `consensusVersion`: `string` ; `fee`: `bigint` ; `firstValid`: `bigint` ; `flatFee`: `boolean` ; `genesisHash`: `Uint8Array` ; `genesisId`: `string` ; `lastValid`: `bigint` ; `minFee`: `bigint`  }\>

The suggested transaction parameters.

**`Example`**

```ts
const params = await AlgorandClient.mainNet().getSuggestedParams();
```

#### Defined in

[src/algorand-client.ts:152](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L152)

___

### newGroup

▸ **newGroup**(`composerConfig?`): `TransactionComposer`

Start a new `TransactionComposer` transaction group

#### Parameters

| Name | Type |
| :------ | :------ |
| `composerConfig?` | `TransactionComposerConfig` |

#### Returns

`TransactionComposer`

A new instance of `TransactionComposer`.

**`Example`**

```ts
const composer = AlgorandClient.mainNet().newGroup();
const result = await composer.addTransaction(payment).send()
```

#### Defined in

[src/algorand-client.ts:235](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L235)

___

### registerErrorTransformer

▸ **registerErrorTransformer**(`transformer`): `void`

Register a function that will be used to transform an error caught when simulating or executing
composed transaction groups made from `newGroup`

#### Parameters

| Name | Type |
| :------ | :------ |
| `transformer` | `ErrorTransformer` |

#### Returns

`void`

#### Defined in

[src/algorand-client.ts:221](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L221)

___

### setDefaultSigner

▸ **setDefaultSigner**(`signer`): [`AlgorandClient`](index.AlgorandClient.md)

Sets the default signer to use if no other signer is specified.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `AddressWithTransactionSigner` \| `TransactionSigner` | The signer to use, either a `TransactionSigner` or a `AddressWithSigner` |

#### Returns

[`AlgorandClient`](index.AlgorandClient.md)

The `AlgorandClient` so method calls can be chained

**`Example`**

```typescript
const signer = new SigningAccount(account, account.addr)
const algorand = AlgorandClient.mainNet().setDefaultSigner(signer)
```

#### Defined in

[src/algorand-client.ts:75](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L75)

___

### setDefaultValidityWindow

▸ **setDefaultValidityWindow**(`validityWindow`): [`AlgorandClient`](index.AlgorandClient.md)

Sets the default validity window for transactions.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `validityWindow` | `number` \| `bigint` | The number of rounds between the first and last valid rounds |

#### Returns

[`AlgorandClient`](index.AlgorandClient.md)

The `AlgorandClient` so method calls can be chained

**`Example`**

```typescript
const algorand = AlgorandClient.mainNet().setDefaultValidityWindow(1000);
```

#### Defined in

[src/algorand-client.ts:60](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L60)

___

### setSigner

▸ **setSigner**(`sender`, `signer`): [`AlgorandClient`](index.AlgorandClient.md)

Tracks the given signer against the given sender for later signing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sender` | `string` \| [`Address`](index.Address.md) | The sender address to use this signer for |
| `signer` | `TransactionSigner` | The signer to sign transactions with for the given sender |

#### Returns

[`AlgorandClient`](index.AlgorandClient.md)

The `AlgorandClient` so method calls can be chained

**`Example`**

```typescript
const signer = new SigningAccount(account, account.addr)
const algorand = AlgorandClient.mainNet().setSigner(signer.addr, signer.signer)
```

#### Defined in

[src/algorand-client.ts:111](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L111)

___

### setSignerFromAccount

▸ **setSignerFromAccount**(`account`): [`AlgorandClient`](index.AlgorandClient.md)

Tracks the given account (object that encapsulates an address and a signer) for later signing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | `MultisigAccount` \| `AddressWithTransactionSigner` \| `LogicSigAccount` | The account to register, which can be a `AddressWithSigner` or a `algosdk.Account`, `algosdk.LogicSigAccount`, `SigningAccount` or `MultisigAccount` |

#### Returns

[`AlgorandClient`](index.AlgorandClient.md)

The `AlgorandClient` so method calls can be chained

**`Example`**

```typescript
const accountManager = AlgorandClient.mainNet()
 .setSignerFromAccount(algosdk.generateAccount())
 .setSignerFromAccount(new algosdk.LogicSigAccount(program, args))
 .setSignerFromAccount(new SigningAccount(account, sender))
 .setSignerFromAccount(new MultisigAccount({version: 1, threshold: 1, addrs: ["ADDRESS1...", "ADDRESS2..."]}, [account1, account2]))
 .setSignerFromAccount({addr: "SENDERADDRESS", signer: transactionSigner})
```

#### Defined in

[src/algorand-client.ts:95](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L95)

___

### setSuggestedParamsCache

▸ **setSuggestedParamsCache**(`suggestedParams`, `until?`): [`AlgorandClient`](index.AlgorandClient.md)

Sets a cache value to use for suggested transaction params.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `suggestedParams` | `Object` | The suggested params to use |
| `suggestedParams.consensusVersion` | `string` | ConsensusVersion indicates the consensus protocol version as of LastRound. |
| `suggestedParams.fee` | `bigint` | Fee is the suggested transaction fee Fee is in units of micro-Algos per byte. Fee may fall to zero but transactions must still have a fee of at least MinTxnFee for the current network protocol. |
| `suggestedParams.firstValid` | `bigint` | - |
| `suggestedParams.flatFee` | `boolean` | - |
| `suggestedParams.genesisHash` | `Uint8Array` | GenesisHash is the hash of the genesis block. |
| `suggestedParams.genesisId` | `string` | GenesisID is an ID listed in the genesis block. |
| `suggestedParams.lastValid` | `bigint` | - |
| `suggestedParams.minFee` | `bigint` | The minimum transaction fee (not per byte) required for the txn to validate for the current network protocol. |
| `until?` | `Date` | A date until which to cache, or if not specified then the timeout is used |

#### Returns

[`AlgorandClient`](index.AlgorandClient.md)

The `AlgorandClient` so method calls can be chained

**`Example`**

```typescript
const algorand = AlgorandClient.mainNet().setSuggestedParamsCache(suggestedParams, new Date(+new Date() + 3_600_000))
```

#### Defined in

[src/algorand-client.ts:126](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L126)

___

### setSuggestedParamsCacheTimeout

▸ **setSuggestedParamsCacheTimeout**(`timeout`): [`AlgorandClient`](index.AlgorandClient.md)

Sets the timeout for caching suggested params.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `timeout` | `number` | The timeout in milliseconds |

#### Returns

[`AlgorandClient`](index.AlgorandClient.md)

The `AlgorandClient` so method calls can be chained

**`Example`**

```typescript
const algorand = AlgorandClient.mainNet().setSuggestedParamsCacheTimeout(10_000)
```

#### Defined in

[src/algorand-client.ts:141](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L141)

___

### unregisterErrorTransformer

▸ **unregisterErrorTransformer**(`transformer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `transformer` | `ErrorTransformer` |

#### Returns

`void`

#### Defined in

[src/algorand-client.ts:225](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L225)

___

### defaultLocalNet

▸ **defaultLocalNet**(): [`AlgorandClient`](index.AlgorandClient.md)

Creates an `AlgorandClient` pointing at default LocalNet ports and API token.

#### Returns

[`AlgorandClient`](index.AlgorandClient.md)

An instance of the `AlgorandClient`.

**`Example`**

```ts
const algorand = AlgorandClient.defaultLocalNet();
```

#### Defined in

[src/algorand-client.ts:283](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L283)

___

### fromClients

▸ **fromClients**(`clients`): [`AlgorandClient`](index.AlgorandClient.md)

Creates an `AlgorandClient` pointing to the given client(s).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `clients` | `AlgoSdkClients` | The clients to use. |

#### Returns

[`AlgorandClient`](index.AlgorandClient.md)

An instance of the `AlgorandClient`.

**`Example`**

```ts
const algorand = AlgorandClient.fromClients({ algod, indexer, kmd });
```

#### Defined in

[src/algorand-client.ts:326](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L326)

___

### fromConfig

▸ **fromConfig**(`config`): [`AlgorandClient`](index.AlgorandClient.md)

Creates  an `AlgorandClient` from the given config.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `AlgoConfig` | The config to use. |

#### Returns

[`AlgorandClient`](index.AlgorandClient.md)

An instance of the `AlgorandClient`.

**`Example`**

```ts
const client = AlgorandClient.fromConfig({ algodConfig, indexerConfig, kmdConfig });
```

#### Defined in

[src/algorand-client.ts:360](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L360)

___

### fromEnvironment

▸ **fromEnvironment**(): [`AlgorandClient`](index.AlgorandClient.md)

Creates an `AlgorandClient` loading the configuration from environment variables.

Retrieve configurations from environment variables when defined or get default LocalNet configuration if they aren't defined.

Expects to be called from a Node.js environment.

If `process.env.ALGOD_SERVER` is defined it will use that along with optional `process.env.ALGOD_PORT` and `process.env.ALGOD_TOKEN`.

If `process.env.INDEXER_SERVER` is defined it will use that along with optional `process.env.INDEXER_PORT` and `process.env.INDEXER_TOKEN`.

If either aren't defined it will use the default LocalNet config.

It will return a KMD configuration that uses `process.env.KMD_PORT` (or port 4002) if `process.env.ALGOD_SERVER` is defined,
otherwise it will use the default LocalNet config unless it detects testnet or mainnet.

#### Returns

[`AlgorandClient`](index.AlgorandClient.md)

An instance of the `AlgorandClient`.

**`Example`**

```ts
const client = AlgorandClient.fromEnvironment();
```

#### Defined in

[src/algorand-client.ts:349](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L349)

___

### mainNet

▸ **mainNet**(): [`AlgorandClient`](index.AlgorandClient.md)

Creates an `AlgorandClient` pointing at MainNet using AlgoNode.

#### Returns

[`AlgorandClient`](index.AlgorandClient.md)

An instance of the `AlgorandClient`.

**`Example`**

```ts
const algorand = AlgorandClient.mainNet();
```

#### Defined in

[src/algorand-client.ts:311](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L311)

___

### testNet

▸ **testNet**(): [`AlgorandClient`](index.AlgorandClient.md)

Creates an `AlgorandClient` pointing at TestNet using AlgoNode.

#### Returns

[`AlgorandClient`](index.AlgorandClient.md)

An instance of the `AlgorandClient`.

**`Example`**

```ts
const algorand = AlgorandClient.testNet();
```

#### Defined in

[src/algorand-client.ts:297](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/algorand-client.ts#L297)
