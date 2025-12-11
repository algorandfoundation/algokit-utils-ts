[@algorandfoundation/algokit-utils](../README.md) / types/account-manager

# Module: types/account-manager

## Table of contents

### Classes

- [AccountManager](../classes/types_account_manager.AccountManager.md)

### Interfaces

- [EnsureFundedResult](../interfaces/types_account_manager.EnsureFundedResult.md)

### Functions

- [getAccountTransactionSigner](types_account_manager.md#getaccounttransactionsigner)

## Functions

### getAccountTransactionSigner

▸ **getAccountTransactionSigner**(`val`): `TransactionSigner`

Returns a `TransactionSigner` for the given account that can sign a transaction.
This function has memoization, so will return the same transaction signer for a given account.

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `MultisigAccount` \| `AddressWithTransactionSigner` \| `LogicSigAccount` |

#### Returns

`TransactionSigner`

A transaction signer

**`Example`**

```typescript
const signer = getAccountTransactionSigner(account)
```

#### Defined in

[src/types/account-manager.ts:42](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L42)
