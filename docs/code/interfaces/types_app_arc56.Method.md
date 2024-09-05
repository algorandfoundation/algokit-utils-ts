[@algorandfoundation/algokit-utils](../README.md) / [types/app-arc56](../modules/types_app_arc56.md) / Method

# Interface: Method

[types/app-arc56](../modules/types_app_arc56.md).Method

Describes a method in the contract. This interface is an extension of the interface described in ARC-4

## Table of contents

### Properties

- [actions](types_app_arc56.Method.md#actions)
- [args](types_app_arc56.Method.md#args)
- [desc](types_app_arc56.Method.md#desc)
- [events](types_app_arc56.Method.md#events)
- [name](types_app_arc56.Method.md#name)
- [readonly](types_app_arc56.Method.md#readonly)
- [recommendations](types_app_arc56.Method.md#recommendations)
- [returns](types_app_arc56.Method.md#returns)

## Properties

### actions

• **actions**: `Object`

an action is a combination of call/create and an OnComplete

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | (``"NoOp"`` \| ``"OptIn"`` \| ``"DeleteApplication"`` \| ``"CloseOut"`` \| ``"ClearState"`` \| ``"UpdateApplication"``)[] | OnCompletes this method allows when appID !== 0 |
| `create` | (``"NoOp"`` \| ``"OptIn"`` \| ``"DeleteApplication"``)[] | OnCompletes this method allows when appID === 0 |

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-arc56.ts:341](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L341)
=======
[src/types/app-arc56.ts:142](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L142)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-arc56.ts:178](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L178)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)

___

### args

• **args**: \{ `defaultValue?`: `string` ; `desc?`: `string` ; `name?`: `string` ; `struct?`: `string` ; `type`: `string`  }[]

The arguments of the method, in order

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-arc56.ts:319](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L319)
=======
[src/types/app-arc56.ts:120](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L120)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-arc56.ts:156](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L156)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)

___

### desc

• `Optional` **desc**: `string`

Optional, user-friendly description for the method

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-arc56.ts:317](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L317)
=======
[src/types/app-arc56.ts:118](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L118)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-arc56.ts:154](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L154)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)

___

### events

• `Optional` **events**: [`Event`](types_app_arc56.Event.md)[]

ARC-28 events that MAY be emitted by this method

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-arc56.ts:350](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L350)
=======
[src/types/app-arc56.ts:151](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L151)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-arc56.ts:187](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L187)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)

___

### name

• **name**: `string`

The name of the method

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-arc56.ts:315](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L315)
=======
[src/types/app-arc56.ts:116](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L116)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-arc56.ts:152](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L152)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)

___

### readonly

• `Optional` **readonly**: `boolean`

If this method does not write anything to the ledger (ARC-22)

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-arc56.ts:348](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L348)
=======
[src/types/app-arc56.ts:149](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L149)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-arc56.ts:185](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L185)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)

___

### recommendations

• `Optional` **recommendations**: `Object`

Information that clients can use when calling the method

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `accounts?` | `string`[] | Recommended foreign accounts |
| `apps?` | `number`[] | Recommended foreign apps |
| `assets?` | `number`[] | Recommended foreign assets |
| `boxes?` | \{ `app?`: `number` ; `key`: `string` ; `readBytes`: `number` ; `writeBytes`: `number`  } | Recommended box references to include |
| `boxes.app?` | `number` | The app ID for the box |
| `boxes.key` | `string` | The base64 encoded box key |
| `boxes.readBytes` | `number` | The number of bytes being read from the box |
| `boxes.writeBytes` | `number` | The number of bytes being written to the box |
| `innerTransactionCount?` | `number` | The number of inner transactions the caller should cover the fees for |

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-arc56.ts:352](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L352)
=======
[src/types/app-arc56.ts:153](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L153)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-arc56.ts:189](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L189)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)

___

### returns

• **returns**: `Object`

Information about the method's return value

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `desc?` | `string` | Optional, user-friendly description for the return value |
| `struct?` | `string` | If the type is a struct, the name of the struct |
| `type` | `string` | The type of the return value, or "void" to indicate no return value. |

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-arc56.ts:332](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L332)
=======
[src/types/app-arc56.ts:133](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L133)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-arc56.ts:169](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L169)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
