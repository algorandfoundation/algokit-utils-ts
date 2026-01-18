[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/transact](../README.md) / encodeSignedTransaction

# Function: encodeSignedTransaction()

> **encodeSignedTransaction**(`signedTransaction`): `Uint8Array`

Defined in: [packages/transact/src/transactions/signed-transaction.ts:115](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/transact/src/transactions/signed-transaction.ts#L115)

Encode signed transactions to MsgPack for sending on the network.

This method performs canonical encoding. No domain separation prefix is applicable.

## Parameters

### signedTransaction

[`SignedTransaction`](../type-aliases/SignedTransaction.md)

The signed transaction to encode

## Returns

`Uint8Array`

The MsgPack encoded bytes or an error if encoding fails.
