[@algorandfoundation/algokit-utils](../README.md) / [types/algorand-client-transaction-sender](../modules/types_algorand_client_transaction_sender.md) / AlgorandClientTransactionSender

# Class: AlgorandClientTransactionSender

[types/algorand-client-transaction-sender](../modules/types_algorand_client_transaction_sender.md).AlgorandClientTransactionSender

Orchestrates sending transactions for `AlgorandClient`.

## Table of contents

### Constructors

- [constructor](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md#constructor)

### Properties

- [\_appManager](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md#_appmanager)
- [\_assetManager](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md#_assetmanager)
- [\_newGroup](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md#_newgroup)
- [appCall](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md#appcall)
- [appCallMethodCall](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md#appcallmethodcall)
- [appCreate](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md#appcreate)
- [appCreateMethodCall](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md#appcreatemethodcall)
- [appDelete](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md#appdelete)
- [appDeleteMethodCall](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md#appdeletemethodcall)
- [appUpdate](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md#appupdate)
- [appUpdateMethodCall](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md#appupdatemethodcall)
- [assetConfig](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md#assetconfig)
- [assetDestroy](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md#assetdestroy)
- [assetFreeze](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md#assetfreeze)
- [assetOptIn](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md#assetoptin)
- [assetTransfer](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md#assettransfer)
- [offlineKeyRegistration](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md#offlinekeyregistration)
- [onlineKeyRegistration](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md#onlinekeyregistration)
- [payment](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md#payment)

### Methods

- [\_send](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md#_send)
- [\_sendAppCall](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md#_sendappcall)
- [\_sendAppCreateCall](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md#_sendappcreatecall)
- [\_sendAppUpdateCall](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md#_sendappupdatecall)
- [assetCreate](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md#assetcreate)
- [assetOptOut](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md#assetoptout)
- [newGroup](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md#newgroup)

## Constructors

### constructor

• **new AlgorandClientTransactionSender**(`newGroup`, `assetManager`, `appManager`): [`AlgorandClientTransactionSender`](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md)

Creates a new `AlgorandClientSender`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `newGroup` | (`config?`: [`TransactionComposerConfig`](../modules/types_composer.md#transactioncomposerconfig)) => [`TransactionComposer`](types_composer.TransactionComposer.md) | A lambda that starts a new `TransactionComposer` transaction group |
| `assetManager` | [`AssetManager`](types_asset_manager.AssetManager.md) | An `AssetManager` instance |
| `appManager` | [`AppManager`](types_app_manager.AppManager.md) | An `AppManager` instance |

#### Returns

[`AlgorandClientTransactionSender`](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md)

**`Example`**

```typescript
const transactionSender = new AlgorandClientTransactionSender(() => new TransactionComposer(), assetManager, appManager)
```

#### Defined in

[src/types/algorand-client-transaction-sender.ts:53](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-sender.ts#L53)

## Properties

### \_appManager

• `Private` **\_appManager**: [`AppManager`](types_app_manager.AppManager.md)

#### Defined in

[src/types/algorand-client-transaction-sender.ts:41](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-sender.ts#L41)

___

### \_assetManager

• `Private` **\_assetManager**: [`AssetManager`](types_asset_manager.AssetManager.md)

#### Defined in

[src/types/algorand-client-transaction-sender.ts:40](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-sender.ts#L40)

___

### \_newGroup

• `Private` **\_newGroup**: () => [`TransactionComposer`](types_composer.TransactionComposer.md)

#### Type declaration

▸ (): [`TransactionComposer`](types_composer.TransactionComposer.md)

##### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

#### Defined in

[src/types/algorand-client-transaction-sender.ts:39](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-sender.ts#L39)

___

### appCall

• **appCall**: (`params`: [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `onComplete?`: `OnApplicationComplete` ; `rejectVersion?`: `number`  } & \{ `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `ClearState` \| `DeleteApplication`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

Call a smart contract.

Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.

**`Example`**

```typescript
await algorand.send.appCall({ sender: 'CREATORADDRESS' })
```

**`Example`**

```typescript
await algorand.send.appCall({
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
 // Signer only needed if you want to provide one,
 //  generally you'd register it with AlgorandClient
 //  against the sender and not need to pass it in
 signer: transactionSigner,
 maxRoundsToWaitForConfirmation: 5,
 suppressLog: true,
})
```

#### Type declaration

▸ (`params`): `Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `onComplete?`: `OnApplicationComplete` ; `rejectVersion?`: `number`  } & \{ `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `ClearState` \| `DeleteApplication`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md) | The parameters for the app call transaction |

##### Returns

`Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

#### Defined in

[src/types/algorand-client-transaction-sender.ts:738](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-sender.ts#L738)

___

### appCallMethodCall

• **appCallMethodCall**: (`params`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `Transaction` \| `ABIValue` \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `ABIMethod` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

Call a smart contract via an ABI method.

Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.

**`Example`**

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
await algorand.send.appCallMethodCall({ sender: 'CREATORADDRESS', method: method, args: ["arg1_value"] })
```

**`Example`**

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
await algorand.send.appCallMethodCall({
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
 // Signer only needed if you want to provide one,
 //  generally you'd register it with AlgorandClient
 //  against the sender and not need to pass it in
 signer: transactionSigner,
 maxRoundsToWaitForConfirmation: 5,
 suppressLog: true,
})
```

#### Type declaration

▸ (`params`): `Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `Transaction` \| `ABIValue` \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `ABIMethod` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md) | The parameters for the app call transaction |

##### Returns

`Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

#### Defined in

[src/types/algorand-client-transaction-sender.ts:982](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-sender.ts#L982)

___

### appCreate

• **appCreate**: (`params`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `appAddress`: `Address` ; `appId`: `bigint` ; `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

Create a smart contract.

Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.

**`Example`**

```typescript
const result = await algorand.send.appCreate({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE' })
const createdAppId = result.appId
```

**`Example`**

```typescript
await algorand.send.appCreate({
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

#### Type declaration

▸ (`params`): `Promise`\<\{ `appAddress`: `Address` ; `appId`: `bigint` ; `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md) | The parameters for the app creation transaction |

##### Returns

`Promise`\<\{ `appAddress`: `Address` ; `appId`: `bigint` ; `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

#### Defined in

[src/types/algorand-client-transaction-sender.ts:598](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-sender.ts#L598)

___

### appCreateMethodCall

• **appCreateMethodCall**: (`params`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: (`undefined` \| `Transaction` \| `ABIValue` \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `ABIMethod` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `appAddress`: `Address` ; `appId`: `bigint` ; `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

Create a smart contract via an ABI method.

Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.

**`Example`**

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
const result = await algorand.send.appCreateMethodCall({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE', method: method, args: ["arg1_value"] })
const createdAppId = result.appId
```

**`Example`**

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
await algorand.send.appCreateMethodCall({
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
 // Signer only needed if you want to provide one,
 //  generally you'd register it with AlgorandClient
 //  against the sender and not need to pass it in
 signer: transactionSigner,
 maxRoundsToWaitForConfirmation: 5,
 suppressLog: true,
})
```

#### Type declaration

▸ (`params`): `Promise`\<\{ `appAddress`: `Address` ; `appId`: `bigint` ; `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: (`undefined` \| `Transaction` \| `ABIValue` \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `ABIMethod` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md) | The parameters for the app creation transaction |

##### Returns

`Promise`\<\{ `appAddress`: `Address` ; `appId`: `bigint` ; `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

#### Defined in

[src/types/algorand-client-transaction-sender.ts:806](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-sender.ts#L806)

___

### appDelete

• **appDelete**: (`params`: [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `onComplete?`: `OnApplicationComplete` ; `rejectVersion?`: `number`  } & \{ `onComplete?`: `DeleteApplication`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

Delete a smart contract.

Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.

**`Example`**

```typescript
await algorand.send.appDelete({ sender: 'CREATORADDRESS' })
```

**`Example`**

```typescript
await algorand.send.appDelete({
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
 // Signer only needed if you want to provide one,
 //  generally you'd register it with AlgorandClient
 //  against the sender and not need to pass it in
 signer: transactionSigner,
 maxRoundsToWaitForConfirmation: 5,
 suppressLog: true,
})
```

#### Type declaration

▸ (`params`): `Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `onComplete?`: `OnApplicationComplete` ; `rejectVersion?`: `number`  } & \{ `onComplete?`: `DeleteApplication`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md) | The parameters for the app deletion transaction |

##### Returns

`Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

#### Defined in

[src/types/algorand-client-transaction-sender.ts:692](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-sender.ts#L692)

___

### appDeleteMethodCall

• **appDeleteMethodCall**: (`params`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `Transaction` \| `ABIValue` \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `ABIMethod` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

Delete a smart contract via an ABI method.

Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.

**`Example`**

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
await algorand.send.appDeleteMethodCall({ sender: 'CREATORADDRESS', method: method, args: ["arg1_value"] })
```

**`Example`**

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
await algorand.send.appDeleteMethodCall({
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
 // Signer only needed if you want to provide one,
 //  generally you'd register it with AlgorandClient
 //  against the sender and not need to pass it in
 signer: transactionSigner,
 maxRoundsToWaitForConfirmation: 5,
 suppressLog: true,
})
```

#### Type declaration

▸ (`params`): `Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `Transaction` \| `ABIValue` \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `ABIMethod` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md) | The parameters for the app deletion transaction |

##### Returns

`Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

#### Defined in

[src/types/algorand-client-transaction-sender.ts:924](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-sender.ts#L924)

___

### appUpdate

• **appUpdate**: (`params`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

Update a smart contract.

Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.

**`Example`**

```typescript
await algorand.send.appUpdate({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE' })
```

**`Example`**

```typescript
await algorand.send.appUpdate({
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
 // Signer only needed if you want to provide one,
 //  generally you'd register it with AlgorandClient
 //  against the sender and not need to pass it in
 signer: transactionSigner,
 maxRoundsToWaitForConfirmation: 5,
 suppressLog: true,
})
```

#### Type declaration

▸ (`params`): `Promise`\<\{ `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md) | The parameters for the app update transaction |

##### Returns

`Promise`\<\{ `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

#### Defined in

[src/types/algorand-client-transaction-sender.ts:646](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-sender.ts#L646)

___

### appUpdateMethodCall

• **appUpdateMethodCall**: (`params`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: (`undefined` \| `Transaction` \| `ABIValue` \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `ABIMethod` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

Update a smart contract via an ABI method.

Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.

**`Example`**

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
await algorand.send.appUpdateMethodCall({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE', method: method, args: ["arg1_value"] })
```

**`Example`**

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
await algorand.send.appUpdateMethodCall({
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
 // Signer only needed if you want to provide one,
 //  generally you'd register it with AlgorandClient
 //  against the sender and not need to pass it in
 signer: transactionSigner,
 maxRoundsToWaitForConfirmation: 5,
 suppressLog: true,
})
```

#### Type declaration

▸ (`params`): `Promise`\<\{ `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: (`undefined` \| `Transaction` \| `ABIValue` \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `ABIMethod` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md) | The parameters for the app update transaction |

##### Returns

`Promise`\<\{ `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

#### Defined in

[src/types/algorand-client-transaction-sender.ts:866](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-sender.ts#L866)

___

### assetConfig

• **assetConfig**: (`params`: [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `assetId`: `bigint` ; `clawback?`: `ReadableAddress` ; `freeze?`: `ReadableAddress` ; `manager?`: `ReadableAddress` ; `reserve?`: `ReadableAddress`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

Configure an existing Algorand Standard Asset.

**Note:** The manager, reserve, freeze, and clawback addresses
are immutably empty if they are not set. If manager is not set then
all fields are immutable from that point forward.

**`Example`**

```typescript
await algorand.send.assetConfig({ sender: "MANAGERADDRESS", assetId: 123456n, manager: "MANAGERADDRESS" })
```

**`Example`**

```typescript
await algorand.send.assetConfig({
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
  // Signer only needed if you want to provide one,
  //  generally you'd register it with AlgorandClient
  //  against the sender and not need to pass it in
  signer: transactionSigner,
  maxRoundsToWaitForConfirmation: 5,
  suppressLog: true,
})
```

#### Type declaration

▸ (`params`): `Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `assetId`: `bigint` ; `clawback?`: `ReadableAddress` ; `freeze?`: `ReadableAddress` ; `manager?`: `ReadableAddress` ; `reserve?`: `ReadableAddress`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md) | The parameters for the asset config transaction |

##### Returns

`Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

#### Defined in

[src/types/algorand-client-transaction-sender.ts:306](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-sender.ts#L306)

___

### assetDestroy

• **assetDestroy**: (`params`: [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `assetId`: `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

Destroys an Algorand Standard Asset.

Created assets can be destroyed only by the asset manager account.
All of the assets must be owned by the creator of the asset before
the asset can be deleted.

**`Example`**

```typescript
await algorand.send.assetDestroy({ sender: "MANAGERADDRESS", assetId: 123456n })
```

**`Example`**

```typescript
await algorand.send.assetDestroy({
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
  // Signer only needed if you want to provide one,
  //  generally you'd register it with AlgorandClient
  //  against the sender and not need to pass it in
  signer: transactionSigner,
  maxRoundsToWaitForConfirmation: 5,
  suppressLog: true,
})
```

#### Type declaration

▸ (`params`): `Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `assetId`: `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md) | The parameters for the asset destroy transaction |

##### Returns

`Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

#### Defined in

[src/types/algorand-client-transaction-sender.ts:386](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-sender.ts#L386)

___

### assetFreeze

• **assetFreeze**: (`params`: [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `account`: `ReadableAddress` ; `assetId`: `bigint` ; `frozen`: `boolean`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

Freeze or unfreeze an Algorand Standard Asset for an account.

**`Example`**

```typescript
await algorand.send.assetFreeze({ sender: "MANAGERADDRESS", assetId: 123456n, account: "ACCOUNTADDRESS", frozen: true })
```

**`Example`**

```typescript
await algorand.send.assetFreeze({
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
  // Signer only needed if you want to provide one,
  //  generally you'd register it with AlgorandClient
  //  against the sender and not need to pass it in
  signer: transactionSigner,
  maxRoundsToWaitForConfirmation: 5,
  suppressLog: true,
})
```

#### Type declaration

▸ (`params`): `Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `account`: `ReadableAddress` ; `assetId`: `bigint` ; `frozen`: `boolean`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md) | The parameters for the asset freeze transaction |

##### Returns

`Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

#### Defined in

[src/types/algorand-client-transaction-sender.ts:345](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-sender.ts#L345)

___

### assetOptIn

• **assetOptIn**: (`params`: [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `assetId`: `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

Opt an account into an Algorand Standard Asset.

**`Example`**

```typescript
await algorand.send.assetOptIn({ sender: "SENDERADDRESS", assetId: 123456n })
```

**`Example`**

```typescript
await algorand.send.assetOptIn({
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
  // Signer only needed if you want to provide one,
  //  generally you'd register it with AlgorandClient
  //  against the sender and not need to pass it in
  signer: transactionSigner,
  maxRoundsToWaitForConfirmation: 5,
  suppressLog: true,
})
```

#### Type declaration

▸ (`params`): `Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `assetId`: `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md) | The parameters for the asset opt-in transaction |

##### Returns

`Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

#### Defined in

[src/types/algorand-client-transaction-sender.ts:466](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-sender.ts#L466)

___

### assetTransfer

• **assetTransfer**: (`params`: [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `amount`: `bigint` ; `assetId`: `bigint` ; `clawbackTarget?`: `ReadableAddress` ; `closeAssetTo?`: `ReadableAddress` ; `receiver`: `ReadableAddress`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

Transfer an Algorand Standard Asset.

**`Example`**

```typescript
await algorand.send.assetTransfer({ sender: "HOLDERADDRESS", assetId: 123456n, amount: 1n, receiver: "RECEIVERADDRESS" })
```

**`Example`**

```typescript
await algorand.send.assetTransfer({
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
  // Signer only needed if you want to provide one,
  //  generally you'd register it with AlgorandClient
  //  against the sender and not need to pass it in
  signer: transactionSigner,
  maxRoundsToWaitForConfirmation: 5,
  suppressLog: true,
})
```

#### Type declaration

▸ (`params`): `Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `amount`: `bigint` ; `assetId`: `bigint` ; `clawbackTarget?`: `ReadableAddress` ; `closeAssetTo?`: `ReadableAddress` ; `receiver`: `ReadableAddress`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md) | The parameters for the asset transfer transaction |

##### Returns

`Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

#### Defined in

[src/types/algorand-client-transaction-sender.ts:428](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-sender.ts#L428)

___

### offlineKeyRegistration

• **offlineKeyRegistration**: (`params`: [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `preventAccountFromEverParticipatingAgain?`: `boolean`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

Register an offline key.

**`Example`**

```typescript
const result = await algorand.send.offlineKeyRegistration({
  sender: 'SENDERADDRESS',
})
```

**`Example`**

```typescript
const result = await algorand.send.offlineKeyRegistration({
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

▸ (`params`): `Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `preventAccountFromEverParticipatingAgain?`: `boolean`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md) | The parameters for the key registration transaction |

##### Returns

`Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

#### Defined in

[src/types/algorand-client-transaction-sender.ts:1061](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-sender.ts#L1061)

___

### onlineKeyRegistration

• **onlineKeyRegistration**: (`params`: [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `selectionKey`: `Uint8Array` ; `stateProofKey?`: `Uint8Array` ; `voteFirst`: `bigint` ; `voteKey`: `Uint8Array` ; `voteKeyDilution`: `bigint` ; `voteLast`: `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

Register an online key.

**`Example`**

```typescript
const result = await algorand.send.onlineKeyRegistration({
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
const result = await algorand.send.onlineKeyRegistration({
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

▸ (`params`): `Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `selectionKey`: `Uint8Array` ; `stateProofKey?`: `Uint8Array` ; `voteFirst`: `bigint` ; `voteKey`: `Uint8Array` ; `voteKeyDilution`: `bigint` ; `voteLast`: `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md) | The parameters for the key registration transaction |

##### Returns

`Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

#### Defined in

[src/types/algorand-client-transaction-sender.ts:1028](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-sender.ts#L1028)

___

### payment

• **payment**: (`params`: [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `ReadableAddress` ; `receiver`: `ReadableAddress`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

Send a payment transaction to transfer Algo between accounts.

**`Example`**

```typescript
const result = await algorand.send.payment({
 sender: 'SENDERADDRESS',
 receiver: 'RECEIVERADDRESS',
 amount: (4).algo(),
})
```

**`Example`**

```typescript
const result = await algorand.send.payment({
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
  // Signer only needed if you want to provide one,
  //  generally you'd register it with AlgorandClient
  //  against the sender and not need to pass it in
  signer: transactionSigner,
  maxRoundsToWaitForConfirmation: 5,
  suppressLog: true,
})
```

#### Type declaration

▸ (`params`): `Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `ReadableAddress` ; `receiver`: `ReadableAddress`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md) | The parameters for the payment transaction |

##### Returns

`Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

#### Defined in

[src/types/algorand-client-transaction-sender.ts:206](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-sender.ts#L206)

## Methods

### \_send

▸ **_send**\<`T`\>(`c`, `log?`): (`params`: `T` & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `c` | (`c`: [`TransactionComposer`](types_composer.TransactionComposer.md)) => (`params`: `T`) => [`TransactionComposer`](types_composer.TransactionComposer.md) |
| `log?` | `Object` |
| `log.postLog?` | (`params`: `T`, `result`: \{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }) => `string` |
| `log.preLog?` | (`params`: `T`, `transaction`: `Transaction`) => `string` |

#### Returns

`fn`

▸ (`params`): `Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `T` & [`SendParams`](../interfaces/types_transaction.SendParams.md) |

##### Returns

`Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

#### Defined in

[src/types/algorand-client-transaction-sender.ts:70](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-sender.ts#L70)

___

### \_sendAppCall

▸ **_sendAppCall**\<`T`\>(`c`, `log?`): (`params`: `T` & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } \| \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } \| [`AppCallParams`](../modules/types_composer.md#appcallparams) \| [`AppDeleteParams`](../modules/types_composer.md#appdeleteparams) \| \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: (`undefined` \| `Transaction` \| `ABIValue` \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `ABIMethod` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } \| \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: (`undefined` \| `Transaction` \| `ABIValue` \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `ABIMethod` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } \| \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `Transaction` \| `ABIValue` \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `ABIMethod` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } \| \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `Transaction` \| `ABIValue` \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `ABIMethod` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } |

#### Parameters

| Name | Type |
| :------ | :------ |
| `c` | (`c`: [`TransactionComposer`](types_composer.TransactionComposer.md)) => (`params`: `T`) => [`TransactionComposer`](types_composer.TransactionComposer.md) |
| `log?` | `Object` |
| `log.postLog?` | (`params`: `T`, `result`: \{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }) => `string` |
| `log.preLog?` | (`params`: `T`, `transaction`: `Transaction`) => `string` |

#### Returns

`fn`

▸ (`params`): `Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `T` & [`SendParams`](../interfaces/types_transaction.SendParams.md) |

##### Returns

`Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

#### Defined in

[src/types/algorand-client-transaction-sender.ts:105](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-sender.ts#L105)

___

### \_sendAppCreateCall

▸ **_sendAppCreateCall**\<`T`\>(`c`, `log?`): (`params`: `T` & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `appAddress`: `Address` ; `appId`: `bigint` ; `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } \| \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: (`undefined` \| `Transaction` \| `ABIValue` \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `ABIMethod` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } |

#### Parameters

| Name | Type |
| :------ | :------ |
| `c` | (`c`: [`TransactionComposer`](types_composer.TransactionComposer.md)) => (`params`: `T`) => [`TransactionComposer`](types_composer.TransactionComposer.md) |
| `log?` | `Object` |
| `log.postLog?` | (`params`: `T`, `result`: \{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }) => `string` |
| `log.preLog?` | (`params`: `T`, `transaction`: `Transaction`) => `string` |

#### Returns

`fn`

▸ (`params`): `Promise`\<\{ `appAddress`: `Address` ; `appId`: `bigint` ; `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `T` & [`SendParams`](../interfaces/types_transaction.SendParams.md) |

##### Returns

`Promise`\<\{ `appAddress`: `Address` ; `appId`: `bigint` ; `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

#### Defined in

[src/types/algorand-client-transaction-sender.ts:148](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-sender.ts#L148)

___

### \_sendAppUpdateCall

▸ **_sendAppUpdateCall**\<`T`\>(`c`, `log?`): (`params`: `T` & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } \| \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } \| \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: (`undefined` \| `Transaction` \| `ABIValue` \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `ABIMethod` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } \| \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: (`undefined` \| `Transaction` \| `ABIValue` \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `ABIMethod` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } |

#### Parameters

| Name | Type |
| :------ | :------ |
| `c` | (`c`: [`TransactionComposer`](types_composer.TransactionComposer.md)) => (`params`: `T`) => [`TransactionComposer`](types_composer.TransactionComposer.md) |
| `log?` | `Object` |
| `log.postLog?` | (`params`: `T`, `result`: \{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }) => `string` |
| `log.preLog?` | (`params`: `T`, `transaction`: `Transaction`) => `string` |

#### Returns

`fn`

▸ (`params`): `Promise`\<\{ `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `T` & [`SendParams`](../interfaces/types_transaction.SendParams.md) |

##### Returns

`Promise`\<\{ `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

#### Defined in

[src/types/algorand-client-transaction-sender.ts:129](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-sender.ts#L129)

___

### assetCreate

▸ **assetCreate**(`params`): `Promise`\<\{ `assetId`: `bigint` ; `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

Create a new Algorand Standard Asset.

The account that sends this transaction will automatically be
opted in to the asset and will hold all units after creation.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `assetName?`: `string` ; `clawback?`: `ReadableAddress` ; `decimals?`: `number` ; `defaultFrozen?`: `boolean` ; `freeze?`: `ReadableAddress` ; `manager?`: `ReadableAddress` ; `metadataHash?`: `string` \| `Uint8Array` ; `reserve?`: `ReadableAddress` ; `total`: `bigint` ; `unitName?`: `string` ; `url?`: `string`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md) | The parameters for the asset creation transaction |

#### Returns

`Promise`\<\{ `assetId`: `bigint` ; `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

The result of the asset create transaction and the transaction that was sent

**`Example`**

```typescript
await algorand.send.assetCreate({ sender: "CREATORADDRESS", total: 100n})
```

**`Example`**

```typescript
await algorand.send.assetCreate({
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
  // Signer only needed if you want to provide one,
  //  generally you'd register it with AlgorandClient
  //  against the sender and not need to pass it in
  signer: transactionSigner,
  maxRoundsToWaitForConfirmation: 5,
  suppressLog: true,
})
```

#### Defined in

[src/types/algorand-client-transaction-sender.ts:257](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-sender.ts#L257)

___

### assetOptOut

▸ **assetOptOut**(`params`): `Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

Opt an account out of an Algorand Standard Asset.

*Note:* If the account has a balance of the asset,
it will not be able to opt-out unless `ensureZeroBalance`
is set to `false` (but then the account will lose the assets).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Omit`\<[`AssetOptOutParams`](../modules/types_composer.md#assetoptoutparams), ``"creator"``\> & \{ `creator?`: `ReadableAddress` ; `ensureZeroBalance`: `boolean`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md) | The parameters for the asset opt-out transaction |

#### Returns

`Promise`\<\{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `undefined` \| `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  }\>

The result of the asset opt-out transaction and the transaction that was sent

**`Example`**

```typescript
await algorand.send.assetOptOut({ sender: "SENDERADDRESS", assetId: 123456n, ensureZeroBalance: true })
```

**`Example`**

```typescript
await algorand.send.assetOptOut({ sender: "SENDERADDRESS", creator: "CREATORADDRESS", assetId: 123456n, ensureZeroBalance: true })
```

**`Example`**

```typescript
await algorand.send.assetOptOut({
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
  // Signer only needed if you want to provide one,
  //  generally you'd register it with AlgorandClient
  //  against the sender and not need to pass it in
  signer: transactionSigner,
  maxRoundsToWaitForConfirmation: 5,
  suppressLog: true,
})
```

#### Defined in

[src/types/algorand-client-transaction-sender.ts:514](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-sender.ts#L514)

___

### newGroup

▸ **newGroup**(): [`TransactionComposer`](types_composer.TransactionComposer.md)

Start a new `TransactionComposer` transaction group

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

A new instance of `TransactionComposer`.

**`Example`**

```ts
const composer = AlgorandClient.mainNet().send.newGroup();
const result = await composer.addTransaction(payment).send()
```

#### Defined in

[src/types/algorand-client-transaction-sender.ts:66](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-sender.ts#L66)
