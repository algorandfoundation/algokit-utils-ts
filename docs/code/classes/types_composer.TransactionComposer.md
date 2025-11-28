[@algorandfoundation/algokit-utils](../README.md) / [types/composer](../modules/types_composer.md) / TransactionComposer

# Class: TransactionComposer

[types/composer](../modules/types_composer.md).TransactionComposer

TransactionComposer helps you compose and execute transactions as a transaction group.

## Table of contents

### Constructors

- [constructor](types_composer.TransactionComposer.md#constructor)

### Properties

- [algod](types_composer.TransactionComposer.md#algod)
- [appManager](types_composer.TransactionComposer.md#appmanager)
- [composerConfig](types_composer.TransactionComposer.md#composerconfig)
- [defaultValidityWindow](types_composer.TransactionComposer.md#defaultvaliditywindow)
- [defaultValidityWindowIsExplicit](types_composer.TransactionComposer.md#defaultvaliditywindowisexplicit)
- [errorTransformers](types_composer.TransactionComposer.md#errortransformers)
- [getSigner](types_composer.TransactionComposer.md#getsigner)
- [getSuggestedParams](types_composer.TransactionComposer.md#getsuggestedparams)
- [rawBuildTransactions](types_composer.TransactionComposer.md#rawbuildtransactions)
- [signedTransactions](types_composer.TransactionComposer.md#signedtransactions)
- [transactionsWithSigners](types_composer.TransactionComposer.md#transactionswithsigners)
- [txns](types_composer.TransactionComposer.md#txns)

### Methods

- [\_buildTransactions](types_composer.TransactionComposer.md#_buildtransactions)
- [addAppCall](types_composer.TransactionComposer.md#addappcall)
- [addAppCallMethodCall](types_composer.TransactionComposer.md#addappcallmethodcall)
- [addAppCreate](types_composer.TransactionComposer.md#addappcreate)
- [addAppCreateMethodCall](types_composer.TransactionComposer.md#addappcreatemethodcall)
- [addAppDelete](types_composer.TransactionComposer.md#addappdelete)
- [addAppDeleteMethodCall](types_composer.TransactionComposer.md#addappdeletemethodcall)
- [addAppUpdate](types_composer.TransactionComposer.md#addappupdate)
- [addAppUpdateMethodCall](types_composer.TransactionComposer.md#addappupdatemethodcall)
- [addAssetConfig](types_composer.TransactionComposer.md#addassetconfig)
- [addAssetCreate](types_composer.TransactionComposer.md#addassetcreate)
- [addAssetDestroy](types_composer.TransactionComposer.md#addassetdestroy)
- [addAssetFreeze](types_composer.TransactionComposer.md#addassetfreeze)
- [addAssetOptIn](types_composer.TransactionComposer.md#addassetoptin)
- [addAssetOptOut](types_composer.TransactionComposer.md#addassetoptout)
- [addAssetTransfer](types_composer.TransactionComposer.md#addassettransfer)
- [addOfflineKeyRegistration](types_composer.TransactionComposer.md#addofflinekeyregistration)
- [addOnlineKeyRegistration](types_composer.TransactionComposer.md#addonlinekeyregistration)
- [addPayment](types_composer.TransactionComposer.md#addpayment)
- [addTransaction](types_composer.TransactionComposer.md#addtransaction)
- [addTransactionComposer](types_composer.TransactionComposer.md#addtransactioncomposer)
- [analyzeGroupRequirements](types_composer.TransactionComposer.md#analyzegrouprequirements)
- [build](types_composer.TransactionComposer.md#build)
- [buildTransactions](types_composer.TransactionComposer.md#buildtransactions)
- [clone](types_composer.TransactionComposer.md#clone)
- [cloneTransaction](types_composer.TransactionComposer.md#clonetransaction)
- [count](types_composer.TransactionComposer.md#count)
- [gatherSignatures](types_composer.TransactionComposer.md#gathersignatures)
- [parseAbiReturnValues](types_composer.TransactionComposer.md#parseabireturnvalues)
- [populateTransactionAndGroupResources](types_composer.TransactionComposer.md#populatetransactionandgroupresources)
- [push](types_composer.TransactionComposer.md#push)
- [rebuild](types_composer.TransactionComposer.md#rebuild)
- [registerErrorTransformer](types_composer.TransactionComposer.md#registererrortransformer)
- [reset](types_composer.TransactionComposer.md#reset)
- [send](types_composer.TransactionComposer.md#send)
- [setMaxFees](types_composer.TransactionComposer.md#setmaxfees)
- [signTransactions](types_composer.TransactionComposer.md#signtransactions)
- [simulate](types_composer.TransactionComposer.md#simulate)
- [transformError](types_composer.TransactionComposer.md#transformerror)
- [arc2Note](types_composer.TransactionComposer.md#arc2note)

## Constructors

### constructor

• **new TransactionComposer**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Create a `TransactionComposer`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`TransactionComposerParams`](../modules/types_composer.md#transactioncomposerparams) | The configuration for this composer |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The `TransactionComposer` instance

#### Defined in

[src/types/composer.ts:294](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L294)

## Properties

### algod

• `Private` **algod**: `AlgodClient`

The algod client used by the composer.

#### Defined in

[src/types/composer.ts:240](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L240)

___

### appManager

• `Private` **appManager**: [`AppManager`](types_app_manager.AppManager.md)

#### Defined in

[src/types/composer.ts:254](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L254)

___

### composerConfig

• `Private` **composerConfig**: [`TransactionComposerConfig`](../modules/types_composer.md#transactioncomposerconfig)

#### Defined in

[src/types/composer.ts:258](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L258)

___

### defaultValidityWindow

• `Private` **defaultValidityWindow**: `bigint`

The default transaction validity window

#### Defined in

[src/types/composer.ts:249](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L249)

___

### defaultValidityWindowIsExplicit

• `Private` **defaultValidityWindowIsExplicit**: `boolean` = `false`

Whether the validity window was explicitly set on construction

#### Defined in

[src/types/composer.ts:252](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L252)

___

### errorTransformers

• `Private` **errorTransformers**: [`ErrorTransformer`](../modules/types_composer.md#errortransformer)[]

#### Defined in

[src/types/composer.ts:256](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L256)

___

### getSigner

• `Private` **getSigner**: (`address`: `ReadableAddress`) => `TransactionSigner`

A function that takes in an address and return a signer function for that address.

#### Type declaration

▸ (`address`): `TransactionSigner`

##### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `ReadableAddress` |

##### Returns

`TransactionSigner`

#### Defined in

[src/types/composer.ts:246](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L246)

___

### getSuggestedParams

• `Private` **getSuggestedParams**: () => `Promise`\<\{ `consensusVersion`: `string` ; `fee`: `bigint` ; `firstValid`: `bigint` ; `flatFee`: `boolean` ; `genesisHash`: `Uint8Array` ; `genesisId`: `string` ; `lastValid`: `bigint` ; `minFee`: `bigint`  }\>

An async function that will return suggested params for the transaction.

#### Type declaration

▸ (): `Promise`\<\{ `consensusVersion`: `string` ; `fee`: `bigint` ; `firstValid`: `bigint` ; `flatFee`: `boolean` ; `genesisHash`: `Uint8Array` ; `genesisId`: `string` ; `lastValid`: `bigint` ; `minFee`: `bigint`  }\>

##### Returns

`Promise`\<\{ `consensusVersion`: `string` ; `fee`: `bigint` ; `firstValid`: `bigint` ; `flatFee`: `boolean` ; `genesisHash`: `Uint8Array` ; `genesisId`: `string` ; `lastValid`: `bigint` ; `minFee`: `bigint`  }\>

#### Defined in

[src/types/composer.ts:243](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L243)

___

### rawBuildTransactions

• `Private` `Optional` **rawBuildTransactions**: `Transaction`[]

#### Defined in

[src/types/composer.ts:265](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L265)

___

### signedTransactions

• `Private` `Optional` **signedTransactions**: `SignedTransaction`[]

#### Defined in

[src/types/composer.ts:262](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L262)

___

### transactionsWithSigners

• `Private` `Optional` **transactionsWithSigners**: [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md)[]

#### Defined in

[src/types/composer.ts:260](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L260)

___

### txns

• `Private` **txns**: `Txn`[] = `[]`

Transactions that have not yet been composed

#### Defined in

[src/types/composer.ts:237](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L237)

## Methods

### \_buildTransactions

▸ **_buildTransactions**(`suggestedParams`): `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `suggestedParams` | `Object` | - |
| `suggestedParams.consensusVersion` | `string` | ConsensusVersion indicates the consensus protocol version as of LastRound. |
| `suggestedParams.fee` | `bigint` | Fee is the suggested transaction fee Fee is in units of micro-Algos per byte. Fee may fall to zero but transactions must still have a fee of at least MinTxnFee for the current network protocol. |
| `suggestedParams.firstValid` | `bigint` | - |
| `suggestedParams.flatFee` | `boolean` | - |
| `suggestedParams.genesisHash` | `Uint8Array` | GenesisHash is the hash of the genesis block. |
| `suggestedParams.genesisId` | `string` | GenesisID is an ID listed in the genesis block. |
| `suggestedParams.lastValid` | `bigint` | - |
| `suggestedParams.minFee` | `bigint` | The minimum transaction fee (not per byte) required for the txn to validate for the current network protocol. |

#### Returns

`Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\>

#### Defined in

[src/types/composer.ts:1346](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1346)

___

### addAppCall

▸ **addAppCall**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an application call transaction to the transaction group.

If you want to create or update an app use `addAppCreate` or `addAppUpdate`.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AppCallParams`](../modules/types_composer.md#appcallparams) | The application call transaction parameters |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

**`Example`**

```typescript
composer.addAppCall({ sender: 'CREATORADDRESS' })
```

**`Example`**

```typescript
composer.addAppCall({
 sender: 'CREATORADDRESS',
 onComplete: OnApplicationComplete.OptIn,
 args: [new Uint8Array(1, 2, 3, 4)]
 accountReferences: ["ACCOUNT_1"]
 appReferences: [123n, 1234n]
 assetReferences: [12345n]
 boxReferences: ["box1", {appId: 1234n, name: "box2"}]
 accessReferences: [{ appId: 1234n }]
 lease: 'lease',
 note: 'note',
 // You wouldn't normally set this field
 firstValidRound: 1000n,
 validityWindow: 10,
 extraFee: (1000).microAlgo(),
 staticFee: (1000).microAlgo(),
 // Max fee doesn't make sense with extraFee AND staticFee
 //  already specified, but here for completeness
 maxFee: (3000).microAlgo(),
})
```

#### Defined in

[src/types/composer.ts:957](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L957)

___

### addAppCallMethodCall

▸ **addAppCallMethodCall**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add a non-create/non-update ABI method application call transaction to the transaction group.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The ABI method application call transaction parameters |
| `params.accessReferences?` | `AccessReference`[] | Access references unifies `accountReferences`, `appReferences`, `assetReferences`, and `boxReferences` under a single list. If non-empty, these other reference lists must be empty. If access is empty, those other reference lists may be non-empty. |
| `params.accountReferences?` | `ReadableAddress`[] | Any account addresses to add to the [accounts array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). |
| `params.appId` | `bigint` | ID of the application; 0 if the application is being created. |
| `params.appReferences?` | `bigint`[] | The ID of any apps to load to the [foreign apps array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). |
| `params.args?` | (`undefined` \| `Transaction` \| `ABIValue` \| `Promise`\<`Transaction`\> \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] | Arguments to the ABI method, either: * An ABI value * A transaction with explicit signer * A transaction (where the signer will be automatically assigned) * An unawaited transaction (e.g. from algorand.createTransaction.{transactionType}()) * Another method call (via method call params object) * undefined (this represents a placeholder transaction argument that is fulfilled by another method call argument) |
| `params.assetReferences?` | `bigint`[] | The ID of any assets to load to the [foreign assets array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). |
| `params.boxReferences?` | ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] | Any boxes to load to the [boxes array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). Either the name identifier (which will be set against app ID of `0` i.e. the current app), or a box identifier with the name identifier and app ID. |
| `params.extraFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The fee to pay IN ADDITION to the suggested fee. Useful for manually covering inner transaction fees. |
| `params.firstValidRound?` | `bigint` | Set the first round this transaction is valid. If left undefined, the value from algod will be used. We recommend you only set this when you intentionally want this to be some time in the future. |
| `params.lastValidRound?` | `bigint` | The last round this transaction is valid. It is recommended to use `validityWindow` instead. |
| `params.lease?` | `string` \| `Uint8Array` | Prevent multiple transactions with the same lease being included within the validity window. A [lease](https://dev.algorand.co/concepts/transactions/leases) enforces a mutually exclusive transaction (useful to prevent double-posting and other scenarios). |
| `params.maxFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | Throw an error if the fee for the transaction is more than this amount; prevents overspending on fees during high congestion periods. |
| `params.method` | `ABIMethod` | The ABI method to call |
| `params.note?` | `string` \| `Uint8Array` | Note to attach to the transaction. Max of 1000 bytes. |
| `params.onComplete?` | `NoOp` \| `OptIn` \| `CloseOut` \| `DeleteApplication` | The [on-complete](https://dev.algorand.co/concepts/smart-contracts/avm#oncomplete) action of the call; defaults to no-op. |
| `params.rejectVersion?` | `number` | The lowest application version for which this transaction should immediately fail. 0 indicates that no version check should be performed. |
| `params.rekeyTo?` | `ReadableAddress` | Change the signing key of the sender to the given address. **Warning:** Please be careful with this parameter and be sure to read the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying). |
| `params.sender` | `ReadableAddress` | The address of the account sending the transaction. |
| `params.signer?` | `AddressWithSigner` \| `TransactionSigner` | The function used to sign transaction(s); if not specified then an attempt will be made to find a registered signer for the given `sender` or use a default signer (if configured). |
| `params.staticFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The static transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction. |
| `params.validityWindow?` | `number` \| `bigint` | How many rounds the transaction should be valid for, if not specified then the registered default validity window will be used. |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

**`Example`**

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
composer.addAppCallMethodCall({ sender: 'CREATORADDRESS', method: method, args: ["arg1_value"] })
```

**`Example`**

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
composer.addAppCallMethodCall({
 sender: 'CREATORADDRESS',
 method: method,
 args: ["arg1_value"],
 onComplete: OnApplicationComplete.OptIn,
 args: [new Uint8Array(1, 2, 3, 4)]
 accountReferences: ["ACCOUNT_1"]
 appReferences: [123n, 1234n]
 assetReferences: [12345n]
 boxReferences: ["box1", {appId: 1234n, name: "box2"}]
 accessReferences: [{ appId: 1234n }]
 lease: 'lease',
 note: 'note',
 // You wouldn't normally set this field
 firstValidRound: 1000n,
 validityWindow: 10,
 extraFee: (1000).microAlgo(),
 staticFee: (1000).microAlgo(),
 // Max fee doesn't make sense with extraFee AND staticFee
 //  already specified, but here for completeness
 maxFee: (3000).microAlgo(),
})
```

#### Defined in

[src/types/composer.ts:1194](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1194)

___

### addAppCreate

▸ **addAppCreate**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an application create transaction to the transaction group.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The application create transaction parameters |
| `params.accessReferences?` | `AccessReference`[] | Access references unifies `accountReferences`, `appReferences`, `assetReferences`, and `boxReferences` under a single list. If non-empty, these other reference lists must be empty. If access is empty, those other reference lists may be non-empty. |
| `params.accountReferences?` | `ReadableAddress`[] | Any account addresses to add to the [accounts array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). |
| `params.appReferences?` | `bigint`[] | The ID of any apps to load to the [foreign apps array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). |
| `params.approvalProgram` | `string` \| `Uint8Array` | The program to execute for all OnCompletes other than ClearState as raw teal that will be compiled (string) or compiled teal (encoded as a byte array (Uint8Array)). |
| `params.args?` | `Uint8Array`[] | Any [arguments to pass to the smart contract call](/concepts/smart-contracts/languages/teal/#argument-passing). |
| `params.assetReferences?` | `bigint`[] | The ID of any assets to load to the [foreign assets array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). |
| `params.boxReferences?` | ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] | Any boxes to load to the [boxes array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). Either the name identifier (which will be set against app ID of `0` i.e. the current app), or a box identifier with the name identifier and app ID. |
| `params.clearStateProgram` | `string` \| `Uint8Array` | The program to execute for ClearState OnComplete as raw teal that will be compiled (string) or compiled teal (encoded as a byte array (Uint8Array)). |
| `params.extraFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The fee to pay IN ADDITION to the suggested fee. Useful for manually covering inner transaction fees. |
| `params.extraProgramPages?` | `number` | Number of extra pages required for the programs. Defaults to the number needed for the programs in this call if not specified. This is immutable once the app is created. |
| `params.firstValidRound?` | `bigint` | Set the first round this transaction is valid. If left undefined, the value from algod will be used. We recommend you only set this when you intentionally want this to be some time in the future. |
| `params.lastValidRound?` | `bigint` | The last round this transaction is valid. It is recommended to use `validityWindow` instead. |
| `params.lease?` | `string` \| `Uint8Array` | Prevent multiple transactions with the same lease being included within the validity window. A [lease](https://dev.algorand.co/concepts/transactions/leases) enforces a mutually exclusive transaction (useful to prevent double-posting and other scenarios). |
| `params.maxFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | Throw an error if the fee for the transaction is more than this amount; prevents overspending on fees during high congestion periods. |
| `params.note?` | `string` \| `Uint8Array` | Note to attach to the transaction. Max of 1000 bytes. |
| `params.onComplete?` | `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` | The [on-complete](https://dev.algorand.co/concepts/smart-contracts/avm#oncomplete) action of the call; defaults to no-op. |
| `params.rejectVersion?` | `number` | The lowest application version for which this transaction should immediately fail. 0 indicates that no version check should be performed. |
| `params.rekeyTo?` | `ReadableAddress` | Change the signing key of the sender to the given address. **Warning:** Please be careful with this parameter and be sure to read the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying). |
| `params.schema?` | `Object` | The state schema for the app. This is immutable once the app is created. |
| `params.schema.globalByteSlices` | `number` | The number of byte slices saved in global state. |
| `params.schema.globalInts` | `number` | The number of integers saved in global state. |
| `params.schema.localByteSlices` | `number` | The number of byte slices saved in local state. |
| `params.schema.localInts` | `number` | The number of integers saved in local state. |
| `params.sender` | `ReadableAddress` | The address of the account sending the transaction. |
| `params.signer?` | `AddressWithSigner` \| `TransactionSigner` | The function used to sign transaction(s); if not specified then an attempt will be made to find a registered signer for the given `sender` or use a default signer (if configured). |
| `params.staticFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The static transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction. |
| `params.validityWindow?` | `number` \| `bigint` | How many rounds the transaction should be valid for, if not specified then the registered default validity window will be used. |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

**`Example`**

```typescript
composer.addAppCreate({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE' })
```

**`Example`**

```typescript
composer.addAppCreate({
 sender: 'CREATORADDRESS',
 approvalProgram: "TEALCODE",
 clearStateProgram: "TEALCODE",
 schema: {
   globalInts: 1,
   globalByteSlices: 2,
   localInts: 3,
   localByteSlices: 4
 },
 extraProgramPages: 1,
 onComplete: OnApplicationComplete.OptIn,
 args: [new Uint8Array(1, 2, 3, 4)]
 accountReferences: ["ACCOUNT_1"]
 appReferences: [123n, 1234n]
 assetReferences: [12345n]
 boxReferences: ["box1", {appId: 1234n, name: "box2"}]
 accessReferences: [{ appId: 1234n }]
 lease: 'lease',
 note: 'note',
 // You wouldn't normally set this field
 firstValidRound: 1000n,
 validityWindow: 10,
 extraFee: (1000).microAlgo(),
 staticFee: (1000).microAlgo(),
 // Max fee doesn't make sense with extraFee AND staticFee
 //  already specified, but here for completeness
 maxFee: (3000).microAlgo(),
 // Signer only needed if you want to provide one,
 //  generally you'd register it with AlgorandClient
 //  against the sender and not need to pass it in
 signer: transactionSigner,
 maxRoundsToWaitForConfirmation: 5,
 suppressLog: true,
})
```

#### Defined in

[src/types/composer.ts:833](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L833)

___

### addAppCreateMethodCall

▸ **addAppCreateMethodCall**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an ABI method create application call transaction to the transaction group.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The ABI create method application call transaction parameters |
| `params.accessReferences?` | `AccessReference`[] | Access references unifies `accountReferences`, `appReferences`, `assetReferences`, and `boxReferences` under a single list. If non-empty, these other reference lists must be empty. If access is empty, those other reference lists may be non-empty. |
| `params.accountReferences?` | `ReadableAddress`[] | Any account addresses to add to the [accounts array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). |
| `params.appReferences?` | `bigint`[] | The ID of any apps to load to the [foreign apps array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). |
| `params.approvalProgram` | `string` \| `Uint8Array` | The program to execute for all OnCompletes other than ClearState as raw teal that will be compiled (string) or compiled teal (encoded as a byte array (Uint8Array)). |
| `params.args?` | (`undefined` \| `Transaction` \| `ABIValue` \| `Promise`\<`Transaction`\> \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] | Arguments to the ABI method, either: * An ABI value * A transaction with explicit signer * A transaction (where the signer will be automatically assigned) * An unawaited transaction (e.g. from algorand.createTransaction.{transactionType}()) * Another method call (via method call params object) * undefined (this represents a placeholder transaction argument that is fulfilled by another method call argument) |
| `params.assetReferences?` | `bigint`[] | The ID of any assets to load to the [foreign assets array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). |
| `params.boxReferences?` | ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] | Any boxes to load to the [boxes array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). Either the name identifier (which will be set against app ID of `0` i.e. the current app), or a box identifier with the name identifier and app ID. |
| `params.clearStateProgram` | `string` \| `Uint8Array` | The program to execute for ClearState OnComplete as raw teal that will be compiled (string) or compiled teal (encoded as a byte array (Uint8Array)). |
| `params.extraFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The fee to pay IN ADDITION to the suggested fee. Useful for manually covering inner transaction fees. |
| `params.extraProgramPages?` | `number` | Number of extra pages required for the programs. Defaults to the number needed for the programs in this call if not specified. This is immutable once the app is created. |
| `params.firstValidRound?` | `bigint` | Set the first round this transaction is valid. If left undefined, the value from algod will be used. We recommend you only set this when you intentionally want this to be some time in the future. |
| `params.lastValidRound?` | `bigint` | The last round this transaction is valid. It is recommended to use `validityWindow` instead. |
| `params.lease?` | `string` \| `Uint8Array` | Prevent multiple transactions with the same lease being included within the validity window. A [lease](https://dev.algorand.co/concepts/transactions/leases) enforces a mutually exclusive transaction (useful to prevent double-posting and other scenarios). |
| `params.maxFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | Throw an error if the fee for the transaction is more than this amount; prevents overspending on fees during high congestion periods. |
| `params.method` | `ABIMethod` | The ABI method to call |
| `params.note?` | `string` \| `Uint8Array` | Note to attach to the transaction. Max of 1000 bytes. |
| `params.onComplete?` | `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` | The [on-complete](https://dev.algorand.co/concepts/smart-contracts/avm#oncomplete) action of the call; defaults to no-op. |
| `params.rejectVersion?` | `number` | The lowest application version for which this transaction should immediately fail. 0 indicates that no version check should be performed. |
| `params.rekeyTo?` | `ReadableAddress` | Change the signing key of the sender to the given address. **Warning:** Please be careful with this parameter and be sure to read the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying). |
| `params.schema?` | `Object` | The state schema for the app. This is immutable once the app is created. |
| `params.schema.globalByteSlices` | `number` | The number of byte slices saved in global state. |
| `params.schema.globalInts` | `number` | The number of integers saved in global state. |
| `params.schema.localByteSlices` | `number` | The number of byte slices saved in local state. |
| `params.schema.localInts` | `number` | The number of integers saved in local state. |
| `params.sender` | `ReadableAddress` | The address of the account sending the transaction. |
| `params.signer?` | `AddressWithSigner` \| `TransactionSigner` | The function used to sign transaction(s); if not specified then an attempt will be made to find a registered signer for the given `sender` or use a default signer (if configured). |
| `params.staticFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The static transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction. |
| `params.validityWindow?` | `number` \| `bigint` | How many rounds the transaction should be valid for, if not specified then the registered default validity window will be used. |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

**`Example`**

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
composer.addAppCreateMethodCall({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE', method: method, args: ["arg1_value"] })
```

**`Example`**

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
composer.addAppCreateMethodCall({
 sender: 'CREATORADDRESS',
 method: method,
 args: ["arg1_value"],
 approvalProgram: "TEALCODE",
 clearStateProgram: "TEALCODE",
 schema: {
   globalInts: 1,
   globalByteSlices: 2,
   localInts: 3,
   localByteSlices: 4
 },
 extraProgramPages: 1,
 onComplete: OnApplicationComplete.OptIn,
 args: [new Uint8Array(1, 2, 3, 4)]
 accountReferences: ["ACCOUNT_1"]
 appReferences: [123n, 1234n]
 assetReferences: [12345n]
 boxReferences: ["box1", {appId: 1234n, name: "box2"}]
 accessReferences: [{ appId: 1234n }]
 lease: 'lease',
 note: 'note',
 // You wouldn't normally set this field
 firstValidRound: 1000n,
 validityWindow: 10,
 extraFee: (1000).microAlgo(),
 staticFee: (1000).microAlgo(),
 // Max fee doesn't make sense with extraFee AND staticFee
 //  already specified, but here for completeness
 maxFee: (3000).microAlgo(),
})
```

#### Defined in

[src/types/composer.ts:1018](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1018)

___

### addAppDelete

▸ **addAppDelete**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an application delete transaction to the transaction group.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AppDeleteParams`](../modules/types_composer.md#appdeleteparams) | The application delete transaction parameters |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

**`Example`**

```typescript
composer.addAppDelete({ sender: 'CREATORADDRESS' })
```

**`Example`**

```typescript
composer.addAppDelete({
 sender: 'CREATORADDRESS',
 onComplete: OnApplicationComplete.DeleteApplication,
 args: [new Uint8Array(1, 2, 3, 4)]
 accountReferences: ["ACCOUNT_1"]
 appReferences: [123n, 1234n]
 assetReferences: [12345n]
 boxReferences: ["box1", {appId: 1234n, name: "box2"}]
 accessReferences: [{ appId: 1234n }]
 lease: 'lease',
 note: 'note',
 // You wouldn't normally set this field
 firstValidRound: 1000n,
 validityWindow: 10,
 extraFee: (1000).microAlgo(),
 staticFee: (1000).microAlgo(),
 // Max fee doesn't make sense with extraFee AND staticFee
 //  already specified, but here for completeness
 maxFee: (3000).microAlgo(),
})
```

#### Defined in

[src/types/composer.ts:915](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L915)

___

### addAppDeleteMethodCall

▸ **addAppDeleteMethodCall**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an ABI method delete application call transaction to the transaction group.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The ABI delete method application call transaction parameters |
| `params.accessReferences?` | `AccessReference`[] | Access references unifies `accountReferences`, `appReferences`, `assetReferences`, and `boxReferences` under a single list. If non-empty, these other reference lists must be empty. If access is empty, those other reference lists may be non-empty. |
| `params.accountReferences?` | `ReadableAddress`[] | Any account addresses to add to the [accounts array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). |
| `params.appId` | `bigint` | ID of the application; 0 if the application is being created. |
| `params.appReferences?` | `bigint`[] | The ID of any apps to load to the [foreign apps array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). |
| `params.args?` | (`undefined` \| `Transaction` \| `ABIValue` \| `Promise`\<`Transaction`\> \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] | Arguments to the ABI method, either: * An ABI value * A transaction with explicit signer * A transaction (where the signer will be automatically assigned) * An unawaited transaction (e.g. from algorand.createTransaction.{transactionType}()) * Another method call (via method call params object) * undefined (this represents a placeholder transaction argument that is fulfilled by another method call argument) |
| `params.assetReferences?` | `bigint`[] | The ID of any assets to load to the [foreign assets array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). |
| `params.boxReferences?` | ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] | Any boxes to load to the [boxes array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). Either the name identifier (which will be set against app ID of `0` i.e. the current app), or a box identifier with the name identifier and app ID. |
| `params.extraFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The fee to pay IN ADDITION to the suggested fee. Useful for manually covering inner transaction fees. |
| `params.firstValidRound?` | `bigint` | Set the first round this transaction is valid. If left undefined, the value from algod will be used. We recommend you only set this when you intentionally want this to be some time in the future. |
| `params.lastValidRound?` | `bigint` | The last round this transaction is valid. It is recommended to use `validityWindow` instead. |
| `params.lease?` | `string` \| `Uint8Array` | Prevent multiple transactions with the same lease being included within the validity window. A [lease](https://dev.algorand.co/concepts/transactions/leases) enforces a mutually exclusive transaction (useful to prevent double-posting and other scenarios). |
| `params.maxFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | Throw an error if the fee for the transaction is more than this amount; prevents overspending on fees during high congestion periods. |
| `params.method` | `ABIMethod` | The ABI method to call |
| `params.note?` | `string` \| `Uint8Array` | Note to attach to the transaction. Max of 1000 bytes. |
| `params.onComplete?` | `DeleteApplication` | The [on-complete](https://dev.algorand.co/concepts/smart-contracts/avm#oncomplete) action of the call; defaults to no-op. |
| `params.rejectVersion?` | `number` | The lowest application version for which this transaction should immediately fail. 0 indicates that no version check should be performed. |
| `params.rekeyTo?` | `ReadableAddress` | Change the signing key of the sender to the given address. **Warning:** Please be careful with this parameter and be sure to read the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying). |
| `params.sender` | `ReadableAddress` | The address of the account sending the transaction. |
| `params.signer?` | `AddressWithSigner` \| `TransactionSigner` | The function used to sign transaction(s); if not specified then an attempt will be made to find a registered signer for the given `sender` or use a default signer (if configured). |
| `params.staticFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The static transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction. |
| `params.validityWindow?` | `number` \| `bigint` | How many rounds the transaction should be valid for, if not specified then the registered default validity window will be used. |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

**`Example`**

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
composer.addAppDeleteMethodCall({ sender: 'CREATORADDRESS', method: method, args: ["arg1_value"] })
```

**`Example`**

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
composer.addAppDeleteMethodCall({
 sender: 'CREATORADDRESS',
 method: method,
 args: ["arg1_value"],
 onComplete: OnApplicationComplete.DeleteApplication,
 args: [new Uint8Array(1, 2, 3, 4)]
 accountReferences: ["ACCOUNT_1"]
 appReferences: [123n, 1234n]
 assetReferences: [12345n]
 boxReferences: ["box1", {appId: 1234n, name: "box2"}]
 accessReferences: [{ appId: 1234n }]
 lease: 'lease',
 note: 'note',
 // You wouldn't normally set this field
 firstValidRound: 1000n,
 validityWindow: 10,
 extraFee: (1000).microAlgo(),
 staticFee: (1000).microAlgo(),
 // Max fee doesn't make sense with extraFee AND staticFee
 //  already specified, but here for completeness
 maxFee: (3000).microAlgo(),
})
```

#### Defined in

[src/types/composer.ts:1136](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1136)

___

### addAppUpdate

▸ **addAppUpdate**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an application update transaction to the transaction group.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The application update transaction parameters |
| `params.accessReferences?` | `AccessReference`[] | Access references unifies `accountReferences`, `appReferences`, `assetReferences`, and `boxReferences` under a single list. If non-empty, these other reference lists must be empty. If access is empty, those other reference lists may be non-empty. |
| `params.accountReferences?` | `ReadableAddress`[] | Any account addresses to add to the [accounts array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). |
| `params.appId` | `bigint` | ID of the application; 0 if the application is being created. |
| `params.appReferences?` | `bigint`[] | The ID of any apps to load to the [foreign apps array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). |
| `params.approvalProgram` | `string` \| `Uint8Array` | The program to execute for all OnCompletes other than ClearState as raw teal (string) or compiled teal (base 64 encoded as a byte array (Uint8Array)) |
| `params.args?` | `Uint8Array`[] | Any [arguments to pass to the smart contract call](/concepts/smart-contracts/languages/teal/#argument-passing). |
| `params.assetReferences?` | `bigint`[] | The ID of any assets to load to the [foreign assets array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). |
| `params.boxReferences?` | ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] | Any boxes to load to the [boxes array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). Either the name identifier (which will be set against app ID of `0` i.e. the current app), or a box identifier with the name identifier and app ID. |
| `params.clearStateProgram` | `string` \| `Uint8Array` | The program to execute for ClearState OnComplete as raw teal (string) or compiled teal (base 64 encoded as a byte array (Uint8Array)) |
| `params.extraFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The fee to pay IN ADDITION to the suggested fee. Useful for manually covering inner transaction fees. |
| `params.firstValidRound?` | `bigint` | Set the first round this transaction is valid. If left undefined, the value from algod will be used. We recommend you only set this when you intentionally want this to be some time in the future. |
| `params.lastValidRound?` | `bigint` | The last round this transaction is valid. It is recommended to use `validityWindow` instead. |
| `params.lease?` | `string` \| `Uint8Array` | Prevent multiple transactions with the same lease being included within the validity window. A [lease](https://dev.algorand.co/concepts/transactions/leases) enforces a mutually exclusive transaction (useful to prevent double-posting and other scenarios). |
| `params.maxFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | Throw an error if the fee for the transaction is more than this amount; prevents overspending on fees during high congestion periods. |
| `params.note?` | `string` \| `Uint8Array` | Note to attach to the transaction. Max of 1000 bytes. |
| `params.onComplete?` | `UpdateApplication` | The [on-complete](https://dev.algorand.co/concepts/smart-contracts/avm#oncomplete) action of the call; defaults to no-op. |
| `params.rejectVersion?` | `number` | The lowest application version for which this transaction should immediately fail. 0 indicates that no version check should be performed. |
| `params.rekeyTo?` | `ReadableAddress` | Change the signing key of the sender to the given address. **Warning:** Please be careful with this parameter and be sure to read the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying). |
| `params.sender` | `ReadableAddress` | The address of the account sending the transaction. |
| `params.signer?` | `AddressWithSigner` \| `TransactionSigner` | The function used to sign transaction(s); if not specified then an attempt will be made to find a registered signer for the given `sender` or use a default signer (if configured). |
| `params.staticFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The static transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction. |
| `params.validityWindow?` | `number` \| `bigint` | How many rounds the transaction should be valid for, if not specified then the registered default validity window will be used. |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

**`Example`**

```typescript
composer.addAppUpdate({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE' })
```

**`Example`**

```typescript
composer.addAppUpdate({
 sender: 'CREATORADDRESS',
 approvalProgram: "TEALCODE",
 clearStateProgram: "TEALCODE",
 onComplete: OnApplicationComplete.UpdateApplication,
 args: [new Uint8Array(1, 2, 3, 4)]
 accountReferences: ["ACCOUNT_1"]
 appReferences: [123n, 1234n]
 assetReferences: [12345n]
 boxReferences: ["box1", {appId: 1234n, name: "box2"}]
 accessReferences: [{ appId: 1234n }]
 lease: 'lease',
 note: 'note',
 // You wouldn't normally set this field
 firstValidRound: 1000n,
 validityWindow: 10,
 extraFee: (1000).microAlgo(),
 staticFee: (1000).microAlgo(),
 // Max fee doesn't make sense with extraFee AND staticFee
 //  already specified, but here for completeness
 maxFee: (3000).microAlgo(),
})
```

#### Defined in

[src/types/composer.ts:875](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L875)

___

### addAppUpdateMethodCall

▸ **addAppUpdateMethodCall**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an ABI method update application call transaction to the transaction group.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The ABI update method application call transaction parameters |
| `params.accessReferences?` | `AccessReference`[] | Access references unifies `accountReferences`, `appReferences`, `assetReferences`, and `boxReferences` under a single list. If non-empty, these other reference lists must be empty. If access is empty, those other reference lists may be non-empty. |
| `params.accountReferences?` | `ReadableAddress`[] | Any account addresses to add to the [accounts array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). |
| `params.appId` | `bigint` | ID of the application; 0 if the application is being created. |
| `params.appReferences?` | `bigint`[] | The ID of any apps to load to the [foreign apps array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). |
| `params.approvalProgram` | `string` \| `Uint8Array` | The program to execute for all OnCompletes other than ClearState as raw teal (string) or compiled teal (base 64 encoded as a byte array (Uint8Array)) |
| `params.args?` | (`undefined` \| `Transaction` \| `ABIValue` \| `Promise`\<`Transaction`\> \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] | Arguments to the ABI method, either: * An ABI value * A transaction with explicit signer * A transaction (where the signer will be automatically assigned) * An unawaited transaction (e.g. from algorand.createTransaction.{transactionType}()) * Another method call (via method call params object) * undefined (this represents a placeholder transaction argument that is fulfilled by another method call argument) |
| `params.assetReferences?` | `bigint`[] | The ID of any assets to load to the [foreign assets array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). |
| `params.boxReferences?` | ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] | Any boxes to load to the [boxes array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). Either the name identifier (which will be set against app ID of `0` i.e. the current app), or a box identifier with the name identifier and app ID. |
| `params.clearStateProgram` | `string` \| `Uint8Array` | The program to execute for ClearState OnComplete as raw teal (string) or compiled teal (base 64 encoded as a byte array (Uint8Array)) |
| `params.extraFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The fee to pay IN ADDITION to the suggested fee. Useful for manually covering inner transaction fees. |
| `params.firstValidRound?` | `bigint` | Set the first round this transaction is valid. If left undefined, the value from algod will be used. We recommend you only set this when you intentionally want this to be some time in the future. |
| `params.lastValidRound?` | `bigint` | The last round this transaction is valid. It is recommended to use `validityWindow` instead. |
| `params.lease?` | `string` \| `Uint8Array` | Prevent multiple transactions with the same lease being included within the validity window. A [lease](https://dev.algorand.co/concepts/transactions/leases) enforces a mutually exclusive transaction (useful to prevent double-posting and other scenarios). |
| `params.maxFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | Throw an error if the fee for the transaction is more than this amount; prevents overspending on fees during high congestion periods. |
| `params.method` | `ABIMethod` | The ABI method to call |
| `params.note?` | `string` \| `Uint8Array` | Note to attach to the transaction. Max of 1000 bytes. |
| `params.onComplete?` | `UpdateApplication` | The [on-complete](https://dev.algorand.co/concepts/smart-contracts/avm#oncomplete) action of the call; defaults to no-op. |
| `params.rejectVersion?` | `number` | The lowest application version for which this transaction should immediately fail. 0 indicates that no version check should be performed. |
| `params.rekeyTo?` | `ReadableAddress` | Change the signing key of the sender to the given address. **Warning:** Please be careful with this parameter and be sure to read the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying). |
| `params.sender` | `ReadableAddress` | The address of the account sending the transaction. |
| `params.signer?` | `AddressWithSigner` \| `TransactionSigner` | The function used to sign transaction(s); if not specified then an attempt will be made to find a registered signer for the given `sender` or use a default signer (if configured). |
| `params.staticFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The static transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction. |
| `params.validityWindow?` | `number` \| `bigint` | How many rounds the transaction should be valid for, if not specified then the registered default validity window will be used. |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

**`Example`**

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
composer.addAppUpdateMethodCall({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE', method: method, args: ["arg1_value"] })
```

**`Example`**

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
composer.addAppUpdateMethodCall({
 sender: 'CREATORADDRESS',
 method: method,
 args: ["arg1_value"],
 approvalProgram: "TEALCODE",
 clearStateProgram: "TEALCODE",
 onComplete: OnApplicationComplete.UpdateApplication,
 args: [new Uint8Array(1, 2, 3, 4)]
 accountReferences: ["ACCOUNT_1"]
 appReferences: [123n, 1234n]
 assetReferences: [12345n]
 boxReferences: ["box1", {appId: 1234n, name: "box2"}]
 accessReferences: [{ appId: 1234n }]
 lease: 'lease',
 note: 'note',
 // You wouldn't normally set this field
 firstValidRound: 1000n,
 validityWindow: 10,
 extraFee: (1000).microAlgo(),
 staticFee: (1000).microAlgo(),
 // Max fee doesn't make sense with extraFee AND staticFee
 //  already specified, but here for completeness
 maxFee: (3000).microAlgo(),
})
```

#### Defined in

[src/types/composer.ts:1078](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1078)

___

### addAssetConfig

▸ **addAssetConfig**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an asset config transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AssetConfigParams`](../modules/types_composer.md#assetconfigparams) | The asset config transaction parameters |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

**`Example`**

```typescript
composer.addAssetConfig({ sender: "MANAGERADDRESS", assetId: 123456n, manager: "MANAGERADDRESS" })
```

**`Example`**

```typescript
composer.addAssetConfig({
  sender: 'MANAGERADDRESS',
  assetId: 123456n,
  manager: 'MANAGERADDRESS',
  reserve: 'RESERVEADDRESS',
  freeze: 'FREEZEADDRESS',
  clawback: 'CLAWBACKADDRESS',
  lease: 'lease',
  note: 'note',
  // You wouldn't normally set this field
  firstValidRound: 1000n,
  validityWindow: 10,
  extraFee: (1000).microAlgo(),
  staticFee: (1000).microAlgo(),
  // Max fee doesn't make sense with extraFee AND staticFee
  //  already specified, but here for completeness
  maxFee: (3000).microAlgo(),
})

#### Defined in

[src/types/composer.ts:605](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L605)

___

### addAssetCreate

▸ **addAssetCreate**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an asset create transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AssetCreateParams`](../modules/types_composer.md#assetcreateparams) | The asset create transaction parameters |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

**`Example`**

```typescript
composer.addAssetCreate({ sender: "CREATORADDRESS", total: 100n})
```

**`Example`**

```typescript
composer.addAssetCreate({
  sender: 'CREATORADDRESS',
  total: 100n,
  decimals: 2,
  assetName: 'asset',
  unitName: 'unit',
  url: 'url',
  metadataHash: 'metadataHash',
  defaultFrozen: false,
  manager: 'MANAGERADDRESS',
  reserve: 'RESERVEADDRESS',
  freeze: 'FREEZEADDRESS',
  clawback: 'CLAWBACKADDRESS',
  lease: 'lease',
  note: 'note',
  // You wouldn't normally set this field
  firstValidRound: 1000n,
  validityWindow: 10,
  extraFee: (1000).microAlgo(),
  staticFee: (1000).microAlgo(),
  // Max fee doesn't make sense with extraFee AND staticFee
  //  already specified, but here for completeness
  maxFee: (3000).microAlgo(),
})

#### Defined in

[src/types/composer.ts:570](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L570)

___

### addAssetDestroy

▸ **addAssetDestroy**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an asset destroy transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AssetDestroyParams`](../modules/types_composer.md#assetdestroyparams) | The asset destroy transaction parameters |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

**`Example`**

```typescript
composer.addAssetDestroy({ sender: "MANAGERADDRESS", assetId: 123456n })
```

**`Example`**

```typescript
composer.addAssetDestroy({
  sender: 'MANAGERADDRESS',
  assetId: 123456n,
  lease: 'lease',
  note: 'note',
  // You wouldn't normally set this field
  firstValidRound: 1000n,
  validityWindow: 10,
  extraFee: (1000).microAlgo(),
  staticFee: (1000).microAlgo(),
  // Max fee doesn't make sense with extraFee AND staticFee
  //  already specified, but here for completeness
  maxFee: (3000).microAlgo(),
})
```

#### Defined in

[src/types/composer.ts:671](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L671)

___

### addAssetFreeze

▸ **addAssetFreeze**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an asset freeze transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AssetFreezeParams`](../modules/types_composer.md#assetfreezeparams) | The asset freeze transaction parameters |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

**`Example`**

```typescript
composer.addAssetFreeze({ sender: "MANAGERADDRESS", assetId: 123456n, account: "ACCOUNTADDRESS", frozen: true })
```

**`Example`**

```typescript
composer.addAssetFreeze({
  sender: 'MANAGERADDRESS',
  assetId: 123456n,
  account: 'ACCOUNTADDRESS',
  frozen: true,
  lease: 'lease',
  note: 'note',
  // You wouldn't normally set this field
  firstValidRound: 1000n,
  validityWindow: 10,
  extraFee: (1000).microAlgo(),
  staticFee: (1000).microAlgo(),
  // Max fee doesn't make sense with extraFee AND staticFee
  //  already specified, but here for completeness
  maxFee: (3000).microAlgo(),
})
```

#### Defined in

[src/types/composer.ts:639](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L639)

___

### addAssetOptIn

▸ **addAssetOptIn**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an asset opt-in transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AssetOptInParams`](../modules/types_composer.md#assetoptinparams) | The asset opt-in transaction parameters |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

**`Example`**

```typescript
composer.addAssetOptIn({ sender: "SENDERADDRESS", assetId: 123456n })
```

**`Example`**

```typescript
composer.addAssetOptIn({
  sender: 'SENDERADDRESS',
  assetId: 123456n,
  lease: 'lease',
  note: 'note',
  // You wouldn't normally set this field
  firstValidRound: 1000n,
  validityWindow: 10,
  extraFee: (1000).microAlgo(),
  staticFee: (1000).microAlgo(),
  // Max fee doesn't make sense with extraFee AND staticFee
  //  already specified, but here for completeness
  maxFee: (3000).microAlgo(),
})
```

#### Defined in

[src/types/composer.ts:740](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L740)

___

### addAssetOptOut

▸ **addAssetOptOut**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an asset opt-out transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AssetOptOutParams`](../modules/types_composer.md#assetoptoutparams) | The asset opt-out transaction parameters |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

**`Example`**

```typescript
composer.addAssetOptOut({ sender: "SENDERADDRESS", assetId: 123456n, ensureZeroBalance: true })
```

**`Example`**

```typescript
composer.addAssetOptOut({ sender: "SENDERADDRESS", creator: "CREATORADDRESS", assetId: 123456n, ensureZeroBalance: true })
```

**`Example`**

```typescript
composer.addAssetOptOut({
  sender: 'SENDERADDRESS',
  assetId: 123456n,
  creator: 'CREATORADDRESS',
  ensureZeroBalance: true,
  lease: 'lease',
  note: 'note',
  // You wouldn't normally set this field
  firstValidRound: 1000n,
  validityWindow: 10,
  extraFee: (1000).microAlgo(),
  staticFee: (1000).microAlgo(),
  // Max fee doesn't make sense with extraFee AND staticFee
  //  already specified, but here for completeness
  maxFee: (3000).microAlgo(),
})
```

#### Defined in

[src/types/composer.ts:778](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L778)

___

### addAssetTransfer

▸ **addAssetTransfer**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an asset transfer transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AssetTransferParams`](../modules/types_composer.md#assettransferparams) | The asset transfer transaction parameters |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

**`Example`**

```typescript
composer.addAssetTransfer({ sender: "HOLDERADDRESS", assetId: 123456n, amount: 1n, receiver: "RECEIVERADDRESS" })
```

**`Example`**

```typescript
composer.addAssetTransfer({
  sender: 'CLAWBACKADDRESS',
  assetId: 123456n,
  amount: 1n,
  receiver: 'RECEIVERADDRESS',
  clawbackTarget: 'HOLDERADDRESS',
  // This field needs to be used with caution
  closeAssetTo: 'ADDRESSTOCLOSETO'
  lease: 'lease',
  note: 'note',
  // You wouldn't normally set this field
  firstValidRound: 1000n,
  validityWindow: 10,
  extraFee: (1000).microAlgo(),
  staticFee: (1000).microAlgo(),
  // Max fee doesn't make sense with extraFee AND staticFee
  //  already specified, but here for completeness
  maxFee: (3000).microAlgo(),
})
```

#### Defined in

[src/types/composer.ts:708](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L708)

___

### addOfflineKeyRegistration

▸ **addOfflineKeyRegistration**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an offline key registration transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`OfflineKeyRegistrationParams`](../modules/types_composer.md#offlinekeyregistrationparams) | The offline key registration transaction parameters |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

**`Example`**

```typescript
composer.addOfflineKeyRegistration({
  sender: 'SENDERADDRESS',
})
```

**`Example`**

```typescript
composer.addOfflineKeyRegistration({
  sender: 'SENDERADDRESS',
  lease: 'lease',
  note: 'note',
  // Use this with caution, it's generally better to use algorand.account.rekeyAccount
  rekeyTo: 'REKEYTOADDRESS',
  // You wouldn't normally set this field
  firstValidRound: 1000n,
  validityWindow: 10,
  extraFee: (1000).microAlgo(),
  staticFee: (1000).microAlgo(),
  // Max fee doesn't make sense with extraFee AND staticFee
  //  already specified, but here for completeness
  maxFee: (3000).microAlgo(),
})
```

#### Defined in

[src/types/composer.ts:1282](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1282)

___

### addOnlineKeyRegistration

▸ **addOnlineKeyRegistration**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an online key registration transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`OnlineKeyRegistrationParams`](../modules/types_composer.md#onlinekeyregistrationparams) | The online key registration transaction parameters |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

**`Example`**

```typescript
composer.addOnlineKeyRegistration({
  sender: 'SENDERADDRESS',
  voteKey: Uint8Array.from(Buffer.from("voteKeyBase64", 'base64')),
  selectionKey: Uint8Array.from(Buffer.from("selectionKeyBase64", 'base64')),
  stateProofKey: Uint8Array.from(Buffer.from("stateProofKeyBase64", 'base64')),
  voteFirst: 1n,
  voteLast: 1000n,
  voteKeyDilution: 1n,
})
```

**`Example`**

```typescript
composer.addOnlineKeyRegistration({
  sender: 'SENDERADDRESS',
  voteKey: Uint8Array.from(Buffer.from("voteKeyBase64", 'base64')),
  selectionKey: Uint8Array.from(Buffer.from("selectionKeyBase64", 'base64')),
  stateProofKey: Uint8Array.from(Buffer.from("stateProofKeyBase64", 'base64')),
  voteFirst: 1n,
  voteLast: 1000n,
  voteKeyDilution: 1n,
  lease: 'lease',
  note: 'note',
  // Use this with caution, it's generally better to use algorand.account.rekeyAccount
  rekeyTo: 'REKEYTOADDRESS',
  // You wouldn't normally set this field
  firstValidRound: 1000n,
  validityWindow: 10,
  extraFee: (1000).microAlgo(),
  staticFee: (1000).microAlgo(),
  // Max fee doesn't make sense with extraFee AND staticFee
  //  already specified, but here for completeness
  maxFee: (3000).microAlgo(),
})
```

#### Defined in

[src/types/composer.ts:1247](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1247)

___

### addPayment

▸ **addPayment**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add a payment transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`PaymentParams`](../modules/types_composer.md#paymentparams) | The payment transaction parameters |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

**`Example`**

```typescript
composer.addPayment({
  sender: 'SENDERADDRESS',
  receiver: 'RECEIVERADDRESS',
  amount: (4).algo(),
})
```

**`Example`**

```typescript
composer.addPayment({
  amount: (4).algo(),
  receiver: 'RECEIVERADDRESS',
  sender: 'SENDERADDRESS',
  closeRemainderTo: 'CLOSEREMAINDERTOADDRESS',
  lease: 'lease',
  note: 'note',
  // Use this with caution, it's generally better to use algorand.account.rekeyAccount
  rekeyTo: 'REKEYTOADDRESS',
  // You wouldn't normally set this field
  firstValidRound: 1000n,
  validityWindow: 10,
  extraFee: (1000).microAlgo(),
  staticFee: (1000).microAlgo(),
  // Max fee doesn't make sense with extraFee AND staticFee
  //  already specified, but here for completeness
  maxFee: (3000).microAlgo(),
})

#### Defined in

[src/types/composer.ts:529](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L529)

___

### addTransaction

▸ **addTransaction**(`transaction`, `signer?`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add a pre-built transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transaction` | `Transaction` | The pre-built transaction |
| `signer?` | `TransactionSigner` | Optional signer override for the transaction |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

**`Example`**

```typescript
composer.addTransaction(txn)
```

#### Defined in

[src/types/composer.ts:459](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L459)

___

### addTransactionComposer

▸ **addTransactionComposer**(`composer`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add another transaction composer to the current transaction composer.
The transaction params of the input transaction composer will be added.
If the input transaction composer is updated, it won't affect the current transaction composer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `composer` | [`TransactionComposer`](types_composer.TransactionComposer.md) | The transaction composer to add |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

**`Example`**

```typescript
const innerComposer = algorand.newGroup()
  .addPayment({ sender: 'SENDER', receiver: 'RECEIVER', amount: (1).algo() })
  .addPayment({ sender: 'SENDER', receiver: 'RECEIVER', amount: (2).algo() })

composer.addTransactionComposer(innerComposer)
```

#### Defined in

[src/types/composer.ts:489](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L489)

___

### analyzeGroupRequirements

▸ **analyzeGroupRequirements**(`transactions`, `suggestedParams`, `analysisParams`): `Promise`\<`GroupAnalysis`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transactions` | `Transaction`[] | - |
| `suggestedParams` | `Object` | - |
| `suggestedParams.consensusVersion` | `string` | ConsensusVersion indicates the consensus protocol version as of LastRound. |
| `suggestedParams.fee` | `bigint` | Fee is the suggested transaction fee Fee is in units of micro-Algos per byte. Fee may fall to zero but transactions must still have a fee of at least MinTxnFee for the current network protocol. |
| `suggestedParams.firstValid` | `bigint` | - |
| `suggestedParams.flatFee` | `boolean` | - |
| `suggestedParams.genesisHash` | `Uint8Array` | GenesisHash is the hash of the genesis block. |
| `suggestedParams.genesisId` | `string` | GenesisID is an ID listed in the genesis block. |
| `suggestedParams.lastValid` | `bigint` | - |
| `suggestedParams.minFee` | `bigint` | The minimum transaction fee (not per byte) required for the txn to validate for the current network protocol. |
| `analysisParams` | [`TransactionComposerConfig`](../modules/types_composer.md#transactioncomposerconfig) | - |

#### Returns

`Promise`\<`GroupAnalysis`\>

#### Defined in

[src/types/composer.ts:1601](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1601)

___

### build

▸ **build**(): `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `transactions`: [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md)[]  }\>

Build the transaction composer.

This method performs resource population and inner transaction fee coverage if these options are set in the composer.

Once this method is called, no further transactions will be able to be added.
You can safely call this method multiple times to get the same result.

#### Returns

`Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `transactions`: [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md)[]  }\>

The built transaction composer, the transactions and any corresponding method calls

**`Example`**

```typescript
const { transactions, methodCalls } = await composer.build()
```

#### Defined in

[src/types/composer.ts:1309](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1309)

___

### buildTransactions

▸ **buildTransactions**(): `Promise`\<[`BuiltTransactions`](../interfaces/types_composer.BuiltTransactions.md)\>

Builds all transactions in the composer and returns them along with method calls and signers.

Note: This method only builds the transactions as-is without resource population or automatic grouping.
Use this when you need the raw transactions.

#### Returns

`Promise`\<[`BuiltTransactions`](../interfaces/types_composer.BuiltTransactions.md)\>

An object containing the array of built transactions, method calls, and signers

**`Example`**

```typescript
const { transactions, methodCalls, signers } = await composer.buildTransactions()
```

#### Defined in

[src/types/composer.ts:1467](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1467)

___

### clone

▸ **clone**(`composerConfig?`): [`TransactionComposer`](types_composer.TransactionComposer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `composerConfig?` | [`TransactionComposerConfig`](../modules/types_composer.md#transactioncomposerconfig) |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

#### Defined in

[src/types/composer.ts:416](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L416)

___

### cloneTransaction

▸ **cloneTransaction**(`txn`): `Txn`

#### Parameters

| Name | Type |
| :------ | :------ |
| `txn` | `Txn` |

#### Returns

`Txn`

#### Defined in

[src/types/composer.ts:309](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L309)

___

### count

▸ **count**(): `number`

Get the number of transactions currently added to this composer.

#### Returns

`number`

The number of transactions currently added to this composer

#### Defined in

[src/types/composer.ts:1292](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1292)

___

### gatherSignatures

▸ **gatherSignatures**(): `Promise`\<`SignedTransaction`[]\>

#### Returns

`Promise`\<`SignedTransaction`[]\>

#### Defined in

[src/types/composer.ts:2065](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L2065)

___

### parseAbiReturnValues

▸ **parseAbiReturnValues**(`confirmations`): `ABIReturn`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `confirmations` | `PendingTransactionResponse`[] |

#### Returns

`ABIReturn`[]

#### Defined in

[src/types/composer.ts:2120](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L2120)

___

### populateTransactionAndGroupResources

▸ **populateTransactionAndGroupResources**(`transactions`, `groupAnalysis?`): `Transaction`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactions` | `Transaction`[] |
| `groupAnalysis?` | `GroupAnalysis` |

#### Returns

`Transaction`[]

#### Defined in

[src/types/composer.ts:1476](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1476)

___

### push

▸ **push**(`...txns`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...txns` | `Txn`[] |

#### Returns

`void`

#### Defined in

[src/types/composer.ts:403](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L403)

___

### rebuild

▸ **rebuild**(): `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `transactions`: [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md)[]  }\>

Rebuild the group, discarding any previously built transactions.
This will potentially cause new signers and suggested params to be used if the callbacks return a new value compared to the first build.

#### Returns

`Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `transactions`: [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md)[]  }\>

The newly built transaction composer and the transactions

**`Example`**

```typescript
const { atc, transactions, methodCalls } = await composer.rebuild()
```

#### Defined in

[src/types/composer.ts:1749](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1749)

___

### registerErrorTransformer

▸ **registerErrorTransformer**(`transformer`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Register a function that will be used to transform an error caught when simulating or executing

#### Parameters

| Name | Type |
| :------ | :------ |
| `transformer` | [`ErrorTransformer`](../modules/types_composer.md#errortransformer) |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

#### Defined in

[src/types/composer.ts:444](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L444)

___

### reset

▸ **reset**(): `void`

#### Returns

`void`

#### Defined in

[src/types/composer.ts:1754](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1754)

___

### send

▸ **send**(`params?`): `Promise`\<[`SendTransactionComposerResults`](../interfaces/types_transaction.SendTransactionComposerResults.md)\>

Compose the transaction group and send it to the network.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params?` | [`SendParams`](../interfaces/types_transaction.SendParams.md) | The parameters to control execution with |

#### Returns

`Promise`\<[`SendTransactionComposerResults`](../interfaces/types_transaction.SendTransactionComposerResults.md)\>

The execution result

**`Example`**

```typescript
const result = await composer.send()
```

#### Defined in

[src/types/composer.ts:1768](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1768)

___

### setMaxFees

▸ **setMaxFees**(`maxFees`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `maxFees` | `Map`\<`number`, [`AlgoAmount`](types_amount.AlgoAmount.md)\> |

#### Returns

`void`

#### Defined in

[src/types/composer.ts:2140](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L2140)

___

### signTransactions

▸ **signTransactions**(`transactionsWithSigners`): `Promise`\<`SignedTransaction`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionsWithSigners` | [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md)[] |

#### Returns

`Promise`\<`SignedTransaction`[]\>

#### Defined in

[src/types/composer.ts:2080](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L2080)

___

### simulate

▸ **simulate**(): `Promise`\<[`SendTransactionComposerResults`](../interfaces/types_transaction.SendTransactionComposerResults.md) & \{ `simulateResponse`: `SimulateTransaction`  }\>

Compose the transaction group and simulate sending it to the network

#### Returns

`Promise`\<[`SendTransactionComposerResults`](../interfaces/types_transaction.SendTransactionComposerResults.md) & \{ `simulateResponse`: `SimulateTransaction`  }\>

The simulation result

**`Example`**

```typescript
const result = await composer.simulate()
```

#### Defined in

[src/types/composer.ts:1945](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1945)

▸ **simulate**(`options`): `Promise`\<[`SendTransactionComposerResults`](../interfaces/types_transaction.SendTransactionComposerResults.md) & \{ `simulateResponse`: `SimulateTransaction`  }\>

Compose the transaction group and simulate sending it to the network

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.allowMoreLogging?` | `boolean` | Lifts limits on log opcode usage during simulation. |
| `options.allowUnnamedResources?` | `boolean` | Allows access to unnamed resources during simulation. |
| `options.execTraceConfig?` | `SimulateTraceConfig` | - |
| `options.extraOpcodeBudget?` | `number` | Applies extra opcode budget during simulation for each transaction group. |
| `options.resultOnFailure?` | `boolean` | Whether or not to return the result on simulation failure instead of throwing an error |
| `options.round?` | `bigint` | If provided, specifies the round preceding the simulation. State changes through this round will be used to run this simulation. Usually only the 4 most recent rounds will be available (controlled by the node config value MaxAcctLookback). If not specified, defaults to the latest available round. |
| `options.skipSignatures` | `boolean` | Whether or not to skip signatures for all built transactions and use an empty signer instead. This will set `fixSigners` and `allowEmptySignatures` when sending the request to the algod API. |

#### Returns

`Promise`\<[`SendTransactionComposerResults`](../interfaces/types_transaction.SendTransactionComposerResults.md) & \{ `simulateResponse`: `SimulateTransaction`  }\>

The simulation result

**`Example`**

```typescript
const result = await composer.simulate({
  skipSignatures: true,
})
```

#### Defined in

[src/types/composer.ts:1956](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1956)

▸ **simulate**(`options`): `Promise`\<[`SendTransactionComposerResults`](../interfaces/types_transaction.SendTransactionComposerResults.md) & \{ `simulateResponse`: `SimulateTransaction`  }\>

Compose the transaction group and simulate sending it to the network

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`RawSimulateOptions`](../modules/types_composer.md#rawsimulateoptions) |

#### Returns

`Promise`\<[`SendTransactionComposerResults`](../interfaces/types_transaction.SendTransactionComposerResults.md) & \{ `simulateResponse`: `SimulateTransaction`  }\>

The simulation result

**`Example`**

```typescript
const result = await composer.simulate({
  extraOpcodeBudget: 1000,
})
```

#### Defined in

[src/types/composer.ts:1969](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1969)

___

### transformError

▸ **transformError**(`originalError`): `Promise`\<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `originalError` | `unknown` |

#### Returns

`Promise`\<`unknown`\>

#### Defined in

[src/types/composer.ts:267](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L267)

___

### arc2Note

▸ **arc2Note**(`note`): `Uint8Array`

Create an encoded transaction note that follows the ARC-2 spec.

https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0002.md

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `note` | [`Arc2TransactionNote`](../modules/types_transaction.md#arc2transactionnote) | The ARC-2 transaction note data |

#### Returns

`Uint8Array`

The binary encoded transaction note

#### Defined in

[src/types/composer.ts:2059](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L2059)
