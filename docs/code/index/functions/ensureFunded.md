[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / ensureFunded

# Function: ~~ensureFunded()~~

> **ensureFunded**\<`T`\>(`funding`, `algod`, `kmd?`): `Promise`\<`undefined` \| [`EnsureFundedReturnType`](../../types/transfer/interfaces/EnsureFundedReturnType.md)\>

Defined in: [src/transfer/transfer.ts:26](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transfer/transfer.ts#L26)

## Type Parameters

### T

`T` *extends* [`EnsureFundedParams`](../../types/transfer/interfaces/EnsureFundedParams.md)

## Parameters

### funding

`T`

The funding configuration of type `EnsureFundedParams`, including the account to fund, minimum spending balance, and optional parameters. If you set `useDispenserApi` to true, you must also set `ALGOKIT_DISPENSER_ACCESS_TOKEN` in your environment variables.

### algod

`AlgodClient`

An instance of the Algodv2 client.

### kmd?

`KmdClient`

An optional instance of the Kmd client.

## Returns

`Promise`\<`undefined` \| [`EnsureFundedReturnType`](../../types/transfer/interfaces/EnsureFundedReturnType.md)\>

- `EnsureFundedReturnType` if funds were transferred.
- `undefined` if no funds were needed.

## Deprecated

Use `algorand.account.ensureFunded()` / `algorand.account.ensureFundedFromEnvironment()`
/ `algorand.account.ensureFundedFromTestNetDispenserApi()` instead

Funds a given account using a funding source such that it has a certain amount of Algo free to spend (accounting for Algo locked in minimum balance requirement).

https://dev.algorand.co/concepts/smart-contracts/costs-constraints#mbr
