[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-client](../README.md) / AppClientCallCoreParams

# Interface: AppClientCallCoreParams

Defined in: [src/types/app-client.ts:193](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L193)

Common (core) parameters to construct a ApplicationClient contract call

## Properties

### note?

> `optional` **note**: [`TransactionNote`](../../transaction/type-aliases/TransactionNote.md)

Defined in: [src/types/app-client.ts:197](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L197)

The transaction note for the smart contract call

***

### sender?

> `optional` **sender**: [`AddressWithTransactionSigner`](../../../Subpaths/transact/interfaces/AddressWithTransactionSigner.md)

Defined in: [src/types/app-client.ts:195](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L195)

The optional sender to send the transaction from, will use the application client's default sender by default if specified

***

### sendParams?

> `optional` **sendParams**: [`SendTransactionParams`](../../transaction/interfaces/SendTransactionParams.md)

Defined in: [src/types/app-client.ts:199](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L199)

Parameters to control transaction sending
