[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app](../README.md) / OnSchemaBreak

# Enumeration: OnSchemaBreak

Defined in: [src/types/app.ts:204](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L204)

What action to perform when deploying an app and a breaking schema change is detected

## Enumeration Members

### AppendApp

> **AppendApp**: `2`

Defined in: [src/types/app.ts:210](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L210)

Create a new app

***

### Fail

> **Fail**: `0`

Defined in: [src/types/app.ts:206](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L206)

Fail the deployment

***

### ReplaceApp

> **ReplaceApp**: `1`

Defined in: [src/types/app.ts:208](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L208)

Delete the app and create a new one in its place
