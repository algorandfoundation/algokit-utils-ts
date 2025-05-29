[@algorandfoundation/algokit-utils](../README.md) / [types/algokit-core-bridge](../modules/types_algokit_core_bridge.md) / TokenHeaderAuthenticationMethod

# Class: TokenHeaderAuthenticationMethod

[types/algokit-core-bridge](../modules/types_algokit_core_bridge.md).TokenHeaderAuthenticationMethod

## Implements

- `SecurityAuthentication`

## Table of contents

### Constructors

- [constructor](types_algokit_core_bridge.TokenHeaderAuthenticationMethod.md#constructor)

### Properties

- [\_header](types_algokit_core_bridge.TokenHeaderAuthenticationMethod.md#_header)
- [\_key](types_algokit_core_bridge.TokenHeaderAuthenticationMethod.md#_key)

### Methods

- [applySecurityAuthentication](types_algokit_core_bridge.TokenHeaderAuthenticationMethod.md#applysecurityauthentication)
- [getName](types_algokit_core_bridge.TokenHeaderAuthenticationMethod.md#getname)

## Constructors

### constructor

• **new TokenHeaderAuthenticationMethod**(`tokenHeader`): [`TokenHeaderAuthenticationMethod`](types_algokit_core_bridge.TokenHeaderAuthenticationMethod.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenHeader` | `TokenHeader` |

#### Returns

[`TokenHeaderAuthenticationMethod`](types_algokit_core_bridge.TokenHeaderAuthenticationMethod.md)

#### Defined in

[src/types/algokit-core-bridge.ts:64](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algokit-core-bridge.ts#L64)

## Properties

### \_header

• `Private` **\_header**: `string`

#### Defined in

[src/types/algokit-core-bridge.ts:61](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algokit-core-bridge.ts#L61)

___

### \_key

• `Private` **\_key**: `string`

#### Defined in

[src/types/algokit-core-bridge.ts:62](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algokit-core-bridge.ts#L62)

## Methods

### applySecurityAuthentication

▸ **applySecurityAuthentication**(`context`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `RequestContext` |

#### Returns

`void`

#### Implementation of

algodApi.SecurityAuthentication.applySecurityAuthentication

#### Defined in

[src/types/algokit-core-bridge.ts:78](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algokit-core-bridge.ts#L78)

___

### getName

▸ **getName**(): `string`

#### Returns

`string`

#### Implementation of

algodApi.SecurityAuthentication.getName

#### Defined in

[src/types/algokit-core-bridge.ts:74](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algokit-core-bridge.ts#L74)
