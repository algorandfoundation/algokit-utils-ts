[@algorandfoundation/algokit-utils](../README.md) / [types/application-client](../modules/types_application_client.md) / AppClientDeployParams

# Interface: AppClientDeployParams

[types/application-client](../modules/types_application_client.md).AppClientDeployParams

Parameters to pass into ApplicationClient.deploy

## Table of contents

### Properties

- [allowDelete](types_application_client.AppClientDeployParams.md#allowdelete)
- [allowUpdate](types_application_client.AppClientDeployParams.md#allowupdate)
- [createArgs](types_application_client.AppClientDeployParams.md#createargs)
- [deleteArgs](types_application_client.AppClientDeployParams.md#deleteargs)
- [deployTimeParameters](types_application_client.AppClientDeployParams.md#deploytimeparameters)
- [onSchemaBreak](types_application_client.AppClientDeployParams.md#onschemabreak)
- [onUpdate](types_application_client.AppClientDeployParams.md#onupdate)
- [sendParams](types_application_client.AppClientDeployParams.md#sendparams)
- [sender](types_application_client.AppClientDeployParams.md#sender)
- [updateArgs](types_application_client.AppClientDeployParams.md#updateargs)
- [version](types_application_client.AppClientDeployParams.md#version)

## Properties

### allowDelete

• `Optional` **allowDelete**: `boolean`

Whether or not to allow deletes in the contract using the deploy-time deletability control if present in your contract.
If this is not specified then it will automatically be determined based on the AppSpec definition

#### Defined in

[types/application-client.ts:74](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L74)

___

### allowUpdate

• `Optional` **allowUpdate**: `boolean`

Whether or not to allow updates in the contract using the deploy-time updatability control if present in your contract.
If this is not specified then it will automatically be determined based on the AppSpec definition

#### Defined in

[types/application-client.ts:70](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L70)

___

### createArgs

• `Optional` **createArgs**: [`AppClientCallArgs`](../modules/types_application_client.md#appclientcallargs)

Any args to pass to any create transaction that is issued as part of deployment

#### Defined in

[types/application-client.ts:84](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L84)

___

### deleteArgs

• `Optional` **deleteArgs**: [`AppClientCallArgs`](../modules/types_application_client.md#appclientcallargs)

Any args to pass to any delete transaction that is issued as part of deployment

#### Defined in

[types/application-client.ts:88](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L88)

___

### deployTimeParameters

• `Optional` **deployTimeParameters**: [`TealTemplateParameters`](types_app.TealTemplateParameters.md)

Any deploy-time parameters to replace in the TEAL code

#### Defined in

[types/application-client.ts:78](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L78)

___

### onSchemaBreak

• `Optional` **onSchemaBreak**: [`OnSchemaBreak`](../enums/types_app.OnSchemaBreak.md) \| ``"replace"`` \| ``"fail"``

What action to perform if a schema break is detected

#### Defined in

[types/application-client.ts:80](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L80)

___

### onUpdate

• `Optional` **onUpdate**: ``"replace"`` \| ``"fail"`` \| [`OnUpdate`](../enums/types_app.OnUpdate.md) \| ``"update"``

What action to perform if a TEAL update is detected

#### Defined in

[types/application-client.ts:82](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L82)

___

### sendParams

• `Optional` **sendParams**: `Omit`<[`SendTransactionParams`](types_transaction.SendTransactionParams.md), ``"skipSending"`` \| ``"skipWaiting"``\>

Parameters to control transaction sending

#### Defined in

[types/application-client.ts:76](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L76)

___

### sender

• `Optional` **sender**: [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom)

The optional sender to send the transaction from, will use the application client's default sender by default if specified

#### Defined in

[types/application-client.ts:66](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L66)

___

### updateArgs

• `Optional` **updateArgs**: [`AppClientCallArgs`](../modules/types_application_client.md#appclientcallargs)

Any args to pass to any update transaction that is issued as part of deployment

#### Defined in

[types/application-client.ts:86](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L86)

___

### version

• `Optional` **version**: `string`

The version of the contract, uses "1.0" by default

#### Defined in

[types/application-client.ts:64](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L64)
