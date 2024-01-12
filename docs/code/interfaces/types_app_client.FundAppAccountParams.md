[@algorandfoundation/algokit-utils](../README.md) / [types/app-client](../modules/types_app_client.md) / FundAppAccountParams

# Interface: FundAppAccountParams

[types/app-client](../modules/types_app_client.md).FundAppAccountParams

Parameters for funding an app account

## Table of contents

### Properties

- [amount](types_app_client.FundAppAccountParams.md#amount)
- [note](types_app_client.FundAppAccountParams.md#note)
- [sendParams](types_app_client.FundAppAccountParams.md#sendparams)
- [sender](types_app_client.FundAppAccountParams.md#sender)

## Properties

### amount

• **amount**: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:208](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L208)
=======
[src/types/app-client.ts:211](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L211)
>>>>>>> origin/main

___

### note

• `Optional` **note**: [`TransactionNote`](../modules/types_transaction.md#transactionnote)

The transaction note for the smart contract call

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:212](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L212)
=======
[src/types/app-client.ts:215](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L215)
>>>>>>> origin/main

___

### sendParams

• `Optional` **sendParams**: [`SendTransactionParams`](types_transaction.SendTransactionParams.md)

Parameters to control transaction sending

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:214](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L214)
=======
[src/types/app-client.ts:217](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L217)
>>>>>>> origin/main

___

### sender

• `Optional` **sender**: [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom)

The optional sender to send the transaction from, will use the application client's default sender by default if specified

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:210](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L210)
=======
[src/types/app-client.ts:213](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L213)
>>>>>>> origin/main
