[@algorandfoundation/algokit-utils](../README.md) / types/transaction

# Module: types/transaction

## Table of contents

### Classes

- [TransactionWrapper](../classes/types_transaction.TransactionWrapper.md)

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
- [PendingTransactionResponseWrapper](types_transaction.md#pendingtransactionresponsewrapper)
- [SendSingleTransactionResult](types_transaction.md#sendsingletransactionresult)
- [SendTransactionFrom](types_transaction.md#sendtransactionfrom)
- [SignedTransactionWrapper](types_transaction.md#signedtransactionwrapper)
- [TransactionNote](types_transaction.md#transactionnote)
- [TransactionNoteData](types_transaction.md#transactionnotedata)

### Functions

- [wrapPendingTransactionResponse](types_transaction.md#wrappendingtransactionresponse)
- [wrapPendingTransactionResponseOptional](types_transaction.md#wrappendingtransactionresponseoptional)

## Type Aliases

### Arc2TransactionNote

Ƭ **Arc2TransactionNote**: \{ `dAppName`: `string` ; `data`: `string` ; `format`: ``"m"`` \| ``"b"`` \| ``"u"``  } \| \{ `dAppName`: `string` ; `data`: [`TransactionNoteData`](types_transaction.md#transactionnotedata) ; `format`: ``"j"``  }

ARC-0002 compatible transaction note components https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0002.md

#### Defined in

[src/types/transaction.ts:29](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L29)

___

### PendingTransactionResponseWrapper

Ƭ **PendingTransactionResponseWrapper**: `Omit`\<`PendingTransactionResponse`, ``"txn"`` \| ``"innerTxns"``\> & \{ `innerTxns?`: [`PendingTransactionResponseWrapper`](types_transaction.md#pendingtransactionresponsewrapper)[] ; `txn`: [`SignedTransactionWrapper`](types_transaction.md#signedtransactionwrapper)  }

#### Defined in

[src/types/transaction.ts:220](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L220)

___

### SendSingleTransactionResult

Ƭ **SendSingleTransactionResult**: [`Expand`](types_expand.md#expand)\<[`SendTransactionComposerResults`](../interfaces/types_transaction.SendTransactionComposerResults.md) & [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md)\>

Result from sending a single transaction.

#### Defined in

[src/types/transaction.ts:63](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L63)

___

### SendTransactionFrom

Ƭ **SendTransactionFrom**: `AddressWithSigner`

**`Deprcated`**

Use `SendingAddress` instead

#### Defined in

[src/types/transaction.ts:115](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L115)

___

### SignedTransactionWrapper

Ƭ **SignedTransactionWrapper**: `Omit`\<`SignedTransaction`, ``"txn"``\> & \{ `txn`: [`TransactionWrapper`](../classes/types_transaction.TransactionWrapper.md)  }

#### Defined in

[src/types/transaction.ts:216](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L216)

___

### TransactionNote

Ƭ **TransactionNote**: `Uint8Array` \| [`TransactionNoteData`](types_transaction.md#transactionnotedata) \| [`Arc2TransactionNote`](types_transaction.md#arc2transactionnote)

#### Defined in

[src/types/transaction.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L25)

___

### TransactionNoteData

Ƭ **TransactionNoteData**: `string` \| ``null`` \| `undefined` \| `number` \| `any`[] \| `Record`\<`string`, `any`\>

#### Defined in

[src/types/transaction.ts:27](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L27)

## Functions

### wrapPendingTransactionResponse

▸ **wrapPendingTransactionResponse**(`response`): [`PendingTransactionResponseWrapper`](types_transaction.md#pendingtransactionresponsewrapper)

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | `PendingTransactionResponse` |

#### Returns

[`PendingTransactionResponseWrapper`](types_transaction.md#pendingtransactionresponsewrapper)

#### Defined in

[src/types/transaction.ts:232](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L232)

___

### wrapPendingTransactionResponseOptional

▸ **wrapPendingTransactionResponseOptional**(`response?`): [`PendingTransactionResponseWrapper`](types_transaction.md#pendingtransactionresponsewrapper) \| `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `response?` | `PendingTransactionResponse` |

#### Returns

[`PendingTransactionResponseWrapper`](types_transaction.md#pendingtransactionresponsewrapper) \| `undefined`

#### Defined in

[src/types/transaction.ts:240](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L240)
