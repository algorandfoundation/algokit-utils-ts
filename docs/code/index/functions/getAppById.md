[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getAppById

# Function: ~~getAppById()~~

> **getAppById**(`appId`, `algod`): `Promise`\<`Application`\>

Defined in: [src/app.ts:406](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L406)

## Parameters

### appId

The id of the app

`number` | `bigint`

### algod

`AlgodClient`

An algod client

## Returns

`Promise`\<`Application`\>

The data about the app

## Deprecated

Use `algorand.app.getById` instead.

Gets the current data for the given app from algod.
