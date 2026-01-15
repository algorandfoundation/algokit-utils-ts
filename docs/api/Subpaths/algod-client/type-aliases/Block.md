[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/algod-client](../README.md) / Block

# Type Alias: Block

> **Block** = `object`

Defined in: [packages/algod\_client/src/models/block.ts:407](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/algod_client/src/models/block.ts#L407)

Block contains the BlockHeader and the list of transactions (Payset).

## Properties

### header

> **header**: [`BlockHeader`](BlockHeader.md)

Defined in: [packages/algod\_client/src/models/block.ts:409](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/algod_client/src/models/block.ts#L409)

The block information (Header)

***

### payset

> **payset**: [`SignedTxnInBlock`](SignedTxnInBlock.md)[]

Defined in: [packages/algod\_client/src/models/block.ts:412](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/algod_client/src/models/block.ts#L412)

[txns] Block transactions (Payset).
