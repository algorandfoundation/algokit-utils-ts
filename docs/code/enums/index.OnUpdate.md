[@algorandfoundation/algokit-utils](../README.md) / [index](../modules/index.md) / OnUpdate

# Enumeration: OnUpdate

[index](../modules/index.md).OnUpdate

What action to perform when deploying an app and an update is detected in the TEAL code

## Table of contents

### Enumeration Members

- [Fail](index.OnUpdate.md#fail)
- [ReplaceApp](index.OnUpdate.md#replaceapp)
- [UpdateApp](index.OnUpdate.md#updateapp)

## Enumeration Members

### Fail

• **Fail** = ``0``

Fail the deployment

#### Defined in

[deploy-app.ts:58](https://github.com/algorandfoundation/algokit-utils-ts/blob/88a7c0f/src/deploy-app.ts#L58)

___

### ReplaceApp

• **ReplaceApp** = ``2``

Delete the app and create a new one in its place

#### Defined in

[deploy-app.ts:62](https://github.com/algorandfoundation/algokit-utils-ts/blob/88a7c0f/src/deploy-app.ts#L62)

___

### UpdateApp

• **UpdateApp** = ``1``

Update the app

#### Defined in

[deploy-app.ts:60](https://github.com/algorandfoundation/algokit-utils-ts/blob/88a7c0f/src/deploy-app.ts#L60)
