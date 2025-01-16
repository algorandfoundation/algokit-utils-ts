[@algorandfoundation/algokit-utils](../README.md) / [types/indexer](../modules/types_indexer.md) / TransactionSignature

# Interface: TransactionSignature

[types/indexer](../modules/types_indexer.md).TransactionSignature

Validation signature associated with some data. Only one of the signatures should be provided. https://developer.algorand.org/docs/rest-apis/indexer/#transactionsignature

## Table of contents

### Properties

- [logicsig](types_indexer.TransactionSignature.md#logicsig)
- [multisig](types_indexer.TransactionSignature.md#multisig)
- [sig](types_indexer.TransactionSignature.md#sig)

## Properties

### logicsig

• `Optional` **logicsig**: [`LogicTransactionSignature`](types_indexer.LogicTransactionSignature.md)

Logicsig signature

#### Defined in

[src/types/indexer.ts:623](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L623)

___

### multisig

• `Optional` **multisig**: [`MultisigTransactionSignature`](types_indexer.MultisigTransactionSignature.md)

Multisig signature

#### Defined in

[src/types/indexer.ts:625](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L625)

___

### sig

• `Optional` **sig**: `string`

[sig] Standard ed25519 signature.

*Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\|[A-Za-z0-9+/]{3}=)?$"`

#### Defined in

[src/types/indexer.ts:630](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L630)
