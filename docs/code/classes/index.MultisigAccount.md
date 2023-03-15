[@algorandfoundation/algokit-utils](../README.md) / [index](../modules/index.md) / MultisigAccount

# Class: MultisigAccount

[index](../modules/index.md).MultisigAccount

Account wrapper that supports partial or full multisig signing

## Table of contents

### Constructors

- [constructor](index.MultisigAccount.md#constructor)

### Properties

- [\_addr](index.MultisigAccount.md#_addr)
- [\_params](index.MultisigAccount.md#_params)
- [\_signingAccounts](index.MultisigAccount.md#_signingaccounts)

### Accessors

- [addr](index.MultisigAccount.md#addr)
- [params](index.MultisigAccount.md#params)
- [signingAccounts](index.MultisigAccount.md#signingaccounts)

### Methods

- [sign](index.MultisigAccount.md#sign)

## Constructors

### constructor

• **new MultisigAccount**(`multisigParams`, `signingAccounts`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `multisigParams` | `MultisigMetadata` |
| `signingAccounts` | (`default` \| [`SigningAccount`](index.SigningAccount.md))[] |

#### Defined in

[transaction.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L25)

## Properties

### \_addr

• **\_addr**: `string`

#### Defined in

[transaction.ts:11](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L11)

___

### \_params

• **\_params**: `MultisigMetadata`

#### Defined in

[transaction.ts:9](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L9)

___

### \_signingAccounts

• **\_signingAccounts**: (`default` \| [`SigningAccount`](index.SigningAccount.md))[]

#### Defined in

[transaction.ts:10](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L10)

## Accessors

### addr

• `get` **addr**(): `string`

#### Returns

`string`

#### Defined in

[transaction.ts:21](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L21)

___

### params

• `get` **params**(): `Readonly`<`MultisigMetadata`\>

#### Returns

`Readonly`<`MultisigMetadata`\>

#### Defined in

[transaction.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L13)

___

### signingAccounts

• `get` **signingAccounts**(): readonly (`default` \| [`SigningAccount`](index.SigningAccount.md))[]

#### Returns

readonly (`default` \| [`SigningAccount`](index.SigningAccount.md))[]

#### Defined in

[transaction.ts:17](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L17)

## Methods

### sign

▸ **sign**(`transaction`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `transaction` | `Uint8Array` \| `Transaction` |

#### Returns

`Uint8Array`

#### Defined in

[transaction.ts:31](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L31)
