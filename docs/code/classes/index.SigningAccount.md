[@algorandfoundation/algokit-utils](../README.md) / [index](../modules/index.md) / SigningAccount

# Class: SigningAccount

[index](../modules/index.md).SigningAccount

Account wrapper that supports a rekeyed account

## Implements

- `default`

## Table of contents

### Constructors

- [constructor](index.SigningAccount.md#constructor)

### Properties

- [\_account](index.SigningAccount.md#_account)
- [\_sender](index.SigningAccount.md#_sender)

### Accessors

- [addr](index.SigningAccount.md#addr)
- [sender](index.SigningAccount.md#sender)
- [signer](index.SigningAccount.md#signer)
- [sk](index.SigningAccount.md#sk)

## Constructors

### constructor

• **new SigningAccount**(`account`, `sender`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `account` | `default` |
| `sender` | `undefined` \| `string` |

#### Defined in

[transaction.ts:81](https://github.com/algorandfoundation/algokit-utils-ts/blob/88a7c0f/src/transaction.ts#L81)

## Properties

### \_account

• `Private` **\_account**: `default`

#### Defined in

[transaction.ts:47](https://github.com/algorandfoundation/algokit-utils-ts/blob/88a7c0f/src/transaction.ts#L47)

___

### \_sender

• `Private` **\_sender**: `string`

#### Defined in

[transaction.ts:48](https://github.com/algorandfoundation/algokit-utils-ts/blob/88a7c0f/src/transaction.ts#L48)

## Accessors

### addr

• `get` **addr**(): `string`

Algorand address of the sender

#### Returns

`string`

#### Implementation of

Account.addr

#### Defined in

[transaction.ts:53](https://github.com/algorandfoundation/algokit-utils-ts/blob/88a7c0f/src/transaction.ts#L53)

___

### sender

• `get` **sender**(): `default`

Algorand account of the sender address and signer private key

#### Returns

`default`

#### Defined in

[transaction.ts:74](https://github.com/algorandfoundation/algokit-utils-ts/blob/88a7c0f/src/transaction.ts#L74)

___

### signer

• `get` **signer**(): `default`

Algorand account of the underlying signing account

#### Returns

`default`

#### Defined in

[transaction.ts:67](https://github.com/algorandfoundation/algokit-utils-ts/blob/88a7c0f/src/transaction.ts#L67)

___

### sk

• `get` **sk**(): `Readonly`<`Uint8Array`\>

Secret key belonging to the signer

#### Returns

`Readonly`<`Uint8Array`\>

#### Implementation of

Account.sk

#### Defined in

[transaction.ts:60](https://github.com/algorandfoundation/algokit-utils-ts/blob/88a7c0f/src/transaction.ts#L60)
