[@algorandfoundation/algokit-utils](../README.md) / [index](../modules/index.md) / TransactionGroupToSend

# Interface: TransactionGroupToSend

[index](../modules/index.md).TransactionGroupToSend

A group of transactions to send together as an group
https://dev.algorand.co/concepts/transactions/atomic-txn-groups/

## Table of contents

### Properties

- [sendParams](index.TransactionGroupToSend.md#sendparams)
- [signer](index.TransactionGroupToSend.md#signer)
- [transactions](index.TransactionGroupToSend.md#transactions)

## Properties

### sendParams

• `Optional` **sendParams**: `Omit`\<[`SendTransactionParams`](index.SendTransactionParams.md), ``"fee"`` \| ``"maxFee"`` \| ``"skipSending"`` \| ``"atc"``\>

Any parameters to control the semantics of the send to the network

#### Defined in

[src/transaction/types.ts:113](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L113)

___

### signer

• `Optional` **signer**: `SendingAddress`

Optional signer to pass in, required if at least one transaction provided is just the transaction, ignored otherwise

#### Defined in

[src/transaction/types.ts:120](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L120)

___

### transactions

• **transactions**: (`Transaction` \| [`TransactionToSign`](index.TransactionToSign.md) \| `Promise`\<[`SendTransactionResult`](index.SendTransactionResult.md)\>)[]

The list of transactions to send, which can either be a raw transaction (in which case `signer` is required),
  the async result of an AlgoKit utils method that returns a `SendTransactionResult` (saves unwrapping the promise, be sure to pass `skipSending: true`, `signer` is also required)
  or the transaction with its signer (`signer` is ignored)

#### Defined in

[src/transaction/types.ts:118](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L118)
