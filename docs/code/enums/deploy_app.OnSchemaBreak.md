[@algorandfoundation/algokit-utils](../README.md) / [deploy-app](../modules/deploy_app.md) / OnSchemaBreak

# Enumeration: OnSchemaBreak

[deploy-app](../modules/deploy_app.md).OnSchemaBreak

What action to perform when deploying an app and a breaking schema change is detected

## Table of contents

### Enumeration Members

- [Fail](deploy_app.OnSchemaBreak.md#fail)
- [ReplaceApp](deploy_app.OnSchemaBreak.md#replaceapp)

## Enumeration Members

### Fail

• **Fail** = ``0``

Fail the deployment

#### Defined in

[deploy-app.ts:68](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/deploy-app.ts#L68)

___

### ReplaceApp

• **ReplaceApp** = ``1``

Delete the app and create a new one in its place

#### Defined in

[deploy-app.ts:70](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/deploy-app.ts#L70)
