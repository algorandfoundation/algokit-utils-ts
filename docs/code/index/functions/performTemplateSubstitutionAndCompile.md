[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / performTemplateSubstitutionAndCompile

# Function: ~~performTemplateSubstitutionAndCompile()~~

> **performTemplateSubstitutionAndCompile**(`tealCode`, `algod`, `templateParams?`, `deploymentMetadata?`): `Promise`\<[`CompiledTeal`](../../types/app/interfaces/CompiledTeal.md)\>

Defined in: [src/app-deploy.ts:326](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app-deploy.ts#L326)

## Parameters

### tealCode

`string`

The TEAL logic to compile

### algod

`AlgodClient`

An algod client

### templateParams?

[`TealTemplateParams`](../../types/app/interfaces/TealTemplateParams.md)

Any parameters to replace in the .teal file before compiling

### deploymentMetadata?

[`AppDeployMetadata`](../../types/app/interfaces/AppDeployMetadata.md)

The deployment metadata the app will be deployed with

## Returns

`Promise`\<[`CompiledTeal`](../../types/app/interfaces/CompiledTeal.md)\>

The information about the compiled code

## Deprecated

Use `algorand.appManager.compileTealTemplate` instead.

Performs template substitution of a teal file and compiles it, returning the compiled result.

Looks for `TMPL_{parameter}` for template replacements.
