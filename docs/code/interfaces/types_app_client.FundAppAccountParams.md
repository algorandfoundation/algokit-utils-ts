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

[src/types/app-client.ts:254](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L254)

___

### note

• `Optional` **note**: [`TransactionNote`](../modules/types_transaction.md#transactionnote)

The transaction note for the smart contract call

#### Defined in

[src/types/app-client.ts:258](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L258)

___

### sendParams

• `Optional` **sendParams**: [`SendTransactionParams`](types_transaction.SendTransactionParams.md)

Parameters to control transaction sending

#### Defined in

[src/types/app-client.ts:260](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L260)

___

### sender

• `Optional` **sender**: [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom)

The optional sender to send the transaction from, will use the application client's default sender by default if specified

#### Defined in

[src/types/app-client.ts:256](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L256)
