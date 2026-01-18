[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/account](../README.md) / AccountInformation

# Type Alias: AccountInformation

> **AccountInformation** = `object`

Defined in: [src/types/account.ts:22](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L22)

Account information at a given round.

## Properties

### address

> **address**: [`Address`](../../../algokit-utils/classes/Address.md)

Defined in: [src/types/account.ts:26](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L26)

The account public key

***

### amountWithoutPendingRewards

> **amountWithoutPendingRewards**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Defined in: [src/types/account.ts:34](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L34)

The amount of Algo in the account, without the pending rewards.

***

### appsLocalState?

> `optional` **appsLocalState**: [`ApplicationLocalState`](../../../Subpaths/algod-client/type-aliases/ApplicationLocalState.md)[]

Defined in: [src/types/account.ts:91](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L91)

Applications local data stored in this account.

***

### appsTotalExtraPages?

> `optional` **appsTotalExtraPages**: `number`

Defined in: [src/types/account.ts:96](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L96)

The sum of all extra application program pages for this account.

***

### appsTotalSchema?

> `optional` **appsTotalSchema**: [`ApplicationStateSchema`](../../../Subpaths/algod-client/type-aliases/ApplicationStateSchema.md)

Defined in: [src/types/account.ts:102](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L102)

(tsch) stores the sum of all of the local schemas and global schemas in this
account.
Note: the raw account uses `StateSchema` for this type.

***

### assets?

> `optional` **assets**: [`AssetHolding`](../../../Subpaths/algod-client/type-aliases/AssetHolding.md)[]

Defined in: [src/types/account.ts:107](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L107)

Assets held by this account.

***

### authAddr?

> `optional` **authAddr**: [`Address`](../../../algokit-utils/classes/Address.md)

Defined in: [src/types/account.ts:114](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L114)

The address against which signing should be checked. If empty, the
address of the current account is used. This field can be updated in any
transaction by setting the `RekeyTo` field.

***

### balance

> **balance**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Defined in: [src/types/account.ts:29](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L29)

The balance of Algo currently held by the account.

***

### createdApps?

> `optional` **createdApps**: [`Application`](../../../Subpaths/algod-client/type-aliases/Application.md)[]

Defined in: [src/types/account.ts:119](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L119)

Parameters of applications created by this account including app global data.

***

### createdAssets?

> `optional` **createdAssets**: [`Asset`](../../../Subpaths/algod-client/type-aliases/Asset.md)[]

Defined in: [src/types/account.ts:125](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L125)

(apar) parameters of assets created by this account.
Note: the raw account uses `map[int] -> Asset` for this type.

***

### lastHeartbeatRound?

> `optional` **lastHeartbeatRound**: `bigint`

Defined in: [src/types/account.ts:162](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L162)

The round in which this account last went online, or explicitly renewed their
online status.

***

### lastProposedRound?

> `optional` **lastProposedRound**: `bigint`

Defined in: [src/types/account.ts:167](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L167)

The round in which this account last proposed the block.

***

### minBalance

> **minBalance**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Defined in: [src/types/account.ts:41](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L41)

Algo balance required to be held by the account.

The requirement grows based on asset and application usage.

***

### participation?

> `optional` **participation**: [`AccountParticipation`](../../../Subpaths/algod-client/type-aliases/AccountParticipation.md)

Defined in: [src/types/account.ts:131](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L131)

AccountParticipation describes the parameters used by this account in consensus
protocol.

***

### pendingRewards

> **pendingRewards**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Defined in: [src/types/account.ts:45](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L45)

Amount of Algo of pending rewards in this account.

***

### rewardBase?

> `optional` **rewardBase**: `number`

Defined in: [src/types/account.ts:137](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L137)

Used as part of the rewards computation. Only applicable to accounts
which are participating.

***

### rewards

> **rewards**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Defined in: [src/types/account.ts:51](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L51)

Total rewards of Algo the account has received, including pending
rewards.

***

### sigType?

> `optional` **sigType**: `string`

Defined in: [src/types/account.ts:145](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L145)

Indicates what type of signature is used by this account, must be one of:
* sig
* msig
* lsig

***

### status

> **status**: `string`

Defined in: [src/types/account.ts:64](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L64)

Delegation status of the account's Algo:
* Offline - indicates that the associated account is delegated.
* Online - indicates that the associated account used as part of the delegation pool.
* NotParticipating - indicates that the associated account is neither a delegator nor a delegate.

***

### totalAppsOptedIn

> **totalAppsOptedIn**: `number`

Defined in: [src/types/account.ts:70](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L70)

The count of all applications that have been opted in, equivalent to the count
of application local data (AppLocalState objects) stored in this account.

***

### totalAssetsOptedIn

> **totalAssetsOptedIn**: `number`

Defined in: [src/types/account.ts:76](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L76)

The count of all assets that have been opted in, equivalent to the count of
AssetHolding objects held by this account.

***

### totalBoxBytes?

> `optional` **totalBoxBytes**: `number`

Defined in: [src/types/account.ts:151](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L151)

The total number of bytes used by this account's app's box keys and
values.

***

### totalBoxes?

> `optional` **totalBoxes**: `number`

Defined in: [src/types/account.ts:156](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L156)

The number of existing boxes created by this account's app.

***

### totalCreatedApps

> **totalCreatedApps**: `number`

Defined in: [src/types/account.ts:81](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L81)

The count of all apps (AppParams objects) created by this account.

***

### totalCreatedAssets

> **totalCreatedAssets**: `number`

Defined in: [src/types/account.ts:86](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L86)

The count of all assets (AssetParams objects) created by this account.

***

### validAsOfRound

> **validAsOfRound**: `bigint`

Defined in: [src/types/account.ts:56](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account.ts#L56)

The round number for which this information is relevant.
