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

[types/application-client.ts:73](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L73)

___

### allowUpdate

• `Optional` **allowUpdate**: `boolean`

Whether or not to allow updates in the contract using the deploy-time updatability control if present in your contract.
If this is not specified then it will automatically be determined based on the AppSpec definition

#### Defined in

[types/application-client.ts:69](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L69)

___

### createArgs

• `Optional` **createArgs**: [`AppClientCallArgs`](../modules/types_application_client.md#appclientcallargs)

Any args to pass to any create transaction that is issued as part of deployment

#### Defined in

[types/application-client.ts:83](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L83)

___

### deleteArgs

• `Optional` **deleteArgs**: [`AppClientCallArgs`](../modules/types_application_client.md#appclientcallargs)

Any args to pass to any delete transaction that is issued as part of deployment

#### Defined in

[types/application-client.ts:87](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L87)

___

### deployTimeParameters

• `Optional` **deployTimeParameters**: [`TealTemplateParameters`](types_app.TealTemplateParameters.md)

Any deploy-time parameters to replace in the TEAL code

#### Defined in

[types/application-client.ts:77](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L77)

___

### onSchemaBreak

• `Optional` **onSchemaBreak**: [`OnSchemaBreak`](../enums/types_app.OnSchemaBreak.md) \| ``"replace"`` \| ``"fail"``

What action to perform if a schema break is detected

#### Defined in

[types/application-client.ts:79](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L79)

___

### onUpdate

• `Optional` **onUpdate**: ``"replace"`` \| ``"fail"`` \| [`OnUpdate`](../enums/types_app.OnUpdate.md) \| ``"update"``

What action to perform if a TEAL update is detected

#### Defined in

[types/application-client.ts:81](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L81)

___

### sendParams

• `Optional` **sendParams**: `Omit`<[`SendTransactionParams`](types_transaction.SendTransactionParams.md), ``"skipSending"`` \| ``"skipWaiting"`` \| ``"args"``\>

Parameters to control transaction sending

#### Defined in

[types/application-client.ts:75](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L75)

___

### sender

• `Optional` **sender**: [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom)

The optional sender to send the transaction from, will use the application client's default sender by default if specified

#### Defined in

[types/application-client.ts:65](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L65)

___

### updateArgs

• `Optional` **updateArgs**: [`AppClientCallArgs`](../modules/types_application_client.md#appclientcallargs)

Any args to pass to any update transaction that is issued as part of deployment

#### Defined in

[types/application-client.ts:85](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L85)

___

### version

• `Optional` **version**: `string`

The version of the contract, uses "1.0" by default

#### Defined in

[types/application-client.ts:63](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L63)
