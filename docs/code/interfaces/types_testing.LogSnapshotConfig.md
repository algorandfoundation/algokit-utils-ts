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

• `Optional` **accounts**: (`string` \| `Address` \| `AddressWithTransactionSigner` \| `MultisigAccount` \| `default` \| `LogicSigAccount` \| [`SigningAccount`](../classes/types_account.SigningAccount.md))[]

Any accounts/addresses to replace the address for predictably

#### Defined in

[src/types/testing.ts:140](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L140)

___

### apps

• `Optional` **apps**: (`string` \| `number` \| `bigint`)[]

Any app IDs to replace predictably

#### Defined in

[src/types/testing.ts:142](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L142)

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

[src/types/testing.ts:144](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L144)

___

### transactions

• `Optional` **transactions**: (`string` \| `Transaction`)[]

Any transaction IDs or transactions to replace the ID for predictably

#### Defined in

[src/types/testing.ts:138](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L138)
