[algotstest](../README.md) / [transaction](../modules/transaction.md) / MultisigAccount

# Class: MultisigAccount

[transaction](../modules/transaction.md).MultisigAccount

Account wrapper that supports partial or full multisig signing

## Table of contents

### Constructors

- [constructor](transaction.MultisigAccount.md#constructor)

### Properties

- [\_addr](transaction.MultisigAccount.md#_addr)
- [\_params](transaction.MultisigAccount.md#_params)
- [\_signingAccounts](transaction.MultisigAccount.md#_signingaccounts)

### Accessors

- [addr](transaction.MultisigAccount.md#addr)
- [params](transaction.MultisigAccount.md#params)
- [signingAccounts](transaction.MultisigAccount.md#signingaccounts)

### Methods

- [sign](transaction.MultisigAccount.md#sign)

## Constructors

### constructor

• **new MultisigAccount**(`multisigParams`, `signingAccounts`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `multisigParams` | `MultisigMetadata` |
| `signingAccounts` | (`default` \| [`SigningAccount`](transaction.SigningAccount.md))[] |

#### Defined in

[transaction.ts:24](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/transaction.ts#L24)

## Properties

### \_addr

• **\_addr**: `string`

#### Defined in

[transaction.ts:10](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/transaction.ts#L10)

___

### \_params

• **\_params**: `MultisigMetadata`

#### Defined in

[transaction.ts:8](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/transaction.ts#L8)

___

### \_signingAccounts

• **\_signingAccounts**: (`default` \| [`SigningAccount`](transaction.SigningAccount.md))[]

#### Defined in

[transaction.ts:9](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/transaction.ts#L9)

## Accessors

### addr

• `get` **addr**(): `string`

#### Returns

`string`

#### Defined in

[transaction.ts:20](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/transaction.ts#L20)

___

### params

• `get` **params**(): `Readonly`<`MultisigMetadata`\>

#### Returns

`Readonly`<`MultisigMetadata`\>

#### Defined in

[transaction.ts:12](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/transaction.ts#L12)

___

### signingAccounts

• `get` **signingAccounts**(): readonly (`default` \| [`SigningAccount`](transaction.SigningAccount.md))[]

#### Returns

readonly (`default` \| [`SigningAccount`](transaction.SigningAccount.md))[]

#### Defined in

[transaction.ts:16](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/transaction.ts#L16)

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

[transaction.ts:30](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/transaction.ts#L30)
