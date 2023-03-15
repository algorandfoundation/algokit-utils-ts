[@algorandfoundation/algokit-utils](../README.md) / [types/indexer](../modules/types_indexer.md) / TransactionResult

# Interface: TransactionResult

[types/indexer](../modules/types_indexer.md).TransactionResult

Indexer result for a transaction,

**`See`**

https://developer.algorand.org/docs/rest-apis/indexer/#transaction

## Table of contents

### Properties

- [application-transaction](types_indexer.TransactionResult.md#application-transaction)
- [asset-config-transaction](types_indexer.TransactionResult.md#asset-config-transaction)
- [asset-freeze-transaction](types_indexer.TransactionResult.md#asset-freeze-transaction)
- [asset-transfer-transaction](types_indexer.TransactionResult.md#asset-transfer-transaction)
- [auth-addr](types_indexer.TransactionResult.md#auth-addr)
- [close-rewards](types_indexer.TransactionResult.md#close-rewards)
- [closing-amount](types_indexer.TransactionResult.md#closing-amount)
- [confirmed-round](types_indexer.TransactionResult.md#confirmed-round)
- [created-application-index](types_indexer.TransactionResult.md#created-application-index)
- [created-asset-index](types_indexer.TransactionResult.md#created-asset-index)
- [fee](types_indexer.TransactionResult.md#fee)
- [first-valid](types_indexer.TransactionResult.md#first-valid)
- [genesis-hash](types_indexer.TransactionResult.md#genesis-hash)
- [genesis-id](types_indexer.TransactionResult.md#genesis-id)
- [global-state-delta](types_indexer.TransactionResult.md#global-state-delta)
- [group](types_indexer.TransactionResult.md#group)
- [id](types_indexer.TransactionResult.md#id)
- [inner-txns](types_indexer.TransactionResult.md#inner-txns)
- [intra-round-offset](types_indexer.TransactionResult.md#intra-round-offset)
- [keyreg-transaction](types_indexer.TransactionResult.md#keyreg-transaction)
- [last-valid](types_indexer.TransactionResult.md#last-valid)
- [lease](types_indexer.TransactionResult.md#lease)
- [local-state-delta](types_indexer.TransactionResult.md#local-state-delta)
- [logs](types_indexer.TransactionResult.md#logs)
- [note](types_indexer.TransactionResult.md#note)
- [payment-transaction](types_indexer.TransactionResult.md#payment-transaction)
- [receiver-rewards](types_indexer.TransactionResult.md#receiver-rewards)
- [rekey-to](types_indexer.TransactionResult.md#rekey-to)
- [round-time](types_indexer.TransactionResult.md#round-time)
- [sender](types_indexer.TransactionResult.md#sender)
- [sender-rewards](types_indexer.TransactionResult.md#sender-rewards)
- [signature](types_indexer.TransactionResult.md#signature)
- [tx-type](types_indexer.TransactionResult.md#tx-type)

## Properties

### application-transaction

• `Optional` **application-transaction**: [`ApplicationTransactionResult`](types_indexer.ApplicationTransactionResult.md)

#### Defined in

[types/indexer.ts:70](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L70)

___

### asset-config-transaction

• **asset-config-transaction**: [`AssetConfigTransactionResult`](types_indexer.AssetConfigTransactionResult.md)

#### Defined in

[types/indexer.ts:72](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L72)

___

### asset-freeze-transaction

• `Optional` **asset-freeze-transaction**: [`AssetFreezeTransactionResult`](types_indexer.AssetFreezeTransactionResult.md)

#### Defined in

[types/indexer.ts:74](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L74)

___

### asset-transfer-transaction

• `Optional` **asset-transfer-transaction**: [`AssetTransferTransactionResult`](types_indexer.AssetTransferTransactionResult.md)

#### Defined in

[types/indexer.ts:75](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L75)

___

### auth-addr

• `Optional` **auth-addr**: `string`

#### Defined in

[types/indexer.ts:78](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L78)

___

### close-rewards

• `Optional` **close-rewards**: `number`

#### Defined in

[types/indexer.ts:89](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L89)

___

### closing-amount

• `Optional` **closing-amount**: `number`

#### Defined in

[types/indexer.ts:79](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L79)

___

### confirmed-round

• `Optional` **confirmed-round**: `number`

#### Defined in

[types/indexer.ts:63](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L63)

___

### created-application-index

• `Optional` **created-application-index**: `number`

#### Defined in

[types/indexer.ts:71](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L71)

___

### created-asset-index

• `Optional` **created-asset-index**: `number`

#### Defined in

[types/indexer.ts:73](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L73)

___

### fee

• **fee**: `number`

#### Defined in

[types/indexer.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L59)

___

### first-valid

• **first-valid**: `number`

#### Defined in

[types/indexer.ts:61](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L61)

___

### genesis-hash

• `Optional` **genesis-hash**: `string`

#### Defined in

[types/indexer.ts:80](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L80)

___

### genesis-id

• `Optional` **genesis-id**: `string`

#### Defined in

[types/indexer.ts:81](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L81)

___

### global-state-delta

• `Optional` **global-state-delta**: `Record`<`string`, [`EvalDelta`](types_indexer.EvalDelta.md)\>[]

#### Defined in

[types/indexer.ts:86](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L86)

___

### group

• `Optional` **group**: `string`

#### Defined in

[types/indexer.ts:64](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L64)

___

### id

• **id**: `string`

#### Defined in

[types/indexer.ts:58](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L58)

___

### inner-txns

• `Optional` **inner-txns**: [`TransactionResult`](types_indexer.TransactionResult.md)[]

#### Defined in

[types/indexer.ts:82](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L82)

___

### intra-round-offset

• `Optional` **intra-round-offset**: `number`

#### Defined in

[types/indexer.ts:68](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L68)

___

### keyreg-transaction

• `Optional` **keyreg-transaction**: `any`

#### Defined in

[types/indexer.ts:76](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L76)

___

### last-valid

• **last-valid**: `number`

#### Defined in

[types/indexer.ts:62](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L62)

___

### lease

• `Optional` **lease**: `string`

#### Defined in

[types/indexer.ts:84](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L84)

___

### local-state-delta

• `Optional` **local-state-delta**: `Record`<`string`, [`EvalDelta`](types_indexer.EvalDelta.md)\>[]

#### Defined in

[types/indexer.ts:85](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L85)

___

### logs

• `Optional` **logs**: `string`[]

#### Defined in

[types/indexer.ts:66](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L66)

___

### note

• `Optional` **note**: `string`

#### Defined in

[types/indexer.ts:65](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L65)

___

### payment-transaction

• `Optional` **payment-transaction**: [`PaymentTransactionResult`](types_indexer.PaymentTransactionResult.md)

#### Defined in

[types/indexer.ts:77](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L77)

___

### receiver-rewards

• `Optional` **receiver-rewards**: `number`

#### Defined in

[types/indexer.ts:87](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L87)

___

### rekey-to

• `Optional` **rekey-to**: `string`

#### Defined in

[types/indexer.ts:83](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L83)

___

### round-time

• `Optional` **round-time**: `number`

#### Defined in

[types/indexer.ts:67](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L67)

___

### sender

• **sender**: `string`

#### Defined in

[types/indexer.ts:60](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L60)

___

### sender-rewards

• `Optional` **sender-rewards**: `number`

#### Defined in

[types/indexer.ts:88](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L88)

___

### signature

• `Optional` **signature**: `TransactionSignature`

#### Defined in

[types/indexer.ts:69](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L69)

___

### tx-type

• **tx-type**: `TransactionType`

#### Defined in

[types/indexer.ts:90](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L90)
