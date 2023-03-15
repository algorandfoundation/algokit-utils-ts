[@algorandfoundation/algokit-utils](../README.md) / [transaction](../modules/transaction.md) / MultisigAccount

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

[transaction.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/transaction.ts#L25)

## Properties

### \_addr

• **\_addr**: `string`

#### Defined in

[transaction.ts:11](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/transaction.ts#L11)

___

### \_params

• **\_params**: `MultisigMetadata`

#### Defined in

[transaction.ts:9](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/transaction.ts#L9)

___

### \_signingAccounts

• **\_signingAccounts**: (`default` \| [`SigningAccount`](transaction.SigningAccount.md))[]

#### Defined in

[transaction.ts:10](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/transaction.ts#L10)

## Accessors

### addr

• `get` **addr**(): `string`

#### Returns

`string`

#### Defined in

[transaction.ts:21](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/transaction.ts#L21)

___

### params

• `get` **params**(): `Readonly`<`MultisigMetadata`\>

#### Returns

`Readonly`<`MultisigMetadata`\>

#### Defined in

[transaction.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/transaction.ts#L13)

___

### signingAccounts

• `get` **signingAccounts**(): readonly (`default` \| [`SigningAccount`](transaction.SigningAccount.md))[]

#### Returns

readonly (`default` \| [`SigningAccount`](transaction.SigningAccount.md))[]

#### Defined in

[transaction.ts:17](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/transaction.ts#L17)

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

[transaction.ts:31](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/transaction.ts#L31)
