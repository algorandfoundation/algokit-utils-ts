[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [transact](../README.md) / LogicSig

# Class: LogicSig

Defined in: [packages/transact/src/logicsig.ts:31](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/logicsig.ts#L31)

## Hierarchy

[View Summary](../../hierarchy.md)

### Extended by

- [`LogicSigAccount`](LogicSigAccount.md)

## Implements

- [`Addressable`](../../index/interfaces/Addressable.md)

## Constructors

### Constructor

> **new LogicSig**(`program`, `programArgs?`): `LogicSig`

Defined in: [packages/transact/src/logicsig.ts:36](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/logicsig.ts#L36)

#### Parameters

##### program

`Uint8Array`

##### programArgs?

`Uint8Array`[]

#### Returns

`LogicSig`

## Properties

### \_addr

> `protected` **\_addr**: [`Address`](../../index/classes/Address.md)

Defined in: [packages/transact/src/logicsig.ts:34](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/logicsig.ts#L34)

***

### args

> **args**: `Uint8Array`[]

Defined in: [packages/transact/src/logicsig.ts:33](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/logicsig.ts#L33)

***

### logic

> **logic**: `Uint8Array`

Defined in: [packages/transact/src/logicsig.ts:32](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/logicsig.ts#L32)

## Accessors

### addr

#### Get Signature

> **get** **addr**(): [`Address`](../../index/classes/Address.md)

Defined in: [packages/transact/src/logicsig.ts:58](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/logicsig.ts#L58)

##### Returns

[`Address`](../../index/classes/Address.md)

#### Implementation of

[`Addressable`](../../index/interfaces/Addressable.md).[`addr`](../../index/interfaces/Addressable.md#addr)

## Methods

### account()

> **account**(): [`LogicSigAccount`](LogicSigAccount.md)

Defined in: [packages/transact/src/logicsig.ts:78](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/logicsig.ts#L78)

#### Returns

[`LogicSigAccount`](LogicSigAccount.md)

***

### address()

> **address**(): [`Address`](../../index/classes/Address.md)

Defined in: [packages/transact/src/logicsig.ts:54](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/logicsig.ts#L54)

#### Returns

[`Address`](../../index/classes/Address.md)

***

### bytesToSignForDelegation()

> **bytesToSignForDelegation**(`msig?`): `Uint8Array`

Defined in: [packages/transact/src/logicsig.ts:62](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/logicsig.ts#L62)

#### Parameters

##### msig?

[`MultisigAccount`](MultisigAccount.md)

#### Returns

`Uint8Array`

***

### delegatedAccount()

> **delegatedAccount**(`delegator`): [`LogicSigAccount`](LogicSigAccount.md)

Defined in: [packages/transact/src/logicsig.ts:82](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/logicsig.ts#L82)

#### Parameters

##### delegator

[`Address`](../../index/classes/Address.md)

#### Returns

[`LogicSigAccount`](LogicSigAccount.md)

***

### programDataToSign()

> **programDataToSign**(`data`): `Uint8Array`

Defined in: [packages/transact/src/logicsig.ts:74](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/logicsig.ts#L74)

#### Parameters

##### data

`Uint8Array`

#### Returns

`Uint8Array`

***

### signProgramData()

> **signProgramData**(`data`, `signer`): `Promise`\<`Uint8Array`\>

Defined in: [packages/transact/src/logicsig.ts:70](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/logicsig.ts#L70)

#### Parameters

##### data

`Uint8Array`

##### signer

[`ProgramDataSigner`](../type-aliases/ProgramDataSigner.md)

#### Returns

`Promise`\<`Uint8Array`\>

***

### fromBytes()

> `static` **fromBytes**(`encodedLsig`): `LogicSig`

Defined in: [packages/transact/src/logicsig.ts:48](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/logicsig.ts#L48)

#### Parameters

##### encodedLsig

`Uint8Array`

#### Returns

`LogicSig`

***

### fromSignature()

> `static` **fromSignature**(`signature`): `LogicSig`

Defined in: [packages/transact/src/logicsig.ts:44](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/logicsig.ts#L44)

#### Parameters

##### signature

[`LogicSigSignature`](../type-aliases/LogicSigSignature.md)

#### Returns

`LogicSig`
