[@algorandfoundation/algokit-utils](../README.md) / [types/algod](../modules/types_algod.md) / PendingTransactionResponse

# Interface: PendingTransactionResponse

[types/algod](../modules/types_algod.md).PendingTransactionResponse

The response from the pending transaction API

**`See`**

https://developer.algorand.org/docs/rest-apis/algod/v2/#get-v2transactionspendingtxid

## Table of contents

### Properties

- [application-index](types_algod.PendingTransactionResponse.md#application-index)
- [asset-closing-amount](types_algod.PendingTransactionResponse.md#asset-closing-amount)
- [asset-index](types_algod.PendingTransactionResponse.md#asset-index)
- [close-rewards](types_algod.PendingTransactionResponse.md#close-rewards)
- [closing-amount](types_algod.PendingTransactionResponse.md#closing-amount)
- [confirmed-round](types_algod.PendingTransactionResponse.md#confirmed-round)
- [global-state-delta](types_algod.PendingTransactionResponse.md#global-state-delta)
- [inner-txns](types_algod.PendingTransactionResponse.md#inner-txns)
- [local-state-delta](types_algod.PendingTransactionResponse.md#local-state-delta)
- [logs](types_algod.PendingTransactionResponse.md#logs)
- [pool-error](types_algod.PendingTransactionResponse.md#pool-error)
- [receiver-rewards](types_algod.PendingTransactionResponse.md#receiver-rewards)
- [sender-rewards](types_algod.PendingTransactionResponse.md#sender-rewards)
- [txn](types_algod.PendingTransactionResponse.md#txn)

## Properties

### application-index

• `Optional` **application-index**: `number`

The application index if the transaction was found and it created an
application.

#### Defined in

[types/algod.ts:9](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algod.ts#L9)

___

### asset-closing-amount

• `Optional` **asset-closing-amount**: `number`

The number of the asset's unit that were transferred to the close-to address.

#### Defined in

[types/algod.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algod.ts#L13)

___

### asset-index

• `Optional` **asset-index**: `number`

The asset index if the transaction was found and it created an asset.

#### Defined in

[types/algod.ts:17](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algod.ts#L17)

___

### close-rewards

• `Optional` **close-rewards**: `number`

Rewards in microalgos applied to the close remainder to account.

#### Defined in

[types/algod.ts:21](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algod.ts#L21)

___

### closing-amount

• `Optional` **closing-amount**: `number`

Closing amount for the transaction.

#### Defined in

[types/algod.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algod.ts#L25)

___

### confirmed-round

• `Optional` **confirmed-round**: `number`

The round where this transaction was confirmed, if present.

#### Defined in

[types/algod.ts:29](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algod.ts#L29)

___

### global-state-delta

• `Optional` **global-state-delta**: `Record`<`string`, `EvalDelta`\>[]

(gd) Global state key/value changes for the application being executed by this
transaction.

#### Defined in

[types/algod.ts:34](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algod.ts#L34)

___

### inner-txns

• `Optional` **inner-txns**: [`PendingTransactionResponse`](types_algod.PendingTransactionResponse.md)[]

Inner transactions produced by application execution.

#### Defined in

[types/algod.ts:38](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algod.ts#L38)

___

### local-state-delta

• `Optional` **local-state-delta**: `Record`<`string`, `EvalDelta`\>[]

(ld) Local state key/value changes for the application being executed by this
transaction.

#### Defined in

[types/algod.ts:43](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algod.ts#L43)

___

### logs

• `Optional` **logs**: `Uint8Array`[]

(lg) Logs for the application being executed by this transaction.

#### Defined in

[types/algod.ts:47](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algod.ts#L47)

___

### pool-error

• **pool-error**: `string`

Indicates that the transaction was kicked out of this node's transaction pool (and specifies why that happened).
An empty string indicates the transaction wasn't kicked out of this node's txpool due to an error.

#### Defined in

[types/algod.ts:50](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algod.ts#L50)

___

### receiver-rewards

• `Optional` **receiver-rewards**: `number`

Rewards in µALGOs applied to the receiver account.

#### Defined in

[types/algod.ts:54](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algod.ts#L54)

___

### sender-rewards

• `Optional` **sender-rewards**: `number`

Rewards in µALGOs applied to the sender account.

#### Defined in

[types/algod.ts:58](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algod.ts#L58)

___

### txn

• **txn**: `EncodedSignedTransaction`

The raw signed transaction.

#### Defined in

[types/algod.ts:62](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algod.ts#L62)
