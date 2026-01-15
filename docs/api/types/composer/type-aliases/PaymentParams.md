[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/composer](../README.md) / PaymentParams

# Type Alias: PaymentParams

> **PaymentParams** = [`CommonTransactionParams`](CommonTransactionParams.md) & `object`

Defined in: [src/transactions/payment.ts:8](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/payment.ts#L8)

Parameters to define a payment transaction.

## Type Declaration

### amount

> **amount**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Amount to send

### closeRemainderTo?

> `optional` **closeRemainderTo**: [`ReadableAddress`](../../../index/type-aliases/ReadableAddress.md)

If given, close the sender account and send the remaining balance to this address

*Warning:* Be careful with this parameter as it can lead to loss of funds if not used correctly.

### receiver

> **receiver**: [`ReadableAddress`](../../../index/type-aliases/ReadableAddress.md)

The address of the account that will receive the Algo
