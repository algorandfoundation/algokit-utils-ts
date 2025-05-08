[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / multisigAccount

# Function: ~~multisigAccount()~~

> **multisigAccount**(`multisigParams`, `signingAccounts`): [`MultisigAccount`](../../types/account/classes/MultisigAccount.md)

Defined in: [src/account/account.ts:24](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/account/account.ts#L24)

## Parameters

### multisigParams

`MultisigMetadata`

The parameters that define the multisig account

### signingAccounts

(`Account` \| [`SigningAccount`](../../types/account/classes/SigningAccount.md))[]

The signers that are currently present

## Returns

[`MultisigAccount`](../../types/account/classes/MultisigAccount.md)

A multisig account wrapper

## Deprecated

Use `algorand.account.multisig(multisigParams, signingAccounts)` or `new MultisigAccount(multisigParams, signingAccounts)` instead.

Returns an account wrapper that supports partial or full multisig signing.
