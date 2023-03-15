[@algorandfoundation/algokit-utils](../README.md) / [transaction](../modules/transaction.md) / TransactionToSign

# Interface: TransactionToSign

[transaction](../modules/transaction.md).TransactionToSign

Defines an unsigned transaction that will appear in a group of transactions along with its signing information

## Table of contents

### Properties

- [signer](transaction.TransactionToSign.md#signer)
- [transaction](transaction.TransactionToSign.md#transaction)

## Properties

### signer

• **signer**: [`SendTransactionFrom`](../modules/transaction.md#sendtransactionfrom)

The account to use to sign the transaction, either an account (with private key loaded) or a logic signature account

#### Defined in

[transaction.ts:218](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/transaction.ts#L218)

___

### transaction

• **transaction**: `Transaction`

The unsigned transaction to sign and send

#### Defined in

[transaction.ts:216](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/transaction.ts#L216)
