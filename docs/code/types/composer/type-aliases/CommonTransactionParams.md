[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/composer](../README.md) / CommonTransactionParams

# Type Alias: CommonTransactionParams

> **CommonTransactionParams** = `object`

Defined in: [src/types/composer.ts:45](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L45)

Common parameters for defining a transaction.

## Properties

### extraFee?

> `optional` **extraFee**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Defined in: [src/types/composer.ts:69](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L69)

The fee to pay IN ADDITION to the suggested fee. Useful for manually covering inner transaction fees.

***

### firstValidRound?

> `optional` **firstValidRound**: `bigint`

Defined in: [src/types/composer.ts:80](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L80)

Set the first round this transaction is valid.
If left undefined, the value from algod will be used.

We recommend you only set this when you intentionally want this to be some time in the future.

***

### lastValidRound?

> `optional` **lastValidRound**: `bigint`

Defined in: [src/types/composer.ts:82](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L82)

The last round this transaction is valid. It is recommended to use `validityWindow` instead.

***

### lease?

> `optional` **lease**: `Uint8Array` \| `string`

Defined in: [src/types/composer.ts:65](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L65)

Prevent multiple transactions with the same lease being included within the validity window.

A [lease](https://dev.algorand.co/concepts/transactions/leases)
 enforces a mutually exclusive transaction (useful to prevent double-posting and other scenarios).

***

### maxFee?

> `optional` **maxFee**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Defined in: [src/types/composer.ts:71](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L71)

Throw an error if the fee for the transaction is more than this amount; prevents overspending on fees during high congestion periods.

***

### note?

> `optional` **note**: `Uint8Array` \| `string`

Defined in: [src/types/composer.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L59)

Note to attach to the transaction. Max of 1000 bytes.

***

### rekeyTo?

> `optional` **rekeyTo**: `string` \| `Address`

Defined in: [src/types/composer.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L57)

Change the signing key of the sender to the given address.

**Warning:** Please be careful with this parameter and be sure to read the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying).

***

### sender

> **sender**: `string` \| `Address`

Defined in: [src/types/composer.ts:47](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L47)

The address of the account sending the transaction.

***

### signer?

> `optional` **signer**: `algosdk.TransactionSigner` \| [`TransactionSignerAccount`](../../account/interfaces/TransactionSignerAccount.md)

Defined in: [src/types/composer.ts:52](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L52)

The function used to sign transaction(s); if not specified then
 an attempt will be made to find a registered signer for the
 given `sender` or use a default signer (if configured).

***

### staticFee?

> `optional` **staticFee**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Defined in: [src/types/composer.ts:67](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L67)

The static transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction.

***

### validityWindow?

> `optional` **validityWindow**: `number` \| `bigint`

Defined in: [src/types/composer.ts:73](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L73)

How many rounds the transaction should be valid for, if not specified then the registered default validity window will be used.
