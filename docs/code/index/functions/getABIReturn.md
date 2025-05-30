[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getABIReturn

# Function: ~~getABIReturn()~~

> **getABIReturn**(`args?`, `confirmation?`): `undefined` \| [`ABIReturn`](../../types/app/type-aliases/ABIReturn.md)

Defined in: [src/app.ts:235](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L235)

## Parameters

### args?

[`AppCallArgs`](../../types/app/type-aliases/AppCallArgs.md)

The arguments that were used for the call

### confirmation?

`PendingTransactionResponse`

The transaction confirmation from algod

## Returns

`undefined` \| [`ABIReturn`](../../types/app/type-aliases/ABIReturn.md)

The return value for the method call

## Deprecated

Use `AppManager.getABIReturn` instead.

Returns any ABI return values for the given app call arguments and transaction confirmation.
