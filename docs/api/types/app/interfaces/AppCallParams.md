[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app](../README.md) / AppCallParams

# Interface: AppCallParams

Defined in: [src/types/app.ts:97](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L97)

Parameters representing a call to an app.

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extends

- [`SendTransactionParams`](../../transaction/interfaces/SendTransactionParams.md)

## Properties

### appId

> **appId**: `number` \| `bigint`

Defined in: [src/types/app.ts:99](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L99)

The id of the app to call

***

### args?

> `optional` **args**: [`AppCallArgs`](../type-aliases/AppCallArgs.md)

Defined in: [src/types/app.ts:109](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L109)

The arguments passed in to the app call

***

### callType

> **callType**: [`NoOp`](../../../Subpaths/transact/enumerations/OnApplicationComplete.md#noop) \| [`OptIn`](../../../Subpaths/transact/enumerations/OnApplicationComplete.md#optin) \| [`CloseOut`](../../../Subpaths/transact/enumerations/OnApplicationComplete.md#closeout) \| [`ClearState`](../../../Subpaths/transact/enumerations/OnApplicationComplete.md#clearstate) \| [`DeleteApplication`](../../../Subpaths/transact/enumerations/OnApplicationComplete.md#deleteapplication)

Defined in: [src/types/app.ts:101](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L101)

The type of call, everything except create (see `createApp`) and update (see `updateApp`)

***

### fee?

> `optional` **fee**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Defined in: [src/types/transaction.ts:36](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L36)

The flat fee you want to pay, useful for covering extra fees in a transaction group or app call

#### Inherited from

[`SendTransactionParams`](../../transaction/interfaces/SendTransactionParams.md).[`fee`](../../transaction/interfaces/SendTransactionParams.md#fee)

***

### from

> **from**: [`AddressWithTransactionSigner`](../../../Subpaths/transact/interfaces/AddressWithTransactionSigner.md)

Defined in: [src/types/app.ts:103](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L103)

The account to make the call from

***

### maxFee?

> `optional` **maxFee**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Defined in: [src/types/transaction.ts:38](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L38)

The maximum fee that you are happy to pay (default: unbounded) - if this is set it's possible the transaction could get rejected during network congestion

#### Inherited from

[`SendTransactionParams`](../../transaction/interfaces/SendTransactionParams.md).[`maxFee`](../../transaction/interfaces/SendTransactionParams.md#maxfee)

***

### maxRoundsToWaitForConfirmation?

> `optional` **maxRoundsToWaitForConfirmation**: `number`

Defined in: [src/types/transaction.ts:40](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L40)

The maximum number of rounds to wait for confirmation, only applies if `skipWaiting` is `undefined` or `false`, default: wait up to 5 rounds

#### Inherited from

[`SendTransactionParams`](../../transaction/interfaces/SendTransactionParams.md).[`maxRoundsToWaitForConfirmation`](../../transaction/interfaces/SendTransactionParams.md#maxroundstowaitforconfirmation)

***

### note?

> `optional` **note**: [`TransactionNote`](../../transaction/type-aliases/TransactionNote.md)

Defined in: [src/types/app.ts:107](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L107)

The (optional) transaction note

***

### populateAppCallResources?

> `optional` **populateAppCallResources**: `boolean`

Defined in: [src/types/transaction.ts:42](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L42)

Whether to use simulate to automatically populate app call resources in the txn objects. Defaults to true when there are app calls in the group.

#### Inherited from

[`SendTransactionParams`](../../transaction/interfaces/SendTransactionParams.md).[`populateAppCallResources`](../../transaction/interfaces/SendTransactionParams.md#populateappcallresources)

***

### skipSending?

> `optional` **skipSending**: `boolean`

Defined in: [src/types/transaction.ts:28](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L28)

Whether to skip signing and sending the transaction to the chain (default: transaction signed and sent to chain, unless `atc` specified)
and instead just return the raw transaction, e.g. so you can add it to a group of transactions

#### Inherited from

[`SendTransactionParams`](../../transaction/interfaces/SendTransactionParams.md).[`skipSending`](../../transaction/interfaces/SendTransactionParams.md#skipsending)

***

### skipWaiting?

> `optional` **skipWaiting**: `boolean`

Defined in: [src/types/transaction.ts:30](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L30)

Whether to skip waiting for the submitted transaction (only relevant if `skipSending` is `false` or unset)

#### Inherited from

[`SendTransactionParams`](../../transaction/interfaces/SendTransactionParams.md).[`skipWaiting`](../../transaction/interfaces/SendTransactionParams.md#skipwaiting)

***

### suppressLog?

> `optional` **suppressLog**: `boolean`

Defined in: [src/types/transaction.ts:34](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L34)

Whether to suppress log messages from transaction send, default: do not suppress

#### Inherited from

[`SendTransactionParams`](../../transaction/interfaces/SendTransactionParams.md).[`suppressLog`](../../transaction/interfaces/SendTransactionParams.md#suppresslog)

***

### transactionComposer?

> `optional` **transactionComposer**: [`TransactionComposer`](../../composer/classes/TransactionComposer.md)

Defined in: [src/types/transaction.ts:32](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L32)

An optional `TransactionComposer` to add the transaction to, if specified then `skipSending: undefined` has the same effect as `skipSending: true`

#### Inherited from

[`SendTransactionParams`](../../transaction/interfaces/SendTransactionParams.md).[`transactionComposer`](../../transaction/interfaces/SendTransactionParams.md#transactioncomposer)

***

### transactionParams?

> `optional` **transactionParams**: `object`

Defined in: [src/types/app.ts:105](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L105)

Optional transaction parameters

#### consensusVersion

> **consensusVersion**: `string`

ConsensusVersion indicates the consensus protocol version
as of LastRound.

#### fee

> **fee**: `bigint`

Fee is the suggested transaction fee
Fee is in units of micro-Algos per byte.
Fee may fall to zero but transactions must still have a fee of
at least MinTxnFee for the current network protocol.

#### firstValid

> **firstValid**: `bigint`

#### flatFee

> **flatFee**: `boolean`

#### genesisHash

> **genesisHash**: `Uint8Array`

GenesisHash is the hash of the genesis block.

#### genesisId

> **genesisId**: `string`

GenesisID is an ID listed in the genesis block.

#### lastValid

> **lastValid**: `bigint`

#### minFee

> **minFee**: `bigint`

The minimum transaction fee (not per byte) required for the
txn to validate for the current network protocol.
