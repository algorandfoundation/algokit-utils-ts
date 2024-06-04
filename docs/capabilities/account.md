# Account management

Account management is one of the core capabilities provided by AlgoKit Utils. It allows you to create mnemonic, rekeyed, multisig, transaction signer, idempotent KMD and environment variable injected accounts that can be used to sign transactions as well as representing a sender address at the same time. This significantly simplifies passing around sender/signer within and into AlgoKit Utils.

## AccountManager

The [`AccountManager`](../code/classes/types_account_manager.AccountManager.md) is a class that is used to get, create, and fund accounts and perform account-related actions such as funding. The `AccountManager` also keeps track of signers for each address so when using the `AlgokitComposer` to send transactions, a signer function does not need to manually be specified for each transaction.

## AlgorandClient

`AlgorandClient` instances have an account manager exposed via [AlgorandClient.prototype.account](../code/classes/types_algorand_client.AlgorandClient.md#account).

## Accounts

In order to get the accounts you can use the underlying algosdk methods where relevant, or you can use the following AlgoKit Utils functions (all of which return a type compatible with `SendTransactionFrom`):

- [`AccountManager.prototype.mnemonicAccountFromEnvironment(name, findWith?)`](../code/classes/types_account_manager.AccountManager.md#fromEnvironment) - Returns an Algorand account with private key loaded by convention based on the given name identifier - either by idempotently creating the account in KMD or from environment variable via `process.env['{NAME}_MNEMONIC']` and (optionally) `process.env['{NAME}_SENDER']` (if account is rekeyed)
  - This allows you to have powerful code that will automatically create and fund an account by name locally and when deployed against TestNet/MainNet will automatically resolve from environment variables, without having to have different code
- [`AccountManager.prototype.fromMnemonic(mnemonicSecret)`](../code/classes/types_account_manager.AccountManager.md#frommnemonic) - Returns an Algorand account (`algosdk.Account`) with secret key loaded (i.e. that can sign transactions) by taking the mnemonic secret.
- [`AccountManager.prototype.multisig(multisigParams, signingAccounts)`](../code/classes/types_account_manager.AccountManager.md#multisig) - Returns a multisig account with one or more signing keys loaded.
- [`AccountManager.prototype.random()`](../code/classes/types_account_manager.AccountManager.md#random) - Returns a new, cryptographically randomly generated account with private key loaded.

### Dispenser

- [`AccountManager.prototype.dispenser()`](../code/classes/types_account_manager.AccountManager.md#dispenser) - Returns an account that can act as a dispenser to fund other accounts either via Kmd (when targeting LocalNet) or by convention from environment variable via `process.env.DISPENSER_MNEMONIC` (and optionally `process.env.DISPENSER_SENDER` if rekeyed)
