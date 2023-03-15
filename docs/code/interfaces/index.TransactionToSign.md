[@algorandfoundation/algokit-utils](../README.md) / [index](../modules/index.md) / TransactionToSign

# Interface: TransactionToSign

[index](../modules/index.md).TransactionToSign

Defines an unsigned transaction that will appear in a group of transactions along with its signing information

## Table of contents

### Properties

- [signer](index.TransactionToSign.md#signer)
- [transaction](index.TransactionToSign.md#transaction)

## Properties

### signer

• **signer**: [`SendTransactionFrom`](../modules/index.md#sendtransactionfrom)

The account to use to sign the transaction, either an account (with private key loaded) or a logic signature account

#### Defined in

[transaction.ts:218](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L218)

___

### transaction

• **transaction**: `Transaction`

The unsigned transaction to sign and send

#### Defined in

[transaction.ts:216](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L216)
