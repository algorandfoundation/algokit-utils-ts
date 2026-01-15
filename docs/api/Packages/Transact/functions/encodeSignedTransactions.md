[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Packages/Transact](../README.md) / encodeSignedTransactions

# Function: encodeSignedTransactions()

> **encodeSignedTransactions**(`signedTransactions`): `Uint8Array`[]

Defined in: [packages/transact/src/transactions/signed-transaction.ts:128](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/signed-transaction.ts#L128)

Encode signed transactions to MsgPack for sending on the network.

 This method performs canonical encoding. No domain separation prefix is applicable.

## Parameters

### signedTransactions

[`SignedTransaction`](../type-aliases/SignedTransaction.md)[]

A collection of signed transactions to encode

## Returns

`Uint8Array`[]

A collection of MsgPack encoded bytes or an error if encoding fails.
