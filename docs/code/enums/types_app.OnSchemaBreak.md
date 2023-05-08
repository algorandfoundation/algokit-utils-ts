[@algorandfoundation/algokit-utils](../README.md) / [types/app](../modules/types_app.md) / OnSchemaBreak

# Enumeration: OnSchemaBreak

[types/app](../modules/types_app.md).OnSchemaBreak

What action to perform when deploying an app and a breaking schema change is detected

## Table of contents

### Enumeration Members

- [Fail](types_app.OnSchemaBreak.md#fail)
- [ReplaceApp](types_app.OnSchemaBreak.md#replaceapp)

## Enumeration Members

### Fail

• **Fail** = ``0``

Fail the deployment

#### Defined in

[src/types/app.ts:255](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L255)

___

### ReplaceApp

• **ReplaceApp** = ``1``

Delete the app and create a new one in its place

#### Defined in

[src/types/app.ts:257](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L257)
