[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/async-event-emitter](../README.md) / AsyncEventEmitter

# Class: AsyncEventEmitter

Defined in: [src/types/async-event-emitter.ts:5](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/async-event-emitter.ts#L5)

## Constructors

### Constructor

> **new AsyncEventEmitter**(): `AsyncEventEmitter`

#### Returns

`AsyncEventEmitter`

## Properties

### off()

> **off**: (`eventName`, `listener`) => `AsyncEventEmitter`

Defined in: [src/types/async-event-emitter.ts:55](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/async-event-emitter.ts#L55)

#### Parameters

##### eventName

`string` | `symbol`

##### listener

[`AsyncEventListener`](../type-aliases/AsyncEventListener.md)

#### Returns

`AsyncEventEmitter`

## Methods

### emitAsync()

> **emitAsync**\<`K`\>(`eventName`, `event`): `Promise`\<`void`\>

Defined in: [src/types/async-event-emitter.ts:9](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/async-event-emitter.ts#L9)

#### Type Parameters

##### K

`K` *extends* `string` \| `symbol`

#### Parameters

##### eventName

`K`

##### event

`K` *extends* [`EventType`](../../lifecycle-events/enumerations/EventType.md) ? [`EventDataMap`](../../lifecycle-events/type-aliases/EventDataMap.md)\[`K`\<`K`\>\] : `unknown`

#### Returns

`Promise`\<`void`\>

***

### on()

> **on**\<`K`\>(`eventName`, `listener`): `AsyncEventEmitter`

Defined in: [src/types/async-event-emitter.ts:15](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/async-event-emitter.ts#L15)

#### Type Parameters

##### K

`K` *extends* `string` \| `symbol`

#### Parameters

##### eventName

`K`

##### listener

[`AsyncEventListener`](../type-aliases/AsyncEventListener.md)\<`K` *extends* [`EventType`](../../lifecycle-events/enumerations/EventType.md) ? [`EventDataMap`](../../lifecycle-events/type-aliases/EventDataMap.md)\[`K`\<`K`\>\] : `unknown`\>

#### Returns

`AsyncEventEmitter`

***

### once()

> **once**\<`K`\>(`eventName`, `listener`): `AsyncEventEmitter`

Defined in: [src/types/async-event-emitter.ts:24](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/async-event-emitter.ts#L24)

#### Type Parameters

##### K

`K` *extends* `string` \| `symbol`

#### Parameters

##### eventName

`K`

##### listener

[`AsyncEventListener`](../type-aliases/AsyncEventListener.md)\<`K` *extends* [`EventType`](../../lifecycle-events/enumerations/EventType.md) ? [`EventDataMap`](../../lifecycle-events/type-aliases/EventDataMap.md)\[`K`\<`K`\>\] : `unknown`\>

#### Returns

`AsyncEventEmitter`

***

### removeListener()

> **removeListener**(`eventName`, `listener`): `AsyncEventEmitter`

Defined in: [src/types/async-event-emitter.ts:39](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/async-event-emitter.ts#L39)

#### Parameters

##### eventName

`string` | `symbol`

##### listener

[`AsyncEventListener`](../type-aliases/AsyncEventListener.md)

#### Returns

`AsyncEventEmitter`
