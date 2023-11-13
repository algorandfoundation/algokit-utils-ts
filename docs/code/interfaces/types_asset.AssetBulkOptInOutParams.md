[@algorandfoundation/algokit-utils](../README.md) / [types/asset](../modules/types_asset.md) / AssetBulkOptInOutParams

# Interface: AssetBulkOptInOutParams

[types/asset](../modules/types_asset.md).AssetBulkOptInOutParams

Parameters for `assetBulkOptIn` / `assetBulkOptOut` call.

## Table of contents

### Properties

- [account](types_asset.AssetBulkOptInOutParams.md#account)
- [assetIds](types_asset.AssetBulkOptInOutParams.md#assetids)
- [maxFee](types_asset.AssetBulkOptInOutParams.md#maxfee)
- [note](types_asset.AssetBulkOptInOutParams.md#note)
- [suppressLog](types_asset.AssetBulkOptInOutParams.md#suppresslog)
- [transactionParams](types_asset.AssetBulkOptInOutParams.md#transactionparams)
- [validateBalances](types_asset.AssetBulkOptInOutParams.md#validatebalances)

## Properties

### account

• **account**: [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom)

The account to opt in/out for

#### Defined in

[src/types/asset.ts:30](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L30)

___

### assetIds

• **assetIds**: `number`[]

The IDs of the assets to opt in for / out of

#### Defined in

[src/types/asset.ts:32](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L32)

___

### maxFee

• `Optional` **maxFee**: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

The maximum fee that you are happy to pay per transaction (default: unbounded) - if this is set it's possible the transaction could get rejected during network congestion

#### Defined in

[src/types/asset.ts:40](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L40)

___

### note

• `Optional` **note**: [`TransactionNote`](../modules/types_transaction.md#transactionnote)

The (optional) transaction note

#### Defined in

[src/types/asset.ts:38](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L38)

___

### suppressLog

• `Optional` **suppressLog**: `boolean`

Whether to suppress log messages from transaction send, default: do not suppress

#### Defined in

[src/types/asset.ts:42](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L42)

___

### transactionParams

• `Optional` **transactionParams**: `SuggestedParams`

Optional transaction parameters

#### Defined in

[src/types/asset.ts:36](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L36)

___

### validateBalances

• `Optional` **validateBalances**: `boolean`

Whether or not to validate the opt-in/out is valid before issuing transactions; default = true

#### Defined in

[src/types/asset.ts:34](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L34)
