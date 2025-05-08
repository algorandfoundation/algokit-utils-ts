[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getAlgoKmdClient

# Function: ~~getAlgoKmdClient()~~

> **getAlgoKmdClient**(`config?`): `KmdClient`

Defined in: [src/network-client.ts:144](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/network-client.ts#L144)

## Parameters

### config?

[`AlgoClientConfig`](../../types/network-client/interfaces/AlgoClientConfig.md)

The config if you want to override the default (getting config from process.env)

## Returns

`KmdClient`

## Deprecated

Use `ClientManager.getKmdClient(config)` or `ClientManager.getKmdClientFromEnvironment()` instead.

Returns a KMD SDK client that automatically retries transient failures on idempotent calls.

KMD client allows you to export private keys, which is useful to get the default account in a LocalNet network.

## Examples

```typescript
 // Uses process.env.ALGOD_SERVER, process.env.KMD_PORT (or if not specified: port 4002) and process.env.ALGOD_TOKEN
 const kmd = getAlgoKmdClient()
 ```

```typescript
 const kmd = getAlgoKmdClient({server: 'http://localhost', port: '4002', token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'})
```
