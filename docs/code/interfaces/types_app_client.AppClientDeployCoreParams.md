[@algorandfoundation/algokit-utils](../README.md) / [types/app-client](../modules/types_app_client.md) / AppClientDeployCoreParams

# Interface: AppClientDeployCoreParams

[types/app-client](../modules/types_app_client.md).AppClientDeployCoreParams

Core parameters to pass into ApplicationClient.deploy

## Hierarchy

- **`AppClientDeployCoreParams`**

  ↳ [`AppClientDeployParams`](types_app_client.AppClientDeployParams.md)

## Table of contents

### Properties

- [allowDelete](types_app_client.AppClientDeployCoreParams.md#allowdelete)
- [allowUpdate](types_app_client.AppClientDeployCoreParams.md#allowupdate)
- [onSchemaBreak](types_app_client.AppClientDeployCoreParams.md#onschemabreak)
- [onUpdate](types_app_client.AppClientDeployCoreParams.md#onupdate)
- [sendParams](types_app_client.AppClientDeployCoreParams.md#sendparams)
- [sender](types_app_client.AppClientDeployCoreParams.md#sender)
- [version](types_app_client.AppClientDeployCoreParams.md#version)

## Properties

### allowDelete

• `Optional` **allowDelete**: `boolean`

Whether or not to allow deletes in the contract using the deploy-time deletability control if present in your contract.
If this is not specified then it will automatically be determined based on the AppSpec definition

#### Defined in

[src/types/app-client.ts:173](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L173)

___

### allowUpdate

• `Optional` **allowUpdate**: `boolean`

Whether or not to allow updates in the contract using the deploy-time updatability control if present in your contract.
If this is not specified then it will automatically be determined based on the AppSpec definition

#### Defined in

[src/types/app-client.ts:169](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L169)

___

### onSchemaBreak

• `Optional` **onSchemaBreak**: [`OnSchemaBreak`](../enums/types_app.OnSchemaBreak.md) \| ``"replace"`` \| ``"fail"`` \| ``"append"``

What action to perform if a schema break is detected

#### Defined in

[src/types/app-client.ts:175](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L175)

___

### onUpdate

• `Optional` **onUpdate**: ``"replace"`` \| ``"fail"`` \| ``"append"`` \| [`OnUpdate`](../enums/types_app.OnUpdate.md) \| ``"update"``

What action to perform if a TEAL update is detected

#### Defined in

[src/types/app-client.ts:177](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L177)

___

### sendParams

• `Optional` **sendParams**: `Omit`\<[`SendTransactionParams`](types_transaction.SendTransactionParams.md), ``"skipSending"`` \| ``"skipWaiting"``\>

Parameters to control transaction sending

#### Defined in

[src/types/app-client.ts:165](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L165)

___

### sender

• `Optional` **sender**: [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom)

The optional sender to send the transaction from, will use the application client's default sender by default if specified

#### Defined in

[src/types/app-client.ts:163](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L163)

___

### version

• `Optional` **version**: `string`

The version of the contract, uses "1.0" by default

#### Defined in

[src/types/app-client.ts:161](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L161)
