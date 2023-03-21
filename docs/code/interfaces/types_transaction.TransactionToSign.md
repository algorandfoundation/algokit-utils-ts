[@algorandfoundation/algokit-utils](../README.md) / [types/transaction](../modules/types_transaction.md) / TransactionToSign

# Interface: TransactionToSign

[types/transaction](../modules/types_transaction.md).TransactionToSign

Defines an unsigned transaction that will appear in a group of transactions along with its signing information

## Table of contents

### Properties

- [signer](types_transaction.TransactionToSign.md#signer)
- [transaction](types_transaction.TransactionToSign.md#transaction)

## Properties

### signer

• **signer**: [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom)

The account to use to sign the transaction, either an account (with private key loaded) or a logic signature account

#### Defined in

[types/transaction.ts:58](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L58)

___

### transaction

• **transaction**: `Transaction`

The unsigned transaction to sign and send

#### Defined in

[types/transaction.ts:56](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L56)
