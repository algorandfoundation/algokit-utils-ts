[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/account-manager](../README.md) / EnsureFundedResult

# Interface: EnsureFundedResult

Defined in: [src/types/account-manager.ts:25](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account-manager.ts#L25)

Result from performing an ensureFunded call.

## Properties

### amountFunded

> **amountFunded**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Defined in: [src/types/account-manager.ts:29](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account-manager.ts#L29)

The amount that was sent to the account.

***

### transactionId

> **transactionId**: `string`

Defined in: [src/types/account-manager.ts:27](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/account-manager.ts#L27)

The transaction ID of the transaction that funded the account.
