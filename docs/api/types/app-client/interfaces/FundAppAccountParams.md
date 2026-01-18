[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-client](../README.md) / FundAppAccountParams

# Interface: FundAppAccountParams

Defined in: [src/types/app-client.ts:234](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-client.ts#L234)

Parameters for funding an app account

## Properties

### amount

> **amount**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Defined in: [src/types/app-client.ts:235](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-client.ts#L235)

***

### note?

> `optional` **note**: [`TransactionNote`](../../transaction/type-aliases/TransactionNote.md)

Defined in: [src/types/app-client.ts:239](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-client.ts#L239)

The transaction note for the smart contract call

***

### sender?

> `optional` **sender**: [`AddressWithTransactionSigner`](../../../Subpaths/transact/interfaces/AddressWithTransactionSigner.md)

Defined in: [src/types/app-client.ts:237](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-client.ts#L237)

The optional sender to send the transaction from, will use the application client's default sender by default if specified

***

### sendParams?

> `optional` **sendParams**: [`SendTransactionParams`](../../transaction/interfaces/SendTransactionParams.md)

Defined in: [src/types/app-client.ts:241](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-client.ts#L241)

Parameters to control transaction sending
