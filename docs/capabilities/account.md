# Account management

Account management is one of the core capabilities provided by AlgoKit Utils. It allows you to create mnemonic, rekeyed, multisig, transaction signer, idempotent KMD and environment variable injected accounts that can be used to sign transactions as well as representing a sender address at the same time. This significantly simplifies management of transaction signing.

## `AccountManager`

The [`AccountManager`](../code/classes/types_account_manager.AccountManager.md) is a class that is used to get, create, and fund accounts and perform account-related actions such as funding. The `AccountManager` also keeps track of signers for each address so when using the [`AlgokitComposer`](./algokit-composer.md) to send transactions, a signer function does not need to manually be specified for each transaction - instead it can be inferred from the sender address automatically!

To get an instance of `AccountManager`, you can use either [`AlgorandClient`](./algorand-client.md) via `algorand.account` or instantiate it directly (passing in a [`ClientManager`](./client.md)):

```typescript
import { AccountManager } from '@algorandfoundation/algokit-utils/types/account-manager'

const accountManager = new AccountManager(clientManager)
```

## `TransactionSignerAccount`

The core internal type that holds information about a signer/sender pair for a transaction is [`TransactionSignerAccount`](../code/interfaces/types_account.TransactionSignerAccount.md), which represents an `algosdk.TransactionSigner` (`signer`) along with a sender address (`addr`) as the encoded string address.

Many methods in `AccountManager` expose a `TransactionSignerAccount`.

### `SendTransactionFrom`

> [!NOTE]
> The [legacy functions](../README.md#usage) within AlgoKit Utils make use of a [`SendTransactionFrom`](../code/modules/types_transaction.md#sendtransactionfrom) union type that is slowly being phased out in favour of the simpler `TransactionSignerAccount`. This `SendTransactionFrom` type is still prevalent within the legacy functions though.

`SendTransactionFrom` is a union of the following types that each represent an account that can both sign a transaction and represent a sender address:

- `Account` - An in-built algosdk `Account` object
- [`SigningAccount`](../code/classes/types_account.SigningAccount.md) - An abstraction around `algosdk.Account` that supports rekeyed accounts
- `LogicSigAccount` - An in-built algosdk `algosdk.LogicSigAccount` object
- [`MultisigAccount`](../code/classes/types_account.MultisigAccount.md) - An abstraction around `algosdk.MultisigMetadata`, `algosdk.makeMultiSigAccountTransactionSigner`, `algosdk.multisigAddress`, `algosdk.signMultisigTransaction` and `algosdk.appendSignMultisigTransaction` that supports multisig accounts with one or more signers present
- [`TransactionSignerAccount`](../code/interfaces/types_account.TransactionSignerAccount.md) - An interface that provides a sender address alongside a transaction signer (e.g. for use with `AtomicTransactionComposer` or [useWallet](https://github.com/TxnLab/use-wallet))

The use of in-built algosdk types like `Account`, `LogicSigAccount` and `TransactionSigner` is aligned to the [Modularity](../README.md#core-principles) principle. Allowing you to co-exist non AlgoKit Utils code with AlgoKit Utils functions.

AlgoKit Utils provides a few helper methods to take one of these `SendTransactionFrom` objects (that to reiterate uses the [legacy imports](../README.md#usage) to access):

- [`algokit.getSenderAddress`](../code/modules/index.md#getsenderaddress) - Returns the public address of the sender the account represents
- [`algokit.getSenderTransactionSigner`](../code/modules/index.md#getsendertransactionsigner) - Returns a `TransactionSigner` to represent the signer of the account' note: this is memoized so multiple calls to this for the same account will safely return the same `TransactionSigner` instance; this works nicely with `AtomicTransactionComposer`
- [`algokit.signTransaction`](../code/modules/index.md#signtransaction) - Signs a single `algosdk.Transaction` object with the given account

## Accounts

In order to get/register accounts for signing operations you can use the following methods on [`AccountManager`](#accountmanager) (expressed here as `algorand.account` to denote the syntax via an [`AlgorandClient`](./algorand-client.md)):

- [`algorand.account.fromEnvironment(name, fundWith)`](../code/classes/types_account_manager.AccountManager.md#fromenvironment) - Registers and returns an account with private key loaded by convention based on the given name identifier - either by idempotently creating the account in KMD or from environment variable via `process.env['{NAME}_MNEMONIC']` and (optionally) `process.env['{NAME}_SENDER']` (if account is rekeyed)
  - This allows you to have powerful code that will automatically create and fund an account by name locally and when deployed against TestNet/MainNet will automatically resolve from environment variables, without having to have different code
  - Note: `fundWith` allows you to control how many ALGOs are seeded into an account created in KMD
- [`algorand.account.fromMnemonic(mnemonicSecret, sender?)`](../code/classes/types_account_manager.AccountManager.md#frommnemonic) - Registers and returns an account with secret key loaded by taking the mnemonic secret
- [`algorand.account.multisig(multisigParams, signingAccounts)`](../code/classes/types_account_manager.AccountManager.md#multisig) - Registers and returns a multisig account with one or more signing keys loaded
- [`algorand.account.rekeyed(sender, signer)`](../code/classes/types_account_manager.AccountManager.md#rekeyed) - Registers and returns an account representing the given rekeyed sender/signer combination
- [`algorand.account.random()`](../code/classes/types_account_manager.AccountManager.md#random) - Returns a new, cryptographically randomly generated account with private key loaded
- [`algorand.account.fromKmd()`](../code/classes/types_account_manager.AccountManager.md#fromkmd) - Returns an account with private key loaded from the given KMD wallet (identified by name)
- [`algorand.account.logicsig(program, args?)`](../code/classes/types_account_manager.AccountManager.md#logicsig) - Returns an account that represents a logic signature

### Dispenser

- [`algorand.account.dispenserFromEnvironment()`](../code/classes/types_account_manager.AccountManager.md#dispenserfromenvironment) - Returns an account (with private key loaded) that can act as a dispenser from environment variables, or against default LocalNet if no environment variables present
- [`algorand.account.localNetDispenser()`](../code/classes/types_account_manager.AccountManager.md#localnetdispenser) - Returns an account with private key loaded that can act as a dispenser for the default LocalNet dispenser account

## Rekey account

> [!NOTE]
> This method requires the [legacy AlgoKit Utils import method to access them](../README.md#usage).

One of the unique features of Algorand is the ability to change the private key that can authorise transactions for an account. This is called [rekeying](https://developer.algorand.org/docs/get-details/accounts/rekey/).

You can issue a transaction to rekey an account by using the `algokit.rekeyAccount(rekey, algod)` function. The `rekey` parameter is an [`AlgoRekeyParams`](../code/interfaces/types_transfer.AlgoRekeyParams.md) object with the following properties:

- All properties in [`SendTransactionParams`](./transaction.md#sendtransactionparams)
- `from: SendTransactionFrom` - The account that will be rekeyed
- `rekeyTo: SendTransactionFrom | string` - The address of the account that will be used to authorise transactions for the rekeyed account going forward
- `transactionParams?: SuggestedParams` - The optional [transaction parameters](./transaction.md#transaction-params)
- `note?: TransactionNote` - The [transaction note](./transaction.md#transaction-notes)
- `lease?: string | Uint8Array`: A [lease](https://developer.algorand.org/articles/leased-transactions-securing-advanced-smart-contract-design/) to assign to the transaction to enforce a mutually exclusive transaction (useful to prevent double-posting and other scenarios)

```typescript
// Example
await algokit.rekeyAccount(
  {
    from: account,
    rekeyTo: newAccount,
    // Optionally specify transactionParams, note, lease and transaction sending parameters
  },
  algod,
)

const rekeyedAccount = algokit.rekeyedAccount(newAccount, account.addr)
// rekeyedAccount can be used to sign transactions on behalf of account...
```

# KMD account management

When running LocalNet, you have an instance of the [Key Management Daemon](https://github.com/algorand/go-algorand/blob/master/daemon/kmd/README.md), which is useful for:

- Accessing the private key of the default accounts that are pre-seeded with algos so that other accounts can be funded and it's possible to use LocalNet
- Idempotently creating new accounts against a name that will stay intact while the LocalNet instance is running without you needing to store private keys anywhere (i.e. completely automated)

The KMD SDK is fairly low level so to make use of it there is a fair bit of boilerplate code that's needed. This code has been abstracted away into the `KmdAccountManager` class.

To get an instance of the `KmdAccountManager` class you can access it from [`AlgorandClient`](./algorand-client.md) via `algorand.account.kmd` or instantiate it directly (passing in a [`ClientManager`](./client.md)):

```typescript
import { KmdAccountManager } from '@algorandfoundation/algokit-utils/types/kmd-account-manager'

// Algod client only
const kmdAccountManager = new KmdAccountManager(clientManager)
```

The methods that are available are:

- [`getWalletAccount(walletName, predicate?, sender?)](../code/classes/types_kmd_account_manager.KmdAccountManager.md#getwalletaccount)` - Returns an Algorand signing account with private key loaded from the given KMD wallet (identified by name).
- [`getOrCreateWalletAccount(name, fundWith?)](../code/classes/types_kmd_account_manager.KmdAccountManager.md#getorcreatewalletaccount)` - Gets an account with private key loaded from a KMD wallet of the given name, or alternatively creates one with funds in it via a KMD wallet of the given name.
- [`getLocalNetDispenserAccount()](../code/classes/types_kmd_account_manager.KmdAccountManager.md#getlocalnetdispenseraccount)` - Returns an Algorand account with private key loaded for the default LocalNet dispenser account (that can be used to fund other accounts)

```typescript
// Get a wallet account that seeded the LocalNet network
const defaultDispenserAccount = await kmdAccountManager.getWalletAccount(
  'unencrypted-default-wallet',
  (a) => a.status !== 'Offline' && a.amount > 1_000_000_000,
)
// Same as above, but dedicated method call for convenience
const localNetDispenserAccount = await kmdAccountManager.getLocalNetDispenserAccount()
// Idempotently get (if exists) or create (if it doesn't exist yet) an account by name using KMD
// if creating it then fund it with 2 Algos from the default dispenser account
const newAccount = await kmdAccountManager.getOrCreateWalletAccount('account1', (2).algos())
// This will return the same account as above since the name matches
const existingAccount = await kmdAccountManager.getOrCreateWalletAccount('account1')
```

Some of this functionality is directly exposed from [`AccountManager`](#accountmanager), which has the added benefit of registering the account as a signer so they can be automatically used to sign transactions when using via [`AlgorandClient`](./algorand-client.md):

```typescript
// Get and register LocalNet dispenser
const localNetDispenser = await algorand.account.localNetDispenser()
// Get and register a dispenser by environment variable, or if not set then LocalNet dispenser via KMD
const dispenser = await algorand.account.dispenserFromEnvironment()
// Get / create and register account from KMD idempotently by name
const account1 = await algorand.account.fromKmd('account1', (2).algos())
```
