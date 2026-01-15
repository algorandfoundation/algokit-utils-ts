[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-client](../README.md) / AppClientDeployCoreParams

# Interface: AppClientDeployCoreParams

Defined in: [src/types/app-client.ts:140](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L140)

Core parameters to pass into ApplicationClient.deploy

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extended by

- [`AppClientDeployParams`](AppClientDeployParams.md)

## Properties

### allowDelete?

> `optional` **allowDelete**: `boolean`

Defined in: [src/types/app-client.ts:154](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L154)

Whether or not to allow deletes in the contract using the deploy-time deletability control if present in your contract.
If this is not specified then it will automatically be determined based on the AppSpec definition

***

### allowUpdate?

> `optional` **allowUpdate**: `boolean`

Defined in: [src/types/app-client.ts:150](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L150)

Whether or not to allow updates in the contract using the deploy-time updatability control if present in your contract.
If this is not specified then it will automatically be determined based on the AppSpec definition

***

### onSchemaBreak?

> `optional` **onSchemaBreak**: `"replace"` \| [`OnSchemaBreak`](../../app/enumerations/OnSchemaBreak.md) \| `"fail"` \| `"append"`

Defined in: [src/types/app-client.ts:156](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L156)

What action to perform if a schema break is detected

***

### onUpdate?

> `optional` **onUpdate**: `"replace"` \| `"update"` \| `"fail"` \| `"append"` \| [`OnUpdate`](../../app/enumerations/OnUpdate.md)

Defined in: [src/types/app-client.ts:158](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L158)

What action to perform if a TEAL update is detected

***

### sender?

> `optional` **sender**: [`AddressWithTransactionSigner`](../../../Packages/Transact/interfaces/AddressWithTransactionSigner.md)

Defined in: [src/types/app-client.ts:144](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L144)

The optional sender to send the transaction from, will use the application client's default sender by default if specified

***

### sendParams?

> `optional` **sendParams**: `Omit`\<[`SendTransactionParams`](../../transaction/interfaces/SendTransactionParams.md), `"skipSending"` \| `"skipWaiting"`\>

Defined in: [src/types/app-client.ts:146](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L146)

Parameters to control transaction sending

***

### version?

> `optional` **version**: `string`

Defined in: [src/types/app-client.ts:142](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L142)

The version of the contract, uses "1.0" by default
