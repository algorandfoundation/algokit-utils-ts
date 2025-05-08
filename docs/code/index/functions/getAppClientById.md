[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getAppClientById

# Function: ~~getAppClientById()~~

> **getAppClientById**(`appDetails`, `algod`): [`ApplicationClient`](../../types/app-client/classes/ApplicationClient.md)

Defined in: [src/app-client.ts:66](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app-client.ts#L66)

## Parameters

### appDetails

[`AppSpecAppDetailsById`](../../types/app-client/type-aliases/AppSpecAppDetailsById.md)

The details of the app

### algod

`AlgodClient`

An algod instance

## Returns

[`ApplicationClient`](../../types/app-client/classes/ApplicationClient.md)

The application client

## Deprecated

Use `AppClient` instead e.g. via `algorand.client.getAppClientById`.
If you want to `create` or `deploy` then use `AppFactory` e.g. via `algorand.client.getAppFactory`,
which will in turn give you an `AppClient` instance against the created/deployed app to make other calls.

Create a new ApplicationClient instance by id

## Example

```ts
const client = algokit.getAppClientById(
    {
      app: {appSpec},
      sender: {account},
      id: {id},
    },
    algodClient,
  )
```
