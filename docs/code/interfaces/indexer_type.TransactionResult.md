[algotstest](../README.md) / [indexer-type](../modules/indexer_type.md) / TransactionResult

# Interface: TransactionResult

[indexer-type](../modules/indexer_type.md).TransactionResult

Indexer result for a transaction,

**`See`**

https://developer.algorand.org/docs/rest-apis/indexer/#transaction

## Table of contents

### Properties

- [application-transaction](indexer_type.TransactionResult.md#application-transaction)
- [asset-config-transaction](indexer_type.TransactionResult.md#asset-config-transaction)
- [asset-freeze-transaction](indexer_type.TransactionResult.md#asset-freeze-transaction)
- [asset-transfer-transaction](indexer_type.TransactionResult.md#asset-transfer-transaction)
- [auth-addr](indexer_type.TransactionResult.md#auth-addr)
- [close-rewards](indexer_type.TransactionResult.md#close-rewards)
- [closing-amount](indexer_type.TransactionResult.md#closing-amount)
- [confirmed-round](indexer_type.TransactionResult.md#confirmed-round)
- [created-application-index](indexer_type.TransactionResult.md#created-application-index)
- [created-asset-index](indexer_type.TransactionResult.md#created-asset-index)
- [fee](indexer_type.TransactionResult.md#fee)
- [first-valid](indexer_type.TransactionResult.md#first-valid)
- [genesis-hash](indexer_type.TransactionResult.md#genesis-hash)
- [genesis-id](indexer_type.TransactionResult.md#genesis-id)
- [global-state-delta](indexer_type.TransactionResult.md#global-state-delta)
- [group](indexer_type.TransactionResult.md#group)
- [id](indexer_type.TransactionResult.md#id)
- [inner-txns](indexer_type.TransactionResult.md#inner-txns)
- [intra-round-offset](indexer_type.TransactionResult.md#intra-round-offset)
- [keyreg-transaction](indexer_type.TransactionResult.md#keyreg-transaction)
- [last-valid](indexer_type.TransactionResult.md#last-valid)
- [lease](indexer_type.TransactionResult.md#lease)
- [local-state-delta](indexer_type.TransactionResult.md#local-state-delta)
- [logs](indexer_type.TransactionResult.md#logs)
- [note](indexer_type.TransactionResult.md#note)
- [payment-transaction](indexer_type.TransactionResult.md#payment-transaction)
- [receiver-rewards](indexer_type.TransactionResult.md#receiver-rewards)
- [rekey-to](indexer_type.TransactionResult.md#rekey-to)
- [round-time](indexer_type.TransactionResult.md#round-time)
- [sender](indexer_type.TransactionResult.md#sender)
- [sender-rewards](indexer_type.TransactionResult.md#sender-rewards)
- [signature](indexer_type.TransactionResult.md#signature)
- [tx-type](indexer_type.TransactionResult.md#tx-type)

## Properties

### application-transaction

• `Optional` **application-transaction**: [`ApplicationTransactionResult`](indexer_type.ApplicationTransactionResult.md)

#### Defined in

[indexer-type.ts:70](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L70)

___

### asset-config-transaction

• **asset-config-transaction**: [`AssetConfigTransactionResult`](indexer_type.AssetConfigTransactionResult.md)

#### Defined in

[indexer-type.ts:72](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L72)

___

### asset-freeze-transaction

• `Optional` **asset-freeze-transaction**: [`AssetFreezeTransactionResult`](indexer_type.AssetFreezeTransactionResult.md)

#### Defined in

[indexer-type.ts:74](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L74)

___

### asset-transfer-transaction

• `Optional` **asset-transfer-transaction**: [`AssetTransferTransactionResult`](indexer_type.AssetTransferTransactionResult.md)

#### Defined in

[indexer-type.ts:75](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L75)

___

### auth-addr

• `Optional` **auth-addr**: `string`

#### Defined in

[indexer-type.ts:78](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L78)

___

### close-rewards

• `Optional` **close-rewards**: `number`

#### Defined in

[indexer-type.ts:89](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L89)

___

### closing-amount

• `Optional` **closing-amount**: `number`

#### Defined in

[indexer-type.ts:79](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L79)

___

### confirmed-round

• `Optional` **confirmed-round**: `number`

#### Defined in

[indexer-type.ts:63](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L63)

___

### created-application-index

• `Optional` **created-application-index**: `number`

#### Defined in

[indexer-type.ts:71](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L71)

___

### created-asset-index

• `Optional` **created-asset-index**: `number`

#### Defined in

[indexer-type.ts:73](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L73)

___

### fee

• **fee**: `number`

#### Defined in

[indexer-type.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L59)

___

### first-valid

• **first-valid**: `number`

#### Defined in

[indexer-type.ts:61](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L61)

___

### genesis-hash

• `Optional` **genesis-hash**: `string`

#### Defined in

[indexer-type.ts:80](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L80)

___

### genesis-id

• `Optional` **genesis-id**: `string`

#### Defined in

[indexer-type.ts:81](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L81)

___

### global-state-delta

• `Optional` **global-state-delta**: `Record`<`string`, [`EvalDelta`](indexer_type.EvalDelta.md)\>[]

#### Defined in

[indexer-type.ts:86](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L86)

___

### group

• `Optional` **group**: `string`

#### Defined in

[indexer-type.ts:64](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L64)

___

### id

• **id**: `string`

#### Defined in

[indexer-type.ts:58](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L58)

___

### inner-txns

• `Optional` **inner-txns**: [`TransactionResult`](indexer_type.TransactionResult.md)[]

#### Defined in

[indexer-type.ts:82](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L82)

___

### intra-round-offset

• `Optional` **intra-round-offset**: `number`

#### Defined in

[indexer-type.ts:68](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L68)

___

### keyreg-transaction

• `Optional` **keyreg-transaction**: `any`

#### Defined in

[indexer-type.ts:76](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L76)

___

### last-valid

• **last-valid**: `number`

#### Defined in

[indexer-type.ts:62](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L62)

___

### lease

• `Optional` **lease**: `string`

#### Defined in

[indexer-type.ts:84](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L84)

___

### local-state-delta

• `Optional` **local-state-delta**: `Record`<`string`, [`EvalDelta`](indexer_type.EvalDelta.md)\>[]

#### Defined in

[indexer-type.ts:85](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L85)

___

### logs

• `Optional` **logs**: `string`[]

#### Defined in

[indexer-type.ts:66](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L66)

___

### note

• `Optional` **note**: `string`

#### Defined in

[indexer-type.ts:65](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L65)

___

### payment-transaction

• `Optional` **payment-transaction**: [`PaymentTransactionResult`](indexer_type.PaymentTransactionResult.md)

#### Defined in

[indexer-type.ts:77](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L77)

___

### receiver-rewards

• `Optional` **receiver-rewards**: `number`

#### Defined in

[indexer-type.ts:87](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L87)

___

### rekey-to

• `Optional` **rekey-to**: `string`

#### Defined in

[indexer-type.ts:83](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L83)

___

### round-time

• `Optional` **round-time**: `number`

#### Defined in

[indexer-type.ts:67](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L67)

___

### sender

• **sender**: `string`

#### Defined in

[indexer-type.ts:60](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L60)

___

### sender-rewards

• `Optional` **sender-rewards**: `number`

#### Defined in

[indexer-type.ts:88](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L88)

___

### signature

• `Optional` **signature**: `TransactionSignature`

#### Defined in

[indexer-type.ts:69](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L69)

___

### tx-type

• **tx-type**: `TransactionType`

#### Defined in

[indexer-type.ts:90](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/indexer-type.ts#L90)
