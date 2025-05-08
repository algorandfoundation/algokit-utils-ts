[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/transaction](../README.md) / TransactionToSign

# Interface: TransactionToSign

Defined in: [src/types/transaction.ts:111](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L111)

Defines an unsigned transaction that will appear in a group of transactions along with its signing information

## Properties

### signer

> **signer**: [`SendTransactionFrom`](../type-aliases/SendTransactionFrom.md)

Defined in: [src/types/transaction.ts:115](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L115)

The account to use to sign the transaction, either an account (with private key loaded) or a logic signature account

***

### transaction

> **transaction**: `Transaction`

Defined in: [src/types/transaction.ts:113](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L113)

The unsigned transaction to sign and send
