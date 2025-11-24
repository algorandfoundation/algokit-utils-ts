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

• **signer**: [`TransactionSignerAccount`](types_account.TransactionSignerAccount.md) \| `TransactionSigner`

The account to use to sign the transaction, either an account (with private key loaded) or a logic signature account

#### Defined in

[src/types/transaction.ts:122](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L122)

___

### transaction

• **transaction**: `Transaction`

The unsigned transaction to sign and send

#### Defined in

[src/types/transaction.ts:120](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L120)
