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
| `sender` | `undefined` \| `string` \| `Address` |

#### Returns

[`SigningAccount`](types_account.SigningAccount.md)

#### Defined in

[src/types/account.ts:58](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account.ts#L58)

## Properties

### \_account

• `Private` **\_account**: `default`

#### Defined in

[src/types/account.ts:23](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account.ts#L23)

___

### \_sender

• `Private` **\_sender**: `Address`

#### Defined in

[src/types/account.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account.ts#L25)

___

### \_signer

• `Private` **\_signer**: `TransactionSigner`

#### Defined in

[src/types/account.ts:24](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account.ts#L24)

## Accessors

### addr

• `get` **addr**(): `Readonly`\<`Address`\>

Algorand address of the sender

#### Returns

`Readonly`\<`Address`\>

#### Implementation of

Account.addr

#### Defined in

[src/types/account.ts:30](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account.ts#L30)

___

### sender

• `get` **sender**(): `default`

Algorand account of the sender address and signer private key

#### Returns

`default`

#### Defined in

[src/types/account.ts:51](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account.ts#L51)

___

### signer

• `get` **signer**(): `TransactionSigner`

Transaction signer for the underlying signing account

#### Returns

`TransactionSigner`

#### Defined in

[src/types/account.ts:44](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account.ts#L44)

___

### sk

• `get` **sk**(): `Readonly`\<`Uint8Array`\>

Secret key belonging to the signer

#### Returns

`Readonly`\<`Uint8Array`\>

#### Implementation of

Account.sk

#### Defined in

[src/types/account.ts:37](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account.ts#L37)
