[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / performTemplateSubstitution

# Function: ~~performTemplateSubstitution()~~

> **performTemplateSubstitution**(`tealCode`, `templateParams?`): `string`

Defined in: [src/app-deploy.ts:309](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app-deploy.ts#L309)

## Parameters

### tealCode

`string`

The TEAL logic to compile

### templateParams?

[`TealTemplateParams`](../../types/app/interfaces/TealTemplateParams.md)

Any parameters to replace in the .teal file before compiling

## Returns

`string`

The TEAL code with replacements

## Deprecated

Use `AppManager.replaceTealTemplateParams` instead

Performs template substitution of a teal file.

Looks for `TMPL_{parameter}` for template replacements.
