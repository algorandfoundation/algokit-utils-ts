[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-client](../README.md) / AppDetailsBase

# Type Alias: AppDetailsBase

> **AppDetailsBase** = `object`

Defined in: [src/types/app-client.ts:108](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L108)

The details of an AlgoKit Utils deployed app

## Properties

### deployTimeParams?

> `optional` **deployTimeParams**: [`TealTemplateParams`](../../app/interfaces/TealTemplateParams.md)

Defined in: [src/types/app-client.ts:116](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L116)

Optionally provide any deploy-time parameters to replace in the TEAL code; if specified here will get
used in calls to `deploy`, `create` and `update` unless overridden in those calls

***

### params?

> `optional` **params**: [`SuggestedParams`](../../../Subpaths/algod-client/type-aliases/SuggestedParams.md)

Defined in: [src/types/app-client.ts:112](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L112)

Default suggested params object to use

***

### sender?

> `optional` **sender**: [`SendTransactionFrom`](../../transaction/type-aliases/SendTransactionFrom.md)

Defined in: [src/types/app-client.ts:110](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L110)

Default sender to use for transactions issued by this application client
