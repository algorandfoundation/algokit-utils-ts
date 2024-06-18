# Typed application clients

Typed deployment clients are automatically generated, typed TypeScript deployment and invocation clients for smart contracts that have an [ARC-0032 application specification](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0032.md) so that the development experience is easier with less upskill ramp-up and less deployment errors. These clients give you a type-safe, intellisense-driven experience for invoking the smart contract.

Typed application clients are the recommended way of interacting with smart contracts. If you don't have/want a typed client, but have an ARC-0032 app spec then you can use the [non-typed app client](./app-client.md) and if you want to call a smart contract you don't have an ARC-0032 file for you can use the underlying [app management](./app.md) and [app deployment](./app-deploy.md) functionality.

## Generating an ARC-0032 app spec

You can generate an ARC-0032 app spec file:

- Using [Algorand Python](https://algorandfoundation.github.io/puya/#quick-start)
- Using [TEALScript](https://tealscript.netlify.app/tutorials/hello-world/0004-artifacts/)
- Using [Beaker](https://algorand-devrel.github.io/beaker/html/usage.html) (PyTEAL)
- By hand by [following the specification](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0032.md)

## Generating a typed client

To generate a typed client from an ARC-0032 app spec file you can use [algokit CLI](https://github.com/algorandfoundation/algokit-cli/blob/main/docs/features/generate.md#1-typed-clients):

```
> algokit generate client application.json --output /absolute/path/to/client.ts
```

## Getting a typed client instance

To get an instance of a typed client you can use an [`AlgorandClient`](./algorand-client.md) instance, which coordinates passing in SDK clients etc.:

```typescript
// Resolve by ID
const appClient = algorand.client.getTypedAppClientById(MyContractClient, {
  // 0 means it's not been deployed yet and it will be created and the ID
  //  set if you call `create` or `deploy`, alternatively you can specify
  //  the ID of an existing deployed app
  id: 0,
})
// Resolve by creator address and contract name
const appClient = algorand.client.getTypedAppClientByCreatorAndName(MyContractClient, {
  creatorAddress: 'CREATORADDRESS',
})
const appClient = algorand.client.getTypedAppClientByCreatorAndName(MyContractClient, {
  creatorAddress: 'CREATORADDRESS',
  // Override the name (by default uses the name in the ARC-32 app spec)
  name: 'contract-name',
})

// With all optional params specified
const client = algorand.client.getTypedAppClientById({
  id: 12345,
  name: nameOverride,
  deployTimeParams,
  params: suggestedParams,
  sender: defaultSender,
})
const appClient = algorand.client.getTypedAppClientByCreatorAndName(
  MyContractClient,
  {
    creatorAddress: 'CREATORADDRESS',
    name: nameOverride,
    deployTimeParams,
    params: suggestedParams,
    sender: defaultSender,
  },
  // Cached app lookup to avoid indexer calls
  cachedAppLookup,
)
```

To understand the difference between resolving by ID and name see the underlying [app client documentation](./app-client.md#creating-an-application-client).

## Client usage

See the [official usage docs](https://github.com/algorandfoundation/algokit-client-generator-ts/blob/main/docs/usage.md) for full details.

For a simple example that deploys a contract and calls a `"hello"` method, see below:

```typescript
// A similar working example can be seen in the AlgoKit init production smart contract templates, when using TypeScript deployment
// In this case the generated client is called `HelloWorldAppClient` and is in `./artifacts/HelloWorldApp/client.ts`
import { HelloWorldAppClient } from './artifacts/HelloWorldApp/client'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

// These require environment variables to be present, or it will retrieve from default LocalNet
const algorand = AlgorandClient.fromEnvironment()
const deployer = algorand.account.fromEnvironment('DEPLOYER', (1).algos())

// Create the typed app client
const appClient = algorand.client.getTypedAppClientByCreatorAndName(HelloWorldAppClient, {
  creatorAddress: deployer.addr,
  sender: deployer,
})

// Create the app (note: this creates a new instance of the app every time,
//  you can use .deploy() to deploy idempotently if the app wasn't previously
//  deployed or needs to be updated if that's allowed)
const app = await appClient.create()

// Make a call to an ABI method and print the result
const response = await appClient.hello({ name: 'world' })
console.log(response)
```
