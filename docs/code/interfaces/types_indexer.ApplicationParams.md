[@algorandfoundation/algokit-utils](../README.md) / [types/indexer](../modules/types_indexer.md) / ApplicationParams

# Interface: ApplicationParams

[types/indexer](../modules/types_indexer.md).ApplicationParams

Stores the global information associated with an application https://developer.algorand.org/docs/rest-apis/indexer/#applicationparams

## Table of contents

### Properties

- [approval-program](types_indexer.ApplicationParams.md#approval-program)
- [clear-state-program](types_indexer.ApplicationParams.md#clear-state-program)
- [creator](types_indexer.ApplicationParams.md#creator)
- [extra-program-pages](types_indexer.ApplicationParams.md#extra-program-pages)
- [global-state](types_indexer.ApplicationParams.md#global-state)
- [global-state-schema](types_indexer.ApplicationParams.md#global-state-schema)
- [local-state-schema](types_indexer.ApplicationParams.md#local-state-schema)

## Properties

### approval-program

• **approval-program**: `string`

[apap]/[approv] Logic executed for every application transaction, except when on-completion is set to "clear".

It can read and write global state for the application, as well as account-specific local state.

Approval programs may reject the transaction.

*Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\|[A-Za-z0-9+/]{3}=)?$"`

#### Defined in

[src/types/indexer.ts:717](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L717)

___

### clear-state-program

• **clear-state-program**: `string`

[apsu]/[clearp] Logic executed for application transactions with on-completion set to "clear".

It can read and write global state for the application, as well as account-specific local state.

Clear state programs cannot reject the transaction.

*Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\|[A-Za-z0-9+/]{3}=)?$"`

#### Defined in

[src/types/indexer.ts:727](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L727)

___

### creator

• **creator**: `string`

The address that created this application. This is the address where the parameters and global state for this application can be found.

#### Defined in

[src/types/indexer.ts:707](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L707)

___

### extra-program-pages

• `Optional` **extra-program-pages**: `number`

[epp] the amount of extra program pages available to this app.

#### Defined in

[src/types/indexer.ts:729](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L729)

___

### global-state

• **global-state**: `TealKeyValue`[]

[gs] global schema

#### Defined in

[src/types/indexer.ts:731](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L731)

___

### global-state-schema

• `Optional` **global-state-schema**: [`StateSchema`](types_indexer.StateSchema.md)

[gsch] global schema

#### Defined in

[src/types/indexer.ts:733](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L733)

___

### local-state-schema

• `Optional` **local-state-schema**: [`StateSchema`](types_indexer.StateSchema.md)

[lsch] local schema

#### Defined in

[src/types/indexer.ts:735](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L735)
