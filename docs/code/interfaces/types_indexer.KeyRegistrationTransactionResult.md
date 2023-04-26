[@algorandfoundation/algokit-utils](../README.md) / [types/indexer](../modules/types_indexer.md) / KeyRegistrationTransactionResult

# Interface: KeyRegistrationTransactionResult

[types/indexer](../modules/types_indexer.md).KeyRegistrationTransactionResult

Fields for a `keyreg` transaction https://developer.algorand.org/docs/rest-apis/indexer/#transactionkeyreg

## Table of contents

### Properties

- [non-participation](types_indexer.KeyRegistrationTransactionResult.md#non-participation)
- [selection-participation-key](types_indexer.KeyRegistrationTransactionResult.md#selection-participation-key)
- [state-proof-key](types_indexer.KeyRegistrationTransactionResult.md#state-proof-key)
- [vote-first-valid](types_indexer.KeyRegistrationTransactionResult.md#vote-first-valid)
- [vote-key-dilution](types_indexer.KeyRegistrationTransactionResult.md#vote-key-dilution)
- [vote-last-valid](types_indexer.KeyRegistrationTransactionResult.md#vote-last-valid)
- [vote-participation-key](types_indexer.KeyRegistrationTransactionResult.md#vote-participation-key)

## Properties

### non-participation

• `Optional` **non-participation**: `boolean`

[nonpart] Mark the account as participating or non-participating.

#### Defined in

[src/types/indexer.ts:322](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L322)

___

### selection-participation-key

• `Optional` **selection-participation-key**: `string`

[selkey] Public key used with the Verified Random Function (VRF) result during committee selection.

*Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\|[A-Za-z0-9+/]{3}=)?$"`

#### Defined in

[src/types/indexer.ts:327](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L327)

___

### state-proof-key

• `Optional` **state-proof-key**: `string`

[selkey] Public key used with the Verified Random Function (VRF) result during committee selection.

*Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\|[A-Za-z0-9+/]{3}=)?$"`

#### Defined in

[src/types/indexer.ts:332](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L332)

___

### vote-first-valid

• `Optional` **vote-first-valid**: `number`

[votefst] First round this participation key is valid.

#### Defined in

[src/types/indexer.ts:334](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L334)

___

### vote-key-dilution

• `Optional` **vote-key-dilution**: `number`

[votekd] Number of subkeys in each batch of participation keys.

#### Defined in

[src/types/indexer.ts:336](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L336)

___

### vote-last-valid

• `Optional` **vote-last-valid**: `number`

[votelst] Last round this participation key is valid.

#### Defined in

[src/types/indexer.ts:338](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L338)

___

### vote-participation-key

• `Optional` **vote-participation-key**: `string`

[votekey] Participation public key used in key registration transactions.

*Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\|[A-Za-z0-9+/]{3}=)?$"`

#### Defined in

[src/types/indexer.ts:343](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L343)
