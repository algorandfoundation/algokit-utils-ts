[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/transaction](../README.md) / SendTransactionFrom

# Type Alias: SendTransactionFrom

> **SendTransactionFrom** = `Account` \| [`SigningAccount`](../../account/classes/SigningAccount.md) \| `LogicSigAccount` \| [`MultisigAccount`](../../account/classes/MultisigAccount.md) \| [`TransactionSignerAccount`](../../account/interfaces/TransactionSignerAccount.md)

Defined in: [src/types/transaction.ts:108](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L108)

Core account abstraction when signing/sending transactions

This type is used across the entire AlgoKit Utils library and allows you to pass through
many types of accounts, including:
* `Account` - The in-built `algosdk.Account` type for mnemonic accounts
* `SigningAccount` - An AlgoKit Utils class that wraps Account to provide support for rekeyed accounts
* `LogicSigAccount` - The in-built `algosdk.LogicSigAccount` type for logic signatures
* `MultisigAccount` - An AlgoKit Utils class that wraps a multisig account and provides mechanisms to get a multisig account
* `TransactionSignerAccount` - An AlgoKit Utils class that wraps the in-built `algosdk.TransactionSigner` along with the sender address
