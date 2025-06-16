[@algorandfoundation/algokit-utils](../README.md) / types/call-http-with-retry

# Module: types/call-http-with-retry

## Table of contents

### Functions

- [callWithRetry](types_call_http_with_retry.md#callwithretry)

## Functions

### callWithRetry

▸ **callWithRetry**\<`T`\>(`func`): `Promise`\<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `ResponseContext` \| `BaseHTTPClientResponse` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `func` | () => `Promise`\<`T`\> |

#### Returns

`Promise`\<`T`\>

#### Defined in

[src/types/call-http-with-retry.ts:22](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/call-http-with-retry.ts#L22)
