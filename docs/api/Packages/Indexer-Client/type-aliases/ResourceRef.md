[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Packages/Indexer Client](../README.md) / ResourceRef

# Type Alias: ResourceRef

> **ResourceRef** = `object`

Defined in: [packages/indexer\_client/src/models/resource-ref.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/indexer_client/src/models/resource-ref.ts#L13)

ResourceRef names a single resource. Only one of the fields should be set.

## Properties

### address?

> `optional` **address**: [`Address`](../../../Algokit-Utils-API/classes/Address.md)

Defined in: [packages/indexer\_client/src/models/resource-ref.ts:17](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/indexer_client/src/models/resource-ref.ts#L17)

\[d\] Account whose balance record is accessible by the executing ApprovalProgram or ClearStateProgram.

***

### applicationId?

> `optional` **applicationId**: `bigint`

Defined in: [packages/indexer\_client/src/models/resource-ref.ts:23](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/indexer_client/src/models/resource-ref.ts#L23)

\[p\] Application id whose GlobalState may be read by the executing
ApprovalProgram or ClearStateProgram.

***

### assetId?

> `optional` **assetId**: `bigint`

Defined in: [packages/indexer\_client/src/models/resource-ref.ts:29](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/indexer_client/src/models/resource-ref.ts#L29)

\[s\] Asset whose AssetParams may be read by the executing
ApprovalProgram or ClearStateProgram.

***

### box?

> `optional` **box**: [`BoxReference`](BoxReference.md)

Defined in: [packages/indexer\_client/src/models/resource-ref.ts:30](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/indexer_client/src/models/resource-ref.ts#L30)

***

### holding?

> `optional` **holding**: [`HoldingRef`](HoldingRef.md)

Defined in: [packages/indexer\_client/src/models/resource-ref.ts:31](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/indexer_client/src/models/resource-ref.ts#L31)

***

### local?

> `optional` **local**: [`LocalsRef`](LocalsRef.md)

Defined in: [packages/indexer\_client/src/models/resource-ref.ts:32](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/indexer_client/src/models/resource-ref.ts#L32)
