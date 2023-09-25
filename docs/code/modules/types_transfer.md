[@algorandfoundation/algokit-utils](../README.md) / types/transfer

# Module: types/transfer

## Table of contents

### Interfaces

- [AlgoTransferParams](../interfaces/types_transfer.AlgoTransferParams.md)
- [EnsureFundedParams](../interfaces/types_transfer.EnsureFundedParams.md)
- [TransferAssetParams](../interfaces/types_transfer.TransferAssetParams.md)

### Type Aliases

- [EnsureFundedReturnType](types_transfer.md#ensurefundedreturntype)

## Type Aliases

### EnsureFundedReturnType

Ƭ **EnsureFundedReturnType**<`T`\>: `T` extends { `useDispenserApi`: ``true``  } ? [`SendDispenserTransactionResult`](../interfaces/types_transaction.SendDispenserTransactionResult.md) : [`SendTransactionResult`](../interfaces/types_transaction.SendTransactionResult.md)

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[src/types/transfer.ts:61](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transfer.ts#L61)
