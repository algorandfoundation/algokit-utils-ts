[@algorandfoundation/algokit-utils](../README.md) / [types/testing](../modules/types_testing.md) / LogSnapshotConfig

# Interface: LogSnapshotConfig

[types/testing](../modules/types_testing.md).LogSnapshotConfig

Configuration for preparing a captured log snapshot.
This helps ensure that the provided configuration items won't appear
 with random values in the log snapshot, but rather will get substituted with predictable ids.

## Table of contents

### Properties

- [accounts](types_testing.LogSnapshotConfig.md#accounts)
- [apps](types_testing.LogSnapshotConfig.md#apps)
- [filterPredicate](types_testing.LogSnapshotConfig.md#filterpredicate)
- [transactions](types_testing.LogSnapshotConfig.md#transactions)

## Properties

### accounts

• `Optional` **accounts**: (`string` \| [`Address`](../classes/index.Address.md) \| `MultisigAccount` \| `AddressWithTransactionSigner` \| `LogicSigAccount`)[]

Any accounts/addresses to replace the address for predictably

#### Defined in

[src/types/testing.ts:173](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L173)

___

### apps

• `Optional` **apps**: (`string` \| `number` \| `bigint`)[]

Any app IDs to replace predictably

#### Defined in

[src/types/testing.ts:175](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L175)

___

### filterPredicate

• `Optional` **filterPredicate**: (`log`: `string`) => `boolean`

Optional filter predicate to filter out logs

#### Type declaration

▸ (`log`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `log` | `string` |

##### Returns

`boolean`

#### Defined in

[src/types/testing.ts:177](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L177)

___

### transactions

• `Optional` **transactions**: (`string` \| `Transaction`)[]

Any transaction IDs or transactions to replace the ID for predictably

#### Defined in

[src/types/testing.ts:171](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L171)
