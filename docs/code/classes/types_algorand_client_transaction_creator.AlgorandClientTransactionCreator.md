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
- [assetConfig](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#assetconfig)
- [assetCreate](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#assetcreate)
- [assetDestroy](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#assetdestroy)
- [assetFreeze](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#assetfreeze)
- [assetOptIn](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#assetoptin)
- [assetOptOut](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#assetoptout)
- [assetTransfer](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#assettransfer)
- [onlineKeyRegistration](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#onlinekeyregistration)
- [payment](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#payment)

### Methods

- [\_transaction](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#_transaction)
- [methodCall](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md#methodcall)

## Constructors

### constructor

• **new AlgorandClientTransactionCreator**(`newGroup`): [`AlgorandClientTransactionCreator`](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md)

Creates a new `AlgorandClientTransactionCreator`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `newGroup` | () => [`default`](types_composer.default.md) | A lambda that starts a new `AlgoKitComposer` transaction group |

#### Returns

[`AlgorandClientTransactionCreator`](types_algorand_client_transaction_creator.AlgorandClientTransactionCreator.md)

#### Defined in

[src/types/algorand-client-transaction-creator.ts:14](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L14)

## Properties

### \_newGroup

• `Private` **\_newGroup**: () => [`default`](types_composer.default.md)

#### Type declaration

▸ (): [`default`](types_composer.default.md)

##### Returns

[`default`](types_composer.default.md)

#### Defined in

[src/types/algorand-client-transaction-creator.ts:8](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L8)

___

### appCall

• **appCall**: (`params`: [`AppCallParams`](../modules/types_composer.md#appcallparams)) => `Promise`\<`Transaction`\>

Create an application call transaction.

#### Type declaration

▸ (`params`): `Promise`\<`Transaction`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AppCallParams`](../modules/types_composer.md#appcallparams) |

##### Returns

`Promise`\<`Transaction`\>

#### Defined in

[src/types/algorand-client-transaction-creator.ts:296](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L296)

___

### assetConfig

• **assetConfig**: (`params`: [`AssetConfigParams`](../modules/types_composer.md#assetconfigparams)) => `Promise`\<`Transaction`\>

Create an asset config transaction to reconfigure an existing Algorand Standard Asset.

**Note:** The manager, reserve, freeze, and clawback addresses
are immutably empty if they are not set. If manager is not set then
all fields are immutable from that point forward.

**`Example`**

```typescript
await algorand.transaction.assetConfig({sender: "MANAGERADDRESS", assetId: 123456n, manager: "MANAGERADDRESS" })
```

**`Example`**

```typescript
await algorand.transaction.assetConfig({
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

[src/types/algorand-client-transaction-creator.ts:138](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L138)

___

### assetCreate

• **assetCreate**: (`params`: [`AssetCreateParams`](../modules/types_composer.md#assetcreateparams)) => `Promise`\<`Transaction`\>

Create a create Algorand Standard Asset transaction.

The account that sends this transaction will automatically be
opted in to the asset and will hold all units after creation.

**`Example`**

```typescript
await algorand.transaction.assetCreate({sender: "CREATORADDRESS", total: 100n})
```

**`Example`**

```typescript
await algorand.transaction.assetCreate({
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

[src/types/algorand-client-transaction-creator.ts:102](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L102)

___

### assetDestroy

• **assetDestroy**: (`params`: [`AssetDestroyParams`](../modules/types_composer.md#assetdestroyparams)) => `Promise`\<`Transaction`\>

Create an Algorand Standard Asset destroy transaction.

Created assets can be destroyed only by the asset manager account.
All of the assets must be owned by the creator of the asset before
the asset can be deleted.

**`Example`**

```typescript
await algorand.transaction.assetDestroy({sender: "MANAGERADDRESS", assetId: 123456n })
```

**`Example`**

```typescript
await algorand.transaction.assetDestroy({
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

[src/types/algorand-client-transaction-creator.ts:200](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L200)

___

### assetFreeze

• **assetFreeze**: (`params`: [`AssetFreezeParams`](../modules/types_composer.md#assetfreezeparams)) => `Promise`\<`Transaction`\>

Create an Algorand Standard Asset freeze transaction.

**`Example`**

```typescript
await algorand.transaction.assetFreeze({sender: "MANAGERADDRESS", assetId: 123456n, account: "ACCOUNTADDRESS", frozen: true })
```

**`Example`**

```typescript
await algorand.transaction.assetFreeze({
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

[src/types/algorand-client-transaction-creator.ts:168](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L168)

___

### assetOptIn

• **assetOptIn**: (`params`: [`AssetOptInParams`](../modules/types_composer.md#assetoptinparams)) => `Promise`\<`Transaction`\>

Create an Algorand Standard Asset opt-in transaction.

**`Example`**

```typescript
await algorand.transaction.assetOptIn({sender: "SENDERADDRESS", assetId: 123456n })
```

**`Example`**

```typescript
await algorand.transaction.assetOptIn({
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

[src/types/algorand-client-transaction-creator.ts:261](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L261)

___

### assetOptOut

• **assetOptOut**: (`params`: [`AssetOptOutParams`](../modules/types_composer.md#assetoptoutparams)) => `Promise`\<`Transaction`\>

Create an asset opt-out transaction.

*Note:* If the account has a balance of the asset,
it will lose those assets

**`Example`**

```typescript
await algorand.transaction.assetOptOut({sender: "SENDERADDRESS", creator: "CREATORADDRESS", assetId: 123456n })
```

**`Example`**

```typescript
await algorand.transaction.assetOptIn({
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

[src/types/algorand-client-transaction-creator.ts:294](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L294)

___

### assetTransfer

• **assetTransfer**: (`params`: [`AssetTransferParams`](../modules/types_composer.md#assettransferparams)) => `Promise`\<`Transaction`\>

Create an Algorand Standard Asset transfer transaction.

**`Example`**

```typescript
await algorand.transaction.assetTransfer({sender: "HOLDERADDRESS", assetId: 123456n, amount: 1n, receiver: "RECEIVERADDRESS" })
```

**`Example`**

```typescript
await algorand.transaction.assetTransfer({
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

[src/types/algorand-client-transaction-creator.ts:233](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L233)

___

### onlineKeyRegistration

• **onlineKeyRegistration**: (`params`: [`OnlineKeyRegistrationParams`](../modules/types_composer.md#onlinekeyregistrationparams)) => `Promise`\<`Transaction`\>

Create an online key registration transaction.

#### Type declaration

▸ (`params`): `Promise`\<`Transaction`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`OnlineKeyRegistrationParams`](../modules/types_composer.md#onlinekeyregistrationparams) |

##### Returns

`Promise`\<`Transaction`\>

#### Defined in

[src/types/algorand-client-transaction-creator.ts:302](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L302)

___

### payment

• **payment**: (`params`: [`PaymentParams`](../modules/types_composer.md#paymentparams)) => `Promise`\<`Transaction`\>

Create a payment transaction to transfer Algo between accounts.

**`Example`**

```typescript
const result = await algorandClient.send.payment({
 sender: 'SENDERADDRESS',
 receiver: 'RECEIVERADDRESS',
 amount: (4).algo(),
})
```

**`Example`**

```typescript
const result = await algorandClient.send.payment({
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

[src/types/algorand-client-transaction-creator.ts:61](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L61)

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

[src/types/algorand-client-transaction-creator.ts:18](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L18)

___

### methodCall

▸ **methodCall**(`params`): `Promise`\<`Transaction`[]\>

Create an application call with ABI method call transaction.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`MethodCallParams`](../modules/types_composer.md#methodcallparams) |

#### Returns

`Promise`\<`Transaction`[]\>

#### Defined in

[src/types/algorand-client-transaction-creator.ts:298](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L298)
