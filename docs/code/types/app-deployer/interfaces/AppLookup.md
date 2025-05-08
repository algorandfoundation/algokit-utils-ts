[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-deployer](../README.md) / AppLookup

# Interface: AppLookup

Defined in: [src/types/app-deployer.ts:90](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L90)

A lookup of name -> Algorand app for a creator

## Properties

### apps

> **apps**: `object`

Defined in: [src/types/app-deployer.ts:94](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L94)

A hash map of app name to app metadata

#### Index Signature

\[`name`: `string`\]: [`AppMetadata`](AppMetadata.md)

***

### creator

> **creator**: `Readonly`\<`Address`\>

Defined in: [src/types/app-deployer.ts:92](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L92)

The address of the creator associated with this lookup
