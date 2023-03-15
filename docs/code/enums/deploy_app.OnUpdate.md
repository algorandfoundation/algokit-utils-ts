[@algorandfoundation/algokit-utils](../README.md) / [deploy-app](../modules/deploy_app.md) / OnUpdate

# Enumeration: OnUpdate

[deploy-app](../modules/deploy_app.md).OnUpdate

What action to perform when deploying an app and an update is detected in the TEAL code

## Table of contents

### Enumeration Members

- [Fail](deploy_app.OnUpdate.md#fail)
- [ReplaceApp](deploy_app.OnUpdate.md#replaceapp)
- [UpdateApp](deploy_app.OnUpdate.md#updateapp)

## Enumeration Members

### Fail

• **Fail** = ``0``

Fail the deployment

#### Defined in

[deploy-app.ts:58](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/deploy-app.ts#L58)

___

### ReplaceApp

• **ReplaceApp** = ``2``

Delete the app and create a new one in its place

#### Defined in

[deploy-app.ts:62](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/deploy-app.ts#L62)

___

### UpdateApp

• **UpdateApp** = ``1``

Update the app

#### Defined in

[deploy-app.ts:60](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/deploy-app.ts#L60)
