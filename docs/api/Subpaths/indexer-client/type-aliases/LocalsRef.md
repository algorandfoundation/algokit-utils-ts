[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/indexer-client](../README.md) / LocalsRef

# Type Alias: LocalsRef

> **LocalsRef** = `object`

Defined in: [packages/indexer\_client/src/models/locals-ref.ts:7](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/locals-ref.ts#L7)

LocalsRef names a local state by referring to an Address and App it belongs to.

## Properties

### address

> **address**: [`Address`](../../../algokit-utils/classes/Address.md)

Defined in: [packages/indexer\_client/src/models/locals-ref.ts:11](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/locals-ref.ts#L11)

\[d\] Address in access list, or the sender of the transaction.

***

### app

> **app**: `bigint`

Defined in: [packages/indexer\_client/src/models/locals-ref.ts:16](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/locals-ref.ts#L16)

\[p\] Application ID for app in access list, or zero if referring to the called application.
