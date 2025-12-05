import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  ArrayCodec,
  ObjectModelCodec,
  addressCodec,
  bytesArrayCodec,
  bytesCodec,
  fixedBytes64Codec,
  numberCodec,
} from '@algorandfoundation/algokit-common'
import { LogicSignature, MultisigSignature, MultisigSubsignature, SignedTransaction } from './signed-transaction'
import { transactionCodec } from './transaction-meta'

const MultisigSubsignatureMeta: ObjectModelMetadata<MultisigSubsignature> = {
  name: 'MultisigSubsignature',
  kind: 'object',
  fields: [
    { name: 'address', wireKey: 'pk', optional: false, codec: addressCodec },
    { name: 'signature', wireKey: 's', optional: true, codec: fixedBytes64Codec },
  ],
}

const MultisigSignatureMeta: ObjectModelMetadata<MultisigSignature> = {
  name: 'MultisigSignature',
  kind: 'object',
  fields: [
    { name: 'version', wireKey: 'v', optional: false, codec: numberCodec },
    { name: 'threshold', wireKey: 'thr', optional: false, codec: numberCodec },
    {
      name: 'subsignatures',
      wireKey: 'subsig',
      optional: false,
      codec: new ArrayCodec(new ObjectModelCodec(MultisigSubsignatureMeta)),
    },
  ],
}

const LogicSignatureMeta: ObjectModelMetadata<LogicSignature> = {
  name: 'LogicSignature',
  kind: 'object',
  fields: [
    { name: 'logic', wireKey: 'l', optional: false, codec: bytesCodec },
    { name: 'args', wireKey: 'arg', optional: true, codec: bytesArrayCodec },
    { name: 'sig', wireKey: 'sig', optional: true, codec: fixedBytes64Codec },
    {
      name: 'msig',
      wireKey: 'msig',
      optional: true,
      codec: new ObjectModelCodec(MultisigSignatureMeta),
    },
    {
      name: 'lmsig',
      wireKey: 'lmsig',
      optional: true,
      codec: new ObjectModelCodec(MultisigSignatureMeta),
    },
  ],
}

export const multiSignatureCodec = new ObjectModelCodec<MultisigSignature>(MultisigSignatureMeta)
export const logicSignatureCodec = new ObjectModelCodec<LogicSignature>(LogicSignatureMeta)

/**
 * Metadata for SignedTransaction
 */
export const SignedTransactionMeta: ObjectModelMetadata<SignedTransaction> = {
  name: 'SignedTransaction',
  kind: 'object',
  fields: [
    {
      name: 'txn',
      wireKey: 'txn',
      optional: false,
      codec: transactionCodec,
    },
    { name: 'sig', wireKey: 'sig', optional: true, codec: fixedBytes64Codec },
    {
      name: 'msig',
      wireKey: 'msig',
      optional: true,
      codec: multiSignatureCodec,
    },
    {
      name: 'lsig',
      wireKey: 'lsig',
      optional: true,
      codec: logicSignatureCodec,
    },
    { name: 'authAddress', wireKey: 'sgnr', optional: true, codec: addressCodec },
  ],
}

export const signedTransactionCodec = new ObjectModelCodec<SignedTransaction>(SignedTransactionMeta)
