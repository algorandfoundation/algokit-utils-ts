[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getAppClient

# Function: ~~getAppClient()~~

> **getAppClient**(`appDetails`, `algod`): [`ApplicationClient`](../../types/app-client/classes/ApplicationClient.md)

Defined in: [src/app-client.ts:40](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app-client.ts#L40)

## Parameters

### appDetails

[`AppSpecAppDetails`](../../types/app-client/type-aliases/AppSpecAppDetails.md)

The details of the app

### algod

`AlgodClient`

An algod instance

## Returns

[`ApplicationClient`](../../types/app-client/classes/ApplicationClient.md)

The application client

## Deprecated

Use `AppClient` instead e.g. via `algorand.client.getAppClientById` or
`algorand.client.getAppClientByCreatorAndName`.
If you want to `create` or `deploy` then use `AppFactory` e.g. via `algorand.client.getAppFactory`,
which will in turn give you an `AppClient` instance against the created/deployed app to make other calls.

Create a new ApplicationClient instance

## Examples

```ts
Resolve by creator and name
const client = algokit.getAppClient(
    {
      resolveBy: 'creatorAndName',
      app: {appSpec},
      sender: {account},
      creatorAddress: {creator},
      findExistingUsing: indexerClient,
    },
    algodClient,
  )
```

```ts
Resolve by id:
const client = algokit.getAppClient(
    {
      resolveBy: 'id',
      app: {appSpec},
      sender: {account},
      id: {id},
    },
   algodClient,
)
```
