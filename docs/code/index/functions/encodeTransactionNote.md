[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / encodeTransactionNote

# Function: ~~encodeTransactionNote()~~

> **encodeTransactionNote**(`note?`): `undefined` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [src/transaction/transaction.ts:58](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L58)

## Parameters

### note?

[`TransactionNote`](../../types/transaction/type-aliases/TransactionNote.md)

The transaction note

## Returns

`undefined` \| `Uint8Array`\<`ArrayBufferLike`\>

the transaction note ready for inclusion in a transaction

 Case on the value of `data` this either be:
  * `null` | `undefined`: `undefined`
  * `string`: The string value
  * Uint8Array: passthrough
  * Arc2TransactionNote object: ARC-0002 compatible transaction note
  * Else: The object/value converted into a JSON string representation

## Deprecated

Convert your data to a `string` or `Uint8Array`, if using ARC-2 use `TransactionComposer.arc2Note`.

Encodes a transaction note into a byte array ready to be included in an Algorand transaction.
