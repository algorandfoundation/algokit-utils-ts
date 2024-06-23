[@algorandfoundation/algokit-utils](../README.md) / [types/dispenser-client](../modules/types_dispenser_client.md) / TestNetDispenserApiClient

# Class: TestNetDispenserApiClient

[types/dispenser-client](../modules/types_dispenser_client.md).TestNetDispenserApiClient

`TestNetDispenserApiClient` is a class that provides methods to interact with the [Algorand TestNet Dispenser API](https://github.com/algorandfoundation/algokit/blob/main/docs/testnet_api.md).
It allows you to fund an address with Algos, refund a transaction, and get the funding limit for the Algo asset.

The class requires an authentication token and a request timeout to be initialized. The authentication token can be provided
either directly as a parameter or through an `ALGOKIT_DISPENSER_ACCESS_TOKEN` environment variable. If neither is provided, an error is thrown.

The request timeout can be provided as a parameter. If not provided, a default value is used.

**`Method`**

fund - Sends a funding request to the dispenser API to fund the specified address with the given amount of Algo.

**`Method`**

refund - Sends a refund request to the dispenser API for the specified refundTxnId.

**`Method`**

limit - Sends a request to the dispenser API to get the funding limit for the Algo asset.

**`Example`**

```typescript
const client = new TestNetDispenserApiClient({ authToken: 'your_auth_token', requestTimeout: 30 });
const fundResponse = await client.fund('your_address', 100);
const limitResponse = await client.getLimit();
await client.refund('your_transaction_id');
```

**`Throws`**

If neither the environment variable 'ALGOKIT_DISPENSER_ACCESS_TOKEN' nor the authToken parameter were provided.

## Table of contents

### Constructors

- [constructor](types_dispenser_client.TestNetDispenserApiClient.md#constructor)

### Properties

- [\_authToken](types_dispenser_client.TestNetDispenserApiClient.md#_authtoken)
- [\_requestTimeout](types_dispenser_client.TestNetDispenserApiClient.md#_requesttimeout)

### Accessors

- [authToken](types_dispenser_client.TestNetDispenserApiClient.md#authtoken)
- [requestTimeout](types_dispenser_client.TestNetDispenserApiClient.md#requesttimeout)

### Methods

- [fund](types_dispenser_client.TestNetDispenserApiClient.md#fund)
- [getLimit](types_dispenser_client.TestNetDispenserApiClient.md#getlimit)
- [processDispenserRequest](types_dispenser_client.TestNetDispenserApiClient.md#processdispenserrequest)
- [refund](types_dispenser_client.TestNetDispenserApiClient.md#refund)

## Constructors

### constructor

• **new TestNetDispenserApiClient**(`params?`): [`TestNetDispenserApiClient`](types_dispenser_client.TestNetDispenserApiClient.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | [`TestNetDispenserApiClientParams`](../interfaces/types_dispenser_client.TestNetDispenserApiClientParams.md) |

#### Returns

[`TestNetDispenserApiClient`](types_dispenser_client.TestNetDispenserApiClient.md)

#### Defined in

[src/types/dispenser-client.ts:69](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/dispenser-client.ts#L69)

## Properties

### \_authToken

• `Private` **\_authToken**: `string`

#### Defined in

[src/types/dispenser-client.ts:66](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/dispenser-client.ts#L66)

___

### \_requestTimeout

• `Private` **\_requestTimeout**: `number`

#### Defined in

[src/types/dispenser-client.ts:67](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/dispenser-client.ts#L67)

## Accessors

### authToken

• `get` **authToken**(): `string`

The authentication token used for API requests.

#### Returns

`string`

#### Defined in

[src/types/dispenser-client.ts:85](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/dispenser-client.ts#L85)

___

### requestTimeout

• `get` **requestTimeout**(): `number`

The timeout for API requests, in seconds.

#### Returns

`number`

#### Defined in

[src/types/dispenser-client.ts:89](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/dispenser-client.ts#L89)

## Methods

### fund

▸ **fund**(`address`, `amount`): `Promise`\<[`DispenserFundResponse`](../interfaces/types_dispenser_client.DispenserFundResponse.md)\>

Sends a funding request to the dispenser API to fund the specified address with the given amount of Algo.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | The address to fund. |
| `amount` | `number` | The amount of microAlgos to fund. |

#### Returns

`Promise`\<[`DispenserFundResponse`](../interfaces/types_dispenser_client.DispenserFundResponse.md)\>

DispenserFundResponse: An object containing the transaction ID and funded amount.

#### Defined in

[src/types/dispenser-client.ts:150](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/dispenser-client.ts#L150)

___

### getLimit

▸ **getLimit**(): `Promise`\<[`DispenserLimitResponse`](../interfaces/types_dispenser_client.DispenserLimitResponse.md)\>

Sends a request to the dispenser API to get the funding limit for the Algo asset.

#### Returns

`Promise`\<[`DispenserLimitResponse`](../interfaces/types_dispenser_client.DispenserLimitResponse.md)\>

DispenserLimitResponse: An object containing the funding limit amount.

#### Defined in

[src/types/dispenser-client.ts:176](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/dispenser-client.ts#L176)

___

### processDispenserRequest

▸ **processDispenserRequest**(`authToken`, `urlSuffix`, `body?`, `method?`): `Promise`\<`Response`\>

Processes a dispenser API request.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `authToken` | `string` | `undefined` | The authentication token. |
| `urlSuffix` | `string` | `undefined` | The URL suffix for the API request. |
| `body` | ``null`` \| `Record`\<`string`, `string` \| `number`\> | `null` | The request body. |
| `method` | `string` | `'POST'` | The HTTP method. |

#### Returns

`Promise`\<`Response`\>

The API response.

#### Defined in

[src/types/dispenser-client.ts:103](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/dispenser-client.ts#L103)

___

### refund

▸ **refund**(`refundTxnId`): `Promise`\<`void`\>

Sends a refund request to the dispenser API for the specified refundTxnId.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `refundTxnId` | `string` | The transaction ID to refund. |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/types/dispenser-client.ts:167](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/dispenser-client.ts#L167)
