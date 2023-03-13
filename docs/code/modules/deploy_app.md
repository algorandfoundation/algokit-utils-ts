[algotstest](../README.md) / deploy-app

# Module: deploy-app

## Table of contents

### Enumerations

- [OnSchemaBreak](../enums/deploy_app.OnSchemaBreak.md)
- [OnUpdate](../enums/deploy_app.OnUpdate.md)

### Interfaces

- [AppDeployMetadata](../interfaces/deploy_app.AppDeployMetadata.md)
- [AppDeploymentParams](../interfaces/deploy_app.AppDeploymentParams.md)
- [AppLookup](../interfaces/deploy_app.AppLookup.md)
- [AppMetadata](../interfaces/deploy_app.AppMetadata.md)
- [TealTemplateParameters](../interfaces/deploy_app.TealTemplateParameters.md)

### Variables

- [APP\_DEPLOY\_NOTE\_PREFIX](deploy_app.md#app_deploy_note_prefix)
- [DELETABLE\_TEMPLATE\_NAME](deploy_app.md#deletable_template_name)
- [UPDATABLE\_TEMPLATE\_NAME](deploy_app.md#updatable_template_name)

### Functions

- [deployApp](deploy_app.md#deployapp)
- [getAppDeploymentTransactionNote](deploy_app.md#getappdeploymenttransactionnote)
- [getCreatorAppsByName](deploy_app.md#getcreatorappsbyname)
- [performTemplateSubstitutionAndCompile](deploy_app.md#performtemplatesubstitutionandcompile)
- [replaceDeployTimeControlParams](deploy_app.md#replacedeploytimecontrolparams)
- [schemaIsBroken](deploy_app.md#schemaisbroken)

## Variables

### APP\_DEPLOY\_NOTE\_PREFIX

• `Const` **APP\_DEPLOY\_NOTE\_PREFIX**: ``"APP_DEPLOY:"``

#### Defined in

[deploy-app.ts:10](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/deploy-app.ts#L10)

___

### DELETABLE\_TEMPLATE\_NAME

• `Const` **DELETABLE\_TEMPLATE\_NAME**: ``"TMPL_DELETABLE"``

#### Defined in

[deploy-app.ts:9](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/deploy-app.ts#L9)

___

### UPDATABLE\_TEMPLATE\_NAME

• `Const` **UPDATABLE\_TEMPLATE\_NAME**: ``"TMPL_UPDATABLE"``

#### Defined in

[deploy-app.ts:8](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/deploy-app.ts#L8)

## Functions

### deployApp

▸ **deployApp**(`deployment`, `algod`, `indexer`): `Promise`<[`SendTransactionResult`](../interfaces/transaction.SendTransactionResult.md) & [`AppMetadata`](../interfaces/deploy_app.AppMetadata.md) \| [`AppMetadata`](../interfaces/deploy_app.AppMetadata.md)\>

Idempotently deploy (create, update/delete if changed) an app against the given name via the given creator account, including deploy-time template placeholder substitutions.

To understand the architecture decisions behind this functionality please

**`See`**

https://github.com/algorandfoundation/algokit-cli/blob/main/docs/architecture-decisions/2023-01-12_smart-contract-deployment.md

**Note:** if there is a breaking state schema change to an existing app (and `onSchemaBreak` is set to `'delete'`) the existing app will be deleted and re-created.

**Note:** if there is an update (different TEAL code) to an existing app (and `onUpdate` is set to `'delete'`) the existing app will be deleted and re-created.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `deployment` | [`AppDeploymentParams`](../interfaces/deploy_app.AppDeploymentParams.md) | The arguments to control the app deployment, including: |
| `algod` | `default` | An algod client |
| `indexer` | `default` | An indexer client |

#### Returns

`Promise`<[`SendTransactionResult`](../interfaces/transaction.SendTransactionResult.md) & [`AppMetadata`](../interfaces/deploy_app.AppMetadata.md) \| [`AppMetadata`](../interfaces/deploy_app.AppMetadata.md)\>

The app reference of the new/existing app

#### Defined in

[deploy-app.ts:106](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/deploy-app.ts#L106)

___

### getAppDeploymentTransactionNote

▸ **getAppDeploymentTransactionNote**(`metadata`): `string`

Return the transaction note for an app deployment.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `metadata` | [`AppDeployMetadata`](../interfaces/deploy_app.AppDeployMetadata.md) | The metadata of the deployment |

#### Returns

`string`

The transaction note as a utf-8 string

#### Defined in

[deploy-app.ts:473](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/deploy-app.ts#L473)

___

### getCreatorAppsByName

▸ **getCreatorAppsByName**(`indexer`, `creatorAccount`): `Promise`<[`AppLookup`](../interfaces/deploy_app.AppLookup.md)\>

Returns a lookup of name => app metadata (id, address, ...metadata) for all apps created by the given account that have an

**`See`**

in the transaction note of the creation transaction.

**Note:** It's recommended this is only called once and then stored since it's a somewhat expensive operation (multiple indexer calls).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexer` | `default` | An indexer client |
| `creatorAccount` | `string` \| [`SendTransactionFrom`](transaction.md#sendtransactionfrom) | The account (with private key loaded) or string address of an account that is the creator of the apps you want to search for |

#### Returns

`Promise`<[`AppLookup`](../interfaces/deploy_app.AppLookup.md)\>

A name-based lookup of the app information (id, address)

#### Defined in

[deploy-app.ts:374](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/deploy-app.ts#L374)

___

### performTemplateSubstitutionAndCompile

▸ **performTemplateSubstitutionAndCompile**(`tealCode`, `algod`, `templateParameters?`, `deploymentMetadata?`): `Promise`<[`CompiledTeal`](../interfaces/app.CompiledTeal.md)\>

Performs template substitution of a teal file and compiles it, returning the compiled result and optionally caching on the file system.

Looks for `TMPL_{parameter}` for template replacements.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tealCode` | `string` | The TEAL logic to compile |
| `algod` | `default` | An algod client |
| `templateParameters?` | [`TealTemplateParameters`](../interfaces/deploy_app.TealTemplateParameters.md) | Any parameters to replace in the .teal file before compiling |
| `deploymentMetadata?` | [`AppDeployMetadata`](../interfaces/deploy_app.AppDeployMetadata.md) | The deployment metadata the app will be deployed with |

#### Returns

`Promise`<[`CompiledTeal`](../interfaces/app.CompiledTeal.md)\>

The information about the compiled code

#### Defined in

[deploy-app.ts:504](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/deploy-app.ts#L504)

___

### replaceDeployTimeControlParams

▸ **replaceDeployTimeControlParams**(`tealCode`, `params`): `string`

Replaces deploy-time deployment control parameters within the given teal code.

**`See`**

 - 
 - 

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tealCode` | `string` | The TEAL code to substitute |
| `params` | `Object` | The deploy-time deployment control parameter value to replace |
| `params.deletable` | `boolean` | - |
| `params.updatable` | `boolean` | - |

#### Returns

`string`

The replaced TEAL code

#### Defined in

[deploy-app.ts:487](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/deploy-app.ts#L487)

___

### schemaIsBroken

▸ **schemaIsBroken**(`before`, `after`): `boolean`

Returns true is there is a breaking change in the application state schema from before to after.
 i.e. if the schema becomes larger, since applications can't ask for more schema after creation.
 Otherwise, there is no error, the app just doesn't store data in the extra schema :(

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `before` | [`ApplicationStateSchema`](../interfaces/algod_type.ApplicationStateSchema.md) | The existing schema |
| `after` | [`ApplicationStateSchema`](../interfaces/algod_type.ApplicationStateSchema.md) | The new schema |

#### Returns

`boolean`

Whether or not there is a breaking change

#### Defined in

[deploy-app.ts:361](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/deploy-app.ts#L361)
