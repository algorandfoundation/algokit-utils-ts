[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getAppClientByCreatorAndName

# Function: ~~getAppClientByCreatorAndName()~~

> **getAppClientByCreatorAndName**(`appDetails`, `algod`): [`ApplicationClient`](../../types/app-client/classes/ApplicationClient.md)

Defined in: [src/app-client.ts:93](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app-client.ts#L93)

## Parameters

### appDetails

[`AppSpecAppDetailsByCreatorAndName`](../../types/app-client/type-aliases/AppSpecAppDetailsByCreatorAndName.md)

The details of the app by creator and name

### algod

`AlgodClient`

An algod instance

## Returns

[`ApplicationClient`](../../types/app-client/classes/ApplicationClient.md)

The application client

## Deprecated

Use `AppClient` instead e.g. via `algorand.client.getAppClientByCreatorAndName`.
If you want to `create` or `deploy` then use `AppFactory` e.g. via `algorand.client.getAppFactory`,
which will in turn give you an `AppClient` instance against the created/deployed app to make other calls.

Create a new ApplicationClient instance by creator and name

## Example

```ts
const client = algokit.getAppClientByCreatorAndName(
    {
      app: appSpec,
      sender: account,
      creatorAddress: account,
      findExistingUsing: indexerClient,
    },
    algodClient,
  )
```
