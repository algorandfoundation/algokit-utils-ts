[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/algorand-client](../README.md) / AlgorandClient

# Class: AlgorandClient

Defined in: [src/types/algorand-client.ts:18](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L18)

A client that brokers easy access to Algorand functionality.

## Accessors

### account

#### Get Signature

> **get** **account**(): [`AccountManager`](../../account-manager/classes/AccountManager.md)

Defined in: [src/types/algorand-client.ts:182](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L182)

Get or create accounts that can sign transactions.

##### Example

```ts
const accountManager = AlgorandClient.mainNet().account;
```

##### Returns

[`AccountManager`](../../account-manager/classes/AccountManager.md)

The `AccountManager` instance.

***

### app

#### Get Signature

> **get** **app**(): [`AppManager`](../../app-manager/classes/AppManager.md)

Defined in: [src/types/algorand-client.ts:202](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L202)

Methods for interacting with apps.

##### Example

```ts
const appManager = AlgorandClient.mainNet().app;
```

##### Returns

[`AppManager`](../../app-manager/classes/AppManager.md)

The `AppManager` instance.

***

### appDeployer

#### Get Signature

> **get** **appDeployer**(): [`AppDeployer`](../../app-deployer/classes/AppDeployer.md)

Defined in: [src/types/algorand-client.ts:212](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L212)

Methods for deploying apps and managing app deployment metadata.

##### Example

```ts
const deployer = AlgorandClient.mainNet().appDeployer;
```

##### Returns

[`AppDeployer`](../../app-deployer/classes/AppDeployer.md)

The `AppDeployer` instance.

***

### asset

#### Get Signature

> **get** **asset**(): [`AssetManager`](../../asset-manager/classes/AssetManager.md)

Defined in: [src/types/algorand-client.ts:192](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L192)

Methods for interacting with assets.

##### Example

```ts
const assetManager = AlgorandClient.mainNet().asset;
```

##### Returns

[`AssetManager`](../../asset-manager/classes/AssetManager.md)

The `AssetManager` instance.

***

### client

#### Get Signature

> **get** **client**(): [`ClientManager`](../../client-manager/classes/ClientManager.md)

Defined in: [src/types/algorand-client.ts:172](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L172)

Get clients, including algosdk clients and app clients.

##### Example

```ts
const clientManager = AlgorandClient.mainNet().client;
```

##### Returns

[`ClientManager`](../../client-manager/classes/ClientManager.md)

The `ClientManager` instance.

***

### createTransaction

#### Get Signature

> **get** **createTransaction**(): [`AlgorandClientTransactionCreator`](../../algorand-client-transaction-creator/classes/AlgorandClientTransactionCreator.md)

Defined in: [src/types/algorand-client.ts:269](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L269)

Methods for creating a transaction.

##### Example

```ts
const payment = await AlgorandClient.mainNet().createTransaction.payment({
 sender: "SENDERADDRESS",
 receiver: "RECEIVERADDRESS",
 amount: algo(1)
})
```

##### Returns

[`AlgorandClientTransactionCreator`](../../algorand-client-transaction-creator/classes/AlgorandClientTransactionCreator.md)

The `AlgorandClientTransactionCreator` instance.

***

### send

#### Get Signature

> **get** **send**(): [`AlgorandClientTransactionSender`](../../algorand-client-transaction-sender/classes/AlgorandClientTransactionSender.md)

Defined in: [src/types/algorand-client.ts:255](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L255)

Methods for sending a transaction.

##### Example

```ts
const result = await AlgorandClient.mainNet().send.payment({
 sender: "SENDERADDRESS",
 receiver: "RECEIVERADDRESS",
 amount: algo(1)
})
```

##### Returns

[`AlgorandClientTransactionSender`](../../algorand-client-transaction-sender/classes/AlgorandClientTransactionSender.md)

The `AlgorandClientTransactionSender` instance.

## Methods

### getSuggestedParams()

> **getSuggestedParams**(): `Promise`\<`SuggestedParams`\>

Defined in: [src/types/algorand-client.ts:151](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L151)

Get suggested params for a transaction (either cached or from algod if the cache is stale or empty)

#### Returns

`Promise`\<`SuggestedParams`\>

The suggested transaction parameters.

#### Example

```ts
const params = await AlgorandClient.mainNet().getSuggestedParams();
```

***

### newGroup()

> **newGroup**(): [`TransactionComposer`](../../composer/classes/TransactionComposer.md)

Defined in: [src/types/algorand-client.ts:234](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L234)

Start a new `TransactionComposer` transaction group

#### Returns

[`TransactionComposer`](../../composer/classes/TransactionComposer.md)

A new instance of `TransactionComposer`.

#### Example

```ts
const composer = AlgorandClient.mainNet().newGroup();
const result = await composer.addTransaction(payment).send()
```

***

### registerErrorTransformer()

> **registerErrorTransformer**(`transformer`): `void`

Defined in: [src/types/algorand-client.ts:220](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L220)

Register a function that will be used to transform an error caught when simulating or executing
composed transaction groups made from `newGroup`

#### Parameters

##### transformer

[`ErrorTransformer`](../../composer/type-aliases/ErrorTransformer.md)

#### Returns

`void`

***

### setDefaultSigner()

> **setDefaultSigner**(`signer`): `AlgorandClient`

Defined in: [src/types/algorand-client.ts:74](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L74)

Sets the default signer to use if no other signer is specified.

#### Parameters

##### signer

The signer to use, either a `TransactionSigner` or a `TransactionSignerAccount`

`TransactionSigner` | [`TransactionSignerAccount`](../../account/interfaces/TransactionSignerAccount.md)

#### Returns

`AlgorandClient`

The `AlgorandClient` so method calls can be chained

#### Example

```typescript
const signer = new SigningAccount(account, account.addr)
const algorand = AlgorandClient.mainNet().setDefaultSigner(signer)
```

***

### setDefaultValidityWindow()

> **setDefaultValidityWindow**(`validityWindow`): `AlgorandClient`

Defined in: [src/types/algorand-client.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L59)

Sets the default validity window for transactions.

#### Parameters

##### validityWindow

The number of rounds between the first and last valid rounds

`number` | `bigint`

#### Returns

`AlgorandClient`

The `AlgorandClient` so method calls can be chained

#### Example

```typescript
const algorand = AlgorandClient.mainNet().setDefaultValidityWindow(1000);
```

***

### setSigner()

> **setSigner**(`sender`, `signer`): `AlgorandClient`

Defined in: [src/types/algorand-client.ts:110](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L110)

Tracks the given signer against the given sender for later signing.

#### Parameters

##### sender

The sender address to use this signer for

`string` | `Address`

##### signer

`TransactionSigner`

The signer to sign transactions with for the given sender

#### Returns

`AlgorandClient`

The `AlgorandClient` so method calls can be chained

#### Example

```typescript
const signer = new SigningAccount(account, account.addr)
const algorand = AlgorandClient.mainNet().setSigner(signer.addr, signer.signer)
```

***

### setSignerFromAccount()

> **setSignerFromAccount**(`account`): `AlgorandClient`

Defined in: [src/types/algorand-client.ts:94](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L94)

Tracks the given account (object that encapsulates an address and a signer) for later signing.

#### Parameters

##### account

The account to register, which can be a `TransactionSignerAccount` or
 a `algosdk.Account`, `algosdk.LogicSigAccount`, `SigningAccount` or `MultisigAccount`

[`MultisigAccount`](../../account/classes/MultisigAccount.md) | `Account` | [`SigningAccount`](../../account/classes/SigningAccount.md) | [`TransactionSignerAccount`](../../account/interfaces/TransactionSignerAccount.md) | `LogicSigAccount`

#### Returns

`AlgorandClient`

The `AlgorandClient` so method calls can be chained

#### Example

```typescript
const accountManager = AlgorandClient.mainNet()
 .setSignerFromAccount(algosdk.generateAccount())
 .setSignerFromAccount(new algosdk.LogicSigAccount(program, args))
 .setSignerFromAccount(new SigningAccount(account, sender))
 .setSignerFromAccount(new MultisigAccount({version: 1, threshold: 1, addrs: ["ADDRESS1...", "ADDRESS2..."]}, [account1, account2]))
 .setSignerFromAccount({addr: "SENDERADDRESS", signer: transactionSigner})
```

***

### setSuggestedParamsCache()

> **setSuggestedParamsCache**(`suggestedParams`, `until?`): `AlgorandClient`

Defined in: [src/types/algorand-client.ts:125](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L125)

Sets a cache value to use for suggested transaction params.

#### Parameters

##### suggestedParams

`SuggestedParams`

The suggested params to use

##### until?

`Date`

A date until which to cache, or if not specified then the timeout is used

#### Returns

`AlgorandClient`

The `AlgorandClient` so method calls can be chained

#### Example

```typescript
const algorand = AlgorandClient.mainNet().setSuggestedParamsCache(suggestedParams, new Date(+new Date() + 3_600_000))
```

***

### setSuggestedParamsCacheTimeout()

> **setSuggestedParamsCacheTimeout**(`timeout`): `AlgorandClient`

Defined in: [src/types/algorand-client.ts:140](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L140)

Sets the timeout for caching suggested params.

#### Parameters

##### timeout

`number`

The timeout in milliseconds

#### Returns

`AlgorandClient`

The `AlgorandClient` so method calls can be chained

#### Example

```typescript
const algorand = AlgorandClient.mainNet().setSuggestedParamsCacheTimeout(10_000)
```

***

### unregisterErrorTransformer()

> **unregisterErrorTransformer**(`transformer`): `void`

Defined in: [src/types/algorand-client.ts:224](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L224)

#### Parameters

##### transformer

[`ErrorTransformer`](../../composer/type-aliases/ErrorTransformer.md)

#### Returns

`void`

***

### defaultLocalNet()

> `static` **defaultLocalNet**(): `AlgorandClient`

Defined in: [src/types/algorand-client.ts:281](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L281)

Creates an `AlgorandClient` pointing at default LocalNet ports and API token.

#### Returns

`AlgorandClient`

An instance of the `AlgorandClient`.

#### Example

```ts
const algorand = AlgorandClient.defaultLocalNet();
```

***

### fromClients()

> `static` **fromClients**(`clients`): `AlgorandClient`

Defined in: [src/types/algorand-client.ts:324](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L324)

Creates an `AlgorandClient` pointing to the given client(s).

#### Parameters

##### clients

[`AlgoSdkClients`](../../client-manager/interfaces/AlgoSdkClients.md)

The clients to use.

#### Returns

`AlgorandClient`

An instance of the `AlgorandClient`.

#### Example

```ts
const algorand = AlgorandClient.fromClients({ algod, indexer, kmd });
```

***

### fromConfig()

> `static` **fromConfig**(`config`): `AlgorandClient`

Defined in: [src/types/algorand-client.ts:358](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L358)

Creates  an `AlgorandClient` from the given config.

#### Parameters

##### config

[`AlgoConfig`](../../network-client/interfaces/AlgoConfig.md)

The config to use.

#### Returns

`AlgorandClient`

An instance of the `AlgorandClient`.

#### Example

```ts
const client = AlgorandClient.fromConfig({ algodConfig, indexerConfig, kmdConfig });
```

***

### fromEnvironment()

> `static` **fromEnvironment**(): `AlgorandClient`

Defined in: [src/types/algorand-client.ts:347](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L347)

Creates an `AlgorandClient` loading the configuration from environment variables.

Retrieve configurations from environment variables when defined or get default LocalNet configuration if they aren't defined.

Expects to be called from a Node.js environment.

If `process.env.ALGOD_SERVER` is defined it will use that along with optional `process.env.ALGOD_PORT` and `process.env.ALGOD_TOKEN`.

If `process.env.INDEXER_SERVER` is defined it will use that along with optional `process.env.INDEXER_PORT` and `process.env.INDEXER_TOKEN`.

If either aren't defined it will use the default LocalNet config.

It will return a KMD configuration that uses `process.env.KMD_PORT` (or port 4002) if `process.env.ALGOD_SERVER` is defined,
otherwise it will use the default LocalNet config unless it detects testnet or mainnet.

#### Returns

`AlgorandClient`

An instance of the `AlgorandClient`.

#### Example

```ts
const client = AlgorandClient.fromEnvironment();
```

***

### mainNet()

> `static` **mainNet**(): `AlgorandClient`

Defined in: [src/types/algorand-client.ts:309](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L309)

Creates an `AlgorandClient` pointing at MainNet using AlgoNode.

#### Returns

`AlgorandClient`

An instance of the `AlgorandClient`.

#### Example

```ts
const algorand = AlgorandClient.mainNet();
```

***

### testNet()

> `static` **testNet**(): `AlgorandClient`

Defined in: [src/types/algorand-client.ts:295](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L295)

Creates an `AlgorandClient` pointing at TestNet using AlgoNode.

#### Returns

`AlgorandClient`

An instance of the `AlgorandClient`.

#### Example

```ts
const algorand = AlgorandClient.testNet();
```
