[@algorandfoundation/algokit-utils](../README.md) / [types/asset](../modules/types_asset.md) / AssetOptOutParams

# Interface: AssetOptOutParams

[types/asset](../modules/types_asset.md).AssetOptOutParams

**`Deprecated`**

Parameters for `assetOptOut` call.

## Hierarchy

- [`AssetOptInParams`](types_asset.AssetOptInParams.md)

  ↳ **`AssetOptOutParams`**

## Table of contents

### Properties

- [account](types_asset.AssetOptOutParams.md#account)
- [assetCreatorAddress](types_asset.AssetOptOutParams.md#assetcreatoraddress)
- [assetId](types_asset.AssetOptOutParams.md#assetid)
- [atc](types_asset.AssetOptOutParams.md#atc)
- [ensureZeroBalance](types_asset.AssetOptOutParams.md#ensurezerobalance)
- [fee](types_asset.AssetOptOutParams.md#fee)
- [lease](types_asset.AssetOptOutParams.md#lease)
- [maxFee](types_asset.AssetOptOutParams.md#maxfee)
- [maxRoundsToWaitForConfirmation](types_asset.AssetOptOutParams.md#maxroundstowaitforconfirmation)
- [note](types_asset.AssetOptOutParams.md#note)
- [populateAppCallResources](types_asset.AssetOptOutParams.md#populateappcallresources)
- [skipSending](types_asset.AssetOptOutParams.md#skipsending)
- [skipWaiting](types_asset.AssetOptOutParams.md#skipwaiting)
- [suppressLog](types_asset.AssetOptOutParams.md#suppresslog)
- [transactionParams](types_asset.AssetOptOutParams.md#transactionparams)

## Properties

### account

• **account**: `AddressWithTransactionSigner`

The account to opt in/out for

#### Inherited from

[AssetOptInParams](types_asset.AssetOptInParams.md).[account](types_asset.AssetOptInParams.md#account)

#### Defined in

[src/types/asset.ts:71](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L71)

___

### assetCreatorAddress

• `Optional` **assetCreatorAddress**: `string`

The address of the creator account for the asset; if unspecified then it looks it up using algod

#### Defined in

[src/types/asset.ts:85](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L85)

___

### assetId

• **assetId**: `number`

The ID of the assets to opt in for / out of

#### Inherited from

[AssetOptInParams](types_asset.AssetOptInParams.md).[assetId](types_asset.AssetOptInParams.md#assetid)

#### Defined in

[src/types/asset.ts:73](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L73)

___

### atc

• `Optional` **atc**: `AtomicTransactionComposer`

An optional `AtomicTransactionComposer` to add the transaction to, if specified then `skipSending: undefined` has the same effect as `skipSending: true`

#### Inherited from

[AssetOptInParams](types_asset.AssetOptInParams.md).[atc](types_asset.AssetOptInParams.md#atc)

#### Defined in

[src/types/transaction.ts:49](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L49)

___

### ensureZeroBalance

• `Optional` **ensureZeroBalance**: `boolean`

Whether or not to validate the account has a zero-balance before issuing the opt-out; default = true

#### Defined in

[src/types/asset.ts:87](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L87)

___

### fee

• `Optional` **fee**: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

The flat fee you want to pay, useful for covering extra fees in a transaction group or app call

#### Inherited from

[AssetOptInParams](types_asset.AssetOptInParams.md).[fee](types_asset.AssetOptInParams.md#fee)

#### Defined in

[src/types/transaction.ts:53](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L53)

___

### lease

• `Optional` **lease**: `string` \| `Uint8Array`

An (optional) [transaction lease](https://dev.algorand.co/concepts/transactions/leases) to apply

#### Inherited from

[AssetOptInParams](types_asset.AssetOptInParams.md).[lease](types_asset.AssetOptInParams.md#lease)

#### Defined in

[src/types/asset.ts:79](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L79)

___

### maxFee

• `Optional` **maxFee**: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

The maximum fee that you are happy to pay (default: unbounded) - if this is set it's possible the transaction could get rejected during network congestion

#### Inherited from

[AssetOptInParams](types_asset.AssetOptInParams.md).[maxFee](types_asset.AssetOptInParams.md#maxfee)

#### Defined in

[src/types/transaction.ts:55](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L55)

___

### maxRoundsToWaitForConfirmation

• `Optional` **maxRoundsToWaitForConfirmation**: `number`

The maximum number of rounds to wait for confirmation, only applies if `skipWaiting` is `undefined` or `false`, default: wait up to 5 rounds

#### Inherited from

[AssetOptInParams](types_asset.AssetOptInParams.md).[maxRoundsToWaitForConfirmation](types_asset.AssetOptInParams.md#maxroundstowaitforconfirmation)

#### Defined in

[src/types/transaction.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L57)

___

### note

• `Optional` **note**: [`TransactionNote`](../modules/types_transaction.md#transactionnote)

The (optional) transaction note

#### Inherited from

[AssetOptInParams](types_asset.AssetOptInParams.md).[note](types_asset.AssetOptInParams.md#note)

#### Defined in

[src/types/asset.ts:77](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L77)

___

### populateAppCallResources

• `Optional` **populateAppCallResources**: `boolean`

Whether to use simulate to automatically populate app call resources in the txn objects. Defaults to true when there are app calls in the group.

#### Inherited from

[AssetOptInParams](types_asset.AssetOptInParams.md).[populateAppCallResources](types_asset.AssetOptInParams.md#populateappcallresources)

#### Defined in

[src/types/transaction.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L59)

___

### skipSending

• `Optional` **skipSending**: `boolean`

Whether to skip signing and sending the transaction to the chain (default: transaction signed and sent to chain, unless `atc` specified)
and instead just return the raw transaction, e.g. so you can add it to a group of transactions

#### Inherited from

[AssetOptInParams](types_asset.AssetOptInParams.md).[skipSending](types_asset.AssetOptInParams.md#skipsending)

#### Defined in

[src/types/transaction.ts:45](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L45)

___

### skipWaiting

• `Optional` **skipWaiting**: `boolean`

Whether to skip waiting for the submitted transaction (only relevant if `skipSending` is `false` or unset)

#### Inherited from

[AssetOptInParams](types_asset.AssetOptInParams.md).[skipWaiting](types_asset.AssetOptInParams.md#skipwaiting)

#### Defined in

[src/types/transaction.ts:47](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L47)

___

### suppressLog

• `Optional` **suppressLog**: `boolean`

Whether to suppress log messages from transaction send, default: do not suppress

#### Inherited from

[AssetOptInParams](types_asset.AssetOptInParams.md).[suppressLog](types_asset.AssetOptInParams.md#suppresslog)

#### Defined in

[src/types/transaction.ts:51](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L51)

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

#### Inherited from

[AssetOptInParams](types_asset.AssetOptInParams.md).[transactionParams](types_asset.AssetOptInParams.md#transactionparams)

#### Defined in

[src/types/asset.ts:75](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L75)
