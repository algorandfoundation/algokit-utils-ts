[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-client](../README.md) / AppClientDeployCoreParams

# Interface: AppClientDeployCoreParams

Defined in: [src/types/app-client.ts:156](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L156)

Core parameters to pass into ApplicationClient.deploy

## Extended by

- [`AppClientDeployParams`](AppClientDeployParams.md)

## Properties

### allowDelete?

> `optional` **allowDelete**: `boolean`

Defined in: [src/types/app-client.ts:170](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L170)

Whether or not to allow deletes in the contract using the deploy-time deletability control if present in your contract.
If this is not specified then it will automatically be determined based on the AppSpec definition

***

### allowUpdate?

> `optional` **allowUpdate**: `boolean`

Defined in: [src/types/app-client.ts:166](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L166)

Whether or not to allow updates in the contract using the deploy-time updatability control if present in your contract.
If this is not specified then it will automatically be determined based on the AppSpec definition

***

### onSchemaBreak?

> `optional` **onSchemaBreak**: [`OnSchemaBreak`](../../app/enumerations/OnSchemaBreak.md) \| `"replace"` \| `"fail"` \| `"append"`

Defined in: [src/types/app-client.ts:172](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L172)

What action to perform if a schema break is detected

***

### onUpdate?

> `optional` **onUpdate**: `"replace"` \| `"fail"` \| `"append"` \| [`OnUpdate`](../../app/enumerations/OnUpdate.md) \| `"update"`

Defined in: [src/types/app-client.ts:174](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L174)

What action to perform if a TEAL update is detected

***

### sender?

> `optional` **sender**: [`SendTransactionFrom`](../../transaction/type-aliases/SendTransactionFrom.md)

Defined in: [src/types/app-client.ts:160](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L160)

The optional sender to send the transaction from, will use the application client's default sender by default if specified

***

### sendParams?

> `optional` **sendParams**: `Omit`\<[`SendTransactionParams`](../../transaction/interfaces/SendTransactionParams.md), `"skipSending"` \| `"skipWaiting"`\>

Defined in: [src/types/app-client.ts:162](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L162)

Parameters to control transaction sending

***

### version?

> `optional` **version**: `string`

Defined in: [src/types/app-client.ts:158](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L158)

The version of the contract, uses "1.0" by default
