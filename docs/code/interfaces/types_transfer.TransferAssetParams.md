[@algorandfoundation/algokit-utils](../README.md) / [types/transfer](../modules/types_transfer.md) / TransferAssetParams

# Interface: TransferAssetParams

[types/transfer](../modules/types_transfer.md).TransferAssetParams

**`Deprecated`**

Parameters for `transferAsset` call.

## Hierarchy

- [`SendTransactionParams`](types_transaction.SendTransactionParams.md)

  ↳ **`TransferAssetParams`**

## Table of contents

### Properties

- [amount](types_transfer.TransferAssetParams.md#amount)
- [assetId](types_transfer.TransferAssetParams.md#assetid)
- [atc](types_transfer.TransferAssetParams.md#atc)
- [clawbackFrom](types_transfer.TransferAssetParams.md#clawbackfrom)
- [fee](types_transfer.TransferAssetParams.md#fee)
- [from](types_transfer.TransferAssetParams.md#from)
- [lease](types_transfer.TransferAssetParams.md#lease)
- [maxFee](types_transfer.TransferAssetParams.md#maxfee)
- [maxRoundsToWaitForConfirmation](types_transfer.TransferAssetParams.md#maxroundstowaitforconfirmation)
- [note](types_transfer.TransferAssetParams.md#note)
- [populateAppCallResources](types_transfer.TransferAssetParams.md#populateappcallresources)
- [skipSending](types_transfer.TransferAssetParams.md#skipsending)
- [skipWaiting](types_transfer.TransferAssetParams.md#skipwaiting)
- [suppressLog](types_transfer.TransferAssetParams.md#suppresslog)
- [to](types_transfer.TransferAssetParams.md#to)
- [transactionParams](types_transfer.TransferAssetParams.md#transactionparams)

## Properties

### amount

• **amount**: `number` \| `bigint`

The amount to send as the smallest divisible unit value

#### Defined in

[src/types/transfer.ts:63](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transfer.ts#L63)

___

### assetId

• **assetId**: `number`

The asset id that will be transfered

#### Defined in

[src/types/transfer.ts:61](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transfer.ts#L61)

___

### atc

• `Optional` **atc**: `AtomicTransactionComposer`

An optional `AtomicTransactionComposer` to add the transaction to, if specified then `skipSending: undefined` has the same effect as `skipSending: true`

#### Inherited from

[SendTransactionParams](types_transaction.SendTransactionParams.md).[atc](types_transaction.SendTransactionParams.md#atc)

#### Defined in

[src/types/transaction.ts:46](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L46)

___

### clawbackFrom

• `Optional` **clawbackFrom**: `string` \| [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom)

An address of a target account from which to perform a clawback operation. Please note, in such cases senderAccount must be equal to clawback field on ASA metadata.

#### Defined in

[src/types/transfer.ts:67](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transfer.ts#L67)

___

### fee

• `Optional` **fee**: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

The flat fee you want to pay, useful for covering extra fees in a transaction group or app call

#### Inherited from

[SendTransactionParams](types_transaction.SendTransactionParams.md).[fee](types_transaction.SendTransactionParams.md#fee)

#### Defined in

[src/types/transaction.ts:50](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L50)

___

### from

• **from**: [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom)

The account that will send the asset

#### Defined in

[src/types/transfer.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transfer.ts#L57)

___

### lease

• `Optional` **lease**: `string` \| `Uint8Array`

An (optional) [transaction lease](https://dev.algorand.co/concepts/transactions/leases) to apply

#### Defined in

[src/types/transfer.ts:71](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transfer.ts#L71)

___

### maxFee

• `Optional` **maxFee**: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

The maximum fee that you are happy to pay (default: unbounded) - if this is set it's possible the transaction could get rejected during network congestion

#### Inherited from

[SendTransactionParams](types_transaction.SendTransactionParams.md).[maxFee](types_transaction.SendTransactionParams.md#maxfee)

#### Defined in

[src/types/transaction.ts:52](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L52)

___

### maxRoundsToWaitForConfirmation

• `Optional` **maxRoundsToWaitForConfirmation**: `number`

The maximum number of rounds to wait for confirmation, only applies if `skipWaiting` is `undefined` or `false`, default: wait up to 5 rounds

#### Inherited from

[SendTransactionParams](types_transaction.SendTransactionParams.md).[maxRoundsToWaitForConfirmation](types_transaction.SendTransactionParams.md#maxroundstowaitforconfirmation)

#### Defined in

[src/types/transaction.ts:54](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L54)

___

### note

• `Optional` **note**: [`TransactionNote`](../modules/types_transaction.md#transactionnote)

The (optional) transaction note

#### Defined in

[src/types/transfer.ts:69](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transfer.ts#L69)

___

### populateAppCallResources

• `Optional` **populateAppCallResources**: `boolean`

Whether to use simulate to automatically populate app call resources in the txn objects. Defaults to true when there are app calls in the group.

#### Inherited from

[SendTransactionParams](types_transaction.SendTransactionParams.md).[populateAppCallResources](types_transaction.SendTransactionParams.md#populateappcallresources)

#### Defined in

[src/types/transaction.ts:56](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L56)

___

### skipSending

• `Optional` **skipSending**: `boolean`

Whether to skip signing and sending the transaction to the chain (default: transaction signed and sent to chain, unless `atc` specified)
and instead just return the raw transaction, e.g. so you can add it to a group of transactions

#### Inherited from

[SendTransactionParams](types_transaction.SendTransactionParams.md).[skipSending](types_transaction.SendTransactionParams.md#skipsending)

#### Defined in

[src/types/transaction.ts:42](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L42)

___

### skipWaiting

• `Optional` **skipWaiting**: `boolean`

Whether to skip waiting for the submitted transaction (only relevant if `skipSending` is `false` or unset)

#### Inherited from

[SendTransactionParams](types_transaction.SendTransactionParams.md).[skipWaiting](types_transaction.SendTransactionParams.md#skipwaiting)

#### Defined in

[src/types/transaction.ts:44](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L44)

___

### suppressLog

• `Optional` **suppressLog**: `boolean`

Whether to suppress log messages from transaction send, default: do not suppress

#### Inherited from

[SendTransactionParams](types_transaction.SendTransactionParams.md).[suppressLog](types_transaction.SendTransactionParams.md#suppresslog)

#### Defined in

[src/types/transaction.ts:48](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L48)

___

### to

• **to**: `string` \| [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom)

The account / account address that will receive the asset

#### Defined in

[src/types/transfer.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transfer.ts#L59)

___

### transactionParams

• `Optional` **transactionParams**: `Object`

Optional transaction parameters

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `consensusVersion` | `string` | ConsensusVersion indicates the consensus protocol version as of LastRound. |
| `fee` | `bigint` | Fee is the suggested transaction fee Fee is in units of micro-Algos per byte. Fee may fall to zero but transactions must still have a fee of at least MinTxnFee for the current network protocol. |
| `firstValid` | `bigint` | - |
| `flatFee` | `boolean` | - |
| `genesisHash` | `Uint8Array` | GenesisHash is the hash of the genesis block. |
| `genesisId` | `string` | GenesisID is an ID listed in the genesis block. |
| `lastValid` | `bigint` | - |
| `minFee` | `bigint` | The minimum transaction fee (not per byte) required for the txn to validate for the current network protocol. |

#### Defined in

[src/types/transfer.ts:65](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transfer.ts#L65)
