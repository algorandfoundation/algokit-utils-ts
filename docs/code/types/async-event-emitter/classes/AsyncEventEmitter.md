[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/async-event-emitter](../README.md) / AsyncEventEmitter

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

#### Call Signature

> **emitAsync**\<`K`\>(`eventName`, `event`): `Promise`\<`void`\>

Defined in: [src/types/async-event-emitter.ts:9](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/async-event-emitter.ts#L9)

##### Type Parameters

###### K

`K` *extends* [`EventType`](../../lifecycle-events/enumerations/EventType.md)

##### Parameters

###### eventName

`K`

###### event

[`EventDataMap`](../../lifecycle-events/type-aliases/EventDataMap.md)\[`K`\]

##### Returns

`Promise`\<`void`\>

#### Call Signature

> **emitAsync**(`eventName`, `event`): `Promise`\<`void`\>

Defined in: [src/types/async-event-emitter.ts:10](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/async-event-emitter.ts#L10)

##### Parameters

###### eventName

`string` | `symbol`

###### event

`unknown`

##### Returns

`Promise`\<`void`\>

***

### on()

#### Call Signature

> **on**\<`K`\>(`eventName`, `listener`): `AsyncEventEmitter`

Defined in: [src/types/async-event-emitter.ts:17](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/async-event-emitter.ts#L17)

##### Type Parameters

###### K

`K` *extends* [`EventType`](../../lifecycle-events/enumerations/EventType.md)

##### Parameters

###### eventName

`K`

###### listener

[`AsyncEventListener`](../type-aliases/AsyncEventListener.md)\<[`EventDataMap`](../../lifecycle-events/type-aliases/EventDataMap.md)\[`K`\]\>

##### Returns

`AsyncEventEmitter`

#### Call Signature

> **on**\<`T`\>(`eventName`, `listener`): `AsyncEventEmitter`

Defined in: [src/types/async-event-emitter.ts:18](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/async-event-emitter.ts#L18)

##### Type Parameters

###### T

`T` = `unknown`

##### Parameters

###### eventName

`string` | `symbol`

###### listener

[`AsyncEventListener`](../type-aliases/AsyncEventListener.md)\<`T`\>

##### Returns

`AsyncEventEmitter`

***

### once()

#### Call Signature

> **once**\<`K`\>(`eventName`, `listener`): `AsyncEventEmitter`

Defined in: [src/types/async-event-emitter.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/async-event-emitter.ts#L25)

##### Type Parameters

###### K

`K` *extends* [`EventType`](../../lifecycle-events/enumerations/EventType.md)

##### Parameters

###### eventName

`K`

###### listener

[`AsyncEventListener`](../type-aliases/AsyncEventListener.md)\<[`EventDataMap`](../../lifecycle-events/type-aliases/EventDataMap.md)\[`K`\]\>

##### Returns

`AsyncEventEmitter`

#### Call Signature

> **once**\<`T`\>(`eventName`, `listener`): `AsyncEventEmitter`

Defined in: [src/types/async-event-emitter.ts:26](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/async-event-emitter.ts#L26)

##### Type Parameters

###### T

`T` = `unknown`

##### Parameters

###### eventName

`string` | `symbol`

###### listener

[`AsyncEventListener`](../type-aliases/AsyncEventListener.md)\<`T`\>

##### Returns

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
