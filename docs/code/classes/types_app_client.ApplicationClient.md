[@algorandfoundation/algokit-utils](../README.md) / [types/app-client](../modules/types_app_client.md) / ApplicationClient

# Class: ApplicationClient

[types/app-client](../modules/types_app_client.md).ApplicationClient

**`Deprecated`**

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
Use `AppClient` instead e.g. via `algorand.client.getAppClientById` or
`algorand.client.getAppClientByCreatorAndName`.
If you want to `create` or `deploy` then use `AppFactory` e.g. via `algorand.client.getAppFactory`,
which will in turn give you an `AppClient` instance against the created/deployed app to make other calls.
<<<<<<< HEAD
=======
Use `AppClient` instead.
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)

Application client - a class that wraps an ARC-0032 app spec and provides high productivity methods to deploy and call the app

## Table of contents

### Constructors

- [constructor](types_app_client.ApplicationClient.md#constructor)

### Properties

- [\_appAddress](types_app_client.ApplicationClient.md#_appaddress)
- [\_appId](types_app_client.ApplicationClient.md#_appid)
- [\_appName](types_app_client.ApplicationClient.md#_appname)
- [\_approvalSourceMap](types_app_client.ApplicationClient.md#_approvalsourcemap)
- [\_clearSourceMap](types_app_client.ApplicationClient.md#_clearsourcemap)
- [\_creator](types_app_client.ApplicationClient.md#_creator)
- [algod](types_app_client.ApplicationClient.md#algod)
- [appSpec](types_app_client.ApplicationClient.md#appspec)
- [deployTimeParams](types_app_client.ApplicationClient.md#deploytimeparams)
- [existingDeployments](types_app_client.ApplicationClient.md#existingdeployments)
- [indexer](types_app_client.ApplicationClient.md#indexer)
- [params](types_app_client.ApplicationClient.md#params)
- [sender](types_app_client.ApplicationClient.md#sender)

### Methods

- [call](types_app_client.ApplicationClient.md#call)
- [callOfType](types_app_client.ApplicationClient.md#calloftype)
- [clearState](types_app_client.ApplicationClient.md#clearstate)
- [closeOut](types_app_client.ApplicationClient.md#closeout)
- [compile](types_app_client.ApplicationClient.md#compile)
- [create](types_app_client.ApplicationClient.md#create)
- [delete](types_app_client.ApplicationClient.md#delete)
- [deploy](types_app_client.ApplicationClient.md#deploy)
- [exportSourceMaps](types_app_client.ApplicationClient.md#exportsourcemaps)
- [exposeLogicError](types_app_client.ApplicationClient.md#exposelogicerror)
- [fundAppAccount](types_app_client.ApplicationClient.md#fundappaccount)
- [getABIMethod](types_app_client.ApplicationClient.md#getabimethod)
- [getABIMethodParams](types_app_client.ApplicationClient.md#getabimethodparams)
- [getABIMethodSignature](types_app_client.ApplicationClient.md#getabimethodsignature)
- [getAppReference](types_app_client.ApplicationClient.md#getappreference)
- [getBoxNames](types_app_client.ApplicationClient.md#getboxnames)
- [getBoxValue](types_app_client.ApplicationClient.md#getboxvalue)
- [getBoxValueFromABIType](types_app_client.ApplicationClient.md#getboxvaluefromabitype)
- [getBoxValues](types_app_client.ApplicationClient.md#getboxvalues)
- [getBoxValuesFromABIType](types_app_client.ApplicationClient.md#getboxvaluesfromabitype)
- [getCallArgs](types_app_client.ApplicationClient.md#getcallargs)
- [getGlobalState](types_app_client.ApplicationClient.md#getglobalstate)
- [getLocalState](types_app_client.ApplicationClient.md#getlocalstate)
- [importSourceMaps](types_app_client.ApplicationClient.md#importsourcemaps)
- [optIn](types_app_client.ApplicationClient.md#optin)
- [update](types_app_client.ApplicationClient.md#update)

## Constructors

### constructor

• **new ApplicationClient**(`appDetails`, `algod`): [`ApplicationClient`](types_app_client.ApplicationClient.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appDetails` | [`AppSpecAppDetails`](../modules/types_app_client.md#appspecappdetails) | The details of the app |
| `algod` | `default` | An algod instance |

#### Returns

[`ApplicationClient`](types_app_client.ApplicationClient.md)

**`Deprecated`**

Use `AppClient` instead e.g. via `algorand.client.getAppClientById` or
`algorand.client.getAppClientByCreatorAndName`.
If you want to `create` or `deploy` then use `AppFactory` e.g. via `algorand.client.getAppFactory`,
which will in turn give you an `AppClient` instance against the created/deployed app to make other calls.

Create a new ApplicationClient instance

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1381](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1381)
=======
[src/types/app-client.ts:1166](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1166)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1323](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1323)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1346](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1346)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1379](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1379)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1384](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1384)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1385](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1385)
>>>>>>> de5873b (chore: draft tests)

## Properties

### \_appAddress

• `Private` **\_appAddress**: `string`

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1364](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1364)
=======
[src/types/app-client.ts:1154](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1154)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1311](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1311)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1329](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1329)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1362](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1362)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1367](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1367)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1368](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1368)
>>>>>>> de5873b (chore: draft tests)

___

### \_appId

• `Private` **\_appId**: `number` \| `bigint`

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1363](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1363)
=======
[src/types/app-client.ts:1153](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1153)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1310](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1310)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1328](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1328)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1361](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1361)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1366](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1366)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1367](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1367)
>>>>>>> de5873b (chore: draft tests)

___

### \_appName

• `Private` **\_appName**: `string`

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1366](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1366)
=======
[src/types/app-client.ts:1156](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1156)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1313](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1313)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1331](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1331)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1364](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1364)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1369](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1369)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1370](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1370)
>>>>>>> de5873b (chore: draft tests)

___

### \_approvalSourceMap

• `Private` **\_approvalSourceMap**: `undefined` \| `SourceMap`

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1368](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1368)
=======
[src/types/app-client.ts:1158](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1158)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1315](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1315)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1333](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1333)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1366](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1366)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1371](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1371)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1372](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1372)
>>>>>>> de5873b (chore: draft tests)

___

### \_clearSourceMap

• `Private` **\_clearSourceMap**: `undefined` \| `SourceMap`

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1369](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1369)
=======
[src/types/app-client.ts:1159](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1159)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1316](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1316)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1334](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1334)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1367](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1367)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1372](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1372)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1373](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1373)
>>>>>>> de5873b (chore: draft tests)

___

### \_creator

• `Private` **\_creator**: `undefined` \| `string`

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1365](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1365)
=======
[src/types/app-client.ts:1155](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1155)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1312](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1312)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1330](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1330)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1363](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1363)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1368](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1368)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1369](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1369)
>>>>>>> de5873b (chore: draft tests)

___

### algod

• `Private` **algod**: `default`

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1355](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1355)
=======
[src/types/app-client.ts:1145](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1145)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1302](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1302)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1320](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1320)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1353](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1353)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1358](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1358)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1359](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1359)
>>>>>>> de5873b (chore: draft tests)

___

### appSpec

• `Private` **appSpec**: [`AppSpec`](../interfaces/types_app_spec.AppSpec.md)

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1357](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1357)
=======
[src/types/app-client.ts:1147](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1147)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1304](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1304)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1322](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1322)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1355](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1355)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1360](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1360)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1361](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1361)
>>>>>>> de5873b (chore: draft tests)

___

### deployTimeParams

• `Private` `Optional` **deployTimeParams**: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md)

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1361](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1361)
=======
[src/types/app-client.ts:1151](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1151)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1308](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1308)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1326](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1326)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1359](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1359)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1364](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1364)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1365](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1365)
>>>>>>> de5873b (chore: draft tests)

___

### existingDeployments

• `Private` **existingDeployments**: `undefined` \| [`AppLookup`](../interfaces/types_app.AppLookup.md)

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1360](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1360)
=======
[src/types/app-client.ts:1150](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1150)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1307](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1307)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1325](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1325)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1358](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1358)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1363](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1363)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1364](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1364)
>>>>>>> de5873b (chore: draft tests)

___

### indexer

• `Private` `Optional` **indexer**: `default`

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1356](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1356)
=======
[src/types/app-client.ts:1146](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1146)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1303](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1303)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1321](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1321)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1354](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1354)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1359](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1359)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1360](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1360)
>>>>>>> de5873b (chore: draft tests)

___

### params

• `Private` **params**: `undefined` \| `SuggestedParams`

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1359](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1359)
=======
[src/types/app-client.ts:1149](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1149)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1306](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1306)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1324](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1324)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1357](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1357)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1362](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1362)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1363](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1363)
>>>>>>> de5873b (chore: draft tests)

___

### sender

• `Private` **sender**: `undefined` \| [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom)

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1358](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1358)
=======
[src/types/app-client.ts:1148](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1148)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1305](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1305)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1323](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1323)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1356](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1356)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1361](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1361)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1362](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1362)
>>>>>>> de5873b (chore: draft tests)

## Methods

### call

▸ **call**(`call?`): `Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `call?` | [`AppClientCallParams`](../modules/types_app_client.md#appclientcallparams) | The call details. |

#### Returns

`Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

The result of the call

**`Deprecated`**

Use `appClient.send.call` or `appClient.transactions.call` from an `AppClient` instance instead.

Issues a no_op (normal) call to the app.

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1709](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1709)
=======
[src/types/app-client.ts:1484](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1484)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1641](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1641)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1674](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1674)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1707](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1707)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1712](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1712)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1716](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1716)
>>>>>>> de5873b (chore: draft tests)

___

### callOfType

▸ **callOfType**(`call?`, `callType`): `Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | [`AppClientCallParams`](../modules/types_app_client.md#appclientcallparams) | The call details. |
| `callType` | ``"no_op"`` \| ``"opt_in"`` \| ``"close_out"`` \| ``"clear_state"`` \| ``"delete_application"`` \| `NoOpOC` \| `OptInOC` \| `CloseOutOC` \| `ClearStateOC` \| `DeleteApplicationOC` | The call type |

#### Returns

`Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

The result of the call

**`Deprecated`**

Use `appClient.send.call` or `appClient.transactions.call` from an `AppClient` instance instead.

Issues a call to the app with the given call type.

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1792](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1792)
=======
[src/types/app-client.ts:1557](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1557)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1714](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1714)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1757](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1757)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1790](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1790)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1795](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1795)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1799](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1799)
>>>>>>> de5873b (chore: draft tests)

___

### clearState

▸ **clearState**(`call?`): `Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `call?` | [`AppClientClearStateParams`](../modules/types_app_client.md#appclientclearstateparams) | The call details. |

#### Returns

`Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

The result of the call

**`Deprecated`**

Use `appClient.send.clearState` or `appClient.transactions.clearState` from an `AppClient` instance instead.

Issues a clear_state call to the app.

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1769](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1769)
=======
[src/types/app-client.ts:1538](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1538)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1695](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1695)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1734](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1734)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1767](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1767)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1772](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1772)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1776](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1776)
>>>>>>> de5873b (chore: draft tests)

___

### closeOut

▸ **closeOut**(`call?`): `Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `call?` | [`AppClientCallParams`](../modules/types_app_client.md#appclientcallparams) | The call details. |

#### Returns

`Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

The result of the call

**`Deprecated`**

Use `appClient.send.closeOut` or `appClient.transactions.closeOut` from an `AppClient` instance instead.

Issues a close_out call to the app.

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1758](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1758)
=======
[src/types/app-client.ts:1529](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1529)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1686](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1686)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1723](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1723)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1756](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1756)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1761](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1761)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1765](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1765)
>>>>>>> de5873b (chore: draft tests)

___

### compile

▸ **compile**(`compilation?`): `Promise`\<\{ `approvalCompiled`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `clearCompiled`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md)  }\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `compilation?` | [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) | The deploy-time parameters for the compilation |

#### Returns

`Promise`\<\{ `approvalCompiled`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `clearCompiled`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md)  }\>

The compiled approval and clear state programs

**`Deprecated`**

Use `AppClient.compile()` instead.

Compiles the approval and clear state programs and sets up the source map.

**`Deprecated`**

Use `AppClient.compile()` instead.

Compiles the approval and clear programs and sets up the source map.

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1420](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1420)
=======
[src/types/app-client.ts:1203](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1203)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1360](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1360)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1385](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1385)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1418](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1418)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1423](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1423)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1424](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1424)
>>>>>>> de5873b (chore: draft tests)

___

### create

▸ **create**(`create?`): `Promise`\<\{ `appAddress`: `string` ; `appId`: `number` \| `bigint` ; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation?`: `PendingTransactionResponse` ; `confirmations?`: `PendingTransactionResponse`[] ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: `Transaction` ; `transactions`: `Transaction`[]  }\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `create?` | [`AppClientCreateParams`](../modules/types_app_client.md#appclientcreateparams) | The parameters to create the app with |

#### Returns

`Promise`\<\{ `appAddress`: `string` ; `appId`: `number` \| `bigint` ; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation?`: `PendingTransactionResponse` ; `confirmations?`: `PendingTransactionResponse`[] ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: `Transaction` ; `transactions`: `Transaction`[]  }\>

The details of the created app, or the transaction to create it if `skipSending` and the compilation result

**`Deprecated`**

Use `create` from an `AppFactory` instance instead.

Creates a smart contract app, returns the details of the created app.

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1603](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1603)
=======
[src/types/app-client.ts:1382](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1382)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1539](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1539)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1568](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1568)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1601](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1601)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1606](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1606)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1610](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1610)
>>>>>>> de5873b (chore: draft tests)

___

### delete

▸ **delete**(`call?`): `Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `call?` | [`AppClientCallParams`](../modules/types_app_client.md#appclientcallparams) | The call details. |

#### Returns

`Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

The result of the call

**`Deprecated`**

Use `appClient.send.delete` or `appClient.transactions.delete` from an `AppClient` instance instead.

Issues a delete_application call to the app.

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1780](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1780)
=======
[src/types/app-client.ts:1547](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1547)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1704](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1704)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1745](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1745)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1778](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1778)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1783](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1783)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1787](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1787)
>>>>>>> de5873b (chore: draft tests)

___

### deploy

▸ **deploy**(`deploy?`): `Promise`\<`Partial`\<[`AppCompilationResult`](../interfaces/types_app.AppCompilationResult.md)\> & [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & \{ `operationPerformed`: ``"nothing"``  } \| \{ `appAddress`: `string` ; `appId`: `number` \| `bigint` ; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `createdMetadata`: [`AppDeployMetadata`](../interfaces/types_app.AppDeployMetadata.md) ; `createdRound`: `number` ; `deletable?`: `boolean` ; `deleted`: `boolean` ; `name`: `string` ; `operationPerformed`: ``"update"`` \| ``"create"`` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `updatable?`: `boolean` ; `updatedRound`: `number` ; `version`: `string`  } \| \{ `appAddress`: `string` ; `appId`: `number` \| `bigint` ; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `createdMetadata`: [`AppDeployMetadata`](../interfaces/types_app.AppDeployMetadata.md) ; `createdRound`: `number` ; `deletable?`: `boolean` ; `deleteResult`: [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) ; `deleteReturn?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `deleted`: `boolean` ; `name`: `string` ; `operationPerformed`: ``"replace"`` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `updatable?`: `boolean` ; `updatedRound`: `number` ; `version`: `string`  }\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `deploy?` | [`AppClientDeployParams`](../interfaces/types_app_client.AppClientDeployParams.md) | Deployment details |

#### Returns

`Promise`\<`Partial`\<[`AppCompilationResult`](../interfaces/types_app.AppCompilationResult.md)\> & [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & \{ `operationPerformed`: ``"nothing"``  } \| \{ `appAddress`: `string` ; `appId`: `number` \| `bigint` ; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `createdMetadata`: [`AppDeployMetadata`](../interfaces/types_app.AppDeployMetadata.md) ; `createdRound`: `number` ; `deletable?`: `boolean` ; `deleted`: `boolean` ; `name`: `string` ; `operationPerformed`: ``"update"`` \| ``"create"`` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `updatable?`: `boolean` ; `updatedRound`: `number` ; `version`: `string`  } \| \{ `appAddress`: `string` ; `appId`: `number` \| `bigint` ; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `createdMetadata`: [`AppDeployMetadata`](../interfaces/types_app.AppDeployMetadata.md) ; `createdRound`: `number` ; `deletable?`: `boolean` ; `deleteResult`: [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) ; `deleteReturn?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `deleted`: `boolean` ; `name`: `string` ; `operationPerformed`: ``"replace"`` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `updatable?`: `boolean` ; `updatedRound`: `number` ; `version`: `string`  }\>

The metadata and transaction result(s) of the deployment, or just the metadata if it didn't need to issue transactions

**`Deprecated`**

Use `deploy` from an `AppFactory` instance instead.

Idempotently deploy (create, update/delete if changed) an app against the given name via the given creator account, including deploy-time template placeholder substitutions.

To understand the architecture decisions behind this functionality please see https://github.com/algorandfoundation/algokit-cli/blob/main/docs/architecture-decisions/2023-01-12_smart-contract-deployment.md

**Note:** if there is a breaking state schema change to an existing app (and `onSchemaBreak` is set to `'replace'`) the existing app will be deleted and re-created.

**Note:** if there is an update (different TEAL code) to an existing app (and `onUpdate` is set to `'replace'`) the existing app will be deleted and re-created.

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1491](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1491)
=======
[src/types/app-client.ts:1272](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1272)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1429](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1429)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1456](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1456)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1489](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1489)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1494](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1494)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1498](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1498)
>>>>>>> de5873b (chore: draft tests)

___

### exportSourceMaps

▸ **exportSourceMaps**(): [`AppSourceMaps`](../interfaces/types_app_client.AppSourceMaps.md)

Export the current source maps for the app.

#### Returns

[`AppSourceMaps`](../interfaces/types_app_client.AppSourceMaps.md)

The source maps

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1456](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1456)
=======
[src/types/app-client.ts:1239](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1239)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1396](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1396)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1421](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1421)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1454](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1454)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1459](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1459)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1463](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1463)
>>>>>>> de5873b (chore: draft tests)

___

### exposeLogicError

▸ **exposeLogicError**(`e`, `isClear?`): `Error`

Takes an error that may include a logic error from a smart contract call and re-exposes the error to include source code information via the source map.
This is automatically used within `ApplicationClient` but if you pass `skipSending: true` e.g. if doing a group transaction
 then you can use this in a try/catch block to get better debugging information.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `e` | `Error` | The error to parse |
| `isClear?` | `boolean` | Whether or not the code was running the clear state program |

#### Returns

`Error`

The new error, or if there was no logic error or source map then the wrapped error with source details

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:2116](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2116)
=======
[src/types/app-client.ts:1875](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1875)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:2032](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2032)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:2083](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2083)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:2114](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2114)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:2119](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2119)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:2123](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2123)
>>>>>>> de5873b (chore: draft tests)

___

### fundAppAccount

▸ **fundAppAccount**(`fund`): `Promise`\<[`SendTransactionResult`](../interfaces/types_transaction.SendTransactionResult.md) \| \{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  } & \{ `transactions`: `Transaction`[]  }\>

Funds Algo into the app account for this app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fund` | [`AlgoAmount`](types_amount.AlgoAmount.md) \| [`FundAppAccountParams`](../interfaces/types_app_client.FundAppAccountParams.md) | The parameters for the funding or the funding amount |

#### Returns

`Promise`\<[`SendTransactionResult`](../interfaces/types_transaction.SendTransactionResult.md) \| \{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  } & \{ `transactions`: `Transaction`[]  }\>

The result of the funding

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1832](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1832)
=======
[src/types/app-client.ts:1597](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1597)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1754](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1754)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1797](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1797)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1830](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1830)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1835](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1835)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1839](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1839)
>>>>>>> de5873b (chore: draft tests)

___

### getABIMethod

▸ **getABIMethod**(`method`): `undefined` \| `ABIMethod`

Returns the ABI Method for the given method name string for the app represented by this application client instance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `string` | Either the name of the method or the ABI method spec definition string |

#### Returns

`undefined` \| `ABIMethod`

The ABI method for the given method

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:2073](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2073)
=======
[src/types/app-client.ts:1834](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1834)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1991](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1991)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:2040](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2040)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:2071](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2071)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:2076](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2076)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:2080](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2080)
>>>>>>> de5873b (chore: draft tests)

___

### getABIMethodParams

▸ **getABIMethodParams**(`method`): `undefined` \| `ABIMethodParams`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `string` | Either the name of the method or the ABI method spec definition string |

#### Returns

`undefined` \| `ABIMethodParams`

The ABI method params for the given method

**`Deprecated`**

<<<<<<< HEAD
<<<<<<< HEAD
Use `appClient.getABIMethod` instead.
=======
Use `AppClient.getABIMethod` instead.
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
Use `appClient.getABIMethod` instead.
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

Returns the ABI Method parameters for the given method name string for the app represented by this application client instance

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:2051](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2051)
=======
[src/types/app-client.ts:1812](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1812)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1969](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1969)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:2016](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2016)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:2049](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2049)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:2054](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2054)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:2058](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2058)
>>>>>>> de5873b (chore: draft tests)

___

### getABIMethodSignature

▸ **getABIMethodSignature**(`method`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `ABIMethodParams` \| `ABIMethod` |

#### Returns

`string`

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:2133](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2133)
=======
[src/types/app-client.ts:1892](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1892)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:2049](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2049)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:2100](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2100)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:2131](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2131)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:2136](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2136)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:2140](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2140)
>>>>>>> de5873b (chore: draft tests)

___

### getAppReference

▸ **getAppReference**(): `Promise`\<[`AppReference`](../interfaces/types_app.AppReference.md) \| [`AppMetadata`](../interfaces/types_app.AppMetadata.md)\>

#### Returns

`Promise`\<[`AppReference`](../interfaces/types_app.AppReference.md) \| [`AppMetadata`](../interfaces/types_app.AppMetadata.md)\>

The app reference, or if deployed using the `deploy` method, the app metadata too

**`Deprecated`**

Use `appClient.appId` and `appClient.appAddress` from an `AppClient` instance instead.

Gets the reference information for the current application instance.
`appId` will be 0 if it can't find an app.

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:2085](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2085)
=======
[src/types/app-client.ts:1844](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1844)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:2001](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2001)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:2052](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2052)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:2083](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2083)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:2088](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2088)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:2092](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2092)
>>>>>>> de5873b (chore: draft tests)

___

### getBoxNames

▸ **getBoxNames**(): `Promise`\<[`BoxName`](../interfaces/types_app.BoxName.md)[]\>

Returns the names of all current boxes for the current app.

#### Returns

`Promise`\<[`BoxName`](../interfaces/types_app.BoxName.md)[]\>

The names of the boxes

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1888](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1888)
=======
[src/types/app-client.ts:1653](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1653)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1810](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1810)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1853](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1853)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1886](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1886)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1891](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1891)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1895](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1895)
>>>>>>> de5873b (chore: draft tests)

___

### getBoxValue

▸ **getBoxValue**(`name`): `Promise`\<`Uint8Array`\>

Returns the value of the given box for the current app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` \| `Uint8Array` \| [`BoxName`](../interfaces/types_app.BoxName.md) | The name of the box to return either as a string, binary array or `BoxName` |

#### Returns

`Promise`\<`Uint8Array`\>

The current box value as a byte array

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1903](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1903)
=======
[src/types/app-client.ts:1668](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1668)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1825](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1825)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1868](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1868)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1901](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1901)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1906](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1906)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1910](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1910)
>>>>>>> de5873b (chore: draft tests)

___

### getBoxValueFromABIType

▸ **getBoxValueFromABIType**(`name`, `type`): `Promise`\<`ABIValue`\>

Returns the value of the given box for the current app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` \| `Uint8Array` \| [`BoxName`](../interfaces/types_app.BoxName.md) | The name of the box to return either as a string, binary array or `BoxName` |
| `type` | `ABIType` |  |

#### Returns

`Promise`\<`ABIValue`\>

The current box value as a byte array

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1919](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1919)
=======
[src/types/app-client.ts:1684](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1684)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1841](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1841)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1884](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1884)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1917](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1917)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1922](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1922)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1926](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1926)
>>>>>>> de5873b (chore: draft tests)

___

### getBoxValues

▸ **getBoxValues**(`filter?`): `Promise`\<\{ `name`: [`BoxName`](../interfaces/types_app.BoxName.md) ; `value`: `Uint8Array`  }[]\>

Returns the values of all current boxes for the current app.
Note: This will issue multiple HTTP requests (one per box) and it's not an atomic operation so values may be out of sync.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filter?` | (`name`: [`BoxName`](../interfaces/types_app.BoxName.md)) => `boolean` | Optional filter to filter which boxes' values are returned |

#### Returns

`Promise`\<\{ `name`: [`BoxName`](../interfaces/types_app.BoxName.md) ; `value`: `Uint8Array`  }[]\>

The (name, value) pair of the boxes with values as raw byte arrays

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1935](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1935)
=======
[src/types/app-client.ts:1700](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1700)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1857](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1857)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1900](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1900)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1933](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1933)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1938](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1938)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1942](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1942)
>>>>>>> de5873b (chore: draft tests)

___

### getBoxValuesFromABIType

▸ **getBoxValuesFromABIType**(`type`, `filter?`): `Promise`\<\{ `name`: [`BoxName`](../interfaces/types_app.BoxName.md) ; `value`: `ABIValue`  }[]\>

Returns the values of all current boxes for the current app decoded using an ABI Type.
Note: This will issue multiple HTTP requests (one per box) and it's not an atomic operation so values may be out of sync.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `ABIType` | The ABI type to decode the values with |
| `filter?` | (`name`: [`BoxName`](../interfaces/types_app.BoxName.md)) => `boolean` | Optional filter to filter which boxes' values are returned |

#### Returns

`Promise`\<\{ `name`: [`BoxName`](../interfaces/types_app.BoxName.md) ; `value`: `ABIValue`  }[]\>

The (name, value) pair of the boxes with values as the ABI Value

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1957](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1957)
=======
[src/types/app-client.ts:1722](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1722)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1879](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1879)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1922](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1922)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1955](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1955)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1960](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1960)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1964](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1964)
>>>>>>> de5873b (chore: draft tests)

___

### getCallArgs

▸ **getCallArgs**(`args`, `sender`): `Promise`\<`undefined` \| [`AppCallArgs`](../modules/types_app.md#appcallargs)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `args` | `undefined` \| [`AppClientCallArgs`](../modules/types_app_client.md#appclientcallargs) | The call args specific to this application client |
| `sender` | [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom) | The sender of this call. Will be used to fetch any default argument values if applicable |

#### Returns

`Promise`\<`undefined` \| [`AppCallArgs`](../modules/types_app.md#appcallargs)\>

The call args ready to pass into an app call

**`Deprecated`**

Use `appClient.params.*` from an `AppClient` instance instead.

Returns the arguments for an app call for the given ABI method or raw method specification.

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1981](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1981)
=======
[src/types/app-client.ts:1744](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1744)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1901](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1901)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1946](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1946)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1979](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1979)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1984](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1984)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1988](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1988)
>>>>>>> de5873b (chore: draft tests)

___

### getGlobalState

▸ **getGlobalState**(): `Promise`\<[`AppState`](../interfaces/types_app.AppState.md)\>

Returns global state for the current app.

#### Returns

`Promise`\<[`AppState`](../interfaces/types_app.AppState.md)\>

The global state

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1860](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1860)
=======
[src/types/app-client.ts:1625](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1625)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1782](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1782)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1825](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1825)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1858](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1858)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1863](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1863)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1867](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1867)
>>>>>>> de5873b (chore: draft tests)

___

### getLocalState

▸ **getLocalState**(`account`): `Promise`\<[`AppState`](../interfaces/types_app.AppState.md)\>

Returns local state for the given account / account address.

#### Parameters

| Name | Type |
| :------ | :------ |
| `account` | `string` \| [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom) |

#### Returns

`Promise`\<[`AppState`](../interfaces/types_app.AppState.md)\>

The global state

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1874](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1874)
=======
[src/types/app-client.ts:1639](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1639)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1796](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1796)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1839](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1839)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1872](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1872)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1877](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1877)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1881](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1881)
>>>>>>> de5873b (chore: draft tests)

___

### importSourceMaps

▸ **importSourceMaps**(`sourceMaps`): `void`

Import source maps for the app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sourceMaps` | [`AppSourceMaps`](../interfaces/types_app_client.AppSourceMaps.md) | The source maps to import |

#### Returns

`void`

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1473](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1473)
=======
[src/types/app-client.ts:1256](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1256)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1413](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1413)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1438](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1438)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1471](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1471)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1476](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1476)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1480](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1480)
>>>>>>> de5873b (chore: draft tests)

___

### optIn

▸ **optIn**(`call?`): `Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `call?` | [`AppClientCallParams`](../modules/types_app_client.md#appclientcallparams) | The call details. |

#### Returns

`Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

The result of the call

**`Deprecated`**

Use `appClient.send.optIn` or `appClient.transactions.optIn` from an `AppClient` instance instead.

Issues a opt_in call to the app.

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1747](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1747)
=======
[src/types/app-client.ts:1520](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1520)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1677](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1677)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1712](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1712)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1745](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1745)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1750](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1750)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1754](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1754)
>>>>>>> de5873b (chore: draft tests)

___

### update

▸ **update**(`update?`): `Promise`\<\{ `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation?`: `PendingTransactionResponse` ; `confirmations?`: `PendingTransactionResponse`[] ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: `Transaction` ; `transactions`: `Transaction`[]  }\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `update?` | [`AppClientUpdateParams`](../modules/types_app_client.md#appclientupdateparams) | The parameters to update the app with |

#### Returns

`Promise`\<\{ `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation?`: `PendingTransactionResponse` ; `confirmations?`: `PendingTransactionResponse`[] ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: `Transaction` ; `transactions`: `Transaction`[]  }\>

The transaction send result and the compilation result

**`Deprecated`**

Use `appClient.send.update` or `appClient.transactions.update` from an `AppClient` instance instead.

Updates the smart contract app.

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:1668](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1668)
=======
[src/types/app-client.ts:1445](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1445)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:1602](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1602)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:1633](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1633)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/app-client.ts:1666](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1666)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:1671](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1671)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
=======
[src/types/app-client.ts:1675](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1675)
>>>>>>> de5873b (chore: draft tests)
