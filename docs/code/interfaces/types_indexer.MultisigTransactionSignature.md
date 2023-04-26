[@algorandfoundation/algokit-utils](../README.md) / [types/indexer](../modules/types_indexer.md) / MultisigTransactionSignature

# Interface: MultisigTransactionSignature

[types/indexer](../modules/types_indexer.md).MultisigTransactionSignature

[msig] structure holding multiple subsignatures.

**`See`**

https://developer.algorand.org/docs/rest-apis/indexer/#transactionsignaturemultisig

## Table of contents

### Properties

- [subsignature](types_indexer.MultisigTransactionSignature.md#subsignature)
- [threshold](types_indexer.MultisigTransactionSignature.md#threshold)
- [version](types_indexer.MultisigTransactionSignature.md#version)

## Properties

### subsignature

• **subsignature**: [`MultisigTransactionSubSignature`](types_indexer.MultisigTransactionSubSignature.md)

[subsig] Holds pairs of public key and signatures.

#### Defined in

[src/types/indexer.ts:412](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L412)

___

### threshold

• **threshold**: `number`

[thr] The threshold of signatures required for the multisig

#### Defined in

[src/types/indexer.ts:414](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L414)

___

### version

• **version**: `number`

[v] The version of the multisig

#### Defined in

[src/types/indexer.ts:416](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L416)