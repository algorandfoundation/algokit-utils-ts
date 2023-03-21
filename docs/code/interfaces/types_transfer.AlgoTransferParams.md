[@algorandfoundation/algokit-utils](../README.md) / [types/transfer](../modules/types_transfer.md) / AlgoTransferParams

# Interface: AlgoTransferParams

[types/transfer](../modules/types_transfer.md).AlgoTransferParams

The sending configuration for a transaction

## Hierarchy

- [`SendTransactionParams`](types_transaction.SendTransactionParams.md)

  ↳ **`AlgoTransferParams`**

## Table of contents

### Properties

- [amount](types_transfer.AlgoTransferParams.md#amount)
- [from](types_transfer.AlgoTransferParams.md#from)
- [maxFee](types_transfer.AlgoTransferParams.md#maxfee)
- [maxRoundsToWaitForConfirmation](types_transfer.AlgoTransferParams.md#maxroundstowaitforconfirmation)
- [note](types_transfer.AlgoTransferParams.md#note)
- [skipSending](types_transfer.AlgoTransferParams.md#skipsending)
- [skipWaiting](types_transfer.AlgoTransferParams.md#skipwaiting)
- [suppressLog](types_transfer.AlgoTransferParams.md#suppresslog)
- [to](types_transfer.AlgoTransferParams.md#to)
- [transactionParams](types_transfer.AlgoTransferParams.md#transactionparams)

## Properties

### amount

• **amount**: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

The amount to send

#### Defined in

[types/transfer.ts:11](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transfer.ts#L11)

___

### from

• **from**: [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom)

The account (with private key loaded) that will send the µALGOs

#### Defined in

[types/transfer.ts:7](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transfer.ts#L7)

___

### maxFee

• `Optional` **maxFee**: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

The maximum fee that you are happy to pay (default: unbounded) - if this is set it's possible the transaction could get rejected during network congestion

#### Inherited from

[SendTransactionParams](types_transaction.SendTransactionParams.md).[maxFee](types_transaction.SendTransactionParams.md#maxfee)

#### Defined in

[types/transaction.ts:32](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L32)

___

### maxRoundsToWaitForConfirmation

• `Optional` **maxRoundsToWaitForConfirmation**: `number`

The maximum number of rounds to wait for confirmation, only applies if `skipWaiting` is `undefined` or `false`, default: wait up to 5 rounds

#### Inherited from

[SendTransactionParams](types_transaction.SendTransactionParams.md).[maxRoundsToWaitForConfirmation](types_transaction.SendTransactionParams.md#maxroundstowaitforconfirmation)

#### Defined in

[types/transaction.ts:34](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L34)

___

### note

• `Optional` **note**: [`TransactionNote`](../modules/types_transaction.md#transactionnote)

The (optional) transaction note

#### Defined in

[types/transfer.ts:15](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transfer.ts#L15)

___

### skipSending

• `Optional` **skipSending**: `boolean`

Whether to skip signing and sending the transaction to the chain (default: transaction signed and sent to chain)
  (and instead just return the raw transaction, e.g. so you can add it to a group of transactions)

#### Inherited from

[SendTransactionParams](types_transaction.SendTransactionParams.md).[skipSending](types_transaction.SendTransactionParams.md#skipsending)

#### Defined in

[types/transaction.ts:26](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L26)

___

### skipWaiting

• `Optional` **skipWaiting**: `boolean`

Whether to skip waiting for the submitted transaction (only relevant if `skipSending` is `false` or unset)

#### Inherited from

[SendTransactionParams](types_transaction.SendTransactionParams.md).[skipWaiting](types_transaction.SendTransactionParams.md#skipwaiting)

#### Defined in

[types/transaction.ts:28](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L28)

___

### suppressLog

• `Optional` **suppressLog**: `boolean`

Whether to suppress log messages from transaction send, default: do not suppress

#### Inherited from

[SendTransactionParams](types_transaction.SendTransactionParams.md).[suppressLog](types_transaction.SendTransactionParams.md#suppresslog)

#### Defined in

[types/transaction.ts:30](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L30)

___

### to

• **to**: `string`

The account address that will receive the ALGOs

#### Defined in

[types/transfer.ts:9](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transfer.ts#L9)

___

### transactionParams

• `Optional` **transactionParams**: `SuggestedParams`

Optional transaction parameters

#### Defined in

[types/transfer.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transfer.ts#L13)
