# v7 migration

Version 7 of AlgoKit Utils moved from a stateless function-based interface to a stateful class-based interface. Doing this allowed for a much easier and simpler consumption experience guided by intellisense, involves less passing around of redundant values (e.g. `algod` client) and is more performant since commonly retrieved values like transaction parameters are able to be cached.

The entry point to the vast majority of functionality in AlgoKit Utils is now available via a single entry-point, the [`AlgorandClient` class](./capabilities/algorand-client.md).

The old version will still work until the next major version bump (we have been careful to keep those functions working with backwards compatibility), but it exposes an older, function-based interface to the functionality that is deprecated. The new way to use AlgoKit Utils is via the `AlgorandClient` class, which is easier, simpler and more convenient to use and has powerful new features.

A simple example of the before and after follows:

```typescript
/**** Before ****/
import * as algokit from '@algorandfoundation/algokit-utils'
const algod = algokit.getAlgoClient()
const account = await algokit.mnemonicAccountFromEnvironment(
  {
    name: 'MY_ACCOUNT',
    fundWith: algokit.algos(2),
  },
  algod,
)
const payment = await algokit.transferAlgos({
  from: account,
  to: 'RECEIVER',
  amount: algokit.algos(1),
})

/**** After ****/
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
const algorand = await AlgorandClient.fromEnvironment()
const account = algorand.account.fromEnvironment('MY_ACCOUNT', (2).algo())
const payment = await algorand.send.payment({
  sender: account.addr,
  receiver: 'RECEIVER',
  amount: (1).algo(),
})
```

If you were following the recommended guidance for AlgoKit Utils then you can easily tell if you are using the old version by looking for this import line (which can act as a good todo checklist if you are migrating):

```typescript
import * as algokit from '@algorandfoundation/algokit-utils'
```

## Migrating

### Step 1 - Accomodate AlgoAmount change

There is a class in AlgoKit Utils called `AlgoAmount` that wraps the representation of microAlgo / Algo amounts. The `microAlgo` property on that class now returns a `bigint` rather than a `number`, which is a breaking change. This is to align with the new consistent way of representing certain types of values (in this case Algo balances and microAlgo amounts) as bigints.

### Step 1 - Replace sdk clients with `AlgorandClient`

To migrate the first step is to get an `AlgorandClient` instance at the same place(s) you had an algod instance. To do this you can look for anywhere you called the `getAlgoClient` method and replace them with an [equivalent mechanism](./capabilities/algorand-client.md#algorand-client) for getting an `AlgorandClient` instance.

You can retrieve an algod / indexer / kmd object to avoid the need to immediately have to rewrite all of the old calls by accessing them from the algorand client, e.g.:

```typescript
const algorand = AlgorandClient.mainnet() // ... or whichever other method you want to get a client
const algod = algorand.client.algod
// And if you need these...
const indexer = algorand.client.indexer
const kmd = algorand.client.kmd
```

Once you have fully migrated you will likely find you wont need these sdk client instances and can delete those variables.

### Step 2 - Replace function calls

Now you can replace the function calls one-by-one. Almost every call should have a `@deprecation` notice that will show up in intellisense for your IDE (e.g. VS Code). The method call will show up with ~~strikethrough~~ and if you hover over it then the deprecation notice will show the new functionality.

For instance, the `algokit.transferAlgos` call shown in the above example has the following deprecation notice:

> @deprecated Use `algorand.send.payment()` / `algorand.createTransaction.payment()` instead

These deprecation notices should largely let you follow the bouncing ball and make quick work of the migration. Largely the old vs new calls are fairly equivalent with some naming changes to improve consistency within AlgoKit Utils and more broadly to align to the core Algorand protocol (e.g. using `payment` rather than `transferAlgos` since it's a payment transaction on the Algorand blockchain). In saying that, there are some key differences that you will need to tweak:

- No longer any need to pass `algod`, `indexer`, or `kmd` around - remove those arguments
- Consistently using `sender` rather than `from`/`sender`/etc. for the transaction sender, and this argument is a string rather than taking a `SendTransactionFrom` type to improve simplicity (so you may need to add `.addr` or similar to an account object)
- Transfer receivers are now `receiver` rather than `to` and always take a string of the address (so you may need to add `.addr` or similar to an account object)
- `clearProgram` parameter is renamed to `clearStateProgram` and `extraPages` to `extraProgramPages` for create and update app calls (to align with Algorand protocol names).
- `extraProgramPages` appears as a top-level params property rather than nested in a `schema` property.
- Round numbers, app IDs and asset IDs are now consistently `BigInt`'s rather than `number` or `number | bigint`
- If you previously used `skipSending: true` that no longer exists; the new equivalent of that is to use `algorand.createTransaction...`, but otherwise you should use `algorand.send...` to immediately sign and send.
- If you previously used `atc` as a parameter when constructing a transaction that no longer exists; the new equivalent of that is to use `algorand.newGroup()` to get an [`AlgoKitComposer`](./capabilities/algokit-composer.md) and chain method calls to build up a group of transactions and then call `execute()` to execute the group.
- Functions that took multiple params objects largely only take a single, combined object now (intellisense is your friend, ctrl+space or your IDE's equivalent auto-complete keyboard shortcut will help you see all of the options!).

Other things to note that you may come across:

- We now restrict the number of valid rounds (10 rounds, except when pointing to LocalNet, which is still 1000 to avoid problems given the round advances for every transaction) to a much smaller window than the default (1000 rounds), but this is configurable [by default](./capabilities/algorand-client.md#transaction-configuration) and [per transaction](./capabilities/algorand-client.md#transaction-parameters) if that's a problem. If you come across this problem it will present as a dead transaction error.
- Transaction parameters are cached for a period of time to prevent repeated calls to the algod API to get default transaction parameters, but this sometimes means that you can create duplicate transaction IDs when previously that wouldn't happen, you will get an obvious error if that happens though and can adjust it by ensuring one of the parameters in your transaction change slightly (e.g. note, lease, validity window, etc.), you can also [exert control over default transaction parameter caching](./capabilities/algorand-client.md#transaction-configuration)
- Rather than always passing a signer into transaction calls (which is what the `SendTransactionFrom` instance previously combined with the address), we have decoupled signing and sender address via the `AccountManager` (`algorand.account`), which keeps track of the signer associated with a sender address so the signer can be resolved just in time.
  - Most of the time you don't need to worry about it since it will magically happen for you, but if you have situations where you are creating a signer outside of the `AccountManager` you will need to [register the signer](./capabilities/account.md#registering-a-signer) with the `AccountManager` first.
  - Note: you can also explicitly [pass a `signer`](./capabilities/algorand-client.md#transaction-parameters) in as well if you want an escape hatch.
- Things that were previously nested in a `sendParams` property are now collapsed into the parent params object

### Step 3 - Replace `ApplicationClient` usage

The existing `ApplicationClient` (untyped app client) class is still present until the next major version bump, but it's worthwhile migrating to the new [`AppClient` and `AppFactory` classes](./capabilities/app-client.md). These new clients are [ARC-56](https://github.com/algorandfoundation/ARCs/pull/258) compatible, but also take an [ARC-32](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0032.md) app spec file and will continue to support this indefinitely until such time the community deems they are deprecated.

All of the functionality in `ApplicationClient` is available within the new classes, but their interface is slightly different to make it easier to use and more consistent with the new `AlgorandClient` functionality. The key existing methods that have changed all have `@deprecation` notices to help guide you on this, but broadly the changes are:

- The constructor no longer has the confusing `resolveBy` semantics, instead there are static methods that determine different ways of constructing a client and the constructor itself is very simple (requiring `appId`)
- If you want to call `create` or `deploy` then you need an `AppFactory` to do that, and then it will in turn give you an `AppClient` instance that is connected to the app you just created / deployed. This significantly simplifies the app client because now the app client has a clear operating purpose: allow for calls and state management for an _instance_ of an app, whereas the app factory handles all of the calls when you don't have an instance yet (or may or may not have an instance in the case of `deploy`).
- This means that you can simply access `client.appId` and `client.appAddress` on `AppClient` since these values are known statically and won't change (previously you had to awkwardly call `await client.getAppReference()` since these values weren't always available and potentially required an API call to resolve).
- `fundAppAccount` no longer takes an `AlgoAmount` directly - it always expects the params object (more consistent with)
- `compile` is replaced with static methods on `AppClient` and `getABIMethodParams` is deprecated in favour of `getABIMethod`, which now returns the params _and_ the `ABIMethod`
- All of the methods that return or execute a transaction (`update`, `call`, `optIn`, etc.) are now exposed in an interface similar to the one in [`AlgorandClient`](./capabilities/algorand-client.md#creating-and-issuing-transactions), namely (where `{callType}` is one of: `update` / `delete` / `optIn` / `closeOut` / `clearState` / `call`):
  - `appClient.createTransaction.{callType}` to get a transaction for an ABI method call
  - `appClient.send.{callType}` to sign and send a transaction for an ABI method call
  - `appClient.params.{callType}` to get a [params object](./capabilities/algorand-client.md#transaction-parameters) for an ABI method call
  - `appClient.createTransaction.bare.{callType}` to get a transaction for a bare app call
  - `appClient.send.bare.{callType}` to sign and send a transaction for a bare app call
  - `appClient.params.bare.{callType}` to get a [params object](./capabilities/algorand-client.md#transaction-parameters) for a bare app call
- The `resolveBy` functionality has disappeared in favour of [much simpler entrypoints within `algorand.client`](./capabilities/app-client.md#appclient)
- When making an ABI method call, the method arguments property is now `args` rather than `methodArgs`
- The foreign reference arrays have been renamed (and are affected by the switch to `BigInt` for app and asset IDs) and appear in the top level params object rather than nested in an `args` property:
  - `boxes` -> `boxReferences`
  - `apps` -> `appReferences`
  - `assets` -> `assetReferences`
  - `accounts` -> `accountReferences`
- The return value for methods that send a transaction will have any ABI return value directly in the `return` property rather than the `ABIReturn` type (this behaviour matches what happened in typed clients, but has now been brought down to the underlying `AppClient`)

### Step 4 - Replace typed app client usage

Version 4 of the TypeScript typed app client generator introduces breaking changes to the generated client that support the new `AppFactory` and `AppClient` functionality along with adding ARC-56 support. The generated client has better typing support for things like state commensurate with the new capabilities within ARC-56.

If you are converting from an older typed client to a new one you will need to make the following changes:

- The constructor parameters for a client are different per the above notes about `AppClient`, the recommended way of constructing a client / factory is via `algorand.client.getTyped*()` for a terse creation experience
- The app client no longer creates or deploys contracts, you need to use the factory for that, which will in turn give you a typed client instance
- Method calls are no longer directly on the typed client, instead they are nested via `appClient.send.` and `appClient.createTransaction.`
- Method calls take a single params object (rather than (args, params)) and the args are nested in an `args` property within that object
- The `compile` method returns `{approvalProgram, clearStateProgram, compiledApproval, compiledClear}` rather than `{approvalCompiled, clearCompiled}`
- `extraPages` is no longer nested within a `schema` property, instead it's directly on the method call params as `extraProgramPages`
- `client.compose()` is now `client.newGroup()`
- `client.compose()....execute()` is now `client.compose()....send()`
