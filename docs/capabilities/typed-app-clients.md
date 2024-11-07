# Typed application clients

Typed application clients are automatically generated, typed TypeScript deployment and invocation clients for smart contracts that have a defined [ARC-56](https://github.com/algorandfoundation/ARCs/pull/258) or [ARC-32](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0032.md) application specification so that the development experience is easier with less upskill ramp-up and less deployment errors. These clients give you a type-safe, intellisense-driven experience for invoking the smart contract.

Typed application clients are the recommended way of interacting with smart contracts. If you don't have/want a typed client, but have an ARC-56/ARC-32 app spec then you can use the [non-typed application clients](./app-client.md) and if you want to call a smart contract you don't have an app spec file for you can use the underlying [app management](./app.md) and [app deployment](./app-deploy.md) functionality to manually construct transactions.

## Generating an app spec

You can generate an app spec file:

- Using [Algorand Python](https://algorandfoundation.github.io/puya/#quick-start)
- Using [TEALScript](https://tealscript.netlify.app/tutorials/hello-world/0004-artifacts/)
- By hand by following the specification [ARC-56](https://github.com/algorandfoundation/ARCs/pull/258)/[ARC-32](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0032.md)
- Using [Beaker](https://algorand-devrel.github.io/beaker/html/usage.html) (PyTEAL) _(DEPRECATED)_

## Generating a typed client

To generate a typed client from an app spec file you can use [algokit CLI](https://github.com/algorandfoundation/algokit-cli/blob/main/docs/features/generate.md#1-typed-clients):

```
> algokit generate client application.json --output /absolute/path/to/client.ts
```

## Getting a typed client instance

To get an instance of a typed client you can use an [`AlgorandClient`](./algorand-client.md) instance, which coordinates passing in SDK clients etc.:

```typescript
// Get an app factory
const factory = algorand.client.getTypedAppFactory(MyContractFactory)
// Resolve by ID for existing contract
const appClient = algorand.client.getTypedAppClientById(MyContractClient, {
  appId: 1234n,
})
// Resolve by creator address and contract name
const appClient = algorand.client.getTypedAppClientByCreatorAndName(MyContractClient, {
  creatorAddress: 'CREATORADDRESS',
})
const appClient = algorand.client.getTypedAppClientByCreatorAndName(MyContractClient, {
  creatorAddress: 'CREATORADDRESS',
  // Override the name (by default uses the name in the ARC-32 / ARC-56 app spec)
  appName: 'contract-name',
})

// With all optional params specified
const factory = algorand.client.getTypedAppFactory(MyContractFactory, {
  appName: nameOverride,
  deployTimeParams,
  defaultSender: 'DEFAULTSENDER',
  version: '2.0',
  updatable: true,
  deletable: false,
  deployTimeParams: {
    VALUE: 1,
  },
})
const appClient = algorand.client.getTypedAppClientById(MyContractClient, {
  appId: 12345n,
  appName: nameOverride,
  defaultSender: 'DEFAULTSENDER',
  approvalSourceMap,
  clearSourceMap,
})
const appClient = algorand.client.getTypedAppClientByCreatorAndName(MyContractClient, {
  creatorAddress: 'CREATORADDRESS',
  appName: nameOverride,
  defaultSender: 'DEFAULTSENDER',
  // Cached app lookup to avoid indexer calls
  appLookupCache,
  approvalSourceMap,
  clearSourceMap,
})
```

To understand the difference between resolving by ID and name see the underlying [app client documentation](./app-client.md#appclient).

## Client usage

See the [official usage docs](https://github.com/algorandfoundation/algokit-client-generator-ts/blob/main/docs/usage.md) for full details.

For a simple example that deploys a contract and calls a `"hello"` method, see below:

```typescript
// A similar working example can be seen in the AlgoKit init production smart contract templates, when using TypeScript deployment
// In this case the generated factory is called `HelloWorldAppFactory` and is in `./artifacts/HelloWorldApp/client.ts`
import { HelloWorldAppClient } from './artifacts/HelloWorldApp/client'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

// These require environment variables to be present, or it will retrieve from default LocalNet
const algorand = AlgorandClient.fromEnvironment()
const deployer = algorand.account.fromEnvironment('DEPLOYER', (1).algo())

// Create the typed app factory
const factory = algorand.client.getTypedAppFactory(HelloWorldAppFactory, {
  creatorAddress: deployer.addr,
  defaultSender: deployer.addr,
})

// Create the app and get a typed app client for the created app (note: this creates a new instance of the app every time,
//  you can use .deploy() to deploy idempotently if the app wasn't previously
//  deployed or needs to be updated if that's allowed)
const { appClient } = await factory.create()

// Make a call to an ABI method and print the result
const response = await appClient.hello({ name: 'world' })
console.log(response)
```
