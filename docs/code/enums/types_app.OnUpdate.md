[@algorandfoundation/algokit-utils](../README.md) / [types/app](../modules/types_app.md) / OnUpdate

# Enumeration: OnUpdate

[types/app](../modules/types_app.md).OnUpdate

What action to perform when deploying an app and an update is detected in the TEAL code

## Table of contents

### Enumeration Members

- [Fail](types_app.OnUpdate.md#fail)
- [ReplaceApp](types_app.OnUpdate.md#replaceapp)
- [UpdateApp](types_app.OnUpdate.md#updateapp)

## Enumeration Members

### Fail

• **Fail** = ``0``

Fail the deployment

#### Defined in

[src/types/app.ts:240](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L240)

___

### ReplaceApp

• **ReplaceApp** = ``2``

Delete the app and create a new one in its place

#### Defined in

[src/types/app.ts:244](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L244)

___

### UpdateApp

• **UpdateApp** = ``1``

Update the app

#### Defined in

[src/types/app.ts:242](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L242)
