[@algorandfoundation/algokit-utils](../README.md) / types/transaction

# Module: types/transaction

## Table of contents

### Interfaces

- [AdditionalTransactionComposerContext](../interfaces/types_transaction.AdditionalTransactionComposerContext.md)
- [ConfirmedTransactionResult](../interfaces/types_transaction.ConfirmedTransactionResult.md)
- [ConfirmedTransactionResults](../interfaces/types_transaction.ConfirmedTransactionResults.md)
- [SendParams](../interfaces/types_transaction.SendParams.md)
- [SendTransactionComposerResults](../interfaces/types_transaction.SendTransactionComposerResults.md)
- [SendTransactionParams](../interfaces/types_transaction.SendTransactionParams.md)
- [SendTransactionResult](../interfaces/types_transaction.SendTransactionResult.md)
- [SendTransactionResults](../interfaces/types_transaction.SendTransactionResults.md)
- [TransactionComposerToSend](../interfaces/types_transaction.TransactionComposerToSend.md)
- [TransactionGroupToSend](../interfaces/types_transaction.TransactionGroupToSend.md)
- [TransactionToSign](../interfaces/types_transaction.TransactionToSign.md)

### Type Aliases

- [Arc2TransactionNote](types_transaction.md#arc2transactionnote)
- [SendSingleTransactionResult](types_transaction.md#sendsingletransactionresult)
- [SendTransactionFrom](types_transaction.md#sendtransactionfrom)
- [TransactionNote](types_transaction.md#transactionnote)
- [TransactionNoteData](types_transaction.md#transactionnotedata)

## Type Aliases

### Arc2TransactionNote

Ƭ **Arc2TransactionNote**: \{ `dAppName`: `string` ; `data`: `string` ; `format`: ``"m"`` \| ``"b"`` \| ``"u"``  } \| \{ `dAppName`: `string` ; `data`: [`TransactionNoteData`](types_transaction.md#transactionnotedata) ; `format`: ``"j"``  }

ARC-0002 compatible transaction note components https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0002.md

#### Defined in

[src/types/transaction.ts:12](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L12)

___

### SendSingleTransactionResult

Ƭ **SendSingleTransactionResult**: [`Expand`](types_expand.md#expand)\<[`SendTransactionComposerResults`](../interfaces/types_transaction.SendTransactionComposerResults.md) & [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md)\>

Result from sending a single transaction.

#### Defined in

[src/types/transaction.ts:46](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L46)

___

### SendTransactionFrom

Ƭ **SendTransactionFrom**: `AddressWithTransactionSigner`

**`Deprcated`**

Use `SendingAddress` instead

#### Defined in

[src/types/transaction.ts:98](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L98)

___

### TransactionNote

Ƭ **TransactionNote**: `Uint8Array` \| [`TransactionNoteData`](types_transaction.md#transactionnotedata) \| [`Arc2TransactionNote`](types_transaction.md#arc2transactionnote)

#### Defined in

[src/types/transaction.ts:8](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L8)

___

### TransactionNoteData

Ƭ **TransactionNoteData**: `string` \| ``null`` \| `undefined` \| `number` \| `any`[] \| `Record`\<`string`, `any`\>

#### Defined in

[src/types/transaction.ts:10](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L10)
