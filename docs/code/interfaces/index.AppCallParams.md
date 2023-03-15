[@algorandfoundation/algokit-utils](../README.md) / [index](../modules/index.md) / AppCallParams

# Interface: AppCallParams

[index](../modules/index.md).AppCallParams

The sending configuration for a transaction

## Hierarchy

- [`SendTransactionParams`](index.SendTransactionParams.md)

  ↳ **`AppCallParams`**

## Table of contents

### Properties

- [appIndex](index.AppCallParams.md#appindex)
- [args](index.AppCallParams.md#args)
- [callType](index.AppCallParams.md#calltype)
- [from](index.AppCallParams.md#from)
- [maxFee](index.AppCallParams.md#maxfee)
- [maxRoundsToWaitForConfirmation](index.AppCallParams.md#maxroundstowaitforconfirmation)
- [note](index.AppCallParams.md#note)
- [skipSending](index.AppCallParams.md#skipsending)
- [skipWaiting](index.AppCallParams.md#skipwaiting)
- [suppressLog](index.AppCallParams.md#suppresslog)
- [transactionParams](index.AppCallParams.md#transactionparams)

## Properties

### appIndex

• **appIndex**: `number`

The index of the app to call

#### Defined in

[app.ts:123](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L123)

___

### args

• `Optional` **args**: [`AppCallArgs`](../modules/index.md#appcallargs)

The arguments passed in to the app call

#### Defined in

[app.ts:133](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L133)

___

### callType

• **callType**: ``"optin"`` \| ``"closeout"`` \| ``"clearstate"`` \| ``"delete"`` \| ``"normal"``

The type of call, everything except create (@see {createApp} ) and update (@see {updateApp} )

#### Defined in

[app.ts:125](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L125)

___

### from

• **from**: [`SendTransactionFrom`](../modules/index.md#sendtransactionfrom)

The account to make the call from

#### Defined in

[app.ts:127](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L127)

___

### maxFee

• `Optional` **maxFee**: [`AlgoAmount`](../classes/index.AlgoAmount.md)

The maximum fee that you are happy to pay (default: unbounded) - if this is set it's possible the transaction could get rejected during network congestion

#### Inherited from

[SendTransactionParams](index.SendTransactionParams.md).[maxFee](index.SendTransactionParams.md#maxfee)

#### Defined in

[transaction.ts:141](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L141)

___

### maxRoundsToWaitForConfirmation

• `Optional` **maxRoundsToWaitForConfirmation**: `number`

The maximum number of rounds to wait for confirmation, only applies if `skipWaiting` is `undefined` or `false`, default: wait up to 5 rounds

#### Inherited from

[SendTransactionParams](index.SendTransactionParams.md).[maxRoundsToWaitForConfirmation](index.SendTransactionParams.md#maxroundstowaitforconfirmation)

#### Defined in

[transaction.ts:143](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L143)

___

### note

• `Optional` **note**: [`TransactionNote`](../modules/index.md#transactionnote)

The (optional) transaction note

#### Defined in

[app.ts:131](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L131)

___

### skipSending

• `Optional` **skipSending**: `boolean`

Whether to skip signing and sending the transaction to the chain (default: transaction signed and sent to chain)
  (and instead just return the raw transaction, e.g. so you can add it to a group of transactions)

#### Inherited from

[SendTransactionParams](index.SendTransactionParams.md).[skipSending](index.SendTransactionParams.md#skipsending)

#### Defined in

[transaction.ts:135](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L135)

___

### skipWaiting

• `Optional` **skipWaiting**: `boolean`

Whether to skip waiting for the submitted transaction (only relevant if `skipSending` is `false` or unset)

#### Inherited from

[SendTransactionParams](index.SendTransactionParams.md).[skipWaiting](index.SendTransactionParams.md#skipwaiting)

#### Defined in

[transaction.ts:137](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L137)

___

### suppressLog

• `Optional` **suppressLog**: `boolean`

Whether to suppress log messages from transaction send, default: do not suppress

#### Inherited from

[SendTransactionParams](index.SendTransactionParams.md).[suppressLog](index.SendTransactionParams.md#suppresslog)

#### Defined in

[transaction.ts:139](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L139)

___

### transactionParams

• `Optional` **transactionParams**: `SuggestedParams`

Optional transaction parameters

#### Defined in

[app.ts:129](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L129)
