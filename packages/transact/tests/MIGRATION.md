# Migration

## Removed Functions

### `sanityCheckProgram`

#### Previously

```typescript
import { sanityCheckProgram } from '@algorandfoundation/algokit-transact'
sanityCheckProgram(programBytes)
```

#### Now

This function has been removed with no replacement.

### `decodeLogicSignature`

#### Previously

```typescript
import { decodeLogicSignature } from '@algorandfoundation/algokit-transact'
const logicSig = decodeLogicSignature(encodedLogicSignature)
```

#### Now

```typescript
import { LogicSigAccount } from '@algorandfoundation/algokit-transact'
const logicSig = LogicSigAccount.fromBytes(encodedLogicSignature)
```

### `newMultisigSignature`

#### Previously

```typescript
import { newMultisigSignature } from '@algorandfoundation/algokit-transact'
const msig = newMultisigSignature(version, threshold, participants)
```

#### Now

```typescript
import { MultisigAccount } from '@algorandfoundation/algokit-transact'
const msigAccount = new MultisigAccount({ version, threshold, addrs: participants }, [])
const msig = msigAccount.createMultisigSignature()
```

### `participantsFromMultisigSignature`

#### Previously

```typescript
import { participantsFromMultisigSignature } from '@algorandfoundation/algokit-transact'
const participants = participantsFromMultisigSignature(multisigSignature)
```

#### Now

```typescript
const participants = multisigSignature.subsignatures.map((subsig) => subsig.publicKey)
```

### `addressFromMultisigSignature`

#### Previously

```typescript
import { addressFromMultisigSignature } from '@algorandfoundation/algokit-transact'
const address = addressFromMultisigSignature(multisigSignature)
```

#### Now

```typescript
import { MultisigAccount } from '@algorandfoundation/algokit-transact'
const msigAccount = MultisigAccount.fromSignature(multisigSignature)
const address = msigAccount.addr
```

### `applyMultisigSubsignature`

#### Previously

```typescript
import { applyMultisigSubsignature } from '@algorandfoundation/algokit-transact'
const updatedMsig = applyMultisigSubsignature(multisigSignature, participant, signature)
```

#### Now

```typescript
import { MultisigAccount } from '@algorandfoundation/algokit-transact'
const msigAccount = new MultisigAccount({ version, threshold, addrs }, [])
const updatedMsig = msigAccount.applySignature(multisigSignature, participant, signature)
```

### `mergeMultisignatures`

#### Previously

```typescript
import { mergeMultisignatures } from '@algorandfoundation/algokit-transact'
const merged = mergeMultisignatures(multisigSignatureA, multisigSignatureB)
```

#### Now

Apply signatures individually using `MultisigAccount.applySignature()`.

### `createMultisigTransaction`

#### Previously

```typescript
import { createMultisigTransaction } from '@algorandfoundation/algokit-transact'
const encodedBlob = createMultisigTransaction(txn, { version, threshold, addrs })
```

#### Now

```typescript
import { MultisigAccount, encodeSignedTransaction } from '@algorandfoundation/algokit-transact'
const msigAccount = new MultisigAccount({ version, threshold, addrs }, [])
const signedTxn = msigAccount.createMultisigTransaction(txn)
const encodedBlob = encodeSignedTransaction(signedTxn)
```

### `mergeMultisigTransactions`

#### Previously

```typescript
import { mergeMultisigTransactions } from '@algorandfoundation/algokit-transact'
const mergedBlob = mergeMultisigTransactions(multisigTxnBlobs)
```

#### Now

Apply signatures individually using `MultisigAccount.applySignatureToTxn()`.

### `appendSignRawMultisigSignature`

#### Previously

```typescript
import { appendSignRawMultisigSignature } from '@algorandfoundation/algokit-transact'
const { txID, blob } = appendSignRawMultisigSignature(multisigTxnBlob, { version, threshold, addrs }, signerAddr, signature)
```

#### Now

```typescript
import { MultisigAccount, encodeSignedTransaction } from '@algorandfoundation/algokit-transact'
const msigAccount = new MultisigAccount({ version, threshold, addrs }, [])
msigAccount.applySignatureToTxn(signedTxn, signerAddr.publicKey, signature)
const blob = encodeSignedTransaction(signedTxn)
const txID = signedTxn.txn.txId()
```

### `addressFromMultisigPreImg`

#### Previously

```typescript
import { addressFromMultisigPreImg } from '@algorandfoundation/algokit-transact'
const address = addressFromMultisigPreImg({ version, threshold, pks })
```

#### Now

```typescript
import { Address, MultisigAccount } from '@algorandfoundation/algokit-transact'
const msigAccount = new MultisigAccount({ version, threshold, addrs: pks.map((pk) => new Address(pk)) }, [])
const address = msigAccount.addr
```

### `addressFromMultisigPreImgAddrs`

#### Previously

```typescript
import { addressFromMultisigPreImgAddrs } from '@algorandfoundation/algokit-transact'
const address = addressFromMultisigPreImgAddrs({ version, threshold, addrs })
```

#### Now

```typescript
import { MultisigAccount } from '@algorandfoundation/algokit-transact'
const msigAccount = new MultisigAccount({ version, threshold, addrs }, [])
const address = msigAccount.addr
```

### `multisigAddress`

#### Previously

```typescript
import { multisigAddress } from '@algorandfoundation/algokit-transact'
const address = multisigAddress({ version, threshold, addrs })
```

#### Now

```typescript
import { MultisigAccount } from '@algorandfoundation/algokit-transact'
const msigAccount = new MultisigAccount({ version, threshold, addrs }, [])
const address = msigAccount.addr
```

### `decodeMultiSignature`

#### Previously

```typescript
import { decodeMultiSignature } from '@algorandfoundation/algokit-transact'
const msig = decodeMultiSignature(encodedMultiSignature)
```

#### Now

Decode the signed transaction and access the `msig` property:

```typescript
import { decodeSignedTransaction } from '@algorandfoundation/algokit-transact'
const signedTxn = decodeSignedTransaction(encodedSignedTransaction)
const msig = signedTxn.msig
```

## Removed Error Message Exports

The following error message constants are no longer exported:

- `MULTISIG_MERGE_LESSTHANTWO_ERROR_MSG`
- `MULTISIG_MERGE_MISMATCH_ERROR_MSG`
- `MULTISIG_MERGE_MISMATCH_AUTH_ADDR_MSG`
- `MULTISIG_MERGE_WRONG_PREIMAGE_ERROR_MSG`
- `MULTISIG_MERGE_SIG_MISMATCH_ERROR_MSG`
- `MULTISIG_NO_MUTATE_ERROR_MSG`
- `MULTISIG_USE_PARTIAL_SIGN_ERROR_MSG`
- `MULTISIG_SIGNATURE_LENGTH_ERROR_MSG`
