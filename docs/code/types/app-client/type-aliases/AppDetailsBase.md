[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-client](../README.md) / AppDetailsBase

# Type Alias: AppDetailsBase

> **AppDetailsBase** = `object`

Defined in: [src/types/app-client.ts:123](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L123)

The details of an AlgoKit Utils deployed app

## Properties

### deployTimeParams?

> `optional` **deployTimeParams**: [`TealTemplateParams`](../../app/interfaces/TealTemplateParams.md)

Defined in: [src/types/app-client.ts:131](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L131)

Optionally provide any deploy-time parameters to replace in the TEAL code; if specified here will get
used in calls to `deploy`, `create` and `update` unless overridden in those calls

***

### params?

> `optional` **params**: `SuggestedParams`

Defined in: [src/types/app-client.ts:127](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L127)

Default suggested params object to use

***

### sender?

> `optional` **sender**: [`SendTransactionFrom`](../../transaction/type-aliases/SendTransactionFrom.md)

Defined in: [src/types/app-client.ts:125](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L125)

Default sender to use for transactions issued by this application client
