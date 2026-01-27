[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [algokit-utils](../README.md) / TransactionGroupToSend

# Interface: TransactionGroupToSend

Defined in: [src/transaction/types.ts:111](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L111)

A group of transactions to send together as an group
https://dev.algorand.co/concepts/transactions/atomic-txn-groups/

## Properties

### sendParams?

> `optional` **sendParams**: `Omit`\<[`SendTransactionParams`](SendTransactionParams.md), `"fee"` \| `"maxFee"` \| `"skipSending"` \| `"atc"`\>

Defined in: [src/transaction/types.ts:113](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L113)

Any parameters to control the semantics of the send to the network

***

### signer?

> `optional` **signer**: [`SendingAddress`](../../Subpaths/transact/type-aliases/SendingAddress.md)

Defined in: [src/transaction/types.ts:120](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L120)

Optional signer to pass in, required if at least one transaction provided is just the transaction, ignored otherwise

***

### transactions

> **transactions**: ([`Transaction`](../../Subpaths/transact/classes/Transaction.md) \| [`TransactionToSign`](TransactionToSign.md) \| `Promise`\<[`SendTransactionResult`](SendTransactionResult.md)\>)[]

Defined in: [src/transaction/types.ts:118](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L118)

The list of transactions to send, which can either be a raw transaction (in which case `signer` is required),
  the async result of an AlgoKit utils method that returns a `SendTransactionResult` (saves unwrapping the promise, be sure to pass `skipSending: true`, `signer` is also required)
  or the transaction with its signer (`signer` is ignored)
