[algotstest](../README.md) / transfer

# Module: transfer

## Table of contents

### Functions

- [transferAlgos](transfer.md#transferalgos)

## Functions

### transferAlgos

▸ **transferAlgos**(`transfer`, `algod`): `Promise`<[`SendTransactionResult`](../interfaces/transaction.SendTransactionResult.md)\>

Transfer ALGOs between two accounts.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transfer` | `AlgoTransferParams` | The transfer definition |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<[`SendTransactionResult`](../interfaces/transaction.SendTransactionResult.md)\>

The transaction object and optionally the confirmation if it was sent to the chain (`skipSending` is `false` or unset)

#### Defined in

[transfer.ts:34](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/transfer.ts#L34)
