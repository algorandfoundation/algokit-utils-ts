[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-deployer](../README.md) / AppLookup

# Interface: AppLookup

Defined in: [src/types/app-deployer.ts:91](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L91)

A lookup of name -> Algorand app for a creator

## Properties

### apps

> **apps**: `object`

Defined in: [src/types/app-deployer.ts:95](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L95)

A hash map of app name to app metadata

#### Index Signature

\[`name`: `string`\]: [`AppMetadata`](AppMetadata.md)

***

### creator

> **creator**: `Readonly`\<[`Address`](../../../Algokit-Utils-API/classes/Address.md)\>

Defined in: [src/types/app-deployer.ts:93](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L93)

The address of the creator associated with this lookup
