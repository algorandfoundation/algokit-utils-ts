[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/composer](../README.md) / AppMethodCall

# Type Alias: AppMethodCall\<T\>

> **AppMethodCall**\<`T`\> = [`Expand`](../../expand/type-aliases/Expand.md)\<`Omit`\<`T`, `"args"`\>\> & `object`

Defined in: [src/types/composer.ts:439](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L439)

Parameters to define an ABI method call.

## Type declaration

### args?

> `optional` **args**: (`algosdk.ABIValue` \| `TransactionWithSigner` \| `Transaction` \| `Promise`\<`Transaction`\> \| `AppMethodCall`\<[`AppCreateParams`](AppCreateParams.md)\> \| `AppMethodCall`\<[`AppUpdateParams`](AppUpdateParams.md)\> \| `AppMethodCall`\<[`AppMethodCallParams`](AppMethodCallParams.md)\> \| `undefined`)[]

Arguments to the ABI method, either:
* An ABI value
* A transaction with explicit signer
* A transaction (where the signer will be automatically assigned)
* An unawaited transaction (e.g. from algorand.createTransaction.{transactionType}())
* Another method call (via method call params object)
* undefined (this represents a placeholder transaction argument that is fulfilled by another method call argument)

### method

> **method**: `algosdk.ABIMethod`

The ABI method to call

## Type Parameters

### T

`T`
