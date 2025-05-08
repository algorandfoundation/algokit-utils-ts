[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app](../README.md) / AppDeploymentParams

# Interface: AppDeploymentParams

Defined in: [src/types/app.ts:310](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L310)

The parameters to deploy an app

## Extends

- `Omit`\<[`CreateAppParams`](CreateAppParams.md), `"onCompleteAction"` \| `"args"` \| `"note"` \| `"skipSending"` \| `"skipWaiting"` \| `"atc"`\>

## Properties

### approvalProgram

> **approvalProgram**: `string` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [src/types/app.ts:135](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L135)

The approval program as raw teal (string) or compiled teal, base 64 encoded as a byte array (Uint8Array)

#### Inherited from

`Omit.approvalProgram`

***

### clearStateProgram

> **clearStateProgram**: `string` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [src/types/app.ts:137](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L137)

The clear state program as raw teal (string) or compiled teal, base 64 encoded as a byte array (Uint8Array)

#### Inherited from

`Omit.clearStateProgram`

***

### createArgs?

> `optional` **createArgs**: [`AppCallArgs`](../type-aliases/AppCallArgs.md)

Defined in: [src/types/app.ts:323](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L323)

Any args to pass to any create transaction that is issued as part of deployment

***

### createOnCompleteAction?

> `optional` **createOnCompleteAction**: `"no_op"` \| `"opt_in"` \| `"close_out"` \| `"update_application"` \| `"delete_application"` \| `NoOpOC` \| `OptInOC` \| `CloseOutOC` \| `UpdateApplicationOC` \| `DeleteApplicationOC`

Defined in: [src/types/app.ts:325](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L325)

Override the on-completion action for the create call; defaults to NoOp

***

### deleteArgs?

> `optional` **deleteArgs**: [`AppCallArgs`](../type-aliases/AppCallArgs.md)

Defined in: [src/types/app.ts:329](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L329)

Any args to pass to any delete transaction that is issued as part of deployment

***

### deployTimeParams?

> `optional` **deployTimeParams**: [`TealTemplateParams`](TealTemplateParams.md)

Defined in: [src/types/app.ts:315](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L315)

Any deploy-time parameters to replace in the TEAL code

***

### existingDeployments?

> `optional` **existingDeployments**: [`AppLookup`](AppLookup.md)

Defined in: [src/types/app.ts:321](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L321)

Optional cached value of the existing apps for the given creator

***

### fee?

> `optional` **fee**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Defined in: [src/types/transaction.ts:40](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L40)

The flat fee you want to pay, useful for covering extra fees in a transaction group or app call

#### Inherited from

`Omit.fee`

***

### from

> **from**: [`SendTransactionFrom`](../../transaction/type-aliases/SendTransactionFrom.md)

Defined in: [src/types/app.ts:133](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L133)

The account (with private key loaded) that will send the transaction

#### Inherited from

`Omit.from`

***

### maxFee?

> `optional` **maxFee**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Defined in: [src/types/transaction.ts:42](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L42)

The maximum fee that you are happy to pay (default: unbounded) - if this is set it's possible the transaction could get rejected during network congestion

#### Inherited from

`Omit.maxFee`

***

### maxRoundsToWaitForConfirmation?

> `optional` **maxRoundsToWaitForConfirmation**: `number`

Defined in: [src/types/transaction.ts:44](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L44)

The maximum number of rounds to wait for confirmation, only applies if `skipWaiting` is `undefined` or `false`, default: wait up to 5 rounds

#### Inherited from

`Omit.maxRoundsToWaitForConfirmation`

***

### metadata

> **metadata**: [`AppDeployMetadata`](AppDeployMetadata.md)

Defined in: [src/types/app.ts:313](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L313)

The deployment metadata

***

### onSchemaBreak?

> `optional` **onSchemaBreak**: [`OnSchemaBreak`](../enumerations/OnSchemaBreak.md) \| `"replace"` \| `"fail"` \| `"append"`

Defined in: [src/types/app.ts:317](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L317)

What action to perform if a schema break is detected

***

### onUpdate?

> `optional` **onUpdate**: `"replace"` \| `"fail"` \| `"append"` \| [`OnUpdate`](../enumerations/OnUpdate.md) \| `"update"`

Defined in: [src/types/app.ts:319](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L319)

What action to perform if a TEAL update is detected

***

### populateAppCallResources?

> `optional` **populateAppCallResources**: `boolean`

Defined in: [src/types/transaction.ts:46](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L46)

Whether to use simulate to automatically populate app call resources in the txn objects. Defaults to true when there are app calls in the group.

#### Inherited from

`Omit.populateAppCallResources`

***

### schema

> **schema**: [`AppStorageSchema`](AppStorageSchema.md)

Defined in: [src/types/app.ts:152](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L152)

The storage schema to request for the created app

#### Inherited from

`Omit.schema`

***

### suppressLog?

> `optional` **suppressLog**: `boolean`

Defined in: [src/types/transaction.ts:38](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L38)

Whether to suppress log messages from transaction send, default: do not suppress

#### Inherited from

`Omit.suppressLog`

***

### transactionParams?

> `optional` **transactionParams**: `SuggestedParams`

Defined in: [src/types/app.ts:139](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L139)

Optional transaction parameters

#### Inherited from

`Omit.transactionParams`

***

### updateArgs?

> `optional` **updateArgs**: [`AppCallArgs`](../type-aliases/AppCallArgs.md)

Defined in: [src/types/app.ts:327](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L327)

Any args to pass to any update transaction that is issued as part of deployment
