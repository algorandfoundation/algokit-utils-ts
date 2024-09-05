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
- [transactions](types_testing.LogSnapshotConfig.md#transactions)

## Properties

### accounts

• `Optional` **accounts**: (`string` \| [`MultisigAccount`](../classes/types_account.MultisigAccount.md) \| `default` \| [`SigningAccount`](../classes/types_account.SigningAccount.md) \| [`TransactionSignerAccount`](types_account.TransactionSignerAccount.md) \| `LogicSigAccount`)[]

Any accounts/addresses to replace the address for predictably

#### Defined in

[src/types/testing.ts:99](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L99)

___

### apps

• `Optional` **apps**: (`string` \| `number` \| `bigint`)[]

Any app IDs to replace predictably

#### Defined in

[src/types/testing.ts:101](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L101)

___

### transactions

• `Optional` **transactions**: (`string` \| `Transaction`)[]

Any transaction IDs or transactions to replace the ID for predictably

#### Defined in

[src/types/testing.ts:97](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L97)
