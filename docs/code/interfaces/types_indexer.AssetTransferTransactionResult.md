[@algorandfoundation/algokit-utils](../README.md) / [types/indexer](../modules/types_indexer.md) / AssetTransferTransactionResult

# Interface: AssetTransferTransactionResult

[types/indexer](../modules/types_indexer.md).AssetTransferTransactionResult

Fields for an asset transfer transaction. https://developer.algorand.org/docs/rest-apis/indexer/#transactionassettransfer

## Table of contents

### Properties

- [amount](types_indexer.AssetTransferTransactionResult.md#amount)
- [asset-id](types_indexer.AssetTransferTransactionResult.md#asset-id)
- [close-amount](types_indexer.AssetTransferTransactionResult.md#close-amount)
- [close-to](types_indexer.AssetTransferTransactionResult.md#close-to)
- [receiver](types_indexer.AssetTransferTransactionResult.md#receiver)
- [sender](types_indexer.AssetTransferTransactionResult.md#sender)

## Properties

### amount

• **amount**: `number` \| `bigint`

[aamt] Amount of asset to transfer. A zero amount transferred to self allocates that asset in the account's Assets map.

#### Defined in

[src/types/indexer.ts:507](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L507)

___

### asset-id

• **asset-id**: `number`

[xaid] ID of the asset being transferred.

#### Defined in

[src/types/indexer.ts:509](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L509)

___

### close-amount

• `Optional` **close-amount**: `number` \| `bigint`

Number of assets transfered to the close-to account as part of the transaction.

#### Defined in

[src/types/indexer.ts:511](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L511)

___

### close-to

• `Optional` **close-to**: `string`

[aclose] Indicates that the asset should be removed from the account's Assets map, and specifies where the remaining asset holdings should be transferred. It's always valid to transfer remaining asset holdings to the creator account.

#### Defined in

[src/types/indexer.ts:513](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L513)

___

### receiver

• **receiver**: `string`

[arcv] Recipient address of the transfer.

#### Defined in

[src/types/indexer.ts:515](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L515)

___

### sender

• `Optional` **sender**: `string`

[asnd] The effective sender during a clawback transactions. If this is not a zero value, the real transaction sender must be the Clawback address from the AssetParams.

#### Defined in

[src/types/indexer.ts:517](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L517)
