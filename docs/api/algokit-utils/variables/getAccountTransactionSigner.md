[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [algokit-utils](../README.md) / getAccountTransactionSigner

# Variable: getAccountTransactionSigner()

> `const` **getAccountTransactionSigner**: (`val`) => [`TransactionSigner`](../../Subpaths/transact/type-aliases/TransactionSigner.md)

Defined in: [src/account-manager.ts:42](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/account-manager.ts#L42)

Returns a `TransactionSigner` for the given account that can sign a transaction.
This function has memoization, so will return the same transaction signer for a given account.

## Parameters

### val

[`MultisigAccount`](../../Subpaths/transact/classes/MultisigAccount.md) | [`AddressWithTransactionSigner`](../../Subpaths/transact/interfaces/AddressWithTransactionSigner.md) | [`LogicSigAccount`](../../Subpaths/transact/classes/LogicSigAccount.md)

## Returns

[`TransactionSigner`](../../Subpaths/transact/type-aliases/TransactionSigner.md)

A transaction signer

## Example

```typescript
const signer = getAccountTransactionSigner(account)
```
