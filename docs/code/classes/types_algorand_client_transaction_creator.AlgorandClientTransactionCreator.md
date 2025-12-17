[@algorandfoundation/algokit-utils](../README.md) / [types/algorand-client-transaction-creator](../modules/types_algorand_client_transaction_creator.md) / AlgorandClientTransactionCreator

# Class: AlgorandClientTransactionCreator

[types/algorand-client-transaction-creator](../modules/types_algorand_client_transaction_creator.md).AlgorandClientTransactionCreator

Orchestrates creating transactions for `AlgorandClient`.

## Table of contents

### Constructors

- [constructor](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#constructor)

### Properties

- [\_newGroup](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#_newgroup)
- [appCall](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#appcall)
- [appCallMethodCall](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#appcallmethodcall)
- [appCreate](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#appcreate)
- [appCreateMethodCall](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#appcreatemethodcall)
- [appDelete](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#appdelete)
- [appDeleteMethodCall](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#appdeletemethodcall)
- [appUpdate](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#appupdate)
- [appUpdateMethodCall](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#appupdatemethodcall)
- [assetConfig](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#assetconfig)
- [assetCreate](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#assetcreate)
- [assetDestroy](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#assetdestroy)
- [assetFreeze](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#assetfreeze)
- [assetOptIn](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#assetoptin)
- [assetOptOut](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#assetoptout)
- [assetTransfer](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#assettransfer)
- [offlineKeyRegistration](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#offlinekeyregistration)
- [onlineKeyRegistration](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#onlinekeyregistration)
- [payment](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#payment)

### Methods

- [\_transaction](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#_transaction)
- [\_transactions](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#_transactions)

## Constructors

### constructor

• **new AlgorandClientTransactionCreator**(`newGroup`): [`AlgorandClientTransactionCreator`](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md)

Creates a new `AlgorandClientTransactionCreator`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `newGroup` | (`config?`: [`TransactionComposerConfig`](../modules/types_composer.md#transactioncomposerconfig)) => [`TransactionComposer`](types_composer.TransactionComposer.md) | A lambda that starts a new `TransactionComposer` transaction group |

#### Returns

[`AlgorandClientTransactionCreator`](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md)

**`Example`**

```typescript
const transactionCreator = new AlgorandClientTransactionCreator(() => new TransactionComposer())
```

#### Defined in

[src/types/algorand-client-transaction-creator.ts:17](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L17)

## Properties

### \_newGroup

• `Private` **\_newGroup**: () => [`TransactionComposer`](types_composer.TransactionComposer.md)

#### Type declaration

▸ (): [`TransactionComposer`](types_composer.TransactionComposer.md)

##### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

#### Defined in

[src/types/algorand-client-transaction-creator.ts:7](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L7)

___

### appCall

• **appCall**: (`params`: [`AppCallParams`](../modules/types_composer.md#appcallparams)) => `Promise`\<`Transaction`\>

Create an application call transaction.

Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.

**`Example`**

```typescript
await algorand.createTransaction.appCall({ sender: 'CREATORADDRESS' })
```

**`Example`**

```typescript
await algorand.createTransaction.appCall({
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

#### Type declaration

▸ (`params`): `Promise`\<`Transaction`\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AppCallParams`](../modules/types_composer.md#appcallparams) | The parameters for the app call transaction |

##### Returns

`Promise`\<`Transaction`\>

#### Defined in

[src/types/algorand-client-transaction-creator.ts:460](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L460)

___

### appCallMethodCall

• **appCallMethodCall**: (`params`: \{ `accessReferences?`: `ResourceReference`[] ; `accountReferences?`: [`ReadableAddress`](../modules/index.md#readableaddress)[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `Transaction` \| `ABIValue` \| `Promise`\<`Transaction`\> \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `ResourceReference`[] ; `accountReferences?`: [`ReadableAddress`](../modules/index.md#readableaddress)[] ; `appId?`: ``0`` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `SendingAddress` ; `signer?`: `AddressWithTransactionSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `ResourceReference`[] ; `accountReferences?`: [`ReadableAddress`](../modules/index.md#readableaddress)[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `SendingAddress` ; `signer?`: `AddressWithTransactionSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `ABIMethod` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: [`ReadableAddress`](../modules/index.md#readableaddress) ; `sender`: `SendingAddress` ; `signer?`: `AddressWithTransactionSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\>

Create an application call with ABI method call transaction.

Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.

**`Example`**

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
await algorand.createTransaction.appCallMethodCall({ sender: 'CREATORADDRESS', method: method, args: ["arg1_value"] })
```

**`Example`**

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
await algorand.createTransaction.appCallMethodCall({
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

#### Type declaration

▸ (`params`): `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The parameters for the app call transaction |
| `params.accessReferences?` | `ResourceReference`[] | Access references unifies `accountReferences`, `appReferences`, `assetReferences`, and `boxReferences` under a single list. If non-empty, these other reference lists must be empty. If access is empty, those other reference lists may be non-empty. |
| `params.accountReferences?` | [`ReadableAddress`](../modules/index.md#readableaddress)[] | Any account addresses to add to the [accounts array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). |
| `params.appId` | `bigint` | ID of the application; 0 if the application is being created. |
| `params.appReferences?` | `bigint`[] | The ID of any apps to load to the [foreign apps array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). |
| `params.args?` | (`undefined` \| `Transaction` \| `ABIValue` \| `Promise`\<`Transaction`\> \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `ResourceReference`[] ; `accountReferences?`: [`ReadableAddress`](../modules/index.md#readableaddress)[] ; `appId?`: ``0`` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `SendingAddress` ; `signer?`: `AddressWithTransactionSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `ResourceReference`[] ; `accountReferences?`: [`ReadableAddress`](../modules/index.md#readableaddress)[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `SendingAddress` ; `signer?`: `AddressWithTransactionSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] | Arguments to the ABI method, either: * An ABI value * A transaction with explicit signer * A transaction (where the signer will be automatically assigned) * An unawaited transaction (e.g. from algorand.createTransaction.{transactionType}()) * Another method call (via method call params object) * undefined (this represents a placeholder transaction argument that is fulfilled by another method call argument) |
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
| `params.rekeyTo?` | [`ReadableAddress`](../modules/index.md#readableaddress) | Change the signing key of the sender to the given address. **Warning:** Please be careful with this parameter and be sure to read the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying). |
| `params.sender` | `SendingAddress` | The address sending the transaction, optionally with an attached signer. |
| `params.signer?` | `AddressWithTransactionSigner` \| `TransactionSigner` | The function used to sign transaction(s); if not specified then an attempt will be made to find a registered signer for the given `sender` or use a default signer (if configured). |
| `params.staticFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The static transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction. |
| `params.validityWindow?` | `number` \| `bigint` | How many rounds the transaction should be valid for, if not specified then the registered default validity window will be used. |

##### Returns

`Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\>

#### Defined in

[src/types/algorand-client-transaction-creator.ts:659](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L659)

___

### appCreate

• **appCreate**: (`params`: \{ `accessReferences?`: `ResourceReference`[] ; `accountReferences?`: [`ReadableAddress`](../modules/index.md#readableaddress)[] ; `appId?`: ``0`` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: [`ReadableAddress`](../modules/index.md#readableaddress) ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `SendingAddress` ; `signer?`: `AddressWithTransactionSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<`Transaction`\>

Create an application create transaction.

Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.

**`Example`**

```typescript
await algorand.createTransaction.appCreate({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE' })
```

**`Example`**

```typescript
await algorand.createTransaction.appCreate({
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
})
```

#### Type declaration

▸ (`params`): `Promise`\<`Transaction`\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The parameters for the app creation transaction |
| `params.accessReferences?` | `ResourceReference`[] | Access references unifies `accountReferences`, `appReferences`, `assetReferences`, and `boxReferences` under a single list. If non-empty, these other reference lists must be empty. If access is empty, those other reference lists may be non-empty. |
| `params.accountReferences?` | [`ReadableAddress`](../modules/index.md#readableaddress)[] | Any account addresses to add to the [accounts array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). |
| `params.appId?` | ``0`` | - |
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
| `params.rekeyTo?` | [`ReadableAddress`](../modules/index.md#readableaddress) | Change the signing key of the sender to the given address. **Warning:** Please be careful with this parameter and be sure to read the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying). |
| `params.schema?` | `Object` | The state schema for the app. This is immutable once the app is created. |
| `params.schema.globalByteSlices` | `number` | The number of byte slices saved in global state. |
| `params.schema.globalInts` | `number` | The number of integers saved in global state. |
| `params.schema.localByteSlices` | `number` | The number of byte slices saved in local state. |
| `params.schema.localInts` | `number` | The number of integers saved in local state. |
| `params.sender` | `SendingAddress` | The address sending the transaction, optionally with an attached signer. |
| `params.signer?` | `AddressWithTransactionSigner` \| `TransactionSigner` | The function used to sign transaction(s); if not specified then an attempt will be made to find a registered signer for the given `sender` or use a default signer (if configured). |
| `params.staticFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The static transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction. |
| `params.validityWindow?` | `number` \| `bigint` | How many rounds the transaction should be valid for, if not specified then the registered default validity window will be used. |

##### Returns

`Promise`\<`Transaction`\>

#### Defined in

[src/types/algorand-client-transaction-creator.ts:353](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L353)

___

### appCreateMethodCall

• **appCreateMethodCall**: (`params`: \{ `accessReferences?`: `ResourceReference`[] ; `accountReferences?`: [`ReadableAddress`](../modules/index.md#readableaddress)[] ; `appId?`: ``0`` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: (`undefined` \| `Transaction` \| `ABIValue` \| `Promise`\<`Transaction`\> \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `ResourceReference`[] ; `accountReferences?`: [`ReadableAddress`](../modules/index.md#readableaddress)[] ; `appId?`: ``0`` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `SendingAddress` ; `signer?`: `AddressWithTransactionSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `ResourceReference`[] ; `accountReferences?`: [`ReadableAddress`](../modules/index.md#readableaddress)[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `SendingAddress` ; `signer?`: `AddressWithTransactionSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `ABIMethod` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: [`ReadableAddress`](../modules/index.md#readableaddress) ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `SendingAddress` ; `signer?`: `AddressWithTransactionSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\>

Create an application create call with ABI method call transaction.

Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.

**`Example`**

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
await algorand.createTransaction.appCreateMethodCall({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE', method: method, args: ["arg1_value"] })
```

**`Example`**

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
await algorand.createTransaction.appCreateMethodCall({
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

#### Type declaration

▸ (`params`): `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The parameters for the app creation transaction |
| `params.accessReferences?` | `ResourceReference`[] | Access references unifies `accountReferences`, `appReferences`, `assetReferences`, and `boxReferences` under a single list. If non-empty, these other reference lists must be empty. If access is empty, those other reference lists may be non-empty. |
| `params.accountReferences?` | [`ReadableAddress`](../modules/index.md#readableaddress)[] | Any account addresses to add to the [accounts array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). |
| `params.appId?` | ``0`` | - |
| `params.appReferences?` | `bigint`[] | The ID of any apps to load to the [foreign apps array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). |
| `params.approvalProgram` | `string` \| `Uint8Array` | The program to execute for all OnCompletes other than ClearState as raw teal that will be compiled (string) or compiled teal (encoded as a byte array (Uint8Array)). |
| `params.args?` | (`undefined` \| `Transaction` \| `ABIValue` \| `Promise`\<`Transaction`\> \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `ResourceReference`[] ; `accountReferences?`: [`ReadableAddress`](../modules/index.md#readableaddress)[] ; `appId?`: ``0`` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `SendingAddress` ; `signer?`: `AddressWithTransactionSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `ResourceReference`[] ; `accountReferences?`: [`ReadableAddress`](../modules/index.md#readableaddress)[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `SendingAddress` ; `signer?`: `AddressWithTransactionSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] | Arguments to the ABI method, either: * An ABI value * A transaction with explicit signer * A transaction (where the signer will be automatically assigned) * An unawaited transaction (e.g. from algorand.createTransaction.{transactionType}()) * Another method call (via method call params object) * undefined (this represents a placeholder transaction argument that is fulfilled by another method call argument) |
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
| `params.rekeyTo?` | [`ReadableAddress`](../modules/index.md#readableaddress) | Change the signing key of the sender to the given address. **Warning:** Please be careful with this parameter and be sure to read the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying). |
| `params.schema?` | `Object` | The state schema for the app. This is immutable once the app is created. |
| `params.schema.globalByteSlices` | `number` | The number of byte slices saved in global state. |
| `params.schema.globalInts` | `number` | The number of integers saved in global state. |
| `params.schema.localByteSlices` | `number` | The number of byte slices saved in local state. |
| `params.schema.localInts` | `number` | The number of integers saved in local state. |
| `params.sender` | `SendingAddress` | The address sending the transaction, optionally with an attached signer. |
| `params.signer?` | `AddressWithTransactionSigner` \| `TransactionSigner` | The function used to sign transaction(s); if not specified then an attempt will be made to find a registered signer for the given `sender` or use a default signer (if configured). |
| `params.staticFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The static transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction. |
| `params.validityWindow?` | `number` \| `bigint` | How many rounds the transaction should be valid for, if not specified then the registered default validity window will be used. |

##### Returns

`Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\>

#### Defined in

[src/types/algorand-client-transaction-creator.ts:516](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L516)

___

### appDelete

• **appDelete**: (`params`: [`AppDeleteParams`](../modules/types_composer.md#appdeleteparams)) => `Promise`\<`Transaction`\>

Create an application delete transaction.

Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.

**`Example`**

```typescript
await algorand.createTransaction.appDelete({ sender: 'CREATORADDRESS' })
```

**`Example`**

```typescript
await algorand.createTransaction.appDelete({
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

#### Type declaration

▸ (`params`): `Promise`\<`Transaction`\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AppDeleteParams`](../modules/types_composer.md#appdeleteparams) | The parameters for the app deletion transaction |

##### Returns

`Promise`\<`Transaction`\>

#### Defined in

[src/types/algorand-client-transaction-creator.ts:425](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L425)

___

### appDeleteMethodCall

• **appDeleteMethodCall**: (`params`: \{ `accessReferences?`: `ResourceReference`[] ; `accountReferences?`: [`ReadableAddress`](../modules/index.md#readableaddress)[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `Transaction` \| `ABIValue` \| `Promise`\<`Transaction`\> \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `ResourceReference`[] ; `accountReferences?`: [`ReadableAddress`](../modules/index.md#readableaddress)[] ; `appId?`: ``0`` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `SendingAddress` ; `signer?`: `AddressWithTransactionSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `ResourceReference`[] ; `accountReferences?`: [`ReadableAddress`](../modules/index.md#readableaddress)[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `SendingAddress` ; `signer?`: `AddressWithTransactionSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `ABIMethod` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: [`ReadableAddress`](../modules/index.md#readableaddress) ; `sender`: `SendingAddress` ; `signer?`: `AddressWithTransactionSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\>

Create an application delete call with ABI method call transaction.

Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.

**`Example`**

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
await algorand.createTransaction.appDeleteMethodCall({ sender: 'CREATORADDRESS', method: method, args: ["arg1_value"] })
```

**`Example`**

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
await algorand.createTransaction.appDeleteMethodCall({
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

#### Type declaration

▸ (`params`): `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The parameters for the app deletion transaction |
| `params.accessReferences?` | `ResourceReference`[] | Access references unifies `accountReferences`, `appReferences`, `assetReferences`, and `boxReferences` under a single list. If non-empty, these other reference lists must be empty. If access is empty, those other reference lists may be non-empty. |
| `params.accountReferences?` | [`ReadableAddress`](../modules/index.md#readableaddress)[] | Any account addresses to add to the [accounts array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). |
| `params.appId` | `bigint` | ID of the application; 0 if the application is being created. |
| `params.appReferences?` | `bigint`[] | The ID of any apps to load to the [foreign apps array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). |
| `params.args?` | (`undefined` \| `Transaction` \| `ABIValue` \| `Promise`\<`Transaction`\> \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `ResourceReference`[] ; `accountReferences?`: [`ReadableAddress`](../modules/index.md#readableaddress)[] ; `appId?`: ``0`` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `SendingAddress` ; `signer?`: `AddressWithTransactionSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `ResourceReference`[] ; `accountReferences?`: [`ReadableAddress`](../modules/index.md#readableaddress)[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `SendingAddress` ; `signer?`: `AddressWithTransactionSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] | Arguments to the ABI method, either: * An ABI value * A transaction with explicit signer * A transaction (where the signer will be automatically assigned) * An unawaited transaction (e.g. from algorand.createTransaction.{transactionType}()) * Another method call (via method call params object) * undefined (this represents a placeholder transaction argument that is fulfilled by another method call argument) |
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
| `params.rekeyTo?` | [`ReadableAddress`](../modules/index.md#readableaddress) | Change the signing key of the sender to the given address. **Warning:** Please be careful with this parameter and be sure to read the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying). |
| `params.sender` | `SendingAddress` | The address sending the transaction, optionally with an attached signer. |
| `params.signer?` | `AddressWithTransactionSigner` \| `TransactionSigner` | The function used to sign transaction(s); if not specified then an attempt will be made to find a registered signer for the given `sender` or use a default signer (if configured). |
| `params.staticFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The static transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction. |
| `params.validityWindow?` | `number` \| `bigint` | How many rounds the transaction should be valid for, if not specified then the registered default validity window will be used. |

##### Returns

`Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\>

#### Defined in

[src/types/algorand-client-transaction-creator.ts:612](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L612)

___

### appUpdate

• **appUpdate**: (`params`: \{ `accessReferences?`: `ResourceReference`[] ; `accountReferences?`: [`ReadableAddress`](../modules/index.md#readableaddress)[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: [`ReadableAddress`](../modules/index.md#readableaddress) ; `sender`: `SendingAddress` ; `signer?`: `AddressWithTransactionSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<`Transaction`\>

Create an application update transaction.

Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.

**`Example`**

```typescript
await algorand.createTransaction.appUpdate({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE' })
```

**`Example`**

```typescript
await algorand.createTransaction.appUpdate({
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

#### Type declaration

▸ (`params`): `Promise`\<`Transaction`\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The parameters for the app update transaction |
| `params.accessReferences?` | `ResourceReference`[] | Access references unifies `accountReferences`, `appReferences`, `assetReferences`, and `boxReferences` under a single list. If non-empty, these other reference lists must be empty. If access is empty, those other reference lists may be non-empty. |
| `params.accountReferences?` | [`ReadableAddress`](../modules/index.md#readableaddress)[] | Any account addresses to add to the [accounts array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). |
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
| `params.rekeyTo?` | [`ReadableAddress`](../modules/index.md#readableaddress) | Change the signing key of the sender to the given address. **Warning:** Please be careful with this parameter and be sure to read the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying). |
| `params.sender` | `SendingAddress` | The address sending the transaction, optionally with an attached signer. |
| `params.signer?` | `AddressWithTransactionSigner` \| `TransactionSigner` | The function used to sign transaction(s); if not specified then an attempt will be made to find a registered signer for the given `sender` or use a default signer (if configured). |
| `params.staticFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The static transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction. |
| `params.validityWindow?` | `number` \| `bigint` | How many rounds the transaction should be valid for, if not specified then the registered default validity window will be used. |

##### Returns

`Promise`\<`Transaction`\>

#### Defined in

[src/types/algorand-client-transaction-creator.ts:390](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L390)

___

### appUpdateMethodCall

• **appUpdateMethodCall**: (`params`: \{ `accessReferences?`: `ResourceReference`[] ; `accountReferences?`: [`ReadableAddress`](../modules/index.md#readableaddress)[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: (`undefined` \| `Transaction` \| `ABIValue` \| `Promise`\<`Transaction`\> \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `ResourceReference`[] ; `accountReferences?`: [`ReadableAddress`](../modules/index.md#readableaddress)[] ; `appId?`: ``0`` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `SendingAddress` ; `signer?`: `AddressWithTransactionSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `ResourceReference`[] ; `accountReferences?`: [`ReadableAddress`](../modules/index.md#readableaddress)[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `SendingAddress` ; `signer?`: `AddressWithTransactionSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `ABIMethod` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: [`ReadableAddress`](../modules/index.md#readableaddress) ; `sender`: `SendingAddress` ; `signer?`: `AddressWithTransactionSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\>

Create an application update call with ABI method call transaction.

Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.

**`Example`**

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
await algorand.createTransaction.appUpdateMethodCall({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE', method: method, args: ["arg1_value"] })
```

**`Example`**

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
await algorand.createTransaction.appUpdateMethodCall({
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

#### Type declaration

▸ (`params`): `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The parameters for the app update transaction |
| `params.accessReferences?` | `ResourceReference`[] | Access references unifies `accountReferences`, `appReferences`, `assetReferences`, and `boxReferences` under a single list. If non-empty, these other reference lists must be empty. If access is empty, those other reference lists may be non-empty. |
| `params.accountReferences?` | [`ReadableAddress`](../modules/index.md#readableaddress)[] | Any account addresses to add to the [accounts array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). |
| `params.appId` | `bigint` | ID of the application; 0 if the application is being created. |
| `params.appReferences?` | `bigint`[] | The ID of any apps to load to the [foreign apps array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). |
| `params.approvalProgram` | `string` \| `Uint8Array` | The program to execute for all OnCompletes other than ClearState as raw teal (string) or compiled teal (base 64 encoded as a byte array (Uint8Array)) |
| `params.args?` | (`undefined` \| `Transaction` \| `ABIValue` \| `Promise`\<`Transaction`\> \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `ResourceReference`[] ; `accountReferences?`: [`ReadableAddress`](../modules/index.md#readableaddress)[] ; `appId?`: ``0`` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `SendingAddress` ; `signer?`: `AddressWithTransactionSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `ResourceReference`[] ; `accountReferences?`: [`ReadableAddress`](../modules/index.md#readableaddress)[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `SendingAddress` ; `signer?`: `AddressWithTransactionSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] | Arguments to the ABI method, either: * An ABI value * A transaction with explicit signer * A transaction (where the signer will be automatically assigned) * An unawaited transaction (e.g. from algorand.createTransaction.{transactionType}()) * Another method call (via method call params object) * undefined (this represents a placeholder transaction argument that is fulfilled by another method call argument) |
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
| `params.rekeyTo?` | [`ReadableAddress`](../modules/index.md#readableaddress) | Change the signing key of the sender to the given address. **Warning:** Please be careful with this parameter and be sure to read the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying). |
| `params.sender` | `SendingAddress` | The address sending the transaction, optionally with an attached signer. |
| `params.signer?` | `AddressWithTransactionSigner` \| `TransactionSigner` | The function used to sign transaction(s); if not specified then an attempt will be made to find a registered signer for the given `sender` or use a default signer (if configured). |
| `params.staticFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The static transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction. |
| `params.validityWindow?` | `number` \| `bigint` | How many rounds the transaction should be valid for, if not specified then the registered default validity window will be used. |

##### Returns

`Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\>

#### Defined in

[src/types/algorand-client-transaction-creator.ts:565](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L565)

___

### assetConfig

• **assetConfig**: (`params`: [`AssetConfigParams`](../modules/types_composer.md#assetconfigparams)) => `Promise`\<`Transaction`\>

Create an asset config transaction to reconfigure an existing Algorand Standard Asset.

**Note:** The manager, reserve, freeze, and clawback addresses
are immutably empty if they are not set. If manager is not set then
all fields are immutable from that point forward.

**`Example`**

```typescript
await algorand.createTransaction.assetConfig({ sender: "MANAGERADDRESS", assetId: 123456n, manager: "MANAGERADDRESS" })
```

**`Example`**

```typescript
await algorand.createTransaction.assetConfig({
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
```

#### Type declaration

▸ (`params`): `Promise`\<`Transaction`\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AssetConfigParams`](../modules/types_composer.md#assetconfigparams) | The parameters for the asset config transaction |

##### Returns

`Promise`\<`Transaction`\>

#### Defined in

[src/types/algorand-client-transaction-creator.ts:149](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L149)

___

### assetCreate

• **assetCreate**: (`params`: [`AssetCreateParams`](../modules/types_composer.md#assetcreateparams)) => `Promise`\<`Transaction`\>

Create a create Algorand Standard Asset transaction.

The account that sends this transaction will automatically be
opted in to the asset and will hold all units after creation.

**`Example`**

```typescript
await algorand.createTransaction.assetCreate({ sender: "CREATORADDRESS", total: 100n})
```

**`Example`**

```typescript
await algorand.createTransaction.assetCreate({
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
```

#### Type declaration

▸ (`params`): `Promise`\<`Transaction`\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AssetCreateParams`](../modules/types_composer.md#assetcreateparams) | The parameters for the asset creation transaction |

##### Returns

`Promise`\<`Transaction`\>

#### Defined in

[src/types/algorand-client-transaction-creator.ts:113](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L113)

___

### assetDestroy

• **assetDestroy**: (`params`: [`AssetDestroyParams`](../modules/types_composer.md#assetdestroyparams)) => `Promise`\<`Transaction`\>

Create an Algorand Standard Asset destroy transaction.

Created assets can be destroyed only by the asset manager account.
All of the assets must be owned by the creator of the asset before
the asset can be deleted.

**`Example`**

```typescript
await algorand.createTransaction.assetDestroy({ sender: "MANAGERADDRESS", assetId: 123456n })
```

**`Example`**

```typescript
await algorand.createTransaction.assetDestroy({
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

#### Type declaration

▸ (`params`): `Promise`\<`Transaction`\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AssetDestroyParams`](../modules/types_composer.md#assetdestroyparams) | The parameters for the asset destroy transaction |

##### Returns

`Promise`\<`Transaction`\>

#### Defined in

[src/types/algorand-client-transaction-creator.ts:211](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L211)

___

### assetFreeze

• **assetFreeze**: (`params`: [`AssetFreezeParams`](../modules/types_composer.md#assetfreezeparams)) => `Promise`\<`Transaction`\>

Create an Algorand Standard Asset freeze transaction.

**`Example`**

```typescript
await algorand.createTransaction.assetFreeze({ sender: "MANAGERADDRESS", assetId: 123456n, account: "ACCOUNTADDRESS", frozen: true })
```

**`Example`**

```typescript
await algorand.createTransaction.assetFreeze({
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

#### Type declaration

▸ (`params`): `Promise`\<`Transaction`\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AssetFreezeParams`](../modules/types_composer.md#assetfreezeparams) | The parameters for the asset freeze transaction |

##### Returns

`Promise`\<`Transaction`\>

#### Defined in

[src/types/algorand-client-transaction-creator.ts:179](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L179)

___

### assetOptIn

• **assetOptIn**: (`params`: [`AssetOptInParams`](../modules/types_composer.md#assetoptinparams)) => `Promise`\<`Transaction`\>

Create an Algorand Standard Asset opt-in transaction.

**`Example`**

```typescript
await algorand.createTransaction.assetOptIn({ sender: "SENDERADDRESS", assetId: 123456n })
```

**`Example`**

```typescript
await algorand.createTransaction.assetOptIn({
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

#### Type declaration

▸ (`params`): `Promise`\<`Transaction`\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AssetOptInParams`](../modules/types_composer.md#assetoptinparams) | The parameters for the asset opt-in transaction |

##### Returns

`Promise`\<`Transaction`\>

#### Defined in

[src/types/algorand-client-transaction-creator.ts:272](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L272)

___

### assetOptOut

• **assetOptOut**: (`params`: [`AssetOptOutParams`](../modules/types_composer.md#assetoptoutparams)) => `Promise`\<`Transaction`\>

Create an asset opt-out transaction.

*Note:* If the account has a balance of the asset,
it will lose those assets

**`Example`**

```typescript
await algorand.createTransaction.assetOptOut({ sender: "SENDERADDRESS", assetId: 123456n, ensureZeroBalance: true })
```

**`Example`**

```typescript
await algorand.createTransaction.assetOptOut({ sender: "SENDERADDRESS", creator: "CREATORADDRESS", assetId: 123456n, ensureZeroBalance: true })
```

**`Example`**

```typescript
await algorand.createTransaction.assetOptOut({
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

#### Type declaration

▸ (`params`): `Promise`\<`Transaction`\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AssetOptOutParams`](../modules/types_composer.md#assetoptoutparams) | The parameters for the asset opt-out transaction |

##### Returns

`Promise`\<`Transaction`\>

#### Defined in

[src/types/algorand-client-transaction-creator.ts:309](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L309)

___

### assetTransfer

• **assetTransfer**: (`params`: [`AssetTransferParams`](../modules/types_composer.md#assettransferparams)) => `Promise`\<`Transaction`\>

Create an Algorand Standard Asset transfer transaction.

**`Example`**

```typescript
await algorand.createTransaction.assetTransfer({ sender: "HOLDERADDRESS", assetId: 123456n, amount: 1n, receiver: "RECEIVERADDRESS" })
```

**`Example`**

```typescript
await algorand.createTransaction.assetTransfer({
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

#### Type declaration

▸ (`params`): `Promise`\<`Transaction`\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AssetTransferParams`](../modules/types_composer.md#assettransferparams) | The parameters for the asset transfer transaction |

##### Returns

`Promise`\<`Transaction`\>

#### Defined in

[src/types/algorand-client-transaction-creator.ts:244](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L244)

___

### offlineKeyRegistration

• **offlineKeyRegistration**: (`params`: [`OfflineKeyRegistrationParams`](../modules/types_composer.md#offlinekeyregistrationparams)) => `Promise`\<`Transaction`\>

Create an offline key registration transaction.

**`Example`**

```typescript
await algorand.createTransaction.offlineKeyRegistration({
  sender: 'SENDERADDRESS',
})
```

**`Example`**

```typescript
await algorand.createTransaction.offlineKeyRegistration({
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

#### Type declaration

▸ (`params`): `Promise`\<`Transaction`\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`OfflineKeyRegistrationParams`](../modules/types_composer.md#offlinekeyregistrationparams) | The parameters for the key registration transaction |

##### Returns

`Promise`\<`Transaction`\>

#### Defined in

[src/types/algorand-client-transaction-creator.ts:731](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L731)

___

### onlineKeyRegistration

• **onlineKeyRegistration**: (`params`: [`OnlineKeyRegistrationParams`](../modules/types_composer.md#onlinekeyregistrationparams)) => `Promise`\<`Transaction`\>

Create an online key registration transaction.

**`Example`**

```typescript
await algorand.createTransaction.onlineKeyRegistration({
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
await algorand.createTransaction.onlineKeyRegistration({
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

#### Type declaration

▸ (`params`): `Promise`\<`Transaction`\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`OnlineKeyRegistrationParams`](../modules/types_composer.md#onlinekeyregistrationparams) | The parameters for the key registration transaction |

##### Returns

`Promise`\<`Transaction`\>

#### Defined in

[src/types/algorand-client-transaction-creator.ts:701](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L701)

___

### payment

• **payment**: (`params`: [`PaymentParams`](../modules/types_composer.md#paymentparams)) => `Promise`\<`Transaction`\>

Create a payment transaction to transfer Algo between accounts.

**`Example`**

```typescript
await algorand.createTransaction.payment({
  sender: 'SENDERADDRESS',
  receiver: 'RECEIVERADDRESS',
  amount: (4).algo(),
})
```

**`Example`**

```typescript
await algorand.createTransaction.payment({
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
```

#### Type declaration

▸ (`params`): `Promise`\<`Transaction`\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`PaymentParams`](../modules/types_composer.md#paymentparams) | The parameters for the payment transaction |

##### Returns

`Promise`\<`Transaction`\>

#### Defined in

[src/types/algorand-client-transaction-creator.ts:72](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L72)

## Methods

### \_transaction

▸ **_transaction**\<`T`\>(`c`): (`params`: `T`) => `Promise`\<`Transaction`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `c` | (`c`: [`TransactionComposer`](types_composer.TransactionComposer.md)) => (`params`: `T`) => [`TransactionComposer`](types_composer.TransactionComposer.md) |

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

[src/types/algorand-client-transaction-creator.ts:21](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L21)

___

### \_transactions

▸ **_transactions**\<`T`\>(`c`): (`params`: `T`) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `c` | (`c`: [`TransactionComposer`](types_composer.TransactionComposer.md)) => (`params`: `T`) => [`TransactionComposer`](types_composer.TransactionComposer.md) |

#### Returns

`fn`

▸ (`params`): `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `T` |

##### Returns

`Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\>

#### Defined in

[src/types/algorand-client-transaction-creator.ts:29](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L29)
