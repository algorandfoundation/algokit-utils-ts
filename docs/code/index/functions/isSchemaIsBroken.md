[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / isSchemaIsBroken

# Function: ~~isSchemaIsBroken()~~

> **isSchemaIsBroken**(`before`, `after`): `boolean`

Defined in: [src/app-deploy.ts:229](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app-deploy.ts#L229)

## Parameters

### before

`ApplicationStateSchema`

The existing schema

### after

`ApplicationStateSchema`

The new schema

## Returns

`boolean`

Whether or not there is a breaking change

## Deprecated

Use `before.numByteSlice < after.numByteSlice || before.numUint < after.numUint` instead.

Returns true is there is a breaking change in the application state schema from before to after.
 i.e. if the schema becomes larger, since applications can't ask for more schema after creation.
 Otherwise, there is no error, the app just doesn't store data in the extra schema :(
