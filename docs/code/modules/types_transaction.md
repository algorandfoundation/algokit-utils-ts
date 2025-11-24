[@algorandfoundation/algokit-utils](../README.md) / types/transaction

# Module: types/transaction

## Table of contents

### Classes

- [TransactionWrapper](../classes/types_transaction.TransactionWrapper.md)

### Interfaces

- [AdditionalAtomicTransactionComposerContext](../interfaces/types_transaction.AdditionalAtomicTransactionComposerContext.md)
- [AtomicTransactionComposerToSend](../interfaces/types_transaction.AtomicTransactionComposerToSend.md)
- [ConfirmedTransactionResult](../interfaces/types_transaction.ConfirmedTransactionResult.md)
- [ConfirmedTransactionResults](../interfaces/types_transaction.ConfirmedTransactionResults.md)
- [SendAtomicTransactionComposerResults](../interfaces/types_transaction.SendAtomicTransactionComposerResults.md)
- [SendParams](../interfaces/types_transaction.SendParams.md)
- [SendTransactionParams](../interfaces/types_transaction.SendTransactionParams.md)
- [SendTransactionResult](../interfaces/types_transaction.SendTransactionResult.md)
- [SendTransactionResults](../interfaces/types_transaction.SendTransactionResults.md)
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

[src/types/transaction.ts:26](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L26)

___

### PendingTransactionResponseWrapper

Ƭ **PendingTransactionResponseWrapper**: `Omit`\<`PendingTransactionResponse`, ``"txn"`` \| ``"innerTxns"``\> & \{ `innerTxns?`: [`PendingTransactionResponseWrapper`](types_transaction.md#pendingtransactionresponsewrapper)[] ; `txn`: [`SignedTransactionWrapper`](types_transaction.md#signedtransactionwrapper)  }

#### Defined in

[src/types/transaction.ts:237](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L237)

___

### SendSingleTransactionResult

Ƭ **SendSingleTransactionResult**: [`Expand`](types_expand.md#expand)\<[`SendAtomicTransactionComposerResults`](../interfaces/types_transaction.SendAtomicTransactionComposerResults.md) & [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md)\>

Result from sending a single transaction.

#### Defined in

[src/types/transaction.ts:60](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L60)

___

### SendTransactionFrom

Ƭ **SendTransactionFrom**: `Account` \| [`SigningAccount`](../classes/types_account.SigningAccount.md) \| `LogicSigAccount` \| [`MultisigAccount`](../classes/types_account.MultisigAccount.md) \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md)

Core account abstraction when signing/sending transactions

This type is used across the entire AlgoKit Utils library and allows you to pass through
many types of accounts, including:
* `Account` - The in-built `algosdk.Account` type for mnemonic accounts
* `SigningAccount` - An AlgoKit Utils class that wraps Account to provide support for rekeyed accounts
* `LogicSigAccount` - The in-built `algosdk.LogicSigAccount` type for logic signatures
* `MultisigAccount` - An AlgoKit Utils class that wraps a multisig account and provides mechanisms to get a multisig account
* `TransactionSignerAccount` - An AlgoKit Utils class that wraps the in-built `algosdk.TransactionSigner` along with the sender address

#### Defined in

[src/types/transaction.ts:118](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L118)

___

### SignedTransactionWrapper

Ƭ **SignedTransactionWrapper**: `Omit`\<`SignedTransaction`, ``"txn"``\> & \{ `txn`: [`TransactionWrapper`](../classes/types_transaction.TransactionWrapper.md)  }

#### Defined in

[src/types/transaction.ts:233](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L233)

___

### TransactionNote

Ƭ **TransactionNote**: `Uint8Array` \| [`TransactionNoteData`](types_transaction.md#transactionnotedata) \| [`Arc2TransactionNote`](types_transaction.md#arc2transactionnote)

#### Defined in

[src/types/transaction.ts:22](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L22)

___

### TransactionNoteData

Ƭ **TransactionNoteData**: `string` \| ``null`` \| `undefined` \| `number` \| `any`[] \| `Record`\<`string`, `any`\>

#### Defined in

[src/types/transaction.ts:24](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L24)

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

[src/types/transaction.ts:249](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L249)

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

[src/types/transaction.ts:257](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L257)
