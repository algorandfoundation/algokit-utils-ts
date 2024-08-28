[@algorandfoundation/algokit-utils](../README.md) / [types/algorand-client-sender](../modules/types_algorand_client_sender.md) / AlgorandClientSender

# Class: AlgorandClientSender

[types/algorand-client-sender](../modules/types_algorand_client_sender.md).AlgorandClientSender

Orchestrates sending transactions for `AlgorandClient`.

## Table of contents

### Constructors

- [constructor](types_algorand_client_sender.AlgorandClientSender.md#constructor)

### Properties

- [\_assetManager](types_algorand_client_sender.AlgorandClientSender.md#_assetmanager)
- [\_newGroup](types_algorand_client_sender.AlgorandClientSender.md#_newgroup)
- [appCall](types_algorand_client_sender.AlgorandClientSender.md#appcall)
- [assetConfig](types_algorand_client_sender.AlgorandClientSender.md#assetconfig)
- [assetDestroy](types_algorand_client_sender.AlgorandClientSender.md#assetdestroy)
- [assetFreeze](types_algorand_client_sender.AlgorandClientSender.md#assetfreeze)
- [assetOptIn](types_algorand_client_sender.AlgorandClientSender.md#assetoptin)
- [assetTransfer](types_algorand_client_sender.AlgorandClientSender.md#assettransfer)
- [methodCall](types_algorand_client_sender.AlgorandClientSender.md#methodcall)
- [onlineKeyRegistration](types_algorand_client_sender.AlgorandClientSender.md#onlinekeyregistration)
- [payment](types_algorand_client_sender.AlgorandClientSender.md#payment)

### Methods

- [\_send](types_algorand_client_sender.AlgorandClientSender.md#_send)
- [assetCreate](types_algorand_client_sender.AlgorandClientSender.md#assetcreate)
- [assetOptOut](types_algorand_client_sender.AlgorandClientSender.md#assetoptout)

## Constructors

### constructor

• **new AlgorandClientSender**(`newGroup`, `assetManager`): [`AlgorandClientSender`](types_algorand_client_sender.AlgorandClientSender.md)

Creates a new `AlgorandClientSender`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `newGroup` | () => [`default`](types_composer.default.md) | A lambda that starts a new `AlgoKitComposer` transaction group |
| `assetManager` | [`AssetManager`](types_asset_manager.AssetManager.md) | An `AssetManager` instance |

#### Returns

[`AlgorandClientSender`](types_algorand_client_sender.AlgorandClientSender.md)

#### Defined in

[src/types/algorand-client-sender.ts:22](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-sender.ts#L22)

## Properties

### \_assetManager

• `Private` **\_assetManager**: [`AssetManager`](types_asset_manager.AssetManager.md)

#### Defined in

[src/types/algorand-client-sender.ts:15](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-sender.ts#L15)

___

### \_newGroup

• `Private` **\_newGroup**: () => [`default`](types_composer.default.md)

#### Type declaration

▸ (): [`default`](types_composer.default.md)

##### Returns

[`default`](types_composer.default.md)

#### Defined in

[src/types/algorand-client-sender.ts:14](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-sender.ts#L14)

___

### appCall

• **appCall**: (`params`: [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `accountReferences?`: `string`[] ; `appId?`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram?`: `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: `BoxReference`[] ; `clearProgram?`: `Uint8Array` ; `extraPages?`: `number` ; `onComplete?`: `OnApplicationComplete` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalUints`: `number` ; `localByteSlices`: `number` ; `localUints`: `number`  }  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

Call a smart contract.

Note: you may prefer to use `algorandClient.client` to get an app client for more advanced functionality.

#### Type declaration

▸ (`params`): `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `accountReferences?`: `string`[] ; `appId?`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram?`: `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: `BoxReference`[] ; `clearProgram?`: `Uint8Array` ; `extraPages?`: `number` ; `onComplete?`: `OnApplicationComplete` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalUints`: `number` ; `localByteSlices`: `number` ; `localUints`: `number`  }  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md) |

##### Returns

`Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

#### Defined in

[src/types/algorand-client-sender.ts:448](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-sender.ts#L448)

___

### assetConfig

• **assetConfig**: (`params`: [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `assetId`: `bigint` ; `clawback?`: `string` ; `freeze?`: `string` ; `manager`: `undefined` \| `string` ; `reserve?`: `string`  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

Configure an existing Algorand Standard Asset.

**Note:** The manager, reserve, freeze, and clawback addresses
are immutably empty if they are not set. If manager is not set then
all fields are immutable from that point forward.

**`Example`**

```typescript
await algorand.send.assetConfig({sender: "MANAGERADDRESS", assetId: 123456n, manager: "MANAGERADDRESS" })
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
  extraFee: (1000).microAlgos(),
  staticFee: (1000).microAlgos(),
  // Max fee doesn't make sense with extraFee AND staticFee
  //  already specified, but here for completeness
  maxFee: (3000).microAlgos(),
  // Signer only needed if you want to provide one,
  //  generally you'd register it with AlgorandClient
  //  against the sender and not need to pass it in
  signer: transactionSigner,
  maxRoundsToWaitForConfirmation: 5,
  suppressLog: true,
})
```

#### Type declaration

▸ (`params`): `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `assetId`: `bigint` ; `clawback?`: `string` ; `freeze?`: `string` ; `manager`: `undefined` \| `string` ; `reserve?`: `string`  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md) | The parameters for the asset config transaction |

##### Returns

`Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

#### Defined in

[src/types/algorand-client-sender.ts:203](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-sender.ts#L203)

___

### assetDestroy

• **assetDestroy**: (`params`: [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `assetId`: `bigint`  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

Destroys an Algorand Standard Asset.

Created assets can be destroyed only by the asset manager account.
All of the assets must be owned by the creator of the asset before
the asset can be deleted.

**`Example`**

```typescript
await algorand.send.assetDestroy({sender: "MANAGERADDRESS", assetId: 123456n })
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
  extraFee: (1000).microAlgos(),
  staticFee: (1000).microAlgos(),
  // Max fee doesn't make sense with extraFee AND staticFee
  //  already specified, but here for completeness
  maxFee: (3000).microAlgos(),
  // Signer only needed if you want to provide one,
  //  generally you'd register it with AlgorandClient
  //  against the sender and not need to pass it in
  signer: transactionSigner,
  maxRoundsToWaitForConfirmation: 5,
  suppressLog: true,
})
```

#### Type declaration

▸ (`params`): `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `assetId`: `bigint`  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md) | The parameters for the asset destroy transaction |

##### Returns

`Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

#### Defined in

[src/types/algorand-client-sender.ts:283](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-sender.ts#L283)

___

### assetFreeze

• **assetFreeze**: (`params`: [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `account`: `string` ; `assetId`: `bigint` ; `frozen`: `boolean`  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

Freeze or unfreeze an Algorand Standard Asset for an account.

**`Example`**

```typescript
await algorand.send.assetFreeze({sender: "MANAGERADDRESS", assetId: 123456n, account: "ACCOUNTADDRESS", frozen: true })
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
  extraFee: (1000).microAlgos(),
  staticFee: (1000).microAlgos(),
  // Max fee doesn't make sense with extraFee AND staticFee
  //  already specified, but here for completeness
  maxFee: (3000).microAlgos(),
  // Signer only needed if you want to provide one,
  //  generally you'd register it with AlgorandClient
  //  against the sender and not need to pass it in
  signer: transactionSigner,
  maxRoundsToWaitForConfirmation: 5,
  suppressLog: true,
})
```

#### Type declaration

▸ (`params`): `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `account`: `string` ; `assetId`: `bigint` ; `frozen`: `boolean`  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md) | The parameters for the asset freeze transaction |

##### Returns

`Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

#### Defined in

[src/types/algorand-client-sender.ts:242](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-sender.ts#L242)

___

### assetOptIn

• **assetOptIn**: (`params`: [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `assetId`: `bigint`  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

Opt an account into an Algorand Standard Asset.

**`Example`**

```typescript
await algorand.send.assetOptIn({sender: "SENDERADDRESS", assetId: 123456n })
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
  extraFee: (1000).microAlgos(),
  staticFee: (1000).microAlgos(),
  // Max fee doesn't make sense with extraFee AND staticFee
  //  already specified, but here for completeness
  maxFee: (3000).microAlgos(),
  // Signer only needed if you want to provide one,
  //  generally you'd register it with AlgorandClient
  //  against the sender and not need to pass it in
  signer: transactionSigner,
  maxRoundsToWaitForConfirmation: 5,
  suppressLog: true,
})
```

#### Type declaration

▸ (`params`): `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `assetId`: `bigint`  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md) | The parameters for the asset opt-in transaction |

##### Returns

`Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

#### Defined in

[src/types/algorand-client-sender.ts:363](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-sender.ts#L363)

___

### assetTransfer

• **assetTransfer**: (`params`: [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `amount`: `bigint` ; `assetId`: `bigint` ; `clawbackTarget?`: `string` ; `closeAssetTo?`: `string` ; `receiver`: `string`  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

Transfer an Algorand Standard Asset.

**`Example`**

```typescript
await algorand.send.assetTransfer({sender: "HOLDERADDRESS", assetId: 123456n, amount: 1n, receiver: "RECEIVERADDRESS" })
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
  extraFee: (1000).microAlgos(),
  staticFee: (1000).microAlgos(),
  // Max fee doesn't make sense with extraFee AND staticFee
  //  already specified, but here for completeness
  maxFee: (3000).microAlgos(),
  // Signer only needed if you want to provide one,
  //  generally you'd register it with AlgorandClient
  //  against the sender and not need to pass it in
  signer: transactionSigner,
  maxRoundsToWaitForConfirmation: 5,
  suppressLog: true,
})
```

#### Type declaration

▸ (`params`): `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `amount`: `bigint` ; `assetId`: `bigint` ; `clawbackTarget?`: `string` ; `closeAssetTo?`: `string` ; `receiver`: `string`  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md) | The parameters for the asset transfer transaction |

##### Returns

`Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

#### Defined in

[src/types/algorand-client-sender.ts:325](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-sender.ts#L325)

___

### methodCall

• **methodCall**: (`params`: [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & `Omit`\<[`AppCallParams`](../modules/types_composer.md#appcallparams), ``"args"``\> & \{ `appId`: `bigint` ; `args?`: (`TransactionWithSigner` \| `Transaction` \| `ABIValue` \| `Promise`\<`Transaction`\> \| [`MethodCallParams`](../modules/types_composer.md#methodcallparams))[] ; `method`: `ABIMethod`  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

Call a smart contract ABI method.

Note: you may prefer to use `algorandClient.client` to get an app client for more advanced functionality.

#### Type declaration

▸ (`params`): `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & `Omit`\<[`AppCallParams`](../modules/types_composer.md#appcallparams), ``"args"``\> & \{ `appId`: `bigint` ; `args?`: (`TransactionWithSigner` \| `Transaction` \| `ABIValue` \| `Promise`\<`Transaction`\> \| [`MethodCallParams`](../modules/types_composer.md#methodcallparams))[] ; `method`: `ABIMethod`  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md) |

##### Returns

`Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

#### Defined in

[src/types/algorand-client-sender.ts:454](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-sender.ts#L454)

___

### onlineKeyRegistration

• **onlineKeyRegistration**: (`params`: [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `selectionKey`: `Uint8Array` ; `stateProofKey?`: `Uint8Array` ; `voteFirst`: `bigint` ; `voteKey`: `Uint8Array` ; `voteKeyDilution`: `bigint` ; `voteLast`: `bigint`  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

Register an online key.

#### Type declaration

▸ (`params`): `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `selectionKey`: `Uint8Array` ; `stateProofKey?`: `Uint8Array` ; `voteFirst`: `bigint` ; `voteKey`: `Uint8Array` ; `voteKeyDilution`: `bigint` ; `voteLast`: `bigint`  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md) |

##### Returns

`Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

#### Defined in

[src/types/algorand-client-sender.ts:456](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-sender.ts#L456)

___

### payment

• **payment**: (`params`: [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` ; `receiver`: `string`  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

Send a payment transaction to transfer Algo between accounts.

**`Example`**

```typescript
const result = await algorandClient.send.payment({
 sender: 'SENDERADDRESS',
 receiver: 'RECEIVERADDRESS',
 amount: (4).algos(),
})
```

**`Example`**

```typescript
const result = await algorandClient.send.payment({
  amount: (4).algos(),
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
  extraFee: (1000).microAlgos(),
  staticFee: (1000).microAlgos(),
  // Max fee doesn't make sense with extraFee AND staticFee
  //  already specified, but here for completeness
  maxFee: (3000).microAlgos(),
  // Signer only needed if you want to provide one,
  //  generally you'd register it with AlgorandClient
  //  against the sender and not need to pass it in
  signer: transactionSigner,
  maxRoundsToWaitForConfirmation: 5,
  suppressLog: true,
})
```

#### Type declaration

▸ (`params`): `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` ; `receiver`: `string`  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md) | The parameters for the payment transaction |

##### Returns

`Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

#### Defined in

[src/types/algorand-client-sender.ts:103](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-sender.ts#L103)

## Methods

### \_send

▸ **_send**\<`T`\>(`c`, `log?`): (`params`: `T` & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md)) => `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `c` | (`c`: [`default`](types_composer.default.md)) => (`params`: `T`) => [`default`](types_composer.default.md) |
| `log?` | `Object` |
| `log.postLog?` | (`params`: `T`, `result`: [`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)) => `string` |
| `log.preLog?` | (`params`: `T`, `transaction`: `Transaction`) => `string` |

#### Returns

`fn`

▸ (`params`): `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `T` & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md) |

##### Returns

`Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

#### Defined in

[src/types/algorand-client-sender.ts:27](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-sender.ts#L27)

___

### assetCreate

▸ **assetCreate**(`params`): `Promise`\<\{ `assetId`: `bigint` ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\>

Create a new Algorand Standard Asset.

The account that sends this transaction will automatically be
opted in to the asset and will hold all units after creation.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) & \{ `assetName?`: `string` ; `clawback?`: `string` ; `decimals?`: `number` ; `defaultFrozen?`: `boolean` ; `freeze?`: `string` ; `manager?`: `string` ; `metadataHash?`: `string` \| `Uint8Array` ; `reserve?`: `string` ; `total`: `bigint` ; `unitName?`: `string` ; `url?`: `string`  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md) | The parameters for the asset creation transaction |

#### Returns

`Promise`\<\{ `assetId`: `bigint` ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\>

The result of the transaction and the transaction that was sent

**`Example`**

```typescript
await algorand.send.assetCreate({sender: "CREATORADDRESS", total: 100n})
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
  extraFee: (1000).microAlgos(),
  staticFee: (1000).microAlgos(),
  // Max fee doesn't make sense with extraFee AND staticFee
  //  already specified, but here for completeness
  maxFee: (3000).microAlgos(),
  // Signer only needed if you want to provide one,
  //  generally you'd register it with AlgorandClient
  //  against the sender and not need to pass it in
  signer: transactionSigner,
  maxRoundsToWaitForConfirmation: 5,
  suppressLog: true,
})
```

#### Defined in

[src/types/algorand-client-sender.ts:154](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-sender.ts#L154)

___

### assetOptOut

▸ **assetOptOut**(`params`): `Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

Opt an account out of an Algorand Standard Asset.

*Note:* If the account has a balance of the asset,
it will not be able to opt-out unless `ensureZeroBalance`
is set to `false` (but then the account will lose the assets).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Omit`\<[`AssetOptOutParams`](../modules/types_composer.md#assetoptoutparams), ``"creator"``\> & \{ `creator?`: `string` ; `ensureZeroBalance`: `boolean`  } & [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md) | The parameters for the asset opt-out transaction |

#### Returns

`Promise`\<[`SendSingleTransactionResult`](../modules/types_algorand_client_sender.md#sendsingletransactionresult)\>

The result of the transaction and the transaction that was sent

**`Example`**

```typescript
await algorand.send.assetOptOut({sender: "SENDERADDRESS", assetId: 123456n, ensureZeroBalance: true })
```

**`Example`**

```typescript
await algorand.send.assetOptOut({sender: "SENDERADDRESS", creator: "CREATORADDRESS", assetId: 123456n, ensureZeroBalance: true })
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
  extraFee: (1000).microAlgos(),
  staticFee: (1000).microAlgos(),
  // Max fee doesn't make sense with extraFee AND staticFee
  //  already specified, but here for completeness
  maxFee: (3000).microAlgos(),
  // Signer only needed if you want to provide one,
  //  generally you'd register it with AlgorandClient
  //  against the sender and not need to pass it in
  signer: transactionSigner,
  maxRoundsToWaitForConfirmation: 5,
  suppressLog: true,
})
```

#### Defined in

[src/types/algorand-client-sender.ts:410](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-sender.ts#L410)
