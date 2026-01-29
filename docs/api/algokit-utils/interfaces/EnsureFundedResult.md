[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [algokit-utils](../README.md) / EnsureFundedResult

# Interface: EnsureFundedResult

Defined in: [src/account-manager.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/account-manager.ts#L25)

Result from performing an ensureFunded call.

## Properties

### amountFunded

> **amountFunded**: [`AlgoAmount`](../classes/AlgoAmount.md)

Defined in: [src/account-manager.ts:29](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/account-manager.ts#L29)

The amount that was sent to the account.

***

### transactionId

> **transactionId**: `string`

Defined in: [src/account-manager.ts:27](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/account-manager.ts#L27)

The transaction ID of the transaction that funded the account.
