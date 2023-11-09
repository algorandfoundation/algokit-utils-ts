[@algorandfoundation/algokit-utils](../README.md) / [types/asset](../modules/types_asset.md) / AssetOptOutParams

# Interface: AssetOptOutParams

[types/asset](../modules/types_asset.md).AssetOptOutParams

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
- [skipSending](types_asset.AssetOptOutParams.md#skipsending)
- [skipWaiting](types_asset.AssetOptOutParams.md#skipwaiting)
- [suppressLog](types_asset.AssetOptOutParams.md#suppresslog)
- [transactionParams](types_asset.AssetOptOutParams.md#transactionparams)

## Properties

### account

• **account**: [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom)

The account to opt in/out for

#### Inherited from

[AssetOptInParams](types_asset.AssetOptInParams.md).[account](types_asset.AssetOptInParams.md#account)

#### Defined in

[src/types/asset.ts:8](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L8)

___

### assetCreatorAddress

• `Optional` **assetCreatorAddress**: `string`

The address of the creator account for the asset; if unspecified then it looks it up using algod

#### Defined in

[src/types/asset.ts:22](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L22)

___

### assetId

• **assetId**: `number`

The ID of the assets to opt in for / out of

#### Inherited from

[AssetOptInParams](types_asset.AssetOptInParams.md).[assetId](types_asset.AssetOptInParams.md#assetid)

#### Defined in

[src/types/asset.ts:10](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L10)

___

### atc

• `Optional` **atc**: `AtomicTransactionComposer`

An optional `AtomicTransactionComposer` to add the transaction to, if specified then `skipSending: undefined` has the same effect as `skipSending: true`

#### Inherited from

[AssetOptInParams](types_asset.AssetOptInParams.md).[atc](types_asset.AssetOptInParams.md#atc)

#### Defined in

[src/types/transaction.ts:30](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L30)

___

### ensureZeroBalance

• `Optional` **ensureZeroBalance**: `boolean`

Whether or not to validate the account has a zero-balance before issuing the opt-out; default = true

#### Defined in

[src/types/asset.ts:24](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L24)

___

### fee

• `Optional` **fee**: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

The flat fee you want to pay, useful for covering extra fees in a transaction group or app call

#### Inherited from

[AssetOptInParams](types_asset.AssetOptInParams.md).[fee](types_asset.AssetOptInParams.md#fee)

#### Defined in

[src/types/transaction.ts:34](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L34)

___

### lease

• `Optional` **lease**: `string` \| `Uint8Array`

An (optional) [transaction lease](https://developer.algorand.org/articles/leased-transactions-securing-advanced-smart-contract-design/) to apply

#### Inherited from

[AssetOptInParams](types_asset.AssetOptInParams.md).[lease](types_asset.AssetOptInParams.md#lease)

#### Defined in

[src/types/asset.ts:16](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L16)

___

### maxFee

• `Optional` **maxFee**: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

The maximum fee that you are happy to pay (default: unbounded) - if this is set it's possible the transaction could get rejected during network congestion

#### Inherited from

[AssetOptInParams](types_asset.AssetOptInParams.md).[maxFee](types_asset.AssetOptInParams.md#maxfee)

#### Defined in

[src/types/transaction.ts:36](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L36)

___

### maxRoundsToWaitForConfirmation

• `Optional` **maxRoundsToWaitForConfirmation**: `number`

The maximum number of rounds to wait for confirmation, only applies if `skipWaiting` is `undefined` or `false`, default: wait up to 5 rounds

#### Inherited from

[AssetOptInParams](types_asset.AssetOptInParams.md).[maxRoundsToWaitForConfirmation](types_asset.AssetOptInParams.md#maxroundstowaitforconfirmation)

#### Defined in

[src/types/transaction.ts:38](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L38)

___

### note

• `Optional` **note**: [`TransactionNote`](../modules/types_transaction.md#transactionnote)

The (optional) transaction note

#### Inherited from

[AssetOptInParams](types_asset.AssetOptInParams.md).[note](types_asset.AssetOptInParams.md#note)

#### Defined in

[src/types/asset.ts:14](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L14)

___

### skipSending

• `Optional` **skipSending**: `boolean`

Whether to skip signing and sending the transaction to the chain (default: transaction signed and sent to chain, unless `atc` specified)
and instead just return the raw transaction, e.g. so you can add it to a group of transactions

#### Inherited from

[AssetOptInParams](types_asset.AssetOptInParams.md).[skipSending](types_asset.AssetOptInParams.md#skipsending)

#### Defined in

[src/types/transaction.ts:26](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L26)

___

### skipWaiting

• `Optional` **skipWaiting**: `boolean`

Whether to skip waiting for the submitted transaction (only relevant if `skipSending` is `false` or unset)

#### Inherited from

[AssetOptInParams](types_asset.AssetOptInParams.md).[skipWaiting](types_asset.AssetOptInParams.md#skipwaiting)

#### Defined in

[src/types/transaction.ts:28](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L28)

___

### suppressLog

• `Optional` **suppressLog**: `boolean`

Whether to suppress log messages from transaction send, default: do not suppress

#### Inherited from

[AssetOptInParams](types_asset.AssetOptInParams.md).[suppressLog](types_asset.AssetOptInParams.md#suppresslog)

#### Defined in

[src/types/transaction.ts:32](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L32)

___

### transactionParams

• `Optional` **transactionParams**: `SuggestedParams`

Optional transaction parameters

#### Inherited from

[AssetOptInParams](types_asset.AssetOptInParams.md).[transactionParams](types_asset.AssetOptInParams.md#transactionparams)

#### Defined in

[src/types/asset.ts:12](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L12)
