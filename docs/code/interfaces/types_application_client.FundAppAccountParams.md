[@algorandfoundation/algokit-utils](../README.md) / [types/application-client](../modules/types_application_client.md) / FundAppAccountParams

# Interface: FundAppAccountParams

[types/application-client](../modules/types_application_client.md).FundAppAccountParams

Parameters for funding an app account

## Table of contents

### Properties

- [amount](types_application_client.FundAppAccountParams.md#amount)
- [note](types_application_client.FundAppAccountParams.md#note)
- [sendParams](types_application_client.FundAppAccountParams.md#sendparams)
- [sender](types_application_client.FundAppAccountParams.md#sender)

## Properties

### amount

• **amount**: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

#### Defined in

[src/types/application-client.ts:153](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L153)

___

### note

• `Optional` **note**: [`TransactionNote`](../modules/types_transaction.md#transactionnote)

The transaction note for the smart contract call

#### Defined in

[src/types/application-client.ts:157](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L157)

___

### sendParams

• `Optional` **sendParams**: [`SendTransactionParams`](types_transaction.SendTransactionParams.md)

Parameters to control transaction sending

#### Defined in

[src/types/application-client.ts:159](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L159)

___

### sender

• `Optional` **sender**: [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom)

The optional sender to send the transaction from, will use the application client's default sender by default if specified

#### Defined in

[src/types/application-client.ts:155](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L155)
