[algotstest](../README.md) / [algod-type](../modules/algod_type.md) / PendingTransactionResponse

# Interface: PendingTransactionResponse

[algod-type](../modules/algod_type.md).PendingTransactionResponse

The response from the pending transaction API

**`See`**

https://developer.algorand.org/docs/rest-apis/algod/v2/#get-v2transactionspendingtxid

## Table of contents

### Properties

- [application-index](algod_type.PendingTransactionResponse.md#application-index)
- [asset-closing-amount](algod_type.PendingTransactionResponse.md#asset-closing-amount)
- [asset-index](algod_type.PendingTransactionResponse.md#asset-index)
- [close-rewards](algod_type.PendingTransactionResponse.md#close-rewards)
- [closing-amount](algod_type.PendingTransactionResponse.md#closing-amount)
- [confirmed-round](algod_type.PendingTransactionResponse.md#confirmed-round)
- [global-state-delta](algod_type.PendingTransactionResponse.md#global-state-delta)
- [inner-txns](algod_type.PendingTransactionResponse.md#inner-txns)
- [local-state-delta](algod_type.PendingTransactionResponse.md#local-state-delta)
- [logs](algod_type.PendingTransactionResponse.md#logs)
- [pool-error](algod_type.PendingTransactionResponse.md#pool-error)
- [receiver-rewards](algod_type.PendingTransactionResponse.md#receiver-rewards)
- [sender-rewards](algod_type.PendingTransactionResponse.md#sender-rewards)
- [txn](algod_type.PendingTransactionResponse.md#txn)

## Properties

### application-index

• `Optional` **application-index**: `number`

The application index if the transaction was found and it created an
application.

#### Defined in

[algod-type.ts:9](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/algod-type.ts#L9)

___

### asset-closing-amount

• `Optional` **asset-closing-amount**: `number`

The number of the asset's unit that were transferred to the close-to address.

#### Defined in

[algod-type.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/algod-type.ts#L13)

___

### asset-index

• `Optional` **asset-index**: `number`

The asset index if the transaction was found and it created an asset.

#### Defined in

[algod-type.ts:17](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/algod-type.ts#L17)

___

### close-rewards

• `Optional` **close-rewards**: `number`

Rewards in microalgos applied to the close remainder to account.

#### Defined in

[algod-type.ts:21](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/algod-type.ts#L21)

___

### closing-amount

• `Optional` **closing-amount**: `number`

Closing amount for the transaction.

#### Defined in

[algod-type.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/algod-type.ts#L25)

___

### confirmed-round

• `Optional` **confirmed-round**: `number`

The round where this transaction was confirmed, if present.

#### Defined in

[algod-type.ts:29](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/algod-type.ts#L29)

___

### global-state-delta

• `Optional` **global-state-delta**: `Record`<`string`, `EvalDelta`\>[]

(gd) Global state key/value changes for the application being executed by this
transaction.

#### Defined in

[algod-type.ts:34](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/algod-type.ts#L34)

___

### inner-txns

• `Optional` **inner-txns**: [`PendingTransactionResponse`](algod_type.PendingTransactionResponse.md)[]

Inner transactions produced by application execution.

#### Defined in

[algod-type.ts:38](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/algod-type.ts#L38)

___

### local-state-delta

• `Optional` **local-state-delta**: `Record`<`string`, `EvalDelta`\>[]

(ld) Local state key/value changes for the application being executed by this
transaction.

#### Defined in

[algod-type.ts:43](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/algod-type.ts#L43)

___

### logs

• `Optional` **logs**: `Uint8Array`[]

(lg) Logs for the application being executed by this transaction.

#### Defined in

[algod-type.ts:47](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/algod-type.ts#L47)

___

### pool-error

• **pool-error**: `string`

Indicates that the transaction was kicked out of this node's transaction pool (and specifies why that happened).
An empty string indicates the transaction wasn't kicked out of this node's txpool due to an error.

#### Defined in

[algod-type.ts:50](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/algod-type.ts#L50)

___

### receiver-rewards

• `Optional` **receiver-rewards**: `number`

Rewards in µALGOs applied to the receiver account.

#### Defined in

[algod-type.ts:54](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/algod-type.ts#L54)

___

### sender-rewards

• `Optional` **sender-rewards**: `number`

Rewards in µALGOs applied to the sender account.

#### Defined in

[algod-type.ts:58](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/algod-type.ts#L58)

___

### txn

• **txn**: `EncodedSignedTransaction`

The raw signed transaction.

#### Defined in

[algod-type.ts:62](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/algod-type.ts#L62)
