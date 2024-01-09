[@algorandfoundation/algokit-utils](../README.md) / [types/indexer](../modules/types_indexer.md) / MultisigTransactionSubSignature

# Interface: MultisigTransactionSubSignature

[types/indexer](../modules/types_indexer.md).MultisigTransactionSubSignature

Sub-signature for a multisig signature https://developer.algorand.org/docs/rest-apis/indexer/#transactionsignaturemultisigsubsignature

## Table of contents

### Properties

- [public-key](types_indexer.MultisigTransactionSubSignature.md#public-key)
- [signature](types_indexer.MultisigTransactionSubSignature.md#signature)

## Properties

### public-key

• **public-key**: `string`

[pk] The public key of the account making the signature

*Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\|[A-Za-z0-9+/]{3}=)?$"`

#### Defined in

[src/types/indexer.ts:426](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/indexer.ts#L426)

___

### signature

• **signature**: `string`

[s] The signature

*Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\|[A-Za-z0-9+/]{3}=)?$"`

#### Defined in

[src/types/indexer.ts:431](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/indexer.ts#L431)
