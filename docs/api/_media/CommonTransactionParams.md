[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/composer](../README.md) / CommonTransactionParams

# Type Alias: CommonTransactionParams

> **CommonTransactionParams** = `object`

Defined in: [src/transactions/common.ts:8](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/common.ts#L8)

Common parameters for defining a transaction.

## Properties

### extraFee?

> `optional` **extraFee**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Defined in: [src/transactions/common.ts:32](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/common.ts#L32)

The fee to pay IN ADDITION to the suggested fee. Useful for manually covering inner transaction fees.

***

### firstValidRound?

> `optional` **firstValidRound**: `bigint`

Defined in: [src/transactions/common.ts:43](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/common.ts#L43)

Set the first round this transaction is valid.
If left undefined, the value from algod will be used.

We recommend you only set this when you intentionally want this to be some time in the future.

***

### lastValidRound?

> `optional` **lastValidRound**: `bigint`

Defined in: [src/transactions/common.ts:45](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/common.ts#L45)

The last round this transaction is valid. It is recommended to use `validityWindow` instead.

***

### lease?

> `optional` **lease**: `Uint8Array` \| `string`

Defined in: [src/transactions/common.ts:28](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/common.ts#L28)

Prevent multiple transactions with the same lease being included within the validity window.

A [lease](https://dev.algorand.co/concepts/transactions/leases)
 enforces a mutually exclusive transaction (useful to prevent double-posting and other scenarios).

***

### maxFee?

> `optional` **maxFee**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Defined in: [src/transactions/common.ts:34](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/common.ts#L34)

Throw an error if the fee for the transaction is more than this amount; prevents overspending on fees during high congestion periods.

***

### note?

> `optional` **note**: `Uint8Array` \| `string`

Defined in: [src/transactions/common.ts:22](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/common.ts#L22)

Note to attach to the transaction. Max of 1000 bytes.

***

### rekeyTo?

> `optional` **rekeyTo**: [`ReadableAddress`](../../../algokit-utils/type-aliases/ReadableAddress.md)

Defined in: [src/transactions/common.ts:20](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/common.ts#L20)

Change the signing key of the sender to the given address.

**Warning:** Please be careful with this parameter and be sure to read the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying).

***

### sender

> **sender**: [`SendingAddress`](../../../Subpaths/transact/type-aliases/SendingAddress.md)

Defined in: [src/transactions/common.ts:10](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/common.ts#L10)

The address sending the transaction, optionally with an attached signer.

***

### signer?

> `optional` **signer**: [`TransactionSigner`](../../../Subpaths/transact/type-aliases/TransactionSigner.md) \| [`AddressWithTransactionSigner`](../../../Subpaths/transact/interfaces/AddressWithTransactionSigner.md)

Defined in: [src/transactions/common.ts:15](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/common.ts#L15)

The function used to sign transaction(s); if not specified then
 an attempt will be made to find a registered signer for the
 given `sender` or use a default signer (if configured).

***

### staticFee?

> `optional` **staticFee**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Defined in: [src/transactions/common.ts:30](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/common.ts#L30)

The static transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction.

***

### validityWindow?

> `optional` **validityWindow**: `number` \| `bigint`

Defined in: [src/transactions/common.ts:36](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/common.ts#L36)

How many rounds the transaction should be valid for, if not specified then the registered default validity window will be used.
