[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/algorand-client](../README.md) / AlgorandClient

# Class: AlgorandClient

Defined in: [src/types/algorand-client.ts:17](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L17)

A client that brokers easy access to Algorand functionality.

## Accessors

### account

#### Get Signature

> **get** **account**(): [`AccountManager`](../../account-manager/classes/AccountManager.md)

Defined in: [src/types/algorand-client.ts:181](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L181)

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

Defined in: [src/types/algorand-client.ts:201](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L201)

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

Defined in: [src/types/algorand-client.ts:211](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L211)

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

Defined in: [src/types/algorand-client.ts:191](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L191)

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

Defined in: [src/types/algorand-client.ts:171](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L171)

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

> **getSuggestedParams**(): `Promise`\<\{ `consensusVersion`: `string`; `fee`: `bigint`; `firstValid`: `bigint`; `flatFee`: `boolean`; `genesisHash`: `Uint8Array`; `genesisId`: `string`; `lastValid`: `bigint`; `minFee`: `bigint`; \}\>

Defined in: [src/types/algorand-client.ts:150](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L150)

Get suggested params for a transaction (either cached or from algod if the cache is stale or empty)

#### Returns

`Promise`\<\{ `consensusVersion`: `string`; `fee`: `bigint`; `firstValid`: `bigint`; `flatFee`: `boolean`; `genesisHash`: `Uint8Array`; `genesisId`: `string`; `lastValid`: `bigint`; `minFee`: `bigint`; \}\>

The suggested transaction parameters.

#### Example

```ts
const params = await AlgorandClient.mainNet().getSuggestedParams();
```

***

### newGroup()

> **newGroup**(`composerConfig?`): [`TransactionComposer`](../../composer/classes/TransactionComposer.md)

Defined in: [src/types/algorand-client.ts:233](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L233)

Start a new `TransactionComposer` transaction group

#### Parameters

##### composerConfig?

[`TransactionComposerConfig`](../../composer/type-aliases/TransactionComposerConfig.md)

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

Defined in: [src/types/algorand-client.ts:219](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L219)

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

Defined in: [src/types/algorand-client.ts:73](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L73)

Sets the default signer to use if no other signer is specified.

#### Parameters

##### signer

The signer to use, either a `TransactionSigner` or a `AddressWithSigner`

[`AddressWithTransactionSigner`](../../../Packages/Transact/interfaces/AddressWithTransactionSigner.md) | [`TransactionSigner`](../../../Packages/Transact/type-aliases/TransactionSigner.md)

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

Defined in: [src/types/algorand-client.ts:58](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L58)

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

Defined in: [src/types/algorand-client.ts:109](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L109)

Tracks the given signer against the given sender for later signing.

#### Parameters

##### sender

The sender address to use this signer for

`string` | [`Address`](../../../Algokit-Utils-API/classes/Address.md)

##### signer

[`TransactionSigner`](../../../Packages/Transact/type-aliases/TransactionSigner.md)

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

Defined in: [src/types/algorand-client.ts:93](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L93)

Tracks the given account (object that encapsulates an address and a signer) for later signing.

#### Parameters

##### account

The account to register, which can be a `AddressWithSigner` or
 a `algosdk.Account`, `algosdk.LogicSigAccount`, `SigningAccount` or `MultisigAccount`

[`MultisigAccount`](../../../Packages/Transact/classes/MultisigAccount.md) | [`AddressWithTransactionSigner`](../../../Packages/Transact/interfaces/AddressWithTransactionSigner.md) | [`LogicSigAccount`](../../../Packages/Transact/classes/LogicSigAccount.md)

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

Defined in: [src/types/algorand-client.ts:124](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L124)

Sets a cache value to use for suggested transaction params.

#### Parameters

##### suggestedParams

The suggested params to use

###### consensusVersion

`string`

ConsensusVersion indicates the consensus protocol version
as of LastRound.

###### fee

`bigint`

Fee is the suggested transaction fee
Fee is in units of micro-Algos per byte.
Fee may fall to zero but transactions must still have a fee of
at least MinTxnFee for the current network protocol.

###### firstValid

`bigint`

###### flatFee

`boolean`

###### genesisHash

`Uint8Array`

GenesisHash is the hash of the genesis block.

###### genesisId

`string`

GenesisID is an ID listed in the genesis block.

###### lastValid

`bigint`

###### minFee

`bigint`

The minimum transaction fee (not per byte) required for the
txn to validate for the current network protocol.

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

Defined in: [src/types/algorand-client.ts:139](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L139)

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

Defined in: [src/types/algorand-client.ts:223](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client.ts#L223)

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
