[algotstest](../README.md) / [app](../modules/app.md) / AppCallParams

# Interface: AppCallParams

[app](../modules/app.md).AppCallParams

The sending configuration for a transaction

## Hierarchy

- [`SendTransactionParams`](transaction.SendTransactionParams.md)

  ↳ **`AppCallParams`**

## Table of contents

### Properties

- [appIndex](app.AppCallParams.md#appindex)
- [args](app.AppCallParams.md#args)
- [callType](app.AppCallParams.md#calltype)
- [from](app.AppCallParams.md#from)
- [maxFee](app.AppCallParams.md#maxfee)
- [maxRoundsToWaitForConfirmation](app.AppCallParams.md#maxroundstowaitforconfirmation)
- [note](app.AppCallParams.md#note)
- [skipSending](app.AppCallParams.md#skipsending)
- [skipWaiting](app.AppCallParams.md#skipwaiting)
- [suppressLog](app.AppCallParams.md#suppresslog)
- [transactionParams](app.AppCallParams.md#transactionparams)

## Properties

### appIndex

• **appIndex**: `number`

The index of the app to call

#### Defined in

[app.ts:86](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/app.ts#L86)

___

### args

• `Optional` **args**: [`AppCallArgs`](app.AppCallArgs.md)

The arguments passed in to the app call

#### Defined in

[app.ts:96](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/app.ts#L96)

___

### callType

• **callType**: ``"optin"`` \| ``"closeout"`` \| ``"clearstate"`` \| ``"delete"`` \| ``"normal"``

The type of call, everything except create (@see {createApp} ) and update (@see {updateApp} )

#### Defined in

[app.ts:88](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/app.ts#L88)

___

### from

• **from**: [`SendTransactionFrom`](../modules/transaction.md#sendtransactionfrom)

The account to make the call from

#### Defined in

[app.ts:90](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/app.ts#L90)

___

### maxFee

• `Optional` **maxFee**: [`AlgoAmount`](../classes/algo_amount.AlgoAmount.md)

The maximum fee that you are happy to pay (default: unbounded) - if this is set it's possible the transaction could get rejected during network congestion

#### Inherited from

[SendTransactionParams](transaction.SendTransactionParams.md).[maxFee](transaction.SendTransactionParams.md#maxfee)

#### Defined in

[transaction.ts:134](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/transaction.ts#L134)

___

### maxRoundsToWaitForConfirmation

• `Optional` **maxRoundsToWaitForConfirmation**: `number`

The maximum number of rounds to wait for confirmation, only applies if `skipWaiting` is `undefined` or `false`, default: wait up to 5 rounds

#### Inherited from

[SendTransactionParams](transaction.SendTransactionParams.md).[maxRoundsToWaitForConfirmation](transaction.SendTransactionParams.md#maxroundstowaitforconfirmation)

#### Defined in

[transaction.ts:136](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/transaction.ts#L136)

___

### note

• `Optional` **note**: [`TransactionNote`](../modules/transaction.md#transactionnote)

The (optional) transaction note

#### Defined in

[app.ts:94](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/app.ts#L94)

___

### skipSending

• `Optional` **skipSending**: `boolean`

Whether to skip signing and sending the transaction to the chain (default: transaction signed and sent to chain)
  (and instead just return the raw transaction, e.g. so you can add it to a group of transactions)

#### Inherited from

[SendTransactionParams](transaction.SendTransactionParams.md).[skipSending](transaction.SendTransactionParams.md#skipsending)

#### Defined in

[transaction.ts:128](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/transaction.ts#L128)

___

### skipWaiting

• `Optional` **skipWaiting**: `boolean`

Whether to skip waiting for the submitted transaction (only relevant if `skipSending` is `false` or unset)

#### Inherited from

[SendTransactionParams](transaction.SendTransactionParams.md).[skipWaiting](transaction.SendTransactionParams.md#skipwaiting)

#### Defined in

[transaction.ts:130](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/transaction.ts#L130)

___

### suppressLog

• `Optional` **suppressLog**: `boolean`

Whether to suppress log messages from transaction send, default: do not suppress

#### Inherited from

[SendTransactionParams](transaction.SendTransactionParams.md).[suppressLog](transaction.SendTransactionParams.md#suppresslog)

#### Defined in

[transaction.ts:132](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/transaction.ts#L132)

___

### transactionParams

• `Optional` **transactionParams**: `SuggestedParams`

Optional transaction parameters

#### Defined in

[app.ts:92](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/app.ts#L92)
