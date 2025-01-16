[@algorandfoundation/algokit-utils](../README.md) / [types/indexer](../modules/types_indexer.md) / HeartbeatTransactionResult

# Interface: HeartbeatTransactionResult

[types/indexer](../modules/types_indexer.md).HeartbeatTransactionResult

Fields for a `hb` transaction https://developer.algorand.org/docs/rest-apis/indexer/#transactionheartbeat

## Table of contents

### Properties

- [hb-address](types_indexer.HeartbeatTransactionResult.md#hb-address)
- [hb-key-dilution](types_indexer.HeartbeatTransactionResult.md#hb-key-dilution)
- [hb-proof](types_indexer.HeartbeatTransactionResult.md#hb-proof)
- [hb-seed](types_indexer.HeartbeatTransactionResult.md#hb-seed)
- [hb-vote-id](types_indexer.HeartbeatTransactionResult.md#hb-vote-id)

## Properties

### hb-address

• **hb-address**: `string`

[hbad] HbAddress is the account this txn is proving onlineness for.

#### Defined in

[src/types/indexer.ts:417](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L417)

___

### hb-key-dilution

• **hb-key-dilution**: `number`

[hbkd] HbKeyDilution must match HbAddress account's current KeyDilution.

#### Defined in

[src/types/indexer.ts:419](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L419)

___

### hb-proof

• **hb-proof**: `Object`

[hbprf] HbProof is a signature using HeartbeatAddress's partkey, thereby showing it is online.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `hb-pk?` | `string` | [p] Public key of the heartbeat message. *Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\\|[A-Za-z0-9+/]{3}=)?$"` |
| `hb-pk1sig?` | `string` | [p1s] Signature of OneTimeSignatureSubkeyOffsetID(PK, Batch, Offset) under the key PK2. *Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\\|[A-Za-z0-9+/]{3}=)?$"` |
| `hb-pk2?` | `string` | [p2] Key for new-style two-level ephemeral signature. *Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\\|[A-Za-z0-9+/]{3}=)?$"` |
| `hb-pk2sig?` | `string` | [p2s] Signature of OneTimeSignatureSubkeyBatchID(PK2, Batch) under the master key (OneTimeSignatureVerifier). *Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\\|[A-Za-z0-9+/]{3}=)?$"` |
| `hb-sig?` | `string` | [s] Signature of the heartbeat message. *Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\\|[A-Za-z0-9+/]{3}=)?$"` |

#### Defined in

[src/types/indexer.ts:421](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L421)

___

### hb-seed

• **hb-seed**: `string`

[hbsd] HbSeed must be the block seed for the this transaction's firstValid block.

*Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\|[A-Za-z0-9+/]{3}=)?$"`

#### Defined in

[src/types/indexer.ts:452](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L452)

___

### hb-vote-id

• **hb-vote-id**: `string`

[hbvid] HbVoteID must match the HbAddress account's current VoteID.

*Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\|[A-Za-z0-9+/]{3}=)?$"`

#### Defined in

[src/types/indexer.ts:457](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L457)
