# Assets

The Algorand Standard Asset (asset) management functions include creating, opting in and transferring assets, which are fundamental to asset interaction in a blockchain environment.
To see some usage examples check out the [automated tests](../../src/asset.spec.ts).

## AlgorandClient

It is recommended to use the `AlgorandClient` for forming and sending transactions. `AlgorandClient.prototype.send`, `AlgorandClient.prototype.transaction`, and `AlgorandClient.prototype.newGroup` can all be used using the same interface depending on whether you want to send a tranasction, prepare a transaction, or add a transaction to a group.

All of the examples on this page will be using `AlgorandClient.prototype.send` to send a singular transaction.

## Creation

To create an asset you can use the `assetCreate` function, which returns a [`SendTransactionResult`](./transaction.md#sendtransactionresult) and takes an [`AssetCreateParams`](../code/modules/types_composer.md#assetcreateparams):

```ts
// Example
const result = await algorand.send.assetCreate({
  sender: testAccount.addr,
  total: 100n,
  assetName: 'My Asset',
})

const assetId = result.confirmation.assetIndex!
```

## Transfer

### `transferAsset`

The key function to facilitate asset transfers is `transferAsset(transfer, algod)`, which returns a [`SendTransactionResult`](./transaction.md#sendtransactionresult) and takes a [`AssetTransferParams`](../code/modules/types_composer.md#assettransferparams):

```ts
// Example
await algorand.send.assetTransfer({
  sender: alice.addr,
  receiver: bob.addr,
  amount: 1n,
  assetId: 1337n,
})
```

## Opt-in/out

Before an account can receive a specific asset, it must `opt-in` to receive it. An opt-in transaction places an asset holding of 0 into the account and increases its minimum balance by [100,000 microAlgos](https://developer.algorand.org/docs/get-details/asa/#assets-overview).

An account can opt out of an asset at any time. This means that the account will no longer hold the asset, and the account will no longer be able to receive the asset. The account also recovers the Minimum Balance Requirement for the asset (100,000 microAlgos).

When opting-out you generally want to be careful to ensure you have a zero-balance otherwise you will forfeit the balance you do have. By default, AlgoKit Utils protects you from making this mistake by checking you have a zero-balance before issuing the opt-out transaction. You can turn this check off if you want to avoid the extra calls to Algorand and are confident in what you are doing.

AlgoKit Utils gives you functions that allow you to do opt-ins in bulk or as a single operation. The bulk operations give you less control over the sending semantics as they automatically send the transactions to Algorand in the most optimal way using transaction groups.

### `assetOptIn`

To opt-in an account to a single asset you can use the `assetOptIn` function which takes in [`AssetOptInParams`](../code/modules/types_composer.md#assetoptinparams):

```typescript
// Example
await algorand.send.assetOptIn({
  sender: alice.addr,
  assetId: 1337n,
})
```

### `assetOptOut`

To opt-out an account from a single asset you can use the [`algokit.assetOptOut(optOut, algod)`](../code/modules/index.md#assetoptout) function. The `optOut` argument is an object [containing](../code/interfaces/types_asset.AssetOptOutParams.md):

- All properties from [`assetOptIn`](#assetoptin)
- `assetCreatorAddress: string` - The address of the creator account for the asset; if unspecified then it looks it up using algod
- `ensureZeroBalance: boolean` - Whether or not to validate the account has a zero-balance before issuing the opt-out; defaults to true

```typescript
// Example
await algokit.assetOptOut(
  {
    account: account,
    assetId: 12345,
    assetCreatorAddress: creator,
    // Can optionally also specify ensureZeroBalance, transactionParams, note, lease and other send params
  },
  algod,
)
```

### `assetBulkOptIn`

The [`assetBulkOptIn`](../code/modules/index.md#assetbulkoptin) function facilitates the opt-in process for an account to multiple assets, allowing the account to receive and hold those assets.

```typescript
// Example
await algokit.assetBulkOptIn(
  {
    account: account,
    assetIds: [12354, 673453],
    // Can optionally also specify validateBalances, transactionParams, note
  },
  algod,
)
```

### `assetBulkOptOut`

The `assetBulkOptOut` function manages the opt-out process for a number of assets, permitting the account to discontinue holding a group of assets.

```typescript
// Example
await algokit.assetBulkOptOut(
  {
    account: account,
    assetIds: [12354, 673453],
    // Can optionally also specify validateBalances, transactionParams, note
  },
  algod,
)
```
