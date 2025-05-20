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

[src/types/algokit-core-bridge.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algokit-core-bridge.ts#L59)

## Properties

### \_header

• `Private` **\_header**: `string`

#### Defined in

[src/types/algokit-core-bridge.ts:56](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algokit-core-bridge.ts#L56)

___

### \_key

• `Private` **\_key**: `string`

#### Defined in

[src/types/algokit-core-bridge.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algokit-core-bridge.ts#L57)

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

[src/types/algokit-core-bridge.ts:73](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algokit-core-bridge.ts#L73)

___

### getName

▸ **getName**(): `string`

#### Returns

`string`

#### Implementation of

algodApi.SecurityAuthentication.getName

#### Defined in

[src/types/algokit-core-bridge.ts:69](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algokit-core-bridge.ts#L69)
