[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/composer](../README.md) / PaymentParams

# Type Alias: PaymentParams

> **PaymentParams** = [`CommonTransactionParams`](CommonTransactionParams.md) & `object`

Defined in: [src/types/composer.ts:86](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L86)

Parameters to define a payment transaction.

## Type declaration

### amount

> **amount**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Amount to send

### closeRemainderTo?

> `optional` **closeRemainderTo**: `string` \| `Address`

If given, close the sender account and send the remaining balance to this address

*Warning:* Be careful with this parameter as it can lead to loss of funds if not used correctly.

### receiver

> **receiver**: `string` \| `Address`

The address of the account that will receive the Algo
