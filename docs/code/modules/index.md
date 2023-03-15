[@algorandfoundation/algokit-utils](../README.md) / index

# Module: index

## Table of contents

### Enumerations

- [OnSchemaBreak](../enums/index.OnSchemaBreak.md)
- [OnUpdate](../enums/index.OnUpdate.md)

### Classes

- [AlgoAmount](../classes/index.AlgoAmount.md)
- [MultisigAccount](../classes/index.MultisigAccount.md)
- [SigningAccount](../classes/index.SigningAccount.md)

### Interfaces

- [ABIAppCallArgs](../interfaces/index.ABIAppCallArgs.md)
- [AlgoClientConfig](../interfaces/index.AlgoClientConfig.md)
- [AppCallParams](../interfaces/index.AppCallParams.md)
- [AppCallTransactionResult](../interfaces/index.AppCallTransactionResult.md)
- [AppDeployMetadata](../interfaces/index.AppDeployMetadata.md)
- [AppDeploymentParams](../interfaces/index.AppDeploymentParams.md)
- [AppLookup](../interfaces/index.AppLookup.md)
- [AppMetadata](../interfaces/index.AppMetadata.md)
- [AppReference](../interfaces/index.AppReference.md)
- [AppStorageSchema](../interfaces/index.AppStorageSchema.md)
- [BoxReference](../interfaces/index.BoxReference.md)
- [CompiledTeal](../interfaces/index.CompiledTeal.md)
- [Config](../interfaces/index.Config.md)
- [CreateAppParams](../interfaces/index.CreateAppParams.md)
- [RawAppCallArgs](../interfaces/index.RawAppCallArgs.md)
- [SendTransactionParams](../interfaces/index.SendTransactionParams.md)
- [SendTransactionResult](../interfaces/index.SendTransactionResult.md)
- [TealTemplateParameters](../interfaces/index.TealTemplateParameters.md)
- [TransactionSignerAccount](../interfaces/index.TransactionSignerAccount.md)
- [TransactionToSign](../interfaces/index.TransactionToSign.md)
- [UpdateAppParams](../interfaces/index.UpdateAppParams.md)

### Type Aliases

- [ABIReturn](index.md#abireturn)
- [AppCallArgs](index.md#appcallargs)
- [Arc2TransactionNote](index.md#arc2transactionnote)
- [Logger](index.md#logger)
- [SendTransactionFrom](index.md#sendtransactionfrom)
- [TransactionNote](index.md#transactionnote)
- [TransactionNoteData](index.md#transactionnotedata)

### Variables

- [ABI\_RETURN\_PREFIX](index.md#abi_return_prefix)
- [APP\_DEPLOY\_NOTE\_PREFIX](index.md#app_deploy_note_prefix)
- [APP\_PAGE\_MAX\_SIZE](index.md#app_page_max_size)
- [AlgoKitConfig](index.md#algokitconfig)
- [DELETABLE\_TEMPLATE\_NAME](index.md#deletable_template_name)
- [DISPENSER\_ACCOUNT](index.md#dispenser_account)
- [UPDATABLE\_TEMPLATE\_NAME](index.md#updatable_template_name)
- [consoleLogger](index.md#consolelogger)
- [nullLogger](index.md#nulllogger)

### Functions

- [callApp](index.md#callapp)
- [capTransactionFee](index.md#captransactionfee)
- [compileTeal](index.md#compileteal)
- [createApp](index.md#createapp)
- [deployApp](index.md#deployapp)
- [encodeTransactionNote](index.md#encodetransactionnote)
- [executePaginatedRequest](index.md#executepaginatedrequest)
- [getABIReturn](index.md#getabireturn)
- [getAccount](index.md#getaccount)
- [getAccountAddressAsString](index.md#getaccountaddressasstring)
- [getAccountAddressAsUint8Array](index.md#getaccountaddressasuint8array)
- [getAccountFromMnemonic](index.md#getaccountfrommnemonic)
- [getAlgoClient](index.md#getalgoclient)
- [getAlgoIndexerClient](index.md#getalgoindexerclient)
- [getAlgoKmdClient](index.md#getalgokmdclient)
- [getAlgoNodeConfig](index.md#getalgonodeconfig)
- [getAlgodConfigFromEnvironment](index.md#getalgodconfigfromenvironment)
- [getAppArgsForTransaction](index.md#getappargsfortransaction)
- [getAppByIndex](index.md#getappbyindex)
- [getAppDeploymentTransactionNote](index.md#getappdeploymenttransactionnote)
- [getCreatorAppsByName](index.md#getcreatorappsbyname)
- [getDefaultLocalNetConfig](index.md#getdefaultlocalnetconfig)
- [getDispenserAccount](index.md#getdispenseraccount)
- [getIndexerConfigFromEnvironment](index.md#getindexerconfigfromenvironment)
- [getKmdWalletAccount](index.md#getkmdwalletaccount)
- [getLocalNetDispenserAccount](index.md#getlocalnetdispenseraccount)
- [getOrCreateKmdWalletAccount](index.md#getorcreatekmdwalletaccount)
- [getSenderAddress](index.md#getsenderaddress)
- [getTestAccount](index.md#gettestaccount)
- [getTransactionParams](index.md#gettransactionparams)
- [isLocalNet](index.md#islocalnet)
- [lookupAccountCreatedApplicationByAddress](index.md#lookupaccountcreatedapplicationbyaddress)
- [lookupTransactionById](index.md#lookuptransactionbyid)
- [performTemplateSubstitution](index.md#performtemplatesubstitution)
- [performTemplateSubstitutionAndCompile](index.md#performtemplatesubstitutionandcompile)
- [replaceDeployTimeControlParams](index.md#replacedeploytimecontrolparams)
- [schemaIsBroken](index.md#schemaisbroken)
- [searchTransactions](index.md#searchtransactions)
- [sendGroupOfTransactions](index.md#sendgroupoftransactions)
- [sendTransaction](index.md#sendtransaction)
- [transferAlgos](index.md#transferalgos)
- [updateApp](index.md#updateapp)
- [waitForConfirmation](index.md#waitforconfirmation)

## Type Aliases

### ABIReturn

Ƭ **ABIReturn**: { `decodeError`: `undefined` ; `rawReturnValue`: `Uint8Array` ; `returnValue`: `ABIValue`  } \| { `decodeError`: `Error` ; `rawReturnValue`: `undefined` ; `returnValue`: `undefined`  }

The return value of an ABI method call

#### Defined in

[app.ts:169](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L169)

___

### AppCallArgs

Ƭ **AppCallArgs**: [`RawAppCallArgs`](../interfaces/index.RawAppCallArgs.md) \| [`ABIAppCallArgs`](../interfaces/index.ABIAppCallArgs.md)

Arguments to pass to an app call either:
  * The raw app call values to pass through into the transaction (after processing); or
  * An ABI method definition (method and args)

#### Defined in

[app.ts:91](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L91)

___

### Arc2TransactionNote

Ƭ **Arc2TransactionNote**: `Object`

ARC-0002 compatible transaction note components,

**`See`**

https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0002.md

#### Type declaration

| Name | Type |
| :------ | :------ |
| `dAppName` | `string` |
| `data` | `string` |
| `format` | ``"m"`` \| ``"j"`` \| ``"b"`` \| ``"u"`` |

#### Defined in

[transaction.ts:97](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L97)

___

### Logger

Ƭ **Logger**: `Object`

General purpose logger type, compatible with Winston and others.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `debug` | (`message`: `string`, ...`optionalParams`: `unknown`[]) => `void` |
| `error` | (`message`: `string`, ...`optionalParams`: `unknown`[]) => `void` |
| `info` | (`message`: `string`, ...`optionalParams`: `unknown`[]) => `void` |
| `verbose` | (`message`: `string`, ...`optionalParams`: `unknown`[]) => `void` |
| `warn` | (`message`: `string`, ...`optionalParams`: `unknown`[]) => `void` |

#### Defined in

[config.ts:3](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/config.ts#L3)

___

### SendTransactionFrom

Ƭ **SendTransactionFrom**: `Account` \| [`SigningAccount`](../classes/index.SigningAccount.md) \| `LogicSigAccount` \| [`MultisigAccount`](../classes/index.MultisigAccount.md) \| [`TransactionSignerAccount`](../interfaces/index.TransactionSignerAccount.md)

#### Defined in

[transaction.ts:154](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L154)

___

### TransactionNote

Ƭ **TransactionNote**: `Uint8Array` \| [`TransactionNoteData`](index.md#transactionnotedata) \| [`Arc2TransactionNote`](index.md#arc2transactionnote)

#### Defined in

[transaction.ts:93](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L93)

___

### TransactionNoteData

Ƭ **TransactionNoteData**: `string` \| ``null`` \| `undefined` \| `number` \| `any`[] \| `Record`<`string`, `any`\>

#### Defined in

[transaction.ts:95](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L95)

## Variables

### ABI\_RETURN\_PREFIX

• `Const` **ABI\_RETURN\_PREFIX**: `Uint8Array`

First 4 bytes of SHA-512/256 hash of "return"

#### Defined in

[app.ts:31](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L31)

___

### APP\_DEPLOY\_NOTE\_PREFIX

• `Const` **APP\_DEPLOY\_NOTE\_PREFIX**: ``"APP_DEPLOY::"``

#### Defined in

[deploy-app.ts:10](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L10)

___

### APP\_PAGE\_MAX\_SIZE

• `Const` **APP\_PAGE\_MAX\_SIZE**: ``2048``

The maximum number of bytes in an app code page

#### Defined in

[app.ts:29](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L29)

___

### AlgoKitConfig

• `Const` **AlgoKitConfig**: `UpdatableConfig`

The AlgoKit config. To update it use the configure method.

#### Defined in

[config.ts:66](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/config.ts#L66)

___

### DELETABLE\_TEMPLATE\_NAME

• `Const` **DELETABLE\_TEMPLATE\_NAME**: ``"TMPL_DELETABLE"``

#### Defined in

[deploy-app.ts:9](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L9)

___

### DISPENSER\_ACCOUNT

• `Const` **DISPENSER\_ACCOUNT**: ``"DISPENSER"``

The account name identifier used for fund dispensing in test environments

#### Defined in

[account.ts:12](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/account.ts#L12)

___

### UPDATABLE\_TEMPLATE\_NAME

• `Const` **UPDATABLE\_TEMPLATE\_NAME**: ``"TMPL_UPDATABLE"``

#### Defined in

[deploy-app.ts:8](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L8)

___

### consoleLogger

• `Const` **consoleLogger**: [`Logger`](index.md#logger)

A logger implementation that writes to console

#### Defined in

[config.ts:12](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/config.ts#L12)

___

### nullLogger

• `Const` **nullLogger**: [`Logger`](index.md#logger)

#### Defined in

[config.ts:20](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/config.ts#L20)

## Functions

### callApp

▸ **callApp**(`call`, `algod`): `Promise`<[`AppCallTransactionResult`](../interfaces/index.AppCallTransactionResult.md)\>

Issues a call to a given app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | [`AppCallParams`](../interfaces/index.AppCallParams.md) | The call details. |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/index.AppCallTransactionResult.md)\>

The result of the call

#### Defined in

[app.ts:263](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L263)

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
| `maxAcceptableFee` | [`AlgoAmount`](../classes/index.AlgoAmount.md) | The maximum acceptable fee to pay |

#### Returns

`void`

#### Defined in

[transaction.ts:390](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L390)

___

### compileTeal

▸ **compileTeal**(`tealCode`, `algod`): `Promise`<[`CompiledTeal`](../interfaces/index.CompiledTeal.md)\>

Compiles the given TEAL using algod and returns the result.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tealCode` | `string` | The TEAL code |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<[`CompiledTeal`](../interfaces/index.CompiledTeal.md)\>

The information about the compiled file

#### Defined in

[app.ts:412](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L412)

___

### createApp

▸ **createApp**(`create`, `algod`): `Promise`<[`AppCallTransactionResult`](../interfaces/index.AppCallTransactionResult.md) & [`AppReference`](../interfaces/index.AppReference.md)\>

Creates a smart contract app, returns the details of the created app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `create` | [`CreateAppParams`](../interfaces/index.CreateAppParams.md) | The parameters to create the app with |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/index.AppCallTransactionResult.md) & [`AppReference`](../interfaces/index.AppReference.md)\>

The details of the created app, or the transaction to create it if `skipSending`

#### Defined in

[app.ts:183](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L183)

___

### deployApp

▸ **deployApp**(`deployment`, `algod`, `indexer`): `Promise`<[`SendTransactionResult`](../interfaces/index.SendTransactionResult.md) & [`AppMetadata`](../interfaces/index.AppMetadata.md) & { `deleteResult?`: [`SendTransactionResult`](../interfaces/index.SendTransactionResult.md)  } \| [`AppMetadata`](../interfaces/index.AppMetadata.md)\>

Idempotently deploy (create, update/delete if changed) an app against the given name via the given creator account, including deploy-time template placeholder substitutions.

To understand the architecture decisions behind this functionality please

**`See`**

https://github.com/algorandfoundation/algokit-cli/blob/main/docs/architecture-decisions/2023-01-12_smart-contract-deployment.md

**Note:** if there is a breaking state schema change to an existing app (and `onSchemaBreak` is set to `'replace'`) the existing app will be deleted and re-created.

**Note:** if there is an update (different TEAL code) to an existing app (and `onUpdate` is set to `'replace'`) the existing app will be deleted and re-created.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `deployment` | [`AppDeploymentParams`](../interfaces/index.AppDeploymentParams.md) | The arguments to control the app deployment |
| `algod` | `default` | An algod client |
| `indexer` | `default` | An indexer client |

#### Returns

`Promise`<[`SendTransactionResult`](../interfaces/index.SendTransactionResult.md) & [`AppMetadata`](../interfaces/index.AppMetadata.md) & { `deleteResult?`: [`SendTransactionResult`](../interfaces/index.SendTransactionResult.md)  } \| [`AppMetadata`](../interfaces/index.AppMetadata.md)\>

The app reference of the new/existing app

#### Defined in

[deploy-app.ts:106](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L106)

___

### encodeTransactionNote

▸ **encodeTransactionNote**(`note?`): `Uint8Array` \| `undefined`

Encodes a transaction note into a byte array ready to be included in an Algorand transaction.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `note?` | [`TransactionNote`](index.md#transactionnote) | The transaction note |

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

[transaction.ts:115](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L115)

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

▸ **getABIReturn**(`args?`, `confirmation?`): [`ABIReturn`](index.md#abireturn) \| `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `args?` | [`AppCallArgs`](index.md#appcallargs) |
| `confirmation?` | [`PendingTransactionResponse`](../interfaces/types_algod.PendingTransactionResponse.md) |

#### Returns

[`ABIReturn`](index.md#abireturn) \| `undefined`

#### Defined in

[app.ts:302](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L302)

___

### getAccount

▸ **getAccount**(`account`, `algod`, `kmdClient?`): `Promise`<`Account` \| [`SigningAccount`](../classes/index.SigningAccount.md)\>

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
| `account` | `string` \| { `fundWith?`: [`AlgoAmount`](../classes/index.AlgoAmount.md) ; `name`: `string`  } | The details of the account to get, wither the name identifier (string) or an object with: * `name`: The name identifier of the account * `fundWith`: The amount to fund the account with it it gets created (when targeting LocalNet), if not specified then 1000 Algos will be funded from the dispenser account |
| `algod` | `default` | An algod client |
| `kmdClient?` | `default` | An optional KMD client to use to create an account (when targeting LocalNet), if not specified then a default KMD client will be loaded from environment variables |

#### Returns

`Promise`<`Account` \| [`SigningAccount`](../classes/index.SigningAccount.md)\>

The requested account with private key loaded from the environment variables or when targeting LocalNet from KMD (idempotently creating and funding the account)

#### Defined in

[account.ts:55](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/account.ts#L55)

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

[account.ts:148](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/account.ts#L148)

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

[account.ts:140](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/account.ts#L140)

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

[account.ts:21](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/account.ts#L21)

___

### getAlgoClient

▸ **getAlgoClient**(`config?`): `Algodv2`

Returns an algod SDK client that automatically retries on idempotent calls

**`Example`**

Default (load from environment variables)

 ```
 // Uses process.env.ALGOD_SERVER, process.env.ALGOD_PORT and process.env.ALGOD_TOKEN
 // Automatically detects if you are using PureStake to switch in the right header name for ALGOD_TOKEN
 const algod = getAlgoClient()
 await algod.healthCheck().do()
 ```

**`Example`**

AlgoNode (testnet)
```
 const algod = getAlgoClient(getAlgoNodeConfig('testnet', 'algod'))
 await algod.healthCheck().do()
```

**`Example`**

AlgoNode (mainnet)
```
 const algod = getAlgoClient(getAlgoNodeConfig('mainnet', 'algod'))
 await algod.healthCheck().do()
```

**`Example`**

Custom (e.g. default local sandbox, although we recommend loading this into a .env and using the Default option instead)
```
 const algod = getAlgoClient({server: 'http://localhost', port: '4001', token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'})
 await algod.healthCheck().do()
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | [`AlgoClientConfig`](../interfaces/index.AlgoClientConfig.md) | The config if you want to override the default (getting config from process.env) |

#### Returns

`Algodv2`

#### Defined in

[network-client.ts:108](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/network-client.ts#L108)

___

### getAlgoIndexerClient

▸ **getAlgoIndexerClient**(`config?`): `Indexer`

Returns an indexer SDK client that automatically retries on idempotent calls

**`Example`**

Default (load from environment variables)

 ```
 // Uses process.env.INDEXER_SERVER, process.env.INDEXER_PORT and process.env.INDEXER_TOKEN
 // Automatically detects if you are using PureStake to switch in the right header name for INDEXER_TOKEN
 const indexer = getAlgoIndexerClient()
 await indexer.makeHealthCheck().do()
 ```

**`Example`**

AlgoNode (testnet)
```
 const indexer = getAlgoIndexerClient(getAlgoNodeConfig('testnet', 'indexer'))
 await indexer.makeHealthCheck().do()
```

**`Example`**

AlgoNode (mainnet)
```
 const indexer = getAlgoIndexerClient(getAlgoNodeConfig('mainnet', 'indexer'))
 await indexer.makeHealthCheck().do()
```

**`Example`**

Custom (e.g. default local sandbox, although we recommend loading this into a .env and using the Default option instead)
```
 const indexer = getAlgoIndexerClient({server: 'http://localhost', port: '8980', token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'})
 await indexer.makeHealthCheck().do()
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | [`AlgoClientConfig`](../interfaces/index.AlgoClientConfig.md) | The config if you want to override the default (getting config from process.env) |

#### Returns

`Indexer`

#### Defined in

[network-client.ts:141](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/network-client.ts#L141)

___

### getAlgoKmdClient

▸ **getAlgoKmdClient**(`config?`): `Kmd`

Returns a KMD SDK client that automatically retries on idempotent calls

KMD client allows you to export private keys, which is useful to get the default account in a sandbox network.

**`Example`**

Default (load from environment variables)

 ```
 // Uses process.env.ALGOD_SERVER, process.env.KMD_PORT (or if not specified: port 4002) and process.env.ALGOD_TOKEN
 const kmd = getAlgoKmdClient()
 ```

**`Example`**

Custom (e.g. default local sandbox, although we recommend loading this into a .env and using the Default option instead)
```
 const kmd = getAlgoKmdClient({server: 'http://localhost', port: '4002', token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'})
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | [`AlgoClientConfig`](../interfaces/index.AlgoClientConfig.md) | The config if you want to override the default (getting config from process.env) |

#### Returns

`Kmd`

#### Defined in

[network-client.ts:164](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/network-client.ts#L164)

___

### getAlgoNodeConfig

▸ **getAlgoNodeConfig**(`network`, `config`): [`AlgoClientConfig`](../interfaces/index.AlgoClientConfig.md)

Returns the Algorand configuration to point to the AlgoNode service

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `network` | ``"testnet"`` \| ``"mainnet"`` | Which network to connect to - TestNet or MainNet |
| `config` | ``"algod"`` \| ``"indexer"`` | Which algod config to return - Algod or Indexer |

#### Returns

[`AlgoClientConfig`](../interfaces/index.AlgoClientConfig.md)

#### Defined in

[network-client.ts:54](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/network-client.ts#L54)

___

### getAlgodConfigFromEnvironment

▸ **getAlgodConfigFromEnvironment**(): [`AlgoClientConfig`](../interfaces/index.AlgoClientConfig.md)

Retrieve the algod configuration from environment variables (expects to be called from a Node.js environment not algod-side)

#### Returns

[`AlgoClientConfig`](../interfaces/index.AlgoClientConfig.md)

#### Defined in

[network-client.ts:16](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/network-client.ts#L16)

___

### getAppArgsForTransaction

▸ **getAppArgsForTransaction**(`args?`): `undefined` \| { `accounts`: `undefined` \| `string`[] ; `appArgs`: `undefined` \| `Uint8Array`[] ; `boxes`: `undefined` \| `BoxReference`[] ; `foreignApps`: `undefined` \| `number`[] = actualArgs.apps; `foreignAssets`: `undefined` \| `number`[] = actualArgs.assets; `lease`: `undefined` \| `Uint8Array`  }

Returns the app args ready to load onto an app

**`See`**

object

#### Parameters

| Name | Type |
| :------ | :------ |
| `args?` | [`AppCallArgs`](index.md#appcallargs) |

#### Returns

`undefined` \| { `accounts`: `undefined` \| `string`[] ; `appArgs`: `undefined` \| `Uint8Array`[] ; `boxes`: `undefined` \| `BoxReference`[] ; `foreignApps`: `undefined` \| `number`[] = actualArgs.apps; `foreignAssets`: `undefined` \| `number`[] = actualArgs.assets; `lease`: `undefined` \| `Uint8Array`  }

#### Defined in

[app.ts:334](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L334)

___

### getAppByIndex

▸ **getAppByIndex**(`appIndex`, `algod`): `Promise`<[`ApplicationResponse`](../interfaces/types_algod.ApplicationResponse.md)\>

Gets the current data for the given app from algod.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appIndex` | `number` | The index of the app |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<[`ApplicationResponse`](../interfaces/types_algod.ApplicationResponse.md)\>

The data about the app

#### Defined in

[app.ts:401](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L401)

___

### getAppDeploymentTransactionNote

▸ **getAppDeploymentTransactionNote**(`metadata`): `string`

Return the transaction note for an app deployment.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `metadata` | [`AppDeployMetadata`](../interfaces/index.AppDeployMetadata.md) | The metadata of the deployment |

#### Returns

`string`

The transaction note as a utf-8 string

#### Defined in

[deploy-app.ts:513](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L513)

___

### getCreatorAppsByName

▸ **getCreatorAppsByName**(`creatorAccount`, `indexer`): `Promise`<[`AppLookup`](../interfaces/index.AppLookup.md)\>

Returns a lookup of name => app metadata (id, address, ...metadata) for all apps created by the given account that have an

**`See`**

in the transaction note of the creation transaction.

**Note:** It's recommended this is only called once and then stored since it's a somewhat expensive operation (multiple indexer calls).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `creatorAccount` | `string` \| [`SendTransactionFrom`](index.md#sendtransactionfrom) | The account (with private key loaded) or string address of an account that is the creator of the apps you want to search for |
| `indexer` | `default` | An indexer client |

#### Returns

`Promise`<[`AppLookup`](../interfaces/index.AppLookup.md)\>

A name-based lookup of the app information (id, address)

#### Defined in

[deploy-app.ts:414](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L414)

___

### getDefaultLocalNetConfig

▸ **getDefaultLocalNetConfig**(`configOrPort`): [`AlgoClientConfig`](../interfaces/index.AlgoClientConfig.md)

Returns the Algorand configuration to point to the default LocalNet

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `configOrPort` | `number` \| ``"algod"`` \| ``"indexer"`` \| ``"kmd"`` | Which algod config to return - algod, kmd, or indexer OR a port number |

#### Returns

[`AlgoClientConfig`](../interfaces/index.AlgoClientConfig.md)

#### Defined in

[network-client.ts:65](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/network-client.ts#L65)

___

### getDispenserAccount

▸ **getDispenserAccount**(`algod`): `Promise`<`default` \| [`SigningAccount`](../classes/index.SigningAccount.md)\>

Returns an account (with private key loaded) that can act as a dispenser

If running on Sandbox then it will return the default dispenser account automatically,
 otherwise it will load the account mnemonic stored in process.env.DISPENSER_MNEMONIC

**`See`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<`default` \| [`SigningAccount`](../classes/index.SigningAccount.md)\>

#### Defined in

[account.ts:159](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/account.ts#L159)

___

### getIndexerConfigFromEnvironment

▸ **getIndexerConfigFromEnvironment**(): [`AlgoClientConfig`](../interfaces/index.AlgoClientConfig.md)

Retrieve the indexer configuration from environment variables (expects to be called from a Node.js environment not algod-side)

#### Returns

[`AlgoClientConfig`](../interfaces/index.AlgoClientConfig.md)

#### Defined in

[network-client.ts:33](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/network-client.ts#L33)

___

### getKmdWalletAccount

▸ **getKmdWalletAccount**(`walletAccount`, `algod`, `kmdClient?`): `Promise`<`Account` \| `undefined`\>

Returns an Algorand account with private key loaded from the given KMD wallet (identified by name).

**`See`**

**`Example`**

Get default funded account in a LocalNet

```
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

▸ **getLocalNetDispenserAccount**(`algod`, `kmdClient?`): `Promise`<`Account`\>

Returns an Algorand account with private key loaded for the default LocalNet dispenser account (that can be used to fund other accounts)

**`See`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `algod` | `default` | An algod client |
| `kmdClient?` | `default` | A KMD client, if not specified then a default KMD client will be loaded from environment variables |

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
| `walletAccount.fundWith?` | [`AlgoAmount`](../classes/index.AlgoAmount.md) | - |
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
| `sender` | [`SendTransactionFrom`](index.md#sendtransactionfrom) | A transaction sender |

#### Returns

`string`

The public address

#### Defined in

[transaction.ts:161](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L161)

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

[account.ts:115](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/account.ts#L115)

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

[transaction.ts:416](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L416)

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

### performTemplateSubstitution

▸ **performTemplateSubstitution**(`tealCode`, `templateParameters?`): `string`

Performs template substitution of a teal file.

Looks for `TMPL_{parameter}` for template replacements.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tealCode` | `string` | The TEAL logic to compile |
| `templateParameters?` | [`TealTemplateParameters`](../interfaces/index.TealTemplateParameters.md) | Any parameters to replace in the .teal file before compiling |

#### Returns

`string`

The TEAL code with replacements

#### Defined in

[deploy-app.ts:558](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L558)

___

### performTemplateSubstitutionAndCompile

▸ **performTemplateSubstitutionAndCompile**(`tealCode`, `algod`, `templateParameters?`, `deploymentMetadata?`): `Promise`<[`CompiledTeal`](../interfaces/index.CompiledTeal.md)\>

Performs template substitution of a teal file and compiles it, returning the compiled result.

Looks for `TMPL_{parameter}` for template replacements.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tealCode` | `string` | The TEAL logic to compile |
| `algod` | `default` | An algod client |
| `templateParameters?` | [`TealTemplateParameters`](../interfaces/index.TealTemplateParameters.md) | Any parameters to replace in the .teal file before compiling |
| `deploymentMetadata?` | [`AppDeployMetadata`](../interfaces/index.AppDeployMetadata.md) | The deployment metadata the app will be deployed with |

#### Returns

`Promise`<[`CompiledTeal`](../interfaces/index.CompiledTeal.md)\>

The information about the compiled code

#### Defined in

[deploy-app.ts:589](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L589)

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

[deploy-app.ts:527](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L527)

___

### schemaIsBroken

▸ **schemaIsBroken**(`before`, `after`): `boolean`

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

[deploy-app.ts:401](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L401)

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
| `groupSend.sendParams?` | `Omit`<`Omit`<[`SendTransactionParams`](../interfaces/index.SendTransactionParams.md), ``"maxFee"``\>, ``"skipSending"``\> | - |
| `groupSend.transactions` | [`TransactionToSign`](../interfaces/index.TransactionToSign.md)[] | - |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<{ `confirmations`: `undefined` \| [`PendingTransactionResponse`](../interfaces/types_algod.PendingTransactionResponse.md)[] ; `groupId`: `string` ; `txIds`: `string`[]  }\>

An object with group transaction ID (`groupTransactionId`) and (if `skipWaiting` is `false` or unset) confirmation (`confirmation`)

#### Defined in

[transaction.ts:236](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L236)

___

### sendTransaction

▸ **sendTransaction**(`send`, `algod`): `Promise`<[`SendTransactionResult`](../interfaces/index.SendTransactionResult.md)\>

Signs and sends the given transaction to the chain

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `send` | `Object` | The details for the transaction to send, including: * `transaction`: The unsigned transaction * `from`: The account to sign the transaction with: either an account with private key loaded or a logic signature account * `config`: The sending configuration for this transaction |
| `send.from` | [`SendTransactionFrom`](index.md#sendtransactionfrom) | - |
| `send.sendParams?` | [`SendTransactionParams`](../interfaces/index.SendTransactionParams.md) | - |
| `send.transaction` | `Transaction` | - |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<[`SendTransactionResult`](../interfaces/index.SendTransactionResult.md)\>

An object with transaction (`transaction`) and (if `skipWaiting` is `false` or unset) confirmation (`confirmation`)

#### Defined in

[transaction.ts:175](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L175)

___

### transferAlgos

▸ **transferAlgos**(`transfer`, `algod`): `Promise`<[`SendTransactionResult`](../interfaces/index.SendTransactionResult.md)\>

Transfer ALGOs between two accounts.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transfer` | `AlgoTransferParams` | The transfer definition |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<[`SendTransactionResult`](../interfaces/index.SendTransactionResult.md)\>

The transaction object and optionally the confirmation if it was sent to the chain (`skipSending` is `false` or unset)

#### Defined in

[transfer.ts:34](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transfer.ts#L34)

___

### updateApp

▸ **updateApp**(`update`, `algod`): `Promise`<[`AppCallTransactionResult`](../interfaces/index.AppCallTransactionResult.md)\>

Updates a smart contract app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `update` | [`UpdateAppParams`](../interfaces/index.UpdateAppParams.md) | The parameters to update the app with |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/index.AppCallTransactionResult.md)\>

The transaction

#### Defined in

[app.ts:230](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L230)

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

[transaction.ts:343](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L343)
