[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-client](../README.md) / AppClientDeployParams

# Interface: AppClientDeployParams

Defined in: [src/types/app-client.ts:192](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L192)

Parameters to pass into ApplicationClient.deploy

## Extends

- [`AppClientDeployCoreParams`](AppClientDeployCoreParams.md).[`AppClientDeployCallInterfaceParams`](AppClientDeployCallInterfaceParams.md)

## Properties

### allowDelete?

> `optional` **allowDelete**: `boolean`

Defined in: [src/types/app-client.ts:170](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L170)

Whether or not to allow deletes in the contract using the deploy-time deletability control if present in your contract.
If this is not specified then it will automatically be determined based on the AppSpec definition

#### Inherited from

[`AppClientDeployCoreParams`](AppClientDeployCoreParams.md).[`allowDelete`](AppClientDeployCoreParams.md#allowdelete)

***

### allowUpdate?

> `optional` **allowUpdate**: `boolean`

Defined in: [src/types/app-client.ts:166](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L166)

Whether or not to allow updates in the contract using the deploy-time updatability control if present in your contract.
If this is not specified then it will automatically be determined based on the AppSpec definition

#### Inherited from

[`AppClientDeployCoreParams`](AppClientDeployCoreParams.md).[`allowUpdate`](AppClientDeployCoreParams.md#allowupdate)

***

### createArgs?

> `optional` **createArgs**: [`AppClientCallArgs`](../type-aliases/AppClientCallArgs.md)

Defined in: [src/types/app-client.ts:182](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L182)

Any args to pass to any create transaction that is issued as part of deployment

#### Inherited from

[`AppClientDeployCallInterfaceParams`](AppClientDeployCallInterfaceParams.md).[`createArgs`](AppClientDeployCallInterfaceParams.md#createargs)

***

### createOnCompleteAction?

> `optional` **createOnCompleteAction**: `"no_op"` \| `"opt_in"` \| `"close_out"` \| `"update_application"` \| `"delete_application"` \| `NoOpOC` \| `OptInOC` \| `CloseOutOC` \| `UpdateApplicationOC` \| `DeleteApplicationOC`

Defined in: [src/types/app-client.ts:184](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L184)

Override the on-completion action for the create call; defaults to NoOp

#### Inherited from

[`AppClientDeployCallInterfaceParams`](AppClientDeployCallInterfaceParams.md).[`createOnCompleteAction`](AppClientDeployCallInterfaceParams.md#createoncompleteaction)

***

### deleteArgs?

> `optional` **deleteArgs**: [`AppClientCallArgs`](../type-aliases/AppClientCallArgs.md)

Defined in: [src/types/app-client.ts:188](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L188)

Any args to pass to any delete transaction that is issued as part of deployment

#### Inherited from

[`AppClientDeployCallInterfaceParams`](AppClientDeployCallInterfaceParams.md).[`deleteArgs`](AppClientDeployCallInterfaceParams.md#deleteargs)

***

### deployTimeParams?

> `optional` **deployTimeParams**: [`TealTemplateParams`](../../app/interfaces/TealTemplateParams.md)

Defined in: [src/types/app-client.ts:180](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L180)

Any deploy-time parameters to replace in the TEAL code

#### Inherited from

[`AppClientDeployCallInterfaceParams`](AppClientDeployCallInterfaceParams.md).[`deployTimeParams`](AppClientDeployCallInterfaceParams.md#deploytimeparams)

***

### onSchemaBreak?

> `optional` **onSchemaBreak**: [`OnSchemaBreak`](../../app/enumerations/OnSchemaBreak.md) \| `"replace"` \| `"fail"` \| `"append"`

Defined in: [src/types/app-client.ts:172](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L172)

What action to perform if a schema break is detected

#### Inherited from

[`AppClientDeployCoreParams`](AppClientDeployCoreParams.md).[`onSchemaBreak`](AppClientDeployCoreParams.md#onschemabreak)

***

### onUpdate?

> `optional` **onUpdate**: `"replace"` \| `"fail"` \| `"append"` \| [`OnUpdate`](../../app/enumerations/OnUpdate.md) \| `"update"`

Defined in: [src/types/app-client.ts:174](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L174)

What action to perform if a TEAL update is detected

#### Inherited from

[`AppClientDeployCoreParams`](AppClientDeployCoreParams.md).[`onUpdate`](AppClientDeployCoreParams.md#onupdate)

***

### schema?

> `optional` **schema**: `Partial`\<[`AppStorageSchema`](../../app/interfaces/AppStorageSchema.md)\>

Defined in: [src/types/app-client.ts:194](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L194)

Any overrides for the storage schema to request for the created app; by default the schema indicated by the app spec is used.

***

### sender?

> `optional` **sender**: [`SendTransactionFrom`](../../transaction/type-aliases/SendTransactionFrom.md)

Defined in: [src/types/app-client.ts:160](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L160)

The optional sender to send the transaction from, will use the application client's default sender by default if specified

#### Inherited from

[`AppClientDeployCoreParams`](AppClientDeployCoreParams.md).[`sender`](AppClientDeployCoreParams.md#sender)

***

### sendParams?

> `optional` **sendParams**: `Omit`\<[`SendTransactionParams`](../../transaction/interfaces/SendTransactionParams.md), `"skipSending"` \| `"skipWaiting"`\>

Defined in: [src/types/app-client.ts:162](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L162)

Parameters to control transaction sending

#### Inherited from

[`AppClientDeployCoreParams`](AppClientDeployCoreParams.md).[`sendParams`](AppClientDeployCoreParams.md#sendparams)

***

### updateArgs?

> `optional` **updateArgs**: [`AppClientCallArgs`](../type-aliases/AppClientCallArgs.md)

Defined in: [src/types/app-client.ts:186](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L186)

Any args to pass to any update transaction that is issued as part of deployment

#### Inherited from

[`AppClientDeployCallInterfaceParams`](AppClientDeployCallInterfaceParams.md).[`updateArgs`](AppClientDeployCallInterfaceParams.md#updateargs)

***

### version?

> `optional` **version**: `string`

Defined in: [src/types/app-client.ts:158](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L158)

The version of the contract, uses "1.0" by default

#### Inherited from

[`AppClientDeployCoreParams`](AppClientDeployCoreParams.md).[`version`](AppClientDeployCoreParams.md#version)
