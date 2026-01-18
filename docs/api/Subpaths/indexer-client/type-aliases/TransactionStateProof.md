[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/indexer-client](../README.md) / TransactionStateProof

# Type Alias: TransactionStateProof

> **TransactionStateProof** = `object`

Defined in: [packages/indexer\_client/src/models/transaction-state-proof.ts:14](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/transaction-state-proof.ts#L14)

Fields for a state proof transaction.

Definition:
data/transactions/stateproof.go : StateProofTxnFields

## Properties

### message?

> `optional` **message**: [`IndexerStateProofMessage`](IndexerStateProofMessage.md)

Defined in: [packages/indexer\_client/src/models/transaction-state-proof.ts:20](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/transaction-state-proof.ts#L20)

***

### stateProof?

> `optional` **stateProof**: [`StateProofFields`](StateProofFields.md)

Defined in: [packages/indexer\_client/src/models/transaction-state-proof.ts:19](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/transaction-state-proof.ts#L19)

***

### stateProofType?

> `optional` **stateProofType**: `number`

Defined in: [packages/indexer\_client/src/models/transaction-state-proof.ts:18](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/transaction-state-proof.ts#L18)

\[sptype\] Type of the state proof. Integer representing an entry defined in protocol/stateproof.go
