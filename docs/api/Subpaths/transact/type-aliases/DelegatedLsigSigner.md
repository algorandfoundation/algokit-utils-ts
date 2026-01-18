[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/transact](../README.md) / DelegatedLsigSigner

# Type Alias: DelegatedLsigSigner()

> **DelegatedLsigSigner** = (`lsig`, `msig?`) => `Promise`\<`object` & \{ `sig?`: `Uint8Array`; \} \| \{ `lmsig?`: [`MultisigSignature`](MultisigSignature.md); \}\>

Defined in: [packages/transact/src/logicsig.ts:23](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/transact/src/logicsig.ts#L23)

Function for signing logic signatures for delegation

## Parameters

### lsig

[`LogicSigAccount`](../classes/LogicSigAccount.md)

The logic signature that is being signed for delegation

### msig?

[`MultisigAccount`](../classes/MultisigAccount.md)

Optional multisig account that should be set when a public key is signing as a subsigner of a multisig

## Returns

`Promise`\<`object` & \{ `sig?`: `Uint8Array`; \} \| \{ `lmsig?`: [`MultisigSignature`](MultisigSignature.md); \}\>

The address of the delegator
