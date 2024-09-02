[@algorandfoundation/algokit-utils](../README.md) / types/app-deployer

# Module: types/app-deployer

## Table of contents

### Classes

- [AppDeployer](../classes/types_app_deployer.AppDeployer.md)

### Interfaces

- [AppDeployParams](../interfaces/types_app_deployer.AppDeployParams.md)
- [AppLookup](../interfaces/types_app_deployer.AppLookup.md)
- [AppMetadata](../interfaces/types_app_deployer.AppMetadata.md)

### Type Aliases

- [AppDeployResult](types_app_deployer.md#appdeployresult)

## Type Aliases

### AppDeployResult

Ƭ **AppDeployResult**: [`Expand`](types_expand.md#expand)\<\{ `operationPerformed`: ``"create"``  } & [`AppMetadata`](../interfaces/types_app_deployer.AppMetadata.md) & [`SendAppCreateTransactionResult`](types_app.md#sendappcreatetransactionresult)\> \| [`Expand`](types_expand.md#expand)\<\{ `operationPerformed`: ``"update"``  } & [`AppMetadata`](../interfaces/types_app_deployer.AppMetadata.md) & [`SendAppUpdateTransactionResult`](types_app.md#sendappupdatetransactionresult)\> \| [`Expand`](types_expand.md#expand)\<\{ `operationPerformed`: ``"replace"``  } & [`AppMetadata`](../interfaces/types_app_deployer.AppMetadata.md) & [`SendAppCreateTransactionResult`](types_app.md#sendappcreatetransactionresult) & \{ `deleteResult`: [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) ; `deleteReturn?`: [`ABIReturn`](types_app.md#abireturn)  }\> \| [`Expand`](types_expand.md#expand)\<\{ `operationPerformed`: ``"nothing"``  } & [`AppMetadata`](../interfaces/types_app_deployer.AppMetadata.md)\>

#### Defined in

[src/types/app-deployer.ts:90](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L90)
