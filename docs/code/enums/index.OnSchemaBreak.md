[@algorandfoundation/algokit-utils](../README.md) / [index](../modules/index.md) / OnSchemaBreak

# Enumeration: OnSchemaBreak

[index](../modules/index.md).OnSchemaBreak

What action to perform when deploying an app and a breaking schema change is detected

## Table of contents

### Enumeration Members

- [Fail](index.OnSchemaBreak.md#fail)
- [ReplaceApp](index.OnSchemaBreak.md#replaceapp)

## Enumeration Members

### Fail

• **Fail** = ``0``

Fail the deployment

#### Defined in

[deploy-app.ts:68](https://github.com/algorandfoundation/algokit-utils-ts/blob/88a7c0f/src/deploy-app.ts#L68)

___

### ReplaceApp

• **ReplaceApp** = ``1``

Delete the app and create a new one in its place

#### Defined in

[deploy-app.ts:70](https://github.com/algorandfoundation/algokit-utils-ts/blob/88a7c0f/src/deploy-app.ts#L70)
