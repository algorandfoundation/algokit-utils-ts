[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/transact](../README.md) / LogicSigAccount

# Class: LogicSigAccount

Defined in: [packages/transact/src/logicsig.ts:96](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/transact/src/logicsig.ts#L96)

A logic signature account that can sign transactions using a TEAL program.

## Remarks

Logic signatures can operate in two modes: contract mode (where the program itself is the authority)
or delegated mode (where an account delegates signing authority to the program). In delegated mode,
the delegator's signature authorizes the logic sig to sign on their behalf. Always verify the TEAL
program logic before delegating, as the delegator is responsible for any transactions the program authorizes.

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extends

- [`LogicSig`](LogicSig.md)

## Constructors

### Constructor

> **new LogicSigAccount**(`program`, `programArgs?`, `delegator?`): `LogicSigAccount`

Defined in: [packages/transact/src/logicsig.ts:142](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/transact/src/logicsig.ts#L142)

#### Parameters

##### program

`Uint8Array`

##### programArgs?

`Uint8Array`[] | `null`

##### delegator?

[`Address`](../../../algokit-utils/classes/Address.md)

#### Returns

`LogicSigAccount`

#### Overrides

[`LogicSig`](LogicSig.md).[`constructor`](LogicSig.md#constructor)

## Properties

### \_addr

> `protected` **\_addr**: [`Address`](../../../algokit-utils/classes/Address.md)

Defined in: [packages/transact/src/logicsig.ts:34](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/transact/src/logicsig.ts#L34)

#### Inherited from

[`LogicSig`](LogicSig.md).[`_addr`](LogicSig.md#_addr)

***

### args

> **args**: `Uint8Array`[]

Defined in: [packages/transact/src/logicsig.ts:33](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/transact/src/logicsig.ts#L33)

#### Inherited from

[`LogicSig`](LogicSig.md).[`args`](LogicSig.md#args)

***

### lmsig?

> `optional` **lmsig**: [`MultisigSignature`](../type-aliases/MultisigSignature.md)

Defined in: [packages/transact/src/logicsig.ts:99](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/transact/src/logicsig.ts#L99)

***

### logic

> **logic**: `Uint8Array`

Defined in: [packages/transact/src/logicsig.ts:32](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/transact/src/logicsig.ts#L32)

#### Inherited from

[`LogicSig`](LogicSig.md).[`logic`](LogicSig.md#logic)

***

### msig?

> `optional` **msig**: [`MultisigSignature`](../type-aliases/MultisigSignature.md)

Defined in: [packages/transact/src/logicsig.ts:98](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/transact/src/logicsig.ts#L98)

***

### sig?

> `optional` **sig**: `Uint8Array`

Defined in: [packages/transact/src/logicsig.ts:97](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/transact/src/logicsig.ts#L97)

## Accessors

### addr

#### Get Signature

> **get** **addr**(): [`Address`](../../../algokit-utils/classes/Address.md)

Defined in: [packages/transact/src/logicsig.ts:58](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/transact/src/logicsig.ts#L58)

##### Returns

[`Address`](../../../algokit-utils/classes/Address.md)

#### Inherited from

[`LogicSig`](LogicSig.md).[`addr`](LogicSig.md#addr)

***

### signer

#### Get Signature

> **get** **signer**(): [`TransactionSigner`](../type-aliases/TransactionSigner.md)

Defined in: [packages/transact/src/logicsig.ts:147](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/transact/src/logicsig.ts#L147)

##### Returns

[`TransactionSigner`](../type-aliases/TransactionSigner.md)

## Methods

### account()

> **account**(): `LogicSigAccount`

Defined in: [packages/transact/src/logicsig.ts:78](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/transact/src/logicsig.ts#L78)

#### Returns

`LogicSigAccount`

#### Inherited from

[`LogicSig`](LogicSig.md).[`account`](LogicSig.md#account)

***

### address()

> **address**(): [`Address`](../../../algokit-utils/classes/Address.md)

Defined in: [packages/transact/src/logicsig.ts:54](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/transact/src/logicsig.ts#L54)

#### Returns

[`Address`](../../../algokit-utils/classes/Address.md)

#### Inherited from

[`LogicSig`](LogicSig.md).[`address`](LogicSig.md#address)

***

### bytesToSignForDelegation()

> **bytesToSignForDelegation**(`msig?`): `Uint8Array`

Defined in: [packages/transact/src/logicsig.ts:62](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/transact/src/logicsig.ts#L62)

#### Parameters

##### msig?

[`MultisigAccount`](MultisigAccount.md)

#### Returns

`Uint8Array`

#### Inherited from

[`LogicSig`](LogicSig.md).[`bytesToSignForDelegation`](LogicSig.md#bytestosignfordelegation)

***

### delegatedAccount()

> **delegatedAccount**(`delegator`): `LogicSigAccount`

Defined in: [packages/transact/src/logicsig.ts:82](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/transact/src/logicsig.ts#L82)

#### Parameters

##### delegator

[`Address`](../../../algokit-utils/classes/Address.md)

#### Returns

`LogicSigAccount`

#### Inherited from

[`LogicSig`](LogicSig.md).[`delegatedAccount`](LogicSig.md#delegatedaccount)

***

### programDataToSign()

> **programDataToSign**(`data`): `Uint8Array`

Defined in: [packages/transact/src/logicsig.ts:74](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/transact/src/logicsig.ts#L74)

#### Parameters

##### data

`Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[`LogicSig`](LogicSig.md).[`programDataToSign`](LogicSig.md#programdatatosign)

***

### signForDelegation()

> **signForDelegation**(`delegator`): `Promise`\<`void`\>

Defined in: [packages/transact/src/logicsig.ts:175](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/transact/src/logicsig.ts#L175)

Signs the logic signature for delegation.

#### Parameters

##### delegator

[`AddressWithDelegatedLsigSigner`](../interfaces/AddressWithDelegatedLsigSigner.md)

The delegator with signing capability

#### Returns

`Promise`\<`void`\>

#### Throws

If delegator address doesn't match expected address or signer returns invalid result

***

### signProgramData()

> **signProgramData**(`data`, `signer`): `Promise`\<`Uint8Array`\>

Defined in: [packages/transact/src/logicsig.ts:70](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/transact/src/logicsig.ts#L70)

#### Parameters

##### data

`Uint8Array`

##### signer

[`ProgramDataSigner`](../type-aliases/ProgramDataSigner.md)

#### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

[`LogicSig`](LogicSig.md).[`signProgramData`](LogicSig.md#signprogramdata)

***

### fromBytes()

> `static` **fromBytes**(`encodedLsig`, `delegator?`): `LogicSigAccount`

Defined in: [packages/transact/src/logicsig.ts:136](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/transact/src/logicsig.ts#L136)

#### Parameters

##### encodedLsig

`Uint8Array`

##### delegator?

[`Address`](../../../algokit-utils/classes/Address.md)

#### Returns

`LogicSigAccount`

#### Overrides

[`LogicSig`](LogicSig.md).[`fromBytes`](LogicSig.md#frombytes)

***

### fromSignature()

> `static` **fromSignature**(`signature`, `delegator?`): `LogicSigAccount`

Defined in: [packages/transact/src/logicsig.ts:108](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/transact/src/logicsig.ts#L108)

Creates a LogicSigAccount from a LogicSigSignature.

#### Parameters

##### signature

[`LogicSigSignature`](../type-aliases/LogicSigSignature.md)

The logic signature

##### delegator?

[`Address`](../../../algokit-utils/classes/Address.md)

Optional delegator address

#### Returns

`LogicSigAccount`

A LogicSigAccount instance

#### Throws

If delegator address doesn't match multisig address or if signature exists without delegator

#### Overrides

[`LogicSig`](LogicSig.md).[`fromSignature`](LogicSig.md#fromsignature)
