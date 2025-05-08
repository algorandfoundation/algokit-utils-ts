[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / deployApp

# Function: ~~deployApp()~~

> **deployApp**(`deployment`, `algod`, `indexer?`): `Promise`\<`Partial`\<[`AppCompilationResult`](../../types/app/interfaces/AppCompilationResult.md)\> & [`ConfirmedTransactionResults`](../../types/transaction/interfaces/ConfirmedTransactionResults.md) & [`AppMetadata`](../../types/app/interfaces/AppMetadata.md) & `object` \| [`ConfirmedTransactionResults`](../../types/transaction/interfaces/ConfirmedTransactionResults.md) & [`AppMetadata`](../../types/app/interfaces/AppMetadata.md) & `object` \| [`AppMetadata`](../../types/app/interfaces/AppMetadata.md) & `object`\>

Defined in: [src/app-deploy.ts:51](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app-deploy.ts#L51)

## Parameters

### deployment

[`AppDeploymentParams`](../../types/app/interfaces/AppDeploymentParams.md)

The arguments to control the app deployment

### algod

`AlgodClient`

An algod client

### indexer?

`IndexerClient`

An indexer client, needed if `existingDeployments` not passed in

## Returns

`Promise`\<`Partial`\<[`AppCompilationResult`](../../types/app/interfaces/AppCompilationResult.md)\> & [`ConfirmedTransactionResults`](../../types/transaction/interfaces/ConfirmedTransactionResults.md) & [`AppMetadata`](../../types/app/interfaces/AppMetadata.md) & `object` \| [`ConfirmedTransactionResults`](../../types/transaction/interfaces/ConfirmedTransactionResults.md) & [`AppMetadata`](../../types/app/interfaces/AppMetadata.md) & `object` \| [`AppMetadata`](../../types/app/interfaces/AppMetadata.md) & `object`\>

The app reference of the new/existing app

## Deprecated

Use `algorand.appDeployer.deploy` instead.

Idempotently deploy (create, update/delete if changed) an app against the given name via the given creator account, including deploy-time template placeholder substitutions.

To understand the architecture decisions behind this functionality please see https://github.com/algorandfoundation/algokit-cli/blob/main/docs/architecture-decisions/2023-01-12_smart-contract-deployment.md

**Note:** When using the return from this function be sure to check `operationPerformed` to get access to various return properties like `transaction`, `confirmation` and `deleteResult`.

**Note:** if there is a breaking state schema change to an existing app (and `onSchemaBreak` is set to `'replace'`) the existing app will be deleted and re-created.

**Note:** if there is an update (different TEAL code) to an existing app (and `onUpdate` is set to `'replace'`) the existing app will be deleted and re-created.
