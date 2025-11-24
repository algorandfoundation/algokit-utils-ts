[@algorandfoundation/algokit-utils](../README.md) / [types/app-client](../modules/types_app_client.md) / AppClientCallCoreParams

# Interface: AppClientCallCoreParams

[types/app-client](../modules/types_app_client.md).AppClientCallCoreParams

Common (core) parameters to construct a ApplicationClient contract call

## Table of contents

### Properties

- [note](types_app_client.AppClientCallCoreParams.md#note)
- [sendParams](types_app_client.AppClientCallCoreParams.md#sendparams)
- [sender](types_app_client.AppClientCallCoreParams.md#sender)

## Properties

### note

• `Optional` **note**: [`TransactionNote`](../modules/types_transaction.md#transactionnote)

The transaction note for the smart contract call

#### Defined in

[src/types/app-client.ts:226](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L226)

___

### sendParams

• `Optional` **sendParams**: [`SendTransactionParams`](types_transaction.SendTransactionParams.md)

Parameters to control transaction sending

#### Defined in

[src/types/app-client.ts:228](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L228)

___

### sender

• `Optional` **sender**: `AddressWithSigner`

The optional sender to send the transaction from, will use the application client's default sender by default if specified

#### Defined in

[src/types/app-client.ts:224](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L224)
