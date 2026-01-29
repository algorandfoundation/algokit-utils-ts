[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [algokit-utils](../README.md) / EnsureFundedResult

# Interface: EnsureFundedResult

Defined in: [src/account-manager.ts:26](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/account-manager.ts#L26)

Result from performing an ensureFunded call.

## Properties

### amountFunded

> **amountFunded**: [`AlgoAmount`](../classes/AlgoAmount.md)

Defined in: [src/account-manager.ts:30](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/account-manager.ts#L30)

The amount that was sent to the account.

***

### transactionId

> **transactionId**: `string`

Defined in: [src/account-manager.ts:28](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/account-manager.ts#L28)

The transaction ID of the transaction that funded the account.
