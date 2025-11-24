[@algorandfoundation/algokit-utils](../README.md) / [types/asset](../modules/types_asset.md) / AssetBulkOptInOutParams

# Interface: AssetBulkOptInOutParams

[types/asset](../modules/types_asset.md).AssetBulkOptInOutParams

**`Deprecated`**

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

• **account**: [`TransactionSignerAccount`](types_account.TransactionSignerAccount.md)

The account to opt in/out for

#### Defined in

[src/types/asset.ts:93](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L93)

___

### assetIds

• **assetIds**: `number`[]

The IDs of the assets to opt in for / out of

#### Defined in

[src/types/asset.ts:95](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L95)

___

### maxFee

• `Optional` **maxFee**: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

The maximum fee that you are happy to pay per transaction (default: unbounded) - if this is set it's possible the transaction could get rejected during network congestion

#### Defined in

[src/types/asset.ts:103](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L103)

___

### note

• `Optional` **note**: [`TransactionNote`](../modules/types_transaction.md#transactionnote)

The (optional) transaction note

#### Defined in

[src/types/asset.ts:101](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L101)

___

### suppressLog

• `Optional` **suppressLog**: `boolean`

Whether to suppress log messages from transaction send, default: do not suppress

#### Defined in

[src/types/asset.ts:105](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L105)

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

[src/types/asset.ts:99](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L99)

___

### validateBalances

• `Optional` **validateBalances**: `boolean`

Whether or not to validate the opt-in/out is valid before issuing transactions; default = true

#### Defined in

[src/types/asset.ts:97](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L97)
