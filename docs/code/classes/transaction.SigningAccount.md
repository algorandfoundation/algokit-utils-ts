[algotstest](../README.md) / [transaction](../modules/transaction.md) / SigningAccount

# Class: SigningAccount

[transaction](../modules/transaction.md).SigningAccount

Account wrapper that supports a rekeyed account

## Implements

- `default`

## Table of contents

### Constructors

- [constructor](transaction.SigningAccount.md#constructor)

### Properties

- [\_account](transaction.SigningAccount.md#_account)
- [\_sender](transaction.SigningAccount.md#_sender)

### Accessors

- [addr](transaction.SigningAccount.md#addr)
- [sender](transaction.SigningAccount.md#sender)
- [signer](transaction.SigningAccount.md#signer)
- [sk](transaction.SigningAccount.md#sk)

## Constructors

### constructor

• **new SigningAccount**(`account`, `sender`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `account` | `default` |
| `sender` | `undefined` \| `string` |

#### Defined in

[transaction.ts:80](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/transaction.ts#L80)

## Properties

### \_account

• `Private` **\_account**: `default`

#### Defined in

[transaction.ts:46](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/transaction.ts#L46)

___

### \_sender

• `Private` **\_sender**: `string`

#### Defined in

[transaction.ts:47](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/transaction.ts#L47)

## Accessors

### addr

• `get` **addr**(): `string`

Algorand address of the sender

#### Returns

`string`

#### Implementation of

Account.addr

#### Defined in

[transaction.ts:52](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/transaction.ts#L52)

___

### sender

• `get` **sender**(): `default`

Algorand account of the sender address and signer private key

#### Returns

`default`

#### Defined in

[transaction.ts:73](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/transaction.ts#L73)

___

### signer

• `get` **signer**(): `default`

Algorand account of the underlying signing account

#### Returns

`default`

#### Defined in

[transaction.ts:66](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/transaction.ts#L66)

___

### sk

• `get` **sk**(): `Readonly`<`Uint8Array`\>

Secret key belonging to the signer

#### Returns

`Readonly`<`Uint8Array`\>

#### Implementation of

Account.sk

#### Defined in

[transaction.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/transaction.ts#L59)
