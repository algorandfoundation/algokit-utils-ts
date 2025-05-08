[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getTestNetDispenserApiClient

# Function: ~~getTestNetDispenserApiClient()~~

> **getTestNetDispenserApiClient**(`params`): [`TestNetDispenserApiClient`](../../types/dispenser-client/classes/TestNetDispenserApiClient.md)

Defined in: [src/dispenser-client.ts:21](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/dispenser-client.ts#L21)

## Parameters

### params

An object containing parameters for the TestNetDispenserApiClient class.
Or null if you want the client to load the access token from the environment variable `ALGOKIT_DISPENSER_ACCESS_TOKEN`.

`null` | [`TestNetDispenserApiClientParams`](../../types/dispenser-client/interfaces/TestNetDispenserApiClientParams.md)

## Returns

[`TestNetDispenserApiClient`](../../types/dispenser-client/classes/TestNetDispenserApiClient.md)

An instance of the TestNetDispenserApiClient class.

## Deprecated

Use `clientManager.getTestNetDispenser` or `clientManager.getTestNetDispenserFromEnvironment` instead

Create a new TestNetDispenserApiClient instance.
Refer to [docs](https://github.com/algorandfoundation/algokit/blob/main/docs/testnet_api.md) on guidance to obtain an access token.

## Example

```ts
const client = algokit.getTestNetDispenserApiClient(
    {
      authToken: 'your_auth_token',
      requestTimeout: 15,
    }
)
```
