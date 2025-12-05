[@algorandfoundation/algokit-utils](../README.md) / [types/transaction](../modules/types_transaction.md) / TransactionWrapper

# Class: TransactionWrapper

[types/transaction](../modules/types_transaction.md).TransactionWrapper

## Implements

- `Transaction`

## Table of contents

### Constructors

- [constructor](types_transaction.TransactionWrapper.md#constructor)

### Properties

- [appCall](types_transaction.TransactionWrapper.md#appcall)
- [assetConfig](types_transaction.TransactionWrapper.md#assetconfig)
- [assetFreeze](types_transaction.TransactionWrapper.md#assetfreeze)
- [assetTransfer](types_transaction.TransactionWrapper.md#assettransfer)
- [fee](types_transaction.TransactionWrapper.md#fee)
- [firstValid](types_transaction.TransactionWrapper.md#firstvalid)
- [genesisHash](types_transaction.TransactionWrapper.md#genesishash)
- [genesisId](types_transaction.TransactionWrapper.md#genesisid)
- [group](types_transaction.TransactionWrapper.md#group)
- [heartbeat](types_transaction.TransactionWrapper.md#heartbeat)
- [keyRegistration](types_transaction.TransactionWrapper.md#keyregistration)
- [lastValid](types_transaction.TransactionWrapper.md#lastvalid)
- [lease](types_transaction.TransactionWrapper.md#lease)
- [note](types_transaction.TransactionWrapper.md#note)
- [payment](types_transaction.TransactionWrapper.md#payment)
- [rekeyTo](types_transaction.TransactionWrapper.md#rekeyto)
- [sender](types_transaction.TransactionWrapper.md#sender)
- [stateProof](types_transaction.TransactionWrapper.md#stateproof)
- [type](types_transaction.TransactionWrapper.md#type)

### Methods

- [txID](types_transaction.TransactionWrapper.md#txid)

## Constructors

### constructor

• **new TransactionWrapper**(`transaction`): [`TransactionWrapper`](types_transaction.TransactionWrapper.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transaction` | `Transaction` |

#### Returns

[`TransactionWrapper`](types_transaction.TransactionWrapper.md)

#### Defined in

[src/types/transaction.ts:185](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L185)

## Properties

### appCall

• `Optional` **appCall**: `AppCallTransactionFields`

#### Implementation of

Transaction.appCall

#### Defined in

[src/types/transaction.ts:179](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L179)

___

### assetConfig

• `Optional` **assetConfig**: `AssetConfigTransactionFields`

#### Implementation of

Transaction.assetConfig

#### Defined in

[src/types/transaction.ts:178](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L178)

___

### assetFreeze

• `Optional` **assetFreeze**: `AssetFreezeTransactionFields`

#### Implementation of

Transaction.assetFreeze

#### Defined in

[src/types/transaction.ts:181](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L181)

___

### assetTransfer

• `Optional` **assetTransfer**: `AssetTransferTransactionFields`

#### Implementation of

Transaction.assetTransfer

#### Defined in

[src/types/transaction.ts:177](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L177)

___

### fee

• `Optional` **fee**: `bigint`

#### Implementation of

Transaction.fee

#### Defined in

[src/types/transaction.ts:167](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L167)

___

### firstValid

• **firstValid**: `bigint`

#### Implementation of

Transaction.firstValid

#### Defined in

[src/types/transaction.ts:168](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L168)

___

### genesisHash

• `Optional` **genesisHash**: `Uint8Array`

#### Implementation of

Transaction.genesisHash

#### Defined in

[src/types/transaction.ts:170](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L170)

___

### genesisId

• `Optional` **genesisId**: `string`

#### Implementation of

Transaction.genesisId

#### Defined in

[src/types/transaction.ts:171](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L171)

___

### group

• `Optional` **group**: `Uint8Array`

#### Implementation of

Transaction.group

#### Defined in

[src/types/transaction.ts:175](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L175)

___

### heartbeat

• `Optional` **heartbeat**: `HeartbeatTransactionFields`

#### Implementation of

Transaction.heartbeat

#### Defined in

[src/types/transaction.ts:182](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L182)

___

### keyRegistration

• `Optional` **keyRegistration**: `KeyRegistrationTransactionFields`

#### Implementation of

Transaction.keyRegistration

#### Defined in

[src/types/transaction.ts:180](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L180)

___

### lastValid

• **lastValid**: `bigint`

#### Implementation of

Transaction.lastValid

#### Defined in

[src/types/transaction.ts:169](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L169)

___

### lease

• `Optional` **lease**: `Uint8Array`

#### Implementation of

Transaction.lease

#### Defined in

[src/types/transaction.ts:174](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L174)

___

### note

• `Optional` **note**: `Uint8Array`

#### Implementation of

Transaction.note

#### Defined in

[src/types/transaction.ts:172](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L172)

___

### payment

• `Optional` **payment**: `PaymentTransactionFields`

#### Implementation of

Transaction.payment

#### Defined in

[src/types/transaction.ts:176](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L176)

___

### rekeyTo

• `Optional` **rekeyTo**: [`Address`](index.Address.md)

#### Implementation of

Transaction.rekeyTo

#### Defined in

[src/types/transaction.ts:173](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L173)

___

### sender

• **sender**: [`Address`](index.Address.md)

#### Implementation of

Transaction.sender

#### Defined in

[src/types/transaction.ts:166](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L166)

___

### stateProof

• `Optional` **stateProof**: `StateProofTransactionFields`

#### Implementation of

Transaction.stateProof

#### Defined in

[src/types/transaction.ts:183](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L183)

___

### type

• **type**: `TransactionType`

#### Implementation of

Transaction.type

#### Defined in

[src/types/transaction.ts:165](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L165)

## Methods

### txID

▸ **txID**(): `string`

Get the transaction ID

#### Returns

`string`

The transaction ID as a base64-encoded string

#### Defined in

[src/types/transaction.ts:211](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L211)
