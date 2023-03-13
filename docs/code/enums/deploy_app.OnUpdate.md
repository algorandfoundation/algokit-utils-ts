[algotstest](../README.md) / [deploy-app](../modules/deploy_app.md) / OnUpdate

# Enumeration: OnUpdate

[deploy-app](../modules/deploy_app.md).OnUpdate

What action to perform when deploying an app and an update is detected in the TEAL code

## Table of contents

### Enumeration Members

- [DeleteApp](deploy_app.OnUpdate.md#deleteapp)
- [Fail](deploy_app.OnUpdate.md#fail)
- [UpdateApp](deploy_app.OnUpdate.md#updateapp)

## Enumeration Members

### DeleteApp

• **DeleteApp** = ``2``

Delete the app and create a new one in its place

#### Defined in

[deploy-app.ts:62](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/deploy-app.ts#L62)

___

### Fail

• **Fail** = ``0``

Fail the deployment

#### Defined in

[deploy-app.ts:58](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/deploy-app.ts#L58)

___

### UpdateApp

• **UpdateApp** = ``1``

Update the app

#### Defined in

[deploy-app.ts:60](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/deploy-app.ts#L60)
