[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/account-manager](../README.md) / getAccountTransactionSigner

# Variable: getAccountTransactionSigner()

> `const` **getAccountTransactionSigner**: (`val`) => [`TransactionSigner`](../../../Packages/Transact/type-aliases/TransactionSigner.md)

Defined in: [src/types/account-manager.ts:42](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account-manager.ts#L42)

Returns a `TransactionSigner` for the given account that can sign a transaction.
This function has memoization, so will return the same transaction signer for a given account.

## Parameters

### val

[`MultisigAccount`](../../../Packages/Transact/classes/MultisigAccount.md) | [`AddressWithTransactionSigner`](../../../Packages/Transact/interfaces/AddressWithTransactionSigner.md) | [`LogicSigAccount`](../../../Packages/Transact/classes/LogicSigAccount.md)

## Returns

[`TransactionSigner`](../../../Packages/Transact/type-aliases/TransactionSigner.md)

A transaction signer

## Example

```typescript
const signer = getAccountTransactionSigner(account)
```
