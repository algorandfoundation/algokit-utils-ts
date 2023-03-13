[algotstest](../README.md) / [transaction](../modules/transaction.md) / TransactionToSign

# Interface: TransactionToSign

[transaction](../modules/transaction.md).TransactionToSign

Defines an unsigned transaction that will appear in a group of transactions along with its signing information

## Table of contents

### Properties

- [signer](transaction.TransactionToSign.md#signer)
- [transaction](transaction.TransactionToSign.md#transaction)

## Properties

### signer

• **signer**: `default` \| [`SigningAccount`](../classes/transaction.SigningAccount.md) \| `LogicSigAccount`

The account to use to sign the transaction, either an account (with private key loaded) or a logic signature account

#### Defined in

[transaction.ts:207](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/transaction.ts#L207)

___

### transaction

• **transaction**: `Transaction`

The unsigned transaction to sign and send

#### Defined in

[transaction.ts:205](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/transaction.ts#L205)
