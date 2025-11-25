[@algorandfoundation/algokit-utils](../README.md) / [types/account](../modules/types_account.md) / MultisigAccount

# Class: MultisigAccount

[types/account](../modules/types_account.md).MultisigAccount

Account wrapper that supports partial or full multisig signing.

## Implements

- `AddressWithSigner`

## Table of contents

### Constructors

- [constructor](types_account.MultisigAccount.md#constructor)

### Properties

- [\_addr](types_account.MultisigAccount.md#_addr)
- [\_params](types_account.MultisigAccount.md#_params)
- [\_signer](types_account.MultisigAccount.md#_signer)
- [\_subSigners](types_account.MultisigAccount.md#_subsigners)

### Accessors

- [addr](types_account.MultisigAccount.md#addr)
- [params](types_account.MultisigAccount.md#params)
- [signer](types_account.MultisigAccount.md#signer)
- [signingAccounts](types_account.MultisigAccount.md#signingaccounts)

## Constructors

### constructor

• **new MultisigAccount**(`multisigParams`, `subSigners`): [`MultisigAccount`](types_account.MultisigAccount.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `multisigParams` | `MultisigMetadata` |
| `subSigners` | `AddressWithSigner`[] |

#### Returns

[`MultisigAccount`](types_account.MultisigAccount.md)

#### Defined in

[src/types/account.ts:48](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account.ts#L48)

## Properties

### \_addr

• **\_addr**: `Address`

#### Defined in

[src/types/account.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account.ts#L25)

___

### \_params

• **\_params**: `MultisigMetadata`

#### Defined in

[src/types/account.ts:23](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account.ts#L23)

___

### \_signer

• **\_signer**: `TransactionSigner`

#### Defined in

[src/types/account.ts:26](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account.ts#L26)

___

### \_subSigners

• **\_subSigners**: `AddressWithSigner`[]

#### Defined in

[src/types/account.ts:24](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account.ts#L24)

## Accessors

### addr

• `get` **addr**(): `Readonly`\<`Address`\>

The address of the multisig account

#### Returns

`Readonly`\<`Address`\>

#### Implementation of

AddressWithSigner.addr

#### Defined in

[src/types/account.ts:39](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account.ts#L39)

___

### params

• `get` **params**(): `Readonly`\<`MultisigMetadata`\>

The parameters for the multisig account

#### Returns

`Readonly`\<`MultisigMetadata`\>

#### Defined in

[src/types/account.ts:29](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account.ts#L29)

___

### signer

• `get` **signer**(): `TransactionSigner`

The transaction signer for the multisig account

#### Returns

`TransactionSigner`

#### Implementation of

AddressWithSigner.signer

#### Defined in

[src/types/account.ts:44](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account.ts#L44)

___

### signingAccounts

• `get` **signingAccounts**(): readonly `AddressWithSigner`[]

The list of accounts that are present to sign

#### Returns

readonly `AddressWithSigner`[]

#### Defined in

[src/types/account.ts:34](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account.ts#L34)
