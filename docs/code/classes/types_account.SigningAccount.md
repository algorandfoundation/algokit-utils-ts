[@algorandfoundation/algokit-utils](../README.md) / [types/account](../modules/types_account.md) / SigningAccount

# Class: SigningAccount

[types/account](../modules/types_account.md).SigningAccount

Account wrapper that supports a rekeyed account

## Implements

- `default`

## Table of contents

### Constructors

- [constructor](types_account.SigningAccount.md#constructor)

### Properties

- [\_account](types_account.SigningAccount.md#_account)
- [\_sender](types_account.SigningAccount.md#_sender)
- [\_signer](types_account.SigningAccount.md#_signer)

### Accessors

- [addr](types_account.SigningAccount.md#addr)
- [sender](types_account.SigningAccount.md#sender)
- [signer](types_account.SigningAccount.md#signer)
- [sk](types_account.SigningAccount.md#sk)

## Constructors

### constructor

• **new SigningAccount**(`account`, `sender`): [`SigningAccount`](types_account.SigningAccount.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `account` | `default` |
| `sender` | `undefined` \| `string` |

#### Returns

[`SigningAccount`](types_account.SigningAccount.md)

#### Defined in

[src/types/account.ts:105](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account.ts#L105)

## Properties

### \_account

• `Private` **\_account**: `default`

#### Defined in

[src/types/account.ts:70](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account.ts#L70)

___

### \_sender

• `Private` **\_sender**: `string`

#### Defined in

[src/types/account.ts:72](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account.ts#L72)

___

### \_signer

• `Private` **\_signer**: `TransactionSigner`

#### Defined in

[src/types/account.ts:71](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account.ts#L71)

## Accessors

### addr

• `get` **addr**(): `string`

Algorand address of the sender

#### Returns

`string`

#### Implementation of

Account.addr

#### Defined in

[src/types/account.ts:77](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account.ts#L77)

___

### sender

• `get` **sender**(): `default`

Algorand account of the sender address and signer private key

#### Returns

`default`

#### Defined in

[src/types/account.ts:98](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account.ts#L98)

___

### signer

• `get` **signer**(): `TransactionSigner`

Transaction signer for the underlying signing account

#### Returns

`TransactionSigner`

#### Defined in

[src/types/account.ts:91](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account.ts#L91)

___

### sk

• `get` **sk**(): `Readonly`\<`Uint8Array`\>

Secret key belonging to the signer

#### Returns

`Readonly`\<`Uint8Array`\>

#### Implementation of

Account.sk

#### Defined in

[src/types/account.ts:84](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account.ts#L84)
