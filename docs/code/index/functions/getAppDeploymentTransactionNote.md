[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getAppDeploymentTransactionNote

# Function: ~~getAppDeploymentTransactionNote()~~

> **getAppDeploymentTransactionNote**(`metadata`): [`Arc2TransactionNote`](../../types/transaction/type-aliases/Arc2TransactionNote.md)

Defined in: [src/app-deploy.ts:271](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app-deploy.ts#L271)

## Parameters

### metadata

[`AppDeployMetadata`](../../types/app/interfaces/AppDeployMetadata.md)

The metadata of the deployment

## Returns

[`Arc2TransactionNote`](../../types/transaction/type-aliases/Arc2TransactionNote.md)

The transaction note as a utf-8 string

## Deprecated

Use `{ dAppName: APP_DEPLOY_NOTE_DAPP, data: metadata, format: 'j' }` instead.

Return the transaction note for an app deployment.
