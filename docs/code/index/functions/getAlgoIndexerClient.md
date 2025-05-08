[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getAlgoIndexerClient

# Function: ~~getAlgoIndexerClient()~~

> **getAlgoIndexerClient**(`config?`): `IndexerClient`

Defined in: [src/network-client.ts:121](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/network-client.ts#L121)

## Parameters

### config?

[`AlgoClientConfig`](../../types/network-client/interfaces/AlgoClientConfig.md)

The config if you want to override the default (getting config from process.env)

## Returns

`IndexerClient`

## Deprecated

Use `ClientManager.getIndexerClient(config, overrideIntDecoding)` or `ClientManager.getIndexerClientFromEnvironment(overrideIntDecoding)` instead.

Returns an indexer SDK client that automatically retries transient failures on idempotent calls

## Examples

```typescript
 // Uses process.env.INDEXER_SERVER, process.env.INDEXER_PORT and process.env.INDEXER_TOKEN
 const indexer = getAlgoIndexerClient()
 await indexer.makeHealthCheck().do()
 ```

```typescript
 const indexer = getAlgoIndexerClient(getAlgoNodeConfig('testnet', 'indexer'))
 await indexer.makeHealthCheck().do()
```

```typescript
 const indexer = getAlgoIndexerClient(getAlgoNodeConfig('mainnet', 'indexer'))
 await indexer.makeHealthCheck().do()
```

```typescript
 const indexer = getAlgoIndexerClient({server: 'http://localhost', port: '8980', token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'})
 await indexer.makeHealthCheck().do()
```
