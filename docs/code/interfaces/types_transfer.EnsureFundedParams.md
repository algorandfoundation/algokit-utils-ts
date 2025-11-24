[@algorandfoundation/algokit-utils](../README.md) / [types/transfer](../modules/types_transfer.md) / EnsureFundedParams

# Interface: EnsureFundedParams

[types/transfer](../modules/types_transfer.md).EnsureFundedParams

**`Deprecated`**

Parameters for `ensureFunded` call.

## Hierarchy

- [`SendTransactionParams`](types_transaction.SendTransactionParams.md)

  ↳ **`EnsureFundedParams`**

## Table of contents

### Properties

- [accountToFund](types_transfer.EnsureFundedParams.md#accounttofund)
- [atc](types_transfer.EnsureFundedParams.md#atc)
- [fee](types_transfer.EnsureFundedParams.md#fee)
- [fundingSource](types_transfer.EnsureFundedParams.md#fundingsource)
- [lease](types_transfer.EnsureFundedParams.md#lease)
- [maxFee](types_transfer.EnsureFundedParams.md#maxfee)
- [maxRoundsToWaitForConfirmation](types_transfer.EnsureFundedParams.md#maxroundstowaitforconfirmation)
- [minFundingIncrement](types_transfer.EnsureFundedParams.md#minfundingincrement)
- [minSpendingBalance](types_transfer.EnsureFundedParams.md#minspendingbalance)
- [note](types_transfer.EnsureFundedParams.md#note)
- [populateAppCallResources](types_transfer.EnsureFundedParams.md#populateappcallresources)
- [skipSending](types_transfer.EnsureFundedParams.md#skipsending)
- [skipWaiting](types_transfer.EnsureFundedParams.md#skipwaiting)
- [suppressLog](types_transfer.EnsureFundedParams.md#suppresslog)
- [transactionParams](types_transfer.EnsureFundedParams.md#transactionparams)

## Properties

### accountToFund

• **accountToFund**: `string` \| [`TransactionSignerAccount`](types_account.TransactionSignerAccount.md)

The account to fund

#### Defined in

[src/types/transfer.ts:39](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transfer.ts#L39)

___

### atc

• `Optional` **atc**: `AtomicTransactionComposer`

An optional `AtomicTransactionComposer` to add the transaction to, if specified then `skipSending: undefined` has the same effect as `skipSending: true`

#### Inherited from

[SendTransactionParams](types_transaction.SendTransactionParams.md).[atc](types_transaction.SendTransactionParams.md#atc)

#### Defined in

[src/types/transaction.ts:49](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L49)

___

### fee

• `Optional` **fee**: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

The flat fee you want to pay, useful for covering extra fees in a transaction group or app call

#### Inherited from

[SendTransactionParams](types_transaction.SendTransactionParams.md).[fee](types_transaction.SendTransactionParams.md#fee)

#### Defined in

[src/types/transaction.ts:53](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L53)

___

### fundingSource

• `Optional` **fundingSource**: [`TransactionSignerAccount`](types_account.TransactionSignerAccount.md) \| [`TestNetDispenserApiClient`](../classes/types_dispenser_client.TestNetDispenserApiClient.md)

The account to use as a funding source, will default to using the dispenser account returned by `algokit.getDispenserAccount`

#### Defined in

[src/types/transfer.ts:41](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transfer.ts#L41)

___

### lease

• `Optional` **lease**: `string` \| `Uint8Array`

An (optional) [transaction lease](https://dev.algorand.co/concepts/transactions/leases) to apply

#### Defined in

[src/types/transfer.ts:51](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transfer.ts#L51)

___

### maxFee

• `Optional` **maxFee**: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

The maximum fee that you are happy to pay (default: unbounded) - if this is set it's possible the transaction could get rejected during network congestion

#### Inherited from

[SendTransactionParams](types_transaction.SendTransactionParams.md).[maxFee](types_transaction.SendTransactionParams.md#maxfee)

#### Defined in

[src/types/transaction.ts:55](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L55)

___

### maxRoundsToWaitForConfirmation

• `Optional` **maxRoundsToWaitForConfirmation**: `number`

The maximum number of rounds to wait for confirmation, only applies if `skipWaiting` is `undefined` or `false`, default: wait up to 5 rounds

#### Inherited from

[SendTransactionParams](types_transaction.SendTransactionParams.md).[maxRoundsToWaitForConfirmation](types_transaction.SendTransactionParams.md#maxroundstowaitforconfirmation)

#### Defined in

[src/types/transaction.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L57)

___

### minFundingIncrement

• `Optional` **minFundingIncrement**: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

When issuing a funding amount, the minimum amount to transfer (avoids many small transfers if this gets called often on an active account)

#### Defined in

[src/types/transfer.ts:45](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transfer.ts#L45)

___

### minSpendingBalance

• **minSpendingBalance**: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

The minimum balance of Algo that the account should have available to spend (i.e. on top of minimum balance requirement)

#### Defined in

[src/types/transfer.ts:43](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transfer.ts#L43)

___

### note

• `Optional` **note**: [`TransactionNote`](../modules/types_transaction.md#transactionnote)

The (optional) transaction note, default: "Funding account to meet minimum requirement"

#### Defined in

[src/types/transfer.ts:49](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transfer.ts#L49)

___

### populateAppCallResources

• `Optional` **populateAppCallResources**: `boolean`

Whether to use simulate to automatically populate app call resources in the txn objects. Defaults to true when there are app calls in the group.

#### Inherited from

[SendTransactionParams](types_transaction.SendTransactionParams.md).[populateAppCallResources](types_transaction.SendTransactionParams.md#populateappcallresources)

#### Defined in

[src/types/transaction.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L59)

___

### skipSending

• `Optional` **skipSending**: `boolean`

Whether to skip signing and sending the transaction to the chain (default: transaction signed and sent to chain, unless `atc` specified)
and instead just return the raw transaction, e.g. so you can add it to a group of transactions

#### Inherited from

[SendTransactionParams](types_transaction.SendTransactionParams.md).[skipSending](types_transaction.SendTransactionParams.md#skipsending)

#### Defined in

[src/types/transaction.ts:45](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L45)

___

### skipWaiting

• `Optional` **skipWaiting**: `boolean`

Whether to skip waiting for the submitted transaction (only relevant if `skipSending` is `false` or unset)

#### Inherited from

[SendTransactionParams](types_transaction.SendTransactionParams.md).[skipWaiting](types_transaction.SendTransactionParams.md#skipwaiting)

#### Defined in

[src/types/transaction.ts:47](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L47)

___

### suppressLog

• `Optional` **suppressLog**: `boolean`

Whether to suppress log messages from transaction send, default: do not suppress

#### Inherited from

[SendTransactionParams](types_transaction.SendTransactionParams.md).[suppressLog](types_transaction.SendTransactionParams.md#suppresslog)

#### Defined in

[src/types/transaction.ts:51](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L51)

___

### transactionParams

• `Optional` **transactionParams**: `Object`

Optional transaction parameters

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `consensusVersion` | `string` | ConsensusVersion indicates the consensus protocol version as of LastRound. |
| `fee` | `bigint` | Fee is the suggested transaction fee Fee is in units of micro-Algos per byte. Fee may fall to zero but transactions must still have a fee of at least MinTxnFee for the current network protocol. |
| `firstValid` | `bigint` | - |
| `flatFee` | `boolean` | - |
| `genesisHash` | `Uint8Array` | GenesisHash is the hash of the genesis block. |
| `genesisId` | `string` | GenesisID is an ID listed in the genesis block. |
| `lastValid` | `bigint` | - |
| `minFee` | `bigint` | The minimum transaction fee (not per byte) required for the txn to validate for the current network protocol. |

#### Defined in

[src/types/transfer.ts:47](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transfer.ts#L47)
