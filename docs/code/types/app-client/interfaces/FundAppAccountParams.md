[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-client](../README.md) / FundAppAccountParams

# Interface: FundAppAccountParams

Defined in: [src/types/app-client.ts:250](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L250)

Parameters for funding an app account

## Properties

### amount

> **amount**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Defined in: [src/types/app-client.ts:251](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L251)

***

### note?

> `optional` **note**: [`TransactionNote`](../../transaction/type-aliases/TransactionNote.md)

Defined in: [src/types/app-client.ts:255](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L255)

The transaction note for the smart contract call

***

### sender?

> `optional` **sender**: [`SendTransactionFrom`](../../transaction/type-aliases/SendTransactionFrom.md)

Defined in: [src/types/app-client.ts:253](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L253)

The optional sender to send the transaction from, will use the application client's default sender by default if specified

***

### sendParams?

> `optional` **sendParams**: [`SendTransactionParams`](../../transaction/interfaces/SendTransactionParams.md)

Defined in: [src/types/app-client.ts:257](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L257)

Parameters to control transaction sending
