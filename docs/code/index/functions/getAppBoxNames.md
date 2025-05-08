[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getAppBoxNames

# Function: ~~getAppBoxNames()~~

> **getAppBoxNames**(`appId`, `algod`): `Promise`\<[`BoxName`](../../types/app/interfaces/BoxName.md)[]\>

Defined in: [src/app.ts:276](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L276)

## Parameters

### appId

The ID of the app return box names for

`number` | `bigint`

### algod

`AlgodClient`

An algod client instance

## Returns

`Promise`\<[`BoxName`](../../types/app/interfaces/BoxName.md)[]\>

The current box names

## Deprecated

Use `algorand.app.getBoxNames` instead.
Returns the names of the boxes for the given app.
