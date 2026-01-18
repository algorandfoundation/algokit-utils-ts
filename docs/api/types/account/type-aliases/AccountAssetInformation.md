[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/account](../README.md) / AccountAssetInformation

# Type Alias: AccountAssetInformation

> **AccountAssetInformation** = `object`

Defined in: [src/types/account.ts:171](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L171)

Account asset holding information at a given round.

## Properties

### assetId

> **assetId**: `bigint`

Defined in: [src/types/account.ts:173](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L173)

The ID of the asset held.

***

### balance

> **balance**: `bigint`

Defined in: [src/types/account.ts:175](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L175)

The current balance of that asset holding.

***

### frozen

> **frozen**: `boolean`

Defined in: [src/types/account.ts:177](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L177)

Whether or not the asset is frozen for the account.

***

### round

> **round**: `bigint`

Defined in: [src/types/account.ts:179](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L179)

The round as at which the holding was correct.
