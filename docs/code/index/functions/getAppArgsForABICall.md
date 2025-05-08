[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getAppArgsForABICall

# Function: ~~getAppArgsForABICall()~~

> **getAppArgsForABICall**(`args`, `from`): `Promise`\<\{ `appAccounts`: `undefined` \| `string`[]; `appForeignApps`: `undefined` \| `number`[]; `appForeignAssets`: `undefined` \| `number`[]; `boxes`: `undefined` \| `BoxReference`[]; `lease`: `undefined` \| `Uint8Array`\<`ArrayBufferLike`\>; `method`: `ABIMethod`; `methodArgs`: (`string` \| `number` \| `bigint` \| `boolean` \| `Address` \| `Uint8Array`\<`ArrayBufferLike`\> \| `ABIValue`[] \| `TransactionWithSigner`)[]; `rekeyTo`: `undefined` \| `string`; `sender`: `string`; `signer`: `TransactionSigner`; \}\>

Defined in: [src/app.ts:378](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L378)

## Parameters

### args

[`ABIAppCallArgs`](../../types/app/type-aliases/ABIAppCallArgs.md)

The ABI app call args

### from

[`SendTransactionFrom`](../../types/transaction/type-aliases/SendTransactionFrom.md)

The transaction signer

## Returns

`Promise`\<\{ `appAccounts`: `undefined` \| `string`[]; `appForeignApps`: `undefined` \| `number`[]; `appForeignAssets`: `undefined` \| `number`[]; `boxes`: `undefined` \| `BoxReference`[]; `lease`: `undefined` \| `Uint8Array`\<`ArrayBufferLike`\>; `method`: `ABIMethod`; `methodArgs`: (`string` \| `number` \| `bigint` \| `boolean` \| `Address` \| `Uint8Array`\<`ArrayBufferLike`\> \| `ABIValue`[] \| `TransactionWithSigner`)[]; `rekeyTo`: `undefined` \| `string`; `sender`: `string`; `signer`: `TransactionSigner`; \}\>

The parameters ready to pass into `addMethodCall` within AtomicTransactionComposer

## Deprecated

Use `TransactionComposer` methods to construct transactions instead.

Returns the app args ready to load onto an ABI method call in `AtomicTransactionComposer`
