[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / replaceDeployTimeControlParams

# Function: ~~replaceDeployTimeControlParams()~~

> **replaceDeployTimeControlParams**(`tealCode`, `params`): `string`

Defined in: [src/app-deploy.ts:294](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app-deploy.ts#L294)

## Parameters

### tealCode

`string`

The TEAL code to substitute

### params

The deploy-time deployment control parameter value to replace

#### deletable?

`boolean`

#### updatable?

`boolean`

## Returns

`string`

The replaced TEAL code

## Deprecated

Use `AppManager.replaceTealTemplateDeployTimeControlParams` instead

Replaces deploy-time deployment control parameters within the given teal code.

* `TMPL_UPDATABLE` for updatability / immutability control
* `TMPL_DELETABLE` for deletability / permanence control

Note: If these values are not undefined, but the corresponding `TMPL_*` value
 isn't in the teal code it will throw an exception.
