[@algorandfoundation/algokit-utils](../README.md) / [types/indexer](../modules/types_indexer.md) / AppLocalState

# Interface: AppLocalState

[types/indexer](../modules/types_indexer.md).AppLocalState

Stores local state associated with an application. https://developer.algorand.org/docs/rest-apis/indexer/#applicationlocalstate

## Table of contents

### Properties

- [closed-out-at-round](types_indexer.AppLocalState.md#closed-out-at-round)
- [deleted](types_indexer.AppLocalState.md#deleted)
- [id](types_indexer.AppLocalState.md#id)
- [key-value](types_indexer.AppLocalState.md#key-value)
- [opted-in-at-round](types_indexer.AppLocalState.md#opted-in-at-round)
- [schema](types_indexer.AppLocalState.md#schema)

## Properties

### closed-out-at-round

• `Optional` **closed-out-at-round**: `number`

Round when account closed out of the application.

#### Defined in

[src/types/indexer.ts:885](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L885)

___

### deleted

• `Optional` **deleted**: `boolean`

Whether or not the application local state is currently deleted from its account.

#### Defined in

[src/types/indexer.ts:887](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L887)

___

### id

• **id**: `number`

The application which this local state is for.

#### Defined in

[src/types/indexer.ts:889](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L889)

___

### key-value

• `Optional` **key-value**: `TealKeyValue`[]

[tkv] storage.

#### Defined in

[src/types/indexer.ts:891](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L891)

___

### opted-in-at-round

• `Optional` **opted-in-at-round**: `number`

Round when the account opted into the application.

#### Defined in

[src/types/indexer.ts:893](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L893)

___

### schema

• **schema**: [`StateSchema`](types_indexer.StateSchema.md)

[hsch] schema.

#### Defined in

[src/types/indexer.ts:895](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L895)
