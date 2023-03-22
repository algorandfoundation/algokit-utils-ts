[@algorandfoundation/algokit-utils](../README.md) / types/transaction

# Module: types/transaction

## Table of contents

### Interfaces

- [ConfirmedTransactionResult](../interfaces/types_transaction.ConfirmedTransactionResult.md)
- [SendTransactionParams](../interfaces/types_transaction.SendTransactionParams.md)
- [SendTransactionResult](../interfaces/types_transaction.SendTransactionResult.md)
- [TransactionToSign](../interfaces/types_transaction.TransactionToSign.md)

### Type Aliases

- [Arc2TransactionNote](types_transaction.md#arc2transactionnote)
- [SendTransactionFrom](types_transaction.md#sendtransactionfrom)
- [TransactionNote](types_transaction.md#transactionnote)
- [TransactionNoteData](types_transaction.md#transactionnotedata)

## Type Aliases

### Arc2TransactionNote

Ƭ **Arc2TransactionNote**: { `dAppName`: `string` ; `data`: `string` ; `format`: ``"m"`` \| ``"b"`` \| ``"u"``  } \| { `dAppName`: `string` ; `data`: [`TransactionNoteData`](types_transaction.md#transactionnotedata) ; `format`: ``"j"``  }

ARC-0002 compatible transaction note components,

**`See`**

https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0002.md

#### Defined in

[types/transaction.ts:10](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L10)

___

### SendTransactionFrom

Ƭ **SendTransactionFrom**: `Account` \| [`SigningAccount`](../classes/types_account.SigningAccount.md) \| `LogicSigAccount` \| [`MultisigAccount`](../classes/types_account.MultisigAccount.md) \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md)

#### Defined in

[types/transaction.ts:53](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L53)

___

### TransactionNote

Ƭ **TransactionNote**: `Uint8Array` \| [`TransactionNoteData`](types_transaction.md#transactionnotedata) \| [`Arc2TransactionNote`](types_transaction.md#arc2transactionnote)

#### Defined in

[types/transaction.ts:6](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L6)

___

### TransactionNoteData

Ƭ **TransactionNoteData**: `string` \| ``null`` \| `undefined` \| `number` \| `any`[] \| `Record`<`string`, `any`\>

#### Defined in

[types/transaction.ts:8](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L8)
