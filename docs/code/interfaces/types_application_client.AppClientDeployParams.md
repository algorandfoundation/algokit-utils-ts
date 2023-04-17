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
- [deployTimeParams](types_application_client.AppClientDeployParams.md#deploytimeparams)
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

[src/types/application-client.ts:100](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L100)

___

### allowUpdate

• `Optional` **allowUpdate**: `boolean`

Whether or not to allow updates in the contract using the deploy-time updatability control if present in your contract.
If this is not specified then it will automatically be determined based on the AppSpec definition

#### Defined in

[src/types/application-client.ts:96](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L96)

___

### createArgs

• `Optional` **createArgs**: [`AppClientCallArgs`](../modules/types_application_client.md#appclientcallargs)

Any args to pass to any create transaction that is issued as part of deployment

#### Defined in

[src/types/application-client.ts:110](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L110)

___

### deleteArgs

• `Optional` **deleteArgs**: [`AppClientCallArgs`](../modules/types_application_client.md#appclientcallargs)

Any args to pass to any delete transaction that is issued as part of deployment

#### Defined in

[src/types/application-client.ts:114](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L114)

___

### deployTimeParams

• `Optional` **deployTimeParams**: [`TealTemplateParams`](types_app.TealTemplateParams.md)

Any deploy-time parameters to replace in the TEAL code

#### Defined in

[src/types/application-client.ts:104](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L104)

___

### onSchemaBreak

• `Optional` **onSchemaBreak**: [`OnSchemaBreak`](../enums/types_app.OnSchemaBreak.md) \| ``"replace"`` \| ``"fail"``

What action to perform if a schema break is detected

#### Defined in

[src/types/application-client.ts:106](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L106)

___

### onUpdate

• `Optional` **onUpdate**: ``"replace"`` \| ``"fail"`` \| [`OnUpdate`](../enums/types_app.OnUpdate.md) \| ``"update"``

What action to perform if a TEAL update is detected

#### Defined in

[src/types/application-client.ts:108](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L108)

___

### sendParams

• `Optional` **sendParams**: `Omit`<[`SendTransactionParams`](types_transaction.SendTransactionParams.md), ``"skipSending"`` \| ``"skipWaiting"``\>

Parameters to control transaction sending

#### Defined in

[src/types/application-client.ts:102](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L102)

___

### sender

• `Optional` **sender**: [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom)

The optional sender to send the transaction from, will use the application client's default sender by default if specified

#### Defined in

[src/types/application-client.ts:92](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L92)

___

### updateArgs

• `Optional` **updateArgs**: [`AppClientCallArgs`](../modules/types_application_client.md#appclientcallargs)

Any args to pass to any update transaction that is issued as part of deployment

#### Defined in

[src/types/application-client.ts:112](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L112)

___

### version

• `Optional` **version**: `string`

The version of the contract, uses "1.0" by default

#### Defined in

[src/types/application-client.ts:90](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L90)
