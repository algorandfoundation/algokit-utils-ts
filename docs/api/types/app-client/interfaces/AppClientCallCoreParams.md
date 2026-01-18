[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-client](../README.md) / AppClientCallCoreParams

# Interface: AppClientCallCoreParams

Defined in: [src/types/app-client.ts:192](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-client.ts#L192)

Common (core) parameters to construct a ApplicationClient contract call

## Properties

### note?

> `optional` **note**: [`TransactionNote`](../../transaction/type-aliases/TransactionNote.md)

Defined in: [src/types/app-client.ts:196](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-client.ts#L196)

The transaction note for the smart contract call

***

### sender?

> `optional` **sender**: [`AddressWithTransactionSigner`](../../../Subpaths/transact/interfaces/AddressWithTransactionSigner.md)

Defined in: [src/types/app-client.ts:194](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-client.ts#L194)

The optional sender to send the transaction from, will use the application client's default sender by default if specified

***

### sendParams?

> `optional` **sendParams**: [`SendTransactionParams`](../../transaction/interfaces/SendTransactionParams.md)

Defined in: [src/types/app-client.ts:198](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-client.ts#L198)

Parameters to control transaction sending
