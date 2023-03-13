[algotstest](../README.md) / [indexer-type](../modules/indexer_type.md) / ApplicationTransactionResult

# Interface: ApplicationTransactionResult

[indexer-type](../modules/indexer_type.md).ApplicationTransactionResult

## Hierarchy

- `Exclude`<{ `creator`: `string` ; `global-state`: `TealKeyValue`[]  }, `ApplicationParams`\>

  ↳ **`ApplicationTransactionResult`**

## Table of contents

### Properties

- [accounts](indexer_type.ApplicationTransactionResult.md#accounts)
- [application-args](indexer_type.ApplicationTransactionResult.md#application-args)
- [application-id](indexer_type.ApplicationTransactionResult.md#application-id)
- [creator](indexer_type.ApplicationTransactionResult.md#creator)
- [foreign-apps](indexer_type.ApplicationTransactionResult.md#foreign-apps)
- [foreign-assets](indexer_type.ApplicationTransactionResult.md#foreign-assets)
- [global-state](indexer_type.ApplicationTransactionResult.md#global-state)
- [on-completion](indexer_type.ApplicationTransactionResult.md#on-completion)

## Properties

### accounts

• `Optional` **accounts**: `string`[]

#### Defined in

[indexer-type.ts:124](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/indexer-type.ts#L124)

___

### application-args

• `Optional` **application-args**: `string`[]

#### Defined in

[indexer-type.ts:123](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/indexer-type.ts#L123)

___

### application-id

• **application-id**: `number`

#### Defined in

[indexer-type.ts:121](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/indexer-type.ts#L121)

___

### creator

• **creator**: `string`

#### Inherited from

Exclude.creator

#### Defined in

[indexer-type.ts:120](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/indexer-type.ts#L120)

___

### foreign-apps

• `Optional` **foreign-apps**: `number`[]

#### Defined in

[indexer-type.ts:125](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/indexer-type.ts#L125)

___

### foreign-assets

• `Optional` **foreign-assets**: `number`[]

#### Defined in

[indexer-type.ts:126](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/indexer-type.ts#L126)

___

### global-state

• **global-state**: `TealKeyValue`[]

#### Inherited from

Exclude.global-state

#### Defined in

[indexer-type.ts:120](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/indexer-type.ts#L120)

___

### on-completion

• **on-completion**: [`ApplicationOnComplete`](../enums/indexer_type.ApplicationOnComplete.md)

#### Defined in

[indexer-type.ts:122](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/indexer-type.ts#L122)
