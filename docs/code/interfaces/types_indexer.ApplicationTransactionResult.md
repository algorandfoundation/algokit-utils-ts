[@algorandfoundation/algokit-utils](../README.md) / [types/indexer](../modules/types_indexer.md) / ApplicationTransactionResult

# Interface: ApplicationTransactionResult

[types/indexer](../modules/types_indexer.md).ApplicationTransactionResult

## Hierarchy

- `Exclude`<{ `creator`: `string` ; `global-state`: `TealKeyValue`[]  }, [`ApplicationParams`](types_indexer.ApplicationParams.md)\>

  ↳ **`ApplicationTransactionResult`**

## Table of contents

### Properties

- [accounts](types_indexer.ApplicationTransactionResult.md#accounts)
- [application-args](types_indexer.ApplicationTransactionResult.md#application-args)
- [application-id](types_indexer.ApplicationTransactionResult.md#application-id)
- [creator](types_indexer.ApplicationTransactionResult.md#creator)
- [foreign-apps](types_indexer.ApplicationTransactionResult.md#foreign-apps)
- [foreign-assets](types_indexer.ApplicationTransactionResult.md#foreign-assets)
- [global-state](types_indexer.ApplicationTransactionResult.md#global-state)
- [on-completion](types_indexer.ApplicationTransactionResult.md#on-completion)

## Properties

### accounts

• `Optional` **accounts**: `string`[]

#### Defined in

[src/types/indexer.ts:124](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L124)

___

### application-args

• `Optional` **application-args**: `string`[]

#### Defined in

[src/types/indexer.ts:123](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L123)

___

### application-id

• **application-id**: `number`

#### Defined in

[src/types/indexer.ts:121](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L121)

___

### creator

• **creator**: `string`

#### Inherited from

Exclude.creator

#### Defined in

[src/types/indexer.ts:120](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L120)

___

### foreign-apps

• `Optional` **foreign-apps**: `number`[]

#### Defined in

[src/types/indexer.ts:125](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L125)

___

### foreign-assets

• `Optional` **foreign-assets**: `number`[]

#### Defined in

[src/types/indexer.ts:126](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L126)

___

### global-state

• **global-state**: `TealKeyValue`[]

#### Inherited from

Exclude.global-state

#### Defined in

[src/types/indexer.ts:120](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L120)

___

### on-completion

• **on-completion**: [`ApplicationOnComplete`](../enums/types_indexer.ApplicationOnComplete.md)

#### Defined in

[src/types/indexer.ts:122](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L122)
