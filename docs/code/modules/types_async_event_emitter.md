[@algorandfoundation/algokit-utils](../README.md) / types/async-event-emitter

# Module: types/async-event-emitter

## Table of contents

### Enumerations

- [EventType](../enums/types_async_event_emitter.EventType.md)

### Classes

- [AsyncEventEmitter](../classes/types_async_event_emitter.AsyncEventEmitter.md)

### Type Aliases

- [AsyncEventListener](types_async_event_emitter.md#asynceventlistener)
- [EventDataMap](types_async_event_emitter.md#eventdatamap)

## Type Aliases

### AsyncEventListener

Ƭ **AsyncEventListener**\<`T`\>: (`event`: `T`, `eventName`: `string` \| `symbol`) => `Promise`\<`void`\> \| `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Type declaration

▸ (`event`, `eventName`): `Promise`\<`void`\> \| `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `T` |
| `eventName` | `string` \| `symbol` |

##### Returns

`Promise`\<`void`\> \| `void`

#### Defined in

[src/types/async-event-emitter.ts:14](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/async-event-emitter.ts#L14)

___

### EventDataMap

Ƭ **EventDataMap**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `AppCompiled` | [`TealSourcesDebugEventData`](../interfaces/types_debugging.TealSourcesDebugEventData.md) |
| `TxnGroupSimulated` | [`AVMTracesEventData`](../interfaces/types_debugging.AVMTracesEventData.md) |

#### Defined in

[src/types/async-event-emitter.ts:8](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/async-event-emitter.ts#L8)
