[@algorandfoundation/algokit-utils](../README.md) / index

# Module: index

## Table of contents

### Variables

- [Config](index.md#config)

### Functions

- [algos](index.md#algos)
- [callApp](index.md#callapp)
- [capTransactionFee](index.md#captransactionfee)
- [compileTeal](index.md#compileteal)
- [createApp](index.md#createapp)
- [deployApp](index.md#deployapp)
- [encodeTransactionNote](index.md#encodetransactionnote)
- [ensureFunded](index.md#ensurefunded)
- [executePaginatedRequest](index.md#executepaginatedrequest)
- [getABIReturn](index.md#getabireturn)
- [getAccount](index.md#getaccount)
- [getAccountAddressAsString](index.md#getaccountaddressasstring)
- [getAccountAddressAsUint8Array](index.md#getaccountaddressasuint8array)
- [getAlgoClient](index.md#getalgoclient)
- [getAlgoIndexerClient](index.md#getalgoindexerclient)
- [getAlgoKmdClient](index.md#getalgokmdclient)
- [getAlgoNodeConfig](index.md#getalgonodeconfig)
- [getAlgodConfigFromEnvironment](index.md#getalgodconfigfromenvironment)
- [getAppArgsForTransaction](index.md#getappargsfortransaction)
- [getAppByIndex](index.md#getappbyindex)
- [getAppDeploymentTransactionNote](index.md#getappdeploymenttransactionnote)
- [getApplicationClient](index.md#getapplicationclient)
- [getCreatorAppsByName](index.md#getcreatorappsbyname)
- [getDefaultLocalNetConfig](index.md#getdefaultlocalnetconfig)
- [getDispenserAccount](index.md#getdispenseraccount)
- [getIndexerConfigFromEnvironment](index.md#getindexerconfigfromenvironment)
- [getKmdWalletAccount](index.md#getkmdwalletaccount)
- [getLocalNetDispenserAccount](index.md#getlocalnetdispenseraccount)
- [getOrCreateKmdWalletAccount](index.md#getorcreatekmdwalletaccount)
- [getSenderAddress](index.md#getsenderaddress)
- [getTransactionParams](index.md#gettransactionparams)
- [isLocalNet](index.md#islocalnet)
- [isSchemaIsBroken](index.md#isschemaisbroken)
- [lookupAccountCreatedApplicationByAddress](index.md#lookupaccountcreatedapplicationbyaddress)
- [lookupTransactionById](index.md#lookuptransactionbyid)
- [microAlgos](index.md#microalgos)
- [mnemonicAccount](index.md#mnemonicaccount)
- [multisigAccount](index.md#multisigaccount)
- [performTemplateSubstitution](index.md#performtemplatesubstitution)
- [performTemplateSubstitutionAndCompile](index.md#performtemplatesubstitutionandcompile)
- [rekeyedAccount](index.md#rekeyedaccount)
- [replaceDeployTimeControlParams](index.md#replacedeploytimecontrolparams)
- [searchTransactions](index.md#searchtransactions)
- [sendGroupOfTransactions](index.md#sendgroupoftransactions)
- [sendTransaction](index.md#sendtransaction)
- [transactionSignerAccount](index.md#transactionsigneraccount)
- [transferAlgos](index.md#transferalgos)
- [updateApp](index.md#updateapp)
- [waitForConfirmation](index.md#waitforconfirmation)

## Variables

### Config

• `Const` **Config**: [`UpdatableConfig`](../classes/types_config.UpdatableConfig.md)

The AlgoKit config. To update it use the configure method.

#### Defined in

[index.ts:15](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/index.ts#L15)

## Functions

### algos

▸ **algos**(`algos`): [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

Returns an amount of Algos using

**`See`**

AlgoAmount

#### Parameters

| Name | Type |
| :------ | :------ |
| `algos` | `number` |

#### Returns

[`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

#### Defined in

[amount.ts:4](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L4)

___

### callApp

▸ **callApp**(`call`, `algod`): `Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

Issues a call to a given app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | [`AppCallParams`](../interfaces/types_app.AppCallParams.md) | The call details. |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

The result of the call

#### Defined in

[app.ts:112](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L112)

___

### capTransactionFee

▸ **capTransactionFee**(`transaction`, `maxAcceptableFee`): `void`

Limit the acceptable fee to a defined amount of µALGOs.
This also sets the transaction to be flatFee to ensure the transaction only succeeds at
the estimated rate.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transaction` | `Transaction` | The transaction to cap |
| `maxAcceptableFee` | [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) | The maximum acceptable fee to pay |

#### Returns

`void`

#### Defined in

[transaction.ts:267](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L267)

___

### compileTeal

▸ **compileTeal**(`tealCode`, `algod`): `Promise`<[`CompiledTeal`](../interfaces/types_app.CompiledTeal.md)\>

Compiles the given TEAL using algod and returns the result.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tealCode` | `string` | The TEAL code |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<[`CompiledTeal`](../interfaces/types_app.CompiledTeal.md)\>

The information about the compiled file

#### Defined in

[app.ts:264](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L264)

___

### createApp

▸ **createApp**(`create`, `algod`): `Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md) & [`AppReference`](../interfaces/types_app.AppReference.md)\>

Creates a smart contract app, returns the details of the created app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `create` | [`CreateAppParams`](../interfaces/types_app.CreateAppParams.md) | The parameters to create the app with |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md) & [`AppReference`](../interfaces/types_app.AppReference.md)\>

The details of the created app, or the transaction to create it if `skipSending`

#### Defined in

[app.ts:32](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L32)

___

### deployApp

▸ **deployApp**(`deployment`, `algod`, `indexer?`): `Promise`<[`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) & [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & { `operationPerformed`: ``"create"`` \| ``"update"``  } \| [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) & [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & { `deleteResult`: [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) ; `operationPerformed`: ``"replace"``  } \| [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & { `operationPerformed`: ``"nothing"``  }\>

Idempotently deploy (create, update/delete if changed) an app against the given name via the given creator account, including deploy-time template placeholder substitutions.

To understand the architecture decisions behind this functionality please

**`See`**

https://github.com/algorandfoundation/algokit-cli/blob/main/docs/architecture-decisions/2023-01-12_smart-contract-deployment.md

**Note:** When using the return from this function be sure to check `operationPerformed` to get access to various return properties like `transaction`, `confirmation` and `deleteResult`.

**Note:** if there is a breaking state schema change to an existing app (and `onSchemaBreak` is set to `'replace'`) the existing app will be deleted and re-created.

**Note:** if there is an update (different TEAL code) to an existing app (and `onUpdate` is set to `'replace'`) the existing app will be deleted and re-created.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `deployment` | [`AppDeploymentParams`](../interfaces/types_app.AppDeploymentParams.md) | The arguments to control the app deployment |
| `algod` | `default` | An algod client |
| `indexer?` | `default` | An indexer client, needed if `existingDeployments` not passed in |

#### Returns

`Promise`<[`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) & [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & { `operationPerformed`: ``"create"`` \| ``"update"``  } \| [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) & [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & { `deleteResult`: [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) ; `operationPerformed`: ``"replace"``  } \| [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & { `operationPerformed`: ``"nothing"``  }\>

The app reference of the new/existing app

#### Defined in

[deploy-app.ts:37](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L37)

___

### encodeTransactionNote

▸ **encodeTransactionNote**(`note?`): `Uint8Array` \| `undefined`

Encodes a transaction note into a byte array ready to be included in an Algorand transaction.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `note?` | [`TransactionNote`](types_transaction.md#transactionnote) | The transaction note |

#### Returns

`Uint8Array` \| `undefined`

the transaction note ready for inclusion in a transaction

 Case on the value of `data` this either either be:
  * `null` | `undefined`: `undefined`
  * `string`: The string value
  * Uint8Array: passthrough
  * Arc2TransactionNote object: ARC-0002 compatible transaction note
  * Else: The object/value converted into a JSON string representation

#### Defined in

[transaction.ts:21](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L21)

___

### ensureFunded

▸ **ensureFunded**(`funding`, `client`): `Promise`<[`SendTransactionResult`](../interfaces/types_transaction.SendTransactionResult.md) \| `undefined`\>

Funds a given account using a funding source such that it has a certain amount of algos free to spend (accounting for ALGOs locked in minimum balance requirement).

**`See`**

https://developer.algorand.org/docs/get-details/accounts/#minimum-balance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `funding` | [`EnsureFundedParams`](../interfaces/types_transfer.EnsureFundedParams.md) | The funding configuration |
| `client` | `default` | An algod client |

#### Returns

`Promise`<[`SendTransactionResult`](../interfaces/types_transaction.SendTransactionResult.md) \| `undefined`\>

undefined if nothing was needed or the transaction send result

#### Defined in

[transfer.ts:42](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transfer.ts#L42)

___

### executePaginatedRequest

▸ **executePaginatedRequest**<`TResult`, `TRequest`\>(`extractItems`, `buildRequest`): `Promise`<`TResult`[]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TResult` | `TResult` |
| `TRequest` | extends `Object` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `extractItems` | (`response`: `any`) => `TResult`[] |
| `buildRequest` | (`nextToken?`: `string`) => `TRequest` |

#### Returns

`Promise`<`TResult`[]\>

#### Defined in

[indexer-lookup.ts:92](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/indexer-lookup.ts#L92)

___

### getABIReturn

▸ **getABIReturn**(`args?`, `confirmation?`): [`ABIReturn`](types_app.md#abireturn) \| `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `args?` | [`AppCallArgs`](types_app.md#appcallargs) |
| `confirmation?` | [`PendingTransactionResponse`](../interfaces/types_algod.PendingTransactionResponse.md) |

#### Returns

[`ABIReturn`](types_app.md#abireturn) \| `undefined`

#### Defined in

[app.ts:151](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L151)

___

### getAccount

▸ **getAccount**(`account`, `algod`, `kmdClient?`): `Promise`<`Account` \| [`SigningAccount`](../classes/types_account.SigningAccount.md)\>

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
```typescript
const account = await getAccount('ACCOUNT', algod)
```

If that code runs against LocalNet then a wallet called `ACCOUNT` will automatically be created with an account that is automatically funded with 1000 (default) ALGOs from the default LocalNet dispenser.

**`See`**

 - 
 - 

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | `string` \| { `fundWith?`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `name`: `string`  } | The details of the account to get, wither the name identifier (string) or an object with: * `name`: The name identifier of the account * `fundWith`: The amount to fund the account with it it gets created (when targeting LocalNet), if not specified then 1000 Algos will be funded from the dispenser account |
| `algod` | `default` | An algod client |
| `kmdClient?` | `default` | An optional KMD client to use to create an account (when targeting LocalNet), if not specified then a default KMD client will be loaded from environment variables |

#### Returns

`Promise`<`Account` \| [`SigningAccount`](../classes/types_account.SigningAccount.md)\>

The requested account with private key loaded from the environment variables or when targeting LocalNet from KMD (idempotently creating and funding the account)

#### Defined in

[account.ts:79](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/account.ts#L79)

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

[account.ts:132](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/account.ts#L132)

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

[account.ts:124](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/account.ts#L124)

___

### getAlgoClient

▸ **getAlgoClient**(`config?`): `Algodv2`

Returns an algod SDK client that automatically retries on idempotent calls

**`Example`**

Default (load from environment variables)

 ```typescript
 // Uses process.env.ALGOD_SERVER, process.env.ALGOD_PORT and process.env.ALGOD_TOKEN
 // Automatically detects if you are using PureStake to switch in the right header name for ALGOD_TOKEN
 const algod = getAlgoClient()
 await algod.healthCheck().do()
 ```

**`Example`**

AlgoNode (testnet)
```typescript
 const algod = getAlgoClient(getAlgoNodeConfig('testnet', 'algod'))
 await algod.healthCheck().do()
```

**`Example`**

AlgoNode (mainnet)
```typescript
 const algod = getAlgoClient(getAlgoNodeConfig('mainnet', 'algod'))
 await algod.healthCheck().do()
```

**`Example`**

Custom (e.g. default local sandbox, although we recommend loading this into a .env and using the Default option instead)
```typescript
 const algod = getAlgoClient({server: 'http://localhost', port: '4001', token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'})
 await algod.healthCheck().do()
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | [`AlgoClientConfig`](../interfaces/types_network_client.AlgoClientConfig.md) | The config if you want to override the default (getting config from process.env) |

#### Returns

`Algodv2`

#### Defined in

[network-client.ts:99](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/network-client.ts#L99)

___

### getAlgoIndexerClient

▸ **getAlgoIndexerClient**(`config?`): `Indexer`

Returns an indexer SDK client that automatically retries on idempotent calls

**`Example`**

Default (load from environment variables)

 ```typescript
 // Uses process.env.INDEXER_SERVER, process.env.INDEXER_PORT and process.env.INDEXER_TOKEN
 // Automatically detects if you are using PureStake to switch in the right header name for INDEXER_TOKEN
 const indexer = getAlgoIndexerClient()
 await indexer.makeHealthCheck().do()
 ```

**`Example`**

AlgoNode (testnet)
```typescript
 const indexer = getAlgoIndexerClient(getAlgoNodeConfig('testnet', 'indexer'))
 await indexer.makeHealthCheck().do()
```

**`Example`**

AlgoNode (mainnet)
```typescript
 const indexer = getAlgoIndexerClient(getAlgoNodeConfig('mainnet', 'indexer'))
 await indexer.makeHealthCheck().do()
```

**`Example`**

Custom (e.g. default local sandbox, although we recommend loading this into a .env and using the Default option instead)
```typescript
 const indexer = getAlgoIndexerClient({server: 'http://localhost', port: '8980', token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'})
 await indexer.makeHealthCheck().do()
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | [`AlgoClientConfig`](../interfaces/types_network_client.AlgoClientConfig.md) | The config if you want to override the default (getting config from process.env) |

#### Returns

`Indexer`

#### Defined in

[network-client.ts:132](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/network-client.ts#L132)

___

### getAlgoKmdClient

▸ **getAlgoKmdClient**(`config?`): `Kmd`

Returns a KMD SDK client that automatically retries on idempotent calls

KMD client allows you to export private keys, which is useful to get the default account in a sandbox network.

**`Example`**

Default (load from environment variables)

 ```typescript
 // Uses process.env.ALGOD_SERVER, process.env.KMD_PORT (or if not specified: port 4002) and process.env.ALGOD_TOKEN
 const kmd = getAlgoKmdClient()
 ```

**`Example`**

Custom (e.g. default local sandbox, although we recommend loading this into a .env and using the Default option instead)
```typescript
 const kmd = getAlgoKmdClient({server: 'http://localhost', port: '4002', token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'})
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | [`AlgoClientConfig`](../interfaces/types_network_client.AlgoClientConfig.md) | The config if you want to override the default (getting config from process.env) |

#### Returns

`Kmd`

#### Defined in

[network-client.ts:155](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/network-client.ts#L155)

___

### getAlgoNodeConfig

▸ **getAlgoNodeConfig**(`network`, `config`): [`AlgoClientConfig`](../interfaces/types_network_client.AlgoClientConfig.md)

Returns the Algorand configuration to point to the AlgoNode service

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `network` | ``"testnet"`` \| ``"mainnet"`` | Which network to connect to - TestNet or MainNet |
| `config` | ``"algod"`` \| ``"indexer"`` | Which algod config to return - Algod or Indexer |

#### Returns

[`AlgoClientConfig`](../interfaces/types_network_client.AlgoClientConfig.md)

#### Defined in

[network-client.ts:45](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/network-client.ts#L45)

___

### getAlgodConfigFromEnvironment

▸ **getAlgodConfigFromEnvironment**(): [`AlgoClientConfig`](../interfaces/types_network_client.AlgoClientConfig.md)

Retrieve the algod configuration from environment variables (expects to be called from a Node.js environment not algod-side)

#### Returns

[`AlgoClientConfig`](../interfaces/types_network_client.AlgoClientConfig.md)

#### Defined in

[network-client.ts:7](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/network-client.ts#L7)

___

### getAppArgsForTransaction

▸ **getAppArgsForTransaction**(`args?`): `undefined` \| { `accounts`: `undefined` \| `string`[] ; `appArgs`: `undefined` \| `Uint8Array`[] ; `boxes`: `undefined` \| `BoxReference`[] ; `foreignApps`: `undefined` \| `number`[] = actualArgs.apps; `foreignAssets`: `undefined` \| `number`[] = actualArgs.assets; `lease`: `undefined` \| `Uint8Array`  }

Returns the app args ready to load onto an app

**`See`**

object

#### Parameters

| Name | Type |
| :------ | :------ |
| `args?` | [`AppCallArgs`](types_app.md#appcallargs) |

#### Returns

`undefined` \| { `accounts`: `undefined` \| `string`[] ; `appArgs`: `undefined` \| `Uint8Array`[] ; `boxes`: `undefined` \| `BoxReference`[] ; `foreignApps`: `undefined` \| `number`[] = actualArgs.apps; `foreignAssets`: `undefined` \| `number`[] = actualArgs.assets; `lease`: `undefined` \| `Uint8Array`  }

#### Defined in

[app.ts:183](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L183)

___

### getAppByIndex

▸ **getAppByIndex**(`appId`, `algod`): `Promise`<[`ApplicationResponse`](../interfaces/types_algod.ApplicationResponse.md)\>

Gets the current data for the given app from algod.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appId` | `number` | The id of the app |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<[`ApplicationResponse`](../interfaces/types_algod.ApplicationResponse.md)\>

The data about the app

#### Defined in

[app.ts:253](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L253)

___

### getAppDeploymentTransactionNote

▸ **getAppDeploymentTransactionNote**(`metadata`): `Object`

Return the transaction note for an app deployment.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `metadata` | [`AppDeployMetadata`](../interfaces/types_app.AppDeployMetadata.md) | The metadata of the deployment |

#### Returns

`Object`

The transaction note as a utf-8 string

| Name | Type |
| :------ | :------ |
| `dAppName` | `string` |
| `data` | [`AppDeployMetadata`](../interfaces/types_app.AppDeployMetadata.md) |
| `format` | `string` |

#### Defined in

[deploy-app.ts:454](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L454)

___

### getApplicationClient

▸ **getApplicationClient**(`appDetails`, `algod`): [`ApplicationClient`](../classes/types_application_client.ApplicationClient.md)

Create a new ApplicationClient instance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appDetails` | [`AppSpecAppDetails`](types_application_client.md#appspecappdetails) | The details of the app |
| `algod` | `default` | An algod instance |

#### Returns

[`ApplicationClient`](../classes/types_application_client.ApplicationClient.md)

The application client

#### Defined in

[application-client.ts:10](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/application-client.ts#L10)

___

### getCreatorAppsByName

▸ **getCreatorAppsByName**(`creatorAccount`, `indexer`): `Promise`<[`AppLookup`](../interfaces/types_app.AppLookup.md)\>

Returns a lookup of name => app metadata (id, address, ...metadata) for all apps created by the given account that have an

**`See`**

in the transaction note of the creation transaction.

**Note:** It's recommended this is only called once and then stored since it's a somewhat expensive operation (multiple indexer calls).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `creatorAccount` | `string` \| [`SendTransactionFrom`](types_transaction.md#sendtransactionfrom) | The account (with private key loaded) or string address of an account that is the creator of the apps you want to search for |
| `indexer` | `default` | An indexer client |

#### Returns

`Promise`<[`AppLookup`](../interfaces/types_app.AppLookup.md)\>

A name-based lookup of the app information (id, address)

#### Defined in

[deploy-app.ts:358](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L358)

___

### getDefaultLocalNetConfig

▸ **getDefaultLocalNetConfig**(`configOrPort`): [`AlgoClientConfig`](../interfaces/types_network_client.AlgoClientConfig.md)

Returns the Algorand configuration to point to the default LocalNet

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `configOrPort` | `number` \| ``"algod"`` \| ``"indexer"`` \| ``"kmd"`` | Which algod config to return - algod, kmd, or indexer OR a port number |

#### Returns

[`AlgoClientConfig`](../interfaces/types_network_client.AlgoClientConfig.md)

#### Defined in

[network-client.ts:56](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/network-client.ts#L56)

___

### getDispenserAccount

▸ **getDispenserAccount**(`algod`, `kmd?`): `Promise`<`default` \| [`SigningAccount`](../classes/types_account.SigningAccount.md)\>

Returns an account (with private key loaded) that can act as a dispenser

If running on Sandbox then it will return the default dispenser account automatically,
 otherwise it will load the account mnemonic stored in process.env.DISPENSER_MNEMONIC

**`See`**

 - 
 - 

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `algod` | `default` | An algod client |
| `kmd?` | `default` | A KMD client, if not specified then a default KMD client will be loaded from environment variables |

#### Returns

`Promise`<`default` \| [`SigningAccount`](../classes/types_account.SigningAccount.md)\>

#### Defined in

[account.ts:144](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/account.ts#L144)

___

### getIndexerConfigFromEnvironment

▸ **getIndexerConfigFromEnvironment**(): [`AlgoClientConfig`](../interfaces/types_network_client.AlgoClientConfig.md)

Retrieve the indexer configuration from environment variables (expects to be called from a Node.js environment not algod-side)

#### Returns

[`AlgoClientConfig`](../interfaces/types_network_client.AlgoClientConfig.md)

#### Defined in

[network-client.ts:24](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/network-client.ts#L24)

___

### getKmdWalletAccount

▸ **getKmdWalletAccount**(`walletAccount`, `algod`, `kmdClient?`): `Promise`<`Account` \| `undefined`\>

Returns an Algorand account with private key loaded from the given KMD wallet (identified by name).

**`See`**

**`Example`**

Get default funded account in a LocalNet

```typescript
const defaultDispenserAccount = await getKmdWalletAccount(algod,
  'unencrypted-default-wallet',
  a => a.status !== 'Offline' && a.amount > 1_000_000_000
)
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `walletAccount` | `Object` | The details of the wallet, with: * `name`: The name of the wallet to retrieve an account from * `predicate`: An optional filter to use to find the account (otherwise it will return a random account from the wallet) |
| `walletAccount.name` | `string` | - |
| `walletAccount.predicate?` | (`account`: `Record`<`string`, `any`\>) => `boolean` | - |
| `algod` | `default` | An algod client |
| `kmdClient?` | `default` | A KMD client, if not specified then a default KMD client will be loaded from environment variables |

#### Returns

`Promise`<`Account` \| `undefined`\>

#### Defined in

[localnet.ts:90](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/localnet.ts#L90)

___

### getLocalNetDispenserAccount

▸ **getLocalNetDispenserAccount**(`algod`, `kmd?`): `Promise`<`Account`\>

Returns an Algorand account with private key loaded for the default LocalNet dispenser account (that can be used to fund other accounts)

**`See`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `algod` | `default` | An algod client |
| `kmd?` | `default` | A KMD client, if not specified then a default KMD client will be loaded from environment variables |

#### Returns

`Promise`<`Account`\>

#### Defined in

[localnet.ts:141](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/localnet.ts#L141)

___

### getOrCreateKmdWalletAccount

▸ **getOrCreateKmdWalletAccount**(`walletAccount`, `algod`, `kmdClient?`): `Promise`<`Account`\>

Gets an account with private key loaded from a KMD wallet of the given name, or alternatively creates one with funds in it via a KMD wallet of the given name.

This is useful to get idempotent accounts from a local sandbox without having to specify the private key (which will change when resetting the sandbox).

This significantly speeds up local dev time and improves experience since you can write code that *just works* first go without manual config in a fresh sandbox.

If this is used via

**`See`**

 - , then you can even use the same code that runs on production without changes for local development!
 - 
 - 

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `walletAccount` | `Object` | The wallet details with: * `name`: The name of the wallet to retrieve / create * `fundWith`: The number of Algos to fund the account with it it gets created, if not specified then 1000 Algos will be funded from the dispenser account |
| `walletAccount.fundWith?` | [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) | - |
| `walletAccount.name` | `string` | - |
| `algod` | `default` | An algod client |
| `kmdClient?` | `default` | A KMD client, if not specified then a default KMD client will be loaded from environment variables |

#### Returns

`Promise`<`Account`\>

An Algorand account with private key loaded - either one that already existed in the given KMD wallet, or a new one that is funded for you

#### Defined in

[localnet.ts:32](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/localnet.ts#L32)

___

### getSenderAddress

▸ **getSenderAddress**(`sender`): `string`

Returns the public address of the given transaction sender.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sender` | [`SendTransactionFrom`](types_transaction.md#sendtransactionfrom) | A transaction sender |

#### Returns

`string`

The public address

#### Defined in

[transaction.ts:42](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L42)

___

### getTransactionParams

▸ **getTransactionParams**(`params`, `algod`): `Promise`<`SuggestedParams`\>

Returns suggested transaction parameters from algod unless some are already provided.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `undefined` \| `SuggestedParams` | Optionally provide parameters to use |
| `algod` | `default` | Algod algod |

#### Returns

`Promise`<`SuggestedParams`\>

The suggested transaction parameters

#### Defined in

[transaction.ts:291](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L291)

___

### isLocalNet

▸ **isLocalNet**(`algod`): `Promise`<`boolean`\>

Returns true if the algod client is pointing to a LocalNet Algorand network

#### Parameters

| Name | Type |
| :------ | :------ |
| `algod` | `default` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[localnet.ts:9](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/localnet.ts#L9)

___

### isSchemaIsBroken

▸ **isSchemaIsBroken**(`before`, `after`): `boolean`

Returns true is there is a breaking change in the application state schema from before to after.
 i.e. if the schema becomes larger, since applications can't ask for more schema after creation.
 Otherwise, there is no error, the app just doesn't store data in the extra schema :(

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `before` | [`ApplicationStateSchema`](../interfaces/types_algod.ApplicationStateSchema.md) | The existing schema |
| `after` | [`ApplicationStateSchema`](../interfaces/types_algod.ApplicationStateSchema.md) | The new schema |

#### Returns

`boolean`

Whether or not there is a breaking change

#### Defined in

[deploy-app.ts:345](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L345)

___

### lookupAccountCreatedApplicationByAddress

▸ **lookupAccountCreatedApplicationByAddress**(`indexer`, `address`, `getAll?`, `paginationLimit?`): `Promise`<[`ApplicationResult`](../interfaces/types_indexer.ApplicationResult.md)[]\>

Looks up applications that were created by the given address.

**`See`**

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `indexer` | `default` | `undefined` | An indexer instance |
| `address` | `string` | `undefined` | The address of the creator to look up |
| `getAll` | `undefined` \| `boolean` | `undefined` | Whether or not to include deleted applications |
| `paginationLimit?` | `number` | `undefined` | The number of records to return per paginated request, default |

#### Returns

`Promise`<[`ApplicationResult`](../interfaces/types_indexer.ApplicationResult.md)[]\>

The list of application results

#### Defined in

[indexer-lookup.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/indexer-lookup.ts#L25)

___

### lookupTransactionById

▸ **lookupTransactionById**(`transactionId`, `indexer`): `Promise`<[`TransactionLookupResult`](../interfaces/types_indexer.TransactionLookupResult.md)\>

Looks up a transaction by ID using Indexer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transactionId` | `string` | The ID of the transaction to look up |
| `indexer` | `default` | An indexer client |

#### Returns

`Promise`<[`TransactionLookupResult`](../interfaces/types_indexer.TransactionLookupResult.md)\>

The result of the look-up

#### Defined in

[indexer-lookup.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/indexer-lookup.ts#L13)

___

### microAlgos

▸ **microAlgos**(`microAlgos`): [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

Returns an amount of µAlgos using

**`See`**

AlgoAmount

#### Parameters

| Name | Type |
| :------ | :------ |
| `microAlgos` | `number` |

#### Returns

[`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

#### Defined in

[amount.ts:9](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L9)

___

### mnemonicAccount

▸ **mnemonicAccount**(`mnemonicSecret`): `Account`

Returns an Algorand account with secret key loaded (i.e. that can sign transactions) by taking the mnemonic secret.

This is a wrapper around algosdk.mnemonicToSecretKey to provide a more friendly/obvious name.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mnemonicSecret` | `string` | The mnemonic secret representing the private key of an account; **Note: Be careful how the mnemonic is handled**, never commit it into source control and ideally load it from the environment (ideally via a secret storage service) rather than the file system. |

#### Returns

`Account`

#### Defined in

[account.ts:45](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/account.ts#L45)

___

### multisigAccount

▸ **multisigAccount**(`multisigParams`, `signingAccounts`): [`MultisigAccount`](../classes/types_account.MultisigAccount.md)

Returns an account wrapper that supports partial or full multisig signing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `multisigParams` | `MultisigMetadata` | The parameters that define the multisig account |
| `signingAccounts` | (`default` \| [`SigningAccount`](../classes/types_account.SigningAccount.md))[] | The signers that are currently present |

#### Returns

[`MultisigAccount`](../classes/types_account.MultisigAccount.md)

A multisig account wrapper

#### Defined in

[account.ts:14](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/account.ts#L14)

___

### performTemplateSubstitution

▸ **performTemplateSubstitution**(`tealCode`, `templateParameters?`): `string`

Performs template substitution of a teal file.

Looks for `TMPL_{parameter}` for template replacements.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tealCode` | `string` | The TEAL logic to compile |
| `templateParameters?` | [`TealTemplateParameters`](../interfaces/types_app.TealTemplateParameters.md) | Any parameters to replace in the .teal file before compiling |

#### Returns

`string`

The TEAL code with replacements

#### Defined in

[deploy-app.ts:503](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L503)

___

### performTemplateSubstitutionAndCompile

▸ **performTemplateSubstitutionAndCompile**(`tealCode`, `algod`, `templateParameters?`, `deploymentMetadata?`): `Promise`<[`CompiledTeal`](../interfaces/types_app.CompiledTeal.md)\>

Performs template substitution of a teal file and compiles it, returning the compiled result.

Looks for `TMPL_{parameter}` for template replacements.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tealCode` | `string` | The TEAL logic to compile |
| `algod` | `default` | An algod client |
| `templateParameters?` | [`TealTemplateParameters`](../interfaces/types_app.TealTemplateParameters.md) | Any parameters to replace in the .teal file before compiling |
| `deploymentMetadata?` | [`AppDeployMetadata`](../interfaces/types_app.AppDeployMetadata.md) | The deployment metadata the app will be deployed with |

#### Returns

`Promise`<[`CompiledTeal`](../interfaces/types_app.CompiledTeal.md)\>

The information about the compiled code

#### Defined in

[deploy-app.ts:533](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L533)

___

### rekeyedAccount

▸ **rekeyedAccount**(`account`, `sender`): [`SigningAccount`](../classes/types_account.SigningAccount.md)

Returns an account wrapper that supports a rekeyed account.

**`See`**

SigningAccount wrapper

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | `default` | The account, with private key loaded, that is signing |
| `sender` | `string` | The address of the rekeyed account that will act as a sender |

#### Returns

[`SigningAccount`](../classes/types_account.SigningAccount.md)

The

#### Defined in

[account.ts:24](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/account.ts#L24)

___

### replaceDeployTimeControlParams

▸ **replaceDeployTimeControlParams**(`tealCode`, `params`): `string`

Replaces deploy-time deployment control parameters within the given teal code.

**`See`**

 - 
 - 

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tealCode` | `string` | The TEAL code to substitute |
| `params` | `Object` | The deploy-time deployment control parameter value to replace |
| `params.deletable?` | `boolean` | - |
| `params.updatable?` | `boolean` | - |

#### Returns

`string`

The replaced TEAL code

#### Defined in

[deploy-app.ts:472](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L472)

___

### searchTransactions

▸ **searchTransactions**(`indexer`, `searchCriteria`, `paginationLimit?`): `Promise`<[`TransactionSearchResults`](../interfaces/types_indexer.TransactionSearchResults.md)\>

Allows transactions to be searched for the given criteria.

**`See`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexer` | `default` | An indexer client |
| `searchCriteria` | (`s`: `default`) => `default` | The criteria to search for |
| `paginationLimit?` | `number` | The number of records to return per paginated request, default |

#### Returns

`Promise`<[`TransactionSearchResults`](../interfaces/types_indexer.TransactionSearchResults.md)\>

The search results

#### Defined in

[indexer-lookup.ts:58](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/indexer-lookup.ts#L58)

___

### sendGroupOfTransactions

▸ **sendGroupOfTransactions**(`groupSend`, `algod`): `Promise`<{ `confirmations`: `undefined` \| [`PendingTransactionResponse`](../interfaces/types_algod.PendingTransactionResponse.md)[] ; `groupId`: `string` ; `txIds`: `string`[]  }\>

Signs and sends a group of [up to 16](https://developer.algorand.org/docs/get-details/atomic_transfers/#create-transactions) transactions to the chain

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `groupSend` | `Object` | The group details to send, with: * `transactions`: The array of transactions to send along with their signing account * `sendParams`: The parameters to dictate how the group is sent |
| `groupSend.sendParams?` | `Omit`<`Omit`<[`SendTransactionParams`](../interfaces/types_transaction.SendTransactionParams.md), ``"maxFee"``\>, ``"skipSending"``\> | - |
| `groupSend.transactions` | [`TransactionToSign`](../interfaces/types_transaction.TransactionToSign.md)[] | - |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<{ `confirmations`: `undefined` \| [`PendingTransactionResponse`](../interfaces/types_algod.PendingTransactionResponse.md)[] ; `groupId`: `string` ; `txIds`: `string`[]  }\>

An object with group transaction ID (`groupTransactionId`) and (if `skipWaiting` is `false` or unset) confirmation (`confirmation`)

#### Defined in

[transaction.ts:115](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L115)

___

### sendTransaction

▸ **sendTransaction**(`send`, `algod`): `Promise`<[`SendTransactionResult`](../interfaces/types_transaction.SendTransactionResult.md)\>

Signs and sends the given transaction to the chain

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `send` | `Object` | The details for the transaction to send, including: * `transaction`: The unsigned transaction * `from`: The account to sign the transaction with: either an account with private key loaded or a logic signature account * `config`: The sending configuration for this transaction |
| `send.from` | [`SendTransactionFrom`](types_transaction.md#sendtransactionfrom) | - |
| `send.sendParams?` | [`SendTransactionParams`](../interfaces/types_transaction.SendTransactionParams.md) | - |
| `send.transaction` | `Transaction` | - |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<[`SendTransactionResult`](../interfaces/types_transaction.SendTransactionResult.md)\>

An object with transaction (`transaction`) and (if `skipWaiting` is `false` or unset) confirmation (`confirmation`)

#### Defined in

[transaction.ts:56](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L56)

___

### transactionSignerAccount

▸ **transactionSignerAccount**(`signer`, `sender`): [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md)

Returns an account wrapper that supports a transaction signer with associated sender address.

**`See`**

SigningAccount wrapper

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `TransactionSigner` | The transaction signer |
| `sender` | `string` | The address of sender account |

#### Returns

[`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md)

The

#### Defined in

[account.ts:34](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/account.ts#L34)

___

### transferAlgos

▸ **transferAlgos**(`transfer`, `algod`): `Promise`<[`SendTransactionResult`](../interfaces/types_transaction.SendTransactionResult.md)\>

Transfer ALGOs between two accounts.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transfer` | [`AlgoTransferParams`](../interfaces/types_transfer.AlgoTransferParams.md) | The transfer definition |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<[`SendTransactionResult`](../interfaces/types_transaction.SendTransactionResult.md)\>

The transaction object and optionally the confirmation if it was sent to the chain (`skipSending` is `false` or unset)

#### Defined in

[transfer.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transfer.ts#L13)

___

### updateApp

▸ **updateApp**(`update`, `algod`): `Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

Updates a smart contract app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `update` | [`UpdateAppParams`](../interfaces/types_app.UpdateAppParams.md) | The parameters to update the app with |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

The transaction

#### Defined in

[app.ts:79](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L79)

___

### waitForConfirmation

▸ **waitForConfirmation**(`transactionId`, `maxRoundsToWait`, `algod`): `Promise`<[`PendingTransactionResponse`](../interfaces/types_algod.PendingTransactionResponse.md)\>

Wait until the transaction is confirmed or rejected, or until `timeout`
number of rounds have passed.

**`Throws`**

Throws an error if the transaction is not confirmed or rejected in the next `timeout` rounds

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transactionId` | `string` | The transaction ID to wait for |
| `maxRoundsToWait` | `number` | Maximum number of rounds to wait |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<[`PendingTransactionResponse`](../interfaces/types_algod.PendingTransactionResponse.md)\>

Pending transaction information

#### Defined in

[transaction.ts:220](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L220)