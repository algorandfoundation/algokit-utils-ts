[@algorandfoundation/algokit-utils](../README.md) / [testing](../modules/testing.md) / LogSnapshotConfig

# Interface: LogSnapshotConfig

[testing](../modules/testing.md).LogSnapshotConfig

Configuration for preparing a captured log snapshot.
This helps ensure that the provided configuration items won't appear
 with random values in the log snapshot, but rather will get substituted with predictable ids.

## Table of contents

### Properties

- [accounts](testing.LogSnapshotConfig.md#accounts)
- [apps](testing.LogSnapshotConfig.md#apps)
- [filterPredicate](testing.LogSnapshotConfig.md#filterpredicate)
- [transactions](testing.LogSnapshotConfig.md#transactions)

## Properties

### accounts

• `Optional` **accounts**: (`string` \| [`Address`](../classes/index.Address.md) \| `MultisigAccount` \| `AddressWithTransactionSigner` \| `LogicSigAccount`)[]

Any accounts/addresses to replace the address for predictably

#### Defined in

[src/testing/types.ts:144](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L144)

___

### apps

• `Optional` **apps**: (`string` \| `number` \| `bigint`)[]

Any app IDs to replace predictably

#### Defined in

[src/testing/types.ts:146](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L146)

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

[src/testing/types.ts:148](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L148)

___

### transactions

• `Optional` **transactions**: (`string` \| `Transaction`)[]

Any transaction IDs or transactions to replace the ID for predictably

#### Defined in

[src/testing/types.ts:142](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L142)
