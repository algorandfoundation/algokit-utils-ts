[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/algod-client](../README.md) / AssetHolding

# Type Alias: AssetHolding

> **AssetHolding** = `object`

Defined in: [packages/algod\_client/src/models/asset-holding.ts:10](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/models/asset-holding.ts#L10)

Describes an asset held by an account.

Definition:
data/basics/userBalance.go : AssetHolding

## Properties

### amount

> **amount**: `bigint`

Defined in: [packages/algod\_client/src/models/asset-holding.ts:14](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/models/asset-holding.ts#L14)

\[a\] number of units held.

***

### assetId

> **assetId**: `bigint`

Defined in: [packages/algod\_client/src/models/asset-holding.ts:19](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/models/asset-holding.ts#L19)

Asset ID of the holding.

***

### isFrozen

> **isFrozen**: `boolean`

Defined in: [packages/algod\_client/src/models/asset-holding.ts:24](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/models/asset-holding.ts#L24)

\[f\] whether or not the holding is frozen.
