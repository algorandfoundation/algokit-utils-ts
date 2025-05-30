[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app](../README.md) / CreateAppParams

# Interface: ~~CreateAppParams~~

Defined in: [src/types/app.ts:150](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L150)

## Deprecated

Use `TransactionComposer` to construct create app transactions instead.

Parameters that are passed in when creating an app.

## Extends

- `CreateOrUpdateAppParams`

## Properties

### ~~approvalProgram~~

> **approvalProgram**: `string` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [src/types/app.ts:135](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L135)

The approval program as raw teal (string) or compiled teal, base 64 encoded as a byte array (Uint8Array)

#### Inherited from

`CreateOrUpdateAppParams.approvalProgram`

***

### ~~args?~~

> `optional` **args**: [`AppCallArgs`](../type-aliases/AppCallArgs.md)

Defined in: [src/types/app.ts:143](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L143)

The arguments passed in to the app call

#### Inherited from

`CreateOrUpdateAppParams.args`

***

### ~~atc?~~

> `optional` **atc**: `AtomicTransactionComposer`

Defined in: [src/types/transaction.ts:36](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L36)

An optional `AtomicTransactionComposer` to add the transaction to, if specified then `skipSending: undefined` has the same effect as `skipSending: true`

#### Inherited from

`CreateOrUpdateAppParams.atc`

***

### ~~clearStateProgram~~

> **clearStateProgram**: `string` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [src/types/app.ts:137](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L137)

The clear state program as raw teal (string) or compiled teal, base 64 encoded as a byte array (Uint8Array)

#### Inherited from

`CreateOrUpdateAppParams.clearStateProgram`

***

### ~~fee?~~

> `optional` **fee**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Defined in: [src/types/transaction.ts:40](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L40)

The flat fee you want to pay, useful for covering extra fees in a transaction group or app call

#### Inherited from

`CreateOrUpdateAppParams.fee`

***

### ~~from~~

> **from**: [`SendTransactionFrom`](../../transaction/type-aliases/SendTransactionFrom.md)

Defined in: [src/types/app.ts:133](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L133)

The account (with private key loaded) that will send the transaction

#### Inherited from

`CreateOrUpdateAppParams.from`

***

### ~~maxFee?~~

> `optional` **maxFee**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Defined in: [src/types/transaction.ts:42](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L42)

The maximum fee that you are happy to pay (default: unbounded) - if this is set it's possible the transaction could get rejected during network congestion

#### Inherited from

`CreateOrUpdateAppParams.maxFee`

***

### ~~maxRoundsToWaitForConfirmation?~~

> `optional` **maxRoundsToWaitForConfirmation**: `number`

Defined in: [src/types/transaction.ts:44](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L44)

The maximum number of rounds to wait for confirmation, only applies if `skipWaiting` is `undefined` or `false`, default: wait up to 5 rounds

#### Inherited from

`CreateOrUpdateAppParams.maxRoundsToWaitForConfirmation`

***

### ~~note?~~

> `optional` **note**: [`TransactionNote`](../../transaction/type-aliases/TransactionNote.md)

Defined in: [src/types/app.ts:141](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L141)

The (optional) transaction note

#### Inherited from

`CreateOrUpdateAppParams.note`

***

### ~~onCompleteAction?~~

> `optional` **onCompleteAction**: `"no_op"` \| `"opt_in"` \| `"close_out"` \| `"update_application"` \| `"delete_application"` \| `NoOpOC` \| `OptInOC` \| `CloseOutOC` \| `UpdateApplicationOC` \| `DeleteApplicationOC`

Defined in: [src/types/app.ts:154](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L154)

Override the on-completion action for the create call; defaults to NoOp

***

### ~~populateAppCallResources?~~

> `optional` **populateAppCallResources**: `boolean`

Defined in: [src/types/transaction.ts:46](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L46)

Whether to use simulate to automatically populate app call resources in the txn objects. Defaults to true when there are app calls in the group.

#### Inherited from

`CreateOrUpdateAppParams.populateAppCallResources`

***

### ~~schema~~

> **schema**: [`AppStorageSchema`](AppStorageSchema.md)

Defined in: [src/types/app.ts:152](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L152)

The storage schema to request for the created app

***

### ~~skipSending?~~

> `optional` **skipSending**: `boolean`

Defined in: [src/types/transaction.ts:32](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L32)

Whether to skip signing and sending the transaction to the chain (default: transaction signed and sent to chain, unless `atc` specified)
and instead just return the raw transaction, e.g. so you can add it to a group of transactions

#### Inherited from

`CreateOrUpdateAppParams.skipSending`

***

### ~~skipWaiting?~~

> `optional` **skipWaiting**: `boolean`

Defined in: [src/types/transaction.ts:34](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L34)

Whether to skip waiting for the submitted transaction (only relevant if `skipSending` is `false` or unset)

#### Inherited from

`CreateOrUpdateAppParams.skipWaiting`

***

### ~~suppressLog?~~

> `optional` **suppressLog**: `boolean`

Defined in: [src/types/transaction.ts:38](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L38)

Whether to suppress log messages from transaction send, default: do not suppress

#### Inherited from

`CreateOrUpdateAppParams.suppressLog`

***

### ~~transactionParams?~~

> `optional` **transactionParams**: `SuggestedParams`

Defined in: [src/types/app.ts:139](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L139)

Optional transaction parameters

#### Inherited from

`CreateOrUpdateAppParams.transactionParams`
