[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/testing](../README.md) / LogSnapshotConfig

# Interface: LogSnapshotConfig

Defined in: [src/types/testing.ts:140](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L140)

Configuration for preparing a captured log snapshot.
This helps ensure that the provided configuration items won't appear
 with random values in the log snapshot, but rather will get substituted with predictable ids.

## Properties

### accounts?

> `optional` **accounts**: (`string` \| [`Address`](../../../index/classes/Address.md) \| [`MultisigAccount`](../../../transact/classes/MultisigAccount.md) \| [`AddressWithTransactionSigner`](../../../transact/interfaces/AddressWithTransactionSigner.md) \| [`LogicSigAccount`](../../../transact/classes/LogicSigAccount.md))[]

Defined in: [src/types/testing.ts:144](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L144)

Any accounts/addresses to replace the address for predictably

***

### apps?

> `optional` **apps**: (`string` \| `number` \| `bigint`)[]

Defined in: [src/types/testing.ts:146](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L146)

Any app IDs to replace predictably

***

### filterPredicate()?

> `optional` **filterPredicate**: (`log`) => `boolean`

Defined in: [src/types/testing.ts:148](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L148)

Optional filter predicate to filter out logs

#### Parameters

##### log

`string`

#### Returns

`boolean`

***

### transactions?

> `optional` **transactions**: (`string` \| [`Transaction`](../../../transact/classes/Transaction.md))[]

Defined in: [src/types/testing.ts:142](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L142)

Any transaction IDs or transactions to replace the ID for predictably
