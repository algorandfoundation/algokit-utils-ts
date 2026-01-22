[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-client](../README.md) / FundAppAccountParams

# Interface: FundAppAccountParams

Defined in: [src/types/app-client.ts:235](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L235)

Parameters for funding an app account

## Properties

### amount

> **amount**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Defined in: [src/types/app-client.ts:236](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L236)

***

### note?

> `optional` **note**: [`TransactionNote`](../../transaction/type-aliases/TransactionNote.md)

Defined in: [src/types/app-client.ts:240](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L240)

The transaction note for the smart contract call

***

### sender?

> `optional` **sender**: [`AddressWithTransactionSigner`](../../../Subpaths/transact/interfaces/AddressWithTransactionSigner.md)

Defined in: [src/types/app-client.ts:238](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L238)

The optional sender to send the transaction from, will use the application client's default sender by default if specified

***

### sendParams?

> `optional` **sendParams**: [`SendTransactionParams`](../../transaction/interfaces/SendTransactionParams.md)

Defined in: [src/types/app-client.ts:242](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L242)

Parameters to control transaction sending
