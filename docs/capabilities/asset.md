# Assets

The Algorand Standard Asset (asset) management functions include creating, opting in and transferring assets, which are fundamental to asset interaction in a blockchain environment.
To see some usage examples check out the [automated tests](../../src/asset.spec.ts).

## Creation

> [!NOTE]
> This method requires the [legacy AlgoKit Utils import method to access it](../README.md#usage).

To create an asset you can use the `createAsset(create, algod)` function, which returns a [`SendTransactionResult`](./transaction.md#sendtransactionresult) and takes an [`AssetCreateParams`](../code/interfaces/types_asset.CreateAssetParams.md):

- All properties in [`SendTransactionParams`](./transaction.md#sendtransactionparams)
- `creator: SendTransactionFrom` - The account to create the asset. This account automatically is opted in to the asset and holds all units after creation.
- `total: number | bigint` - The total number of base (decimal) units of the asset to create. If decimal is, say, 2, then for every 100 `total` there would be 1 whole unit.
- `decimals: number` - The number of digits to use after the decimal point when displaying the asset. If 0, the asset is not divisible. If 1, the base unit of the asset is in tenths, and so on up to 19 decimal places.
- `name?: string` - The optional name of the asset. Max size if 32 bytes.
- `unit?: string` - The optional name of the unit of this asset. Max size is 8 bytes.
- `url?: string` - Specifies an optional URL where more information about the asset can be retrieved. Max size is 96 bytes.
- `metadataHash?: string | Uint8Array` - This field is intended to be a 32-byte hash of some metadata that is relevant to your asset and/or asset holders.
- `manager?: string | SendTransactionFrom` - The optional account that can manage the configuration of the asset and destroy it.
- `reserveAccount?: string | SendTransactionFrom` - The optional account that holds the reserve (non-minted) units of the asset. This address has no specific authority in the protocol itself and is informational.
- `freezeAccount?: string | SendTransactionFrom` - The optional account that can be used to freeze holdings of this asset. If empty, freezing is not permitted.
- `clawbackAccount?: string | SendTransactionFrom` - The optional account that can clawback holdings of this asset. If empty, clawback is not permitted.
- `frozenByDefault?: boolean` - Whether to freeze holdings for this asset by default. If `true` then for anyone apart from the creator to hold the asset it needs to be unfrozen per account using `freeze`. Defaults to `false`.
- `transactionParams?: SuggestedParams` - The optional [transaction parameters](./transaction.md#transaction-params)
- `note?: TransactionNote` - The [transaction note](./transaction.md#transaction-notes)
- `lease?: string | Uint8Array`: A [lease](https://developer.algorand.org/articles/leased-transactions-securing-advanced-smart-contract-design/) to assign to the transaction to enforce a mutually exclusive transaction (useful to prevent double-posting and other scenarios)

```typescript
await algokit.createAsset(
  {
    creator: account,
    total: 100,
    decimals: 0,
    name: 'My asset',
    // Can optionally specify other parameters per above
    // Can optionally also specify transactionParams, note, lease and other send params
  },
  algod,
)
```

## Transfer

> [!NOTE]
> These methods require the [legacy AlgoKit Utils import method to access them](../README.md#usage).

### `transferAsset`

The key function to facilitate asset transfers is `transferAsset(transfer, algod)`, which returns a [`SendTransactionResult`](./transaction.md#sendtransactionresult) and takes a [`TransferAssetParams`](../code/interfaces/types_transfer.TransferAssetParams.md):

- All properties in [`SendTransactionParams`](./transaction.md#sendtransactionparams)
- `from: SendTransactionFrom` - The account that will send the asset
- `to: SendTransactionFrom | string` - The account / account address that will receive the asset
- `assetId: number` - The asset id that will be transfered
- `amount: number | bigint` - The amount to send in the smallest divisible unit
- `transactionParams?: SuggestedParams` - The optional [transaction parameters](./transaction.md#transaction-params)
- `clawbackFrom: SendTransactionFrom | string` - An optional address of a target account from which to perform a clawback operation. Please note, in such cases senderAccount must be equal to clawback field on ASA metadata.
- `note?: TransactionNote` - The [transaction note](./transaction.md#transaction-notes)
- `lease?: string | Uint8Array`: A [lease](https://developer.algorand.org/articles/leased-transactions-securing-advanced-smart-contract-design/) to assign to the transaction to enforce a mutually exclusive transaction (useful to prevent double-posting and other scenarios)

## Opt-in/out

> [!NOTE]
> These methods require the [legacy AlgoKit Utils import method to access them](../README.md#usage).

Before an account can receive a specific asset, it must `opt-in` to receive it. An opt-in transaction places an asset holding of 0 into the account and increases its minimum balance by [100,000 microAlgos](https://developer.algorand.org/docs/get-details/asa/#assets-overview).

An account can opt out of an asset at any time. This means that the account will no longer hold the asset, and the account will no longer be able to receive the asset. The account also recovers the Minimum Balance Requirement for the asset (100,000 microAlgos).

When opting-out you generally want to be careful to ensure you have a zero-balance otherwise you will forfeit the balance you do have. By default, AlgoKit Utils protects you from making this mistake by checking you have a zero-balance before issuing the opt-out transaction. You can turn this check off if you want to avoid the extra calls to Algorand and are confident in what you are doing.

AlgoKit Utils gives you functions that allow you to do opt-ins in bulk or as a single operation. The bulk operations give you less control over the sending semantics as they automatically send the transactions to Algorand in the most optimal way using transaction groups.

### `assetOptIn`

To opt-in an account to a single asset you can use the [`algokit.assetOptIn(optIn, algod)`](../code/modules/index.md#assetoptin) function. The `optIn` argument is an object [containing](../code/interfaces/types_asset.AssetOptInParams.md):

- All properties in [`SendTransactionParams`](./transaction.md#sendtransactionparams)
- `account: SendTransactionFrom` - The account that will opt-in to the asset
- `assetId: number` - The asset id that will be opted-in to
- `transactionParams: SuggestedParams` - The optional [transaction parameters](./transaction.md#transaction-params)
- `note: TransactionNote` - The optional [transaction note](./transaction.md#transaction-notes)
- `lease: string | Uint8Array`: A [lease](https://developer.algorand.org/articles/leased-transactions-securing-advanced-smart-contract-design/) to assign to the transaction to enforce a mutually exclusive transaction (useful to prevent double-posting and other scenarios)

```typescript
// Example
await algokit.assetOptIn(
  {
    account: account,
    assetId: 12345,
    // Can optionally also specify transactionParams, note, lease and other send params
  },
  algod,
)
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
