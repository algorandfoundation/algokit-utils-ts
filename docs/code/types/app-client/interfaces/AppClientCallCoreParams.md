[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-client](../README.md) / AppClientCallCoreParams

# Interface: AppClientCallCoreParams

Defined in: [src/types/app-client.ts:208](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L208)

Common (core) parameters to construct a ApplicationClient contract call

## Properties

### note?

> `optional` **note**: [`TransactionNote`](../../transaction/type-aliases/TransactionNote.md)

Defined in: [src/types/app-client.ts:212](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L212)

The transaction note for the smart contract call

***

### sender?

> `optional` **sender**: [`SendTransactionFrom`](../../transaction/type-aliases/SendTransactionFrom.md)

Defined in: [src/types/app-client.ts:210](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L210)

The optional sender to send the transaction from, will use the application client's default sender by default if specified

***

### sendParams?

> `optional` **sendParams**: [`SendTransactionParams`](../../transaction/interfaces/SendTransactionParams.md)

Defined in: [src/types/app-client.ts:214](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L214)

Parameters to control transaction sending
