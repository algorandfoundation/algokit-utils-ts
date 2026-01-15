[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app](../README.md) / ABIAppCallArg

# Type Alias: ABIAppCallArg

> **ABIAppCallArg** = [`ABIValue`](../../../Subpaths/abi/type-aliases/ABIValue.md) \| [`TransactionWithSigner`](../../../algokit-utils/interfaces/TransactionWithSigner.md) \| [`TransactionToSign`](../../transaction/interfaces/TransactionToSign.md) \| [`Transaction`](../../../Subpaths/transact/classes/Transaction.md) \| `Promise`\<[`SendTransactionResult`](../../transaction/interfaces/SendTransactionResult.md)\> \| [`SendTransactionResult`](../../transaction/interfaces/SendTransactionResult.md) \| `undefined`

Defined in: [src/types/app.ts:71](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L71)

An argument for an ABI method, either a primitive value, or a transaction with or without signer, or the unawaited async return value of an algokit method that returns a `SendTransactionResult`
