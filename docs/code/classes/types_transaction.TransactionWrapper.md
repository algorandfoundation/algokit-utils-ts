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

[src/types/transaction.ts:198](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L198)

## Properties

### appCall

• `Optional` **appCall**: `AppCallTransactionFields`

#### Implementation of

Transaction.appCall

#### Defined in

[src/types/transaction.ts:192](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L192)

___

### assetConfig

• `Optional` **assetConfig**: `AssetConfigTransactionFields`

#### Implementation of

Transaction.assetConfig

#### Defined in

[src/types/transaction.ts:191](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L191)

___

### assetFreeze

• `Optional` **assetFreeze**: `AssetFreezeTransactionFields`

#### Implementation of

Transaction.assetFreeze

#### Defined in

[src/types/transaction.ts:194](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L194)

___

### assetTransfer

• `Optional` **assetTransfer**: `AssetTransferTransactionFields`

#### Implementation of

Transaction.assetTransfer

#### Defined in

[src/types/transaction.ts:190](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L190)

___

### fee

• `Optional` **fee**: `bigint`

#### Implementation of

Transaction.fee

#### Defined in

[src/types/transaction.ts:180](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L180)

___

### firstValid

• **firstValid**: `bigint`

#### Implementation of

Transaction.firstValid

#### Defined in

[src/types/transaction.ts:181](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L181)

___

### genesisHash

• `Optional` **genesisHash**: `Uint8Array`

#### Implementation of

Transaction.genesisHash

#### Defined in

[src/types/transaction.ts:183](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L183)

___

### genesisId

• `Optional` **genesisId**: `string`

#### Implementation of

Transaction.genesisId

#### Defined in

[src/types/transaction.ts:184](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L184)

___

### group

• `Optional` **group**: `Uint8Array`

#### Implementation of

Transaction.group

#### Defined in

[src/types/transaction.ts:188](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L188)

___

### heartbeat

• `Optional` **heartbeat**: `HeartbeatTransactionFields`

#### Implementation of

Transaction.heartbeat

#### Defined in

[src/types/transaction.ts:195](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L195)

___

### keyRegistration

• `Optional` **keyRegistration**: `KeyRegistrationTransactionFields`

#### Implementation of

Transaction.keyRegistration

#### Defined in

[src/types/transaction.ts:193](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L193)

___

### lastValid

• **lastValid**: `bigint`

#### Implementation of

Transaction.lastValid

#### Defined in

[src/types/transaction.ts:182](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L182)

___

### lease

• `Optional` **lease**: `Uint8Array`

#### Implementation of

Transaction.lease

#### Defined in

[src/types/transaction.ts:187](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L187)

___

### note

• `Optional` **note**: `Uint8Array`

#### Implementation of

Transaction.note

#### Defined in

[src/types/transaction.ts:185](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L185)

___

### payment

• `Optional` **payment**: `PaymentTransactionFields`

#### Implementation of

Transaction.payment

#### Defined in

[src/types/transaction.ts:189](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L189)

___

### rekeyTo

• `Optional` **rekeyTo**: `Address`

#### Implementation of

Transaction.rekeyTo

#### Defined in

[src/types/transaction.ts:186](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L186)

___

### sender

• **sender**: `Address`

#### Implementation of

Transaction.sender

#### Defined in

[src/types/transaction.ts:179](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L179)

___

### stateProof

• `Optional` **stateProof**: `StateProofTransactionFields`

#### Implementation of

Transaction.stateProof

#### Defined in

[src/types/transaction.ts:196](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L196)

___

### type

• **type**: `TransactionType`

#### Implementation of

Transaction.type

#### Defined in

[src/types/transaction.ts:178](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L178)

## Methods

### txID

▸ **txID**(): `string`

Get the transaction ID

#### Returns

`string`

The transaction ID as a base64-encoded string

#### Defined in

[src/types/transaction.ts:224](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L224)
