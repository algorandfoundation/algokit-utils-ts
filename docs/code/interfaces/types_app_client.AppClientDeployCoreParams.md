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

<<<<<<< HEAD
[src/types/app-client.ts:134](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L134)
=======
[src/types/app-client.ts:137](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L137)
>>>>>>> origin/main

___

### allowUpdate

• `Optional` **allowUpdate**: `boolean`

Whether or not to allow updates in the contract using the deploy-time updatability control if present in your contract.
If this is not specified then it will automatically be determined based on the AppSpec definition

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:130](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L130)
=======
[src/types/app-client.ts:133](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L133)
>>>>>>> origin/main

___

### onSchemaBreak

• `Optional` **onSchemaBreak**: [`OnSchemaBreak`](../enums/types_app.OnSchemaBreak.md) \| ``"replace"`` \| ``"fail"`` \| ``"append"``

What action to perform if a schema break is detected

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:136](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L136)
=======
[src/types/app-client.ts:139](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L139)
>>>>>>> origin/main

___

### onUpdate

• `Optional` **onUpdate**: ``"replace"`` \| ``"fail"`` \| ``"append"`` \| [`OnUpdate`](../enums/types_app.OnUpdate.md) \| ``"update"``

What action to perform if a TEAL update is detected

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:138](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L138)
=======
[src/types/app-client.ts:141](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L141)
>>>>>>> origin/main

___

### sendParams

• `Optional` **sendParams**: `Omit`\<[`SendTransactionParams`](types_transaction.SendTransactionParams.md), ``"skipSending"`` \| ``"skipWaiting"``\>

Parameters to control transaction sending

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:126](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L126)
=======
[src/types/app-client.ts:129](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L129)
>>>>>>> origin/main

___

### sender

• `Optional` **sender**: [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom)

The optional sender to send the transaction from, will use the application client's default sender by default if specified

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:124](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L124)
=======
[src/types/app-client.ts:127](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L127)
>>>>>>> origin/main

___

### version

• `Optional` **version**: `string`

The version of the contract, uses "1.0" by default

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:122](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L122)
=======
[src/types/app-client.ts:125](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L125)
>>>>>>> origin/main
