[@algorandfoundation/algokit-utils-debug](../README.md) / index

# Module: index

## Table of contents

### Functions

- [performAtomicTransactionComposerSimulate](index.md#performatomictransactioncomposersimulate)
- [persistSourceMaps](index.md#persistsourcemaps)
- [simulateAndPersistResponse](index.md#simulateandpersistresponse)

## Functions

### performAtomicTransactionComposerSimulate

▸ **performAtomicTransactionComposerSimulate**(`atc`, `algod`): `Promise`\<`SimulateResponse`\>

Performs a simulation of the transactions loaded into the given AtomicTransactionComposer.

#### Parameters

| Name    | Type                        | Description                                               |
| :------ | :-------------------------- | :-------------------------------------------------------- |
| `atc`   | `AtomicTransactionComposer` | The AtomicTransactionComposer with transaction(s) loaded. |
| `algod` | `default`                   | An Algod client to perform the simulation.                |

#### Returns

`Promise`\<`SimulateResponse`\>

The simulation result, which includes various details about how the transactions would be processed.

#### Defined in

[debugging/simulate-and-persist-response.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/debug-utils/src/debugging/simulate-and-persist-response.ts#L25)

---

### persistSourceMaps

▸ **persistSourceMaps**(`params`): `Promise`\<`void`\>

This function persists the source maps for the given sources.

#### Parameters

| Name     | Type                                                                                  |
| :------- | :------------------------------------------------------------------------------------ |
| `params` | [`PersistSourceMapsParams`](../interfaces/types_debugging.PersistSourceMapsParams.md) |

#### Returns

`Promise`\<`void`\>

A promise that resolves when the source maps have been persisted.

#### Defined in

[debugging/debugging.ts:72](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/debug-utils/src/debugging/debugging.ts#L72)

---

### simulateAndPersistResponse

▸ **simulateAndPersistResponse**(`param0`): `Promise`\<`SimulateResponse`\>

This function simulates the atomic transactions using the provided `AtomicTransactionComposer` object and `Algodv2` object,
and persists the simulation response to an AlgoKit AVM Debugger compliant JSON file.

#### Parameters

| Name     | Type                                                                                                    | Description                                               |
| :------- | :------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------- |
| `param0` | [`SimulateAndPersistResponseParams`](../interfaces/types_debugging.SimulateAndPersistResponseParams.md) | The parameters to control the simulation and persistence. |

#### Returns

`Promise`\<`SimulateResponse`\>

The simulation result, which includes various details about how the transactions would be processed.

**`Example`**

```ts
const atc = new AtomicTransactionComposer()
const algod = new algosdk.Algodv2(token, server, port)
const projectRoot = '/path/to/project'
const bufferSizeMb = 10

const result = await simulateAndPersistResponse({ atc, projectRoot, algod, bufferSizeMb })
console.log(result)
```

#### Defined in

[debugging/simulate-and-persist-response.ts:65](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/debug-utils/src/debugging/simulate-and-persist-response.ts#L65)
