[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/indexer-client](../README.md) / TransactionAssetFreeze

# Type Alias: TransactionAssetFreeze

> **TransactionAssetFreeze** = `object`

Defined in: [packages/indexer\_client/src/models/transaction-asset-freeze.ts:10](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/transaction-asset-freeze.ts#L10)

Fields for an asset freeze transaction.

Definition:
data/transactions/asset.go : AssetFreezeTxnFields

## Properties

### address

> **address**: `string`

Defined in: [packages/indexer\_client/src/models/transaction-asset-freeze.ts:14](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/transaction-asset-freeze.ts#L14)

\[fadd\] Address of the account whose asset is being frozen or thawed.

***

### assetId

> **assetId**: `bigint`

Defined in: [packages/indexer\_client/src/models/transaction-asset-freeze.ts:19](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/transaction-asset-freeze.ts#L19)

\[faid\] ID of the asset being frozen or thawed.

***

### newFreezeStatus

> **newFreezeStatus**: `boolean`

Defined in: [packages/indexer\_client/src/models/transaction-asset-freeze.ts:24](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/transaction-asset-freeze.ts#L24)

\[afrz\] The new freeze status.
