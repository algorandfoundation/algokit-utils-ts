[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/testing](../README.md) / getMockServer

# Function: getMockServer()

> **getMockServer**(`clientType`): `Promise`\<[`MockServer`](../interfaces/MockServer.md)\>

Defined in: [packages/testing/src/mockServer.ts:92](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/testing/src/mockServer.ts#L92)

Get a mock server instance for the specified client type.

Reads the appropriate environment variable (MOCK_ALGOD_URL, MOCK_INDEXER_URL, or MOCK_KMD_URL)
and validates that the server is reachable before returning a MockServer instance.

## Parameters

### clientType

[`ClientType`](../type-aliases/ClientType.md)

The type of client to get a mock server for ('algod', 'indexer', or 'kmd')

## Returns

`Promise`\<[`MockServer`](../interfaces/MockServer.md)\>

Promise resolving to a MockServer instance

## Throws

Error if the environment variable is not set or the server is not reachable

## Example

```typescript
const server = await getMockServer('algod')
const client = new AlgodClient(DEFAULT_TOKEN, server.baseUrl)
// ... run tests ...
```
