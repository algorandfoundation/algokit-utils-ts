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
import { TransactionMeta } from './transaction-meta'

const MultisigSubsignatureMeta: ObjectModelMetadata = {
  name: 'MultisigSubsignature',
  kind: 'object',
  fields: [
    { name: 'address', wireKey: 'pk', optional: false, codec: addressCodec },
    { name: 'signature', wireKey: 's', optional: true, codec: fixedBytes64Codec },
  ],
}

const MultisigSignatureMeta: ObjectModelMetadata = {
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

const LogicSignatureMeta: ObjectModelMetadata = {
  name: 'LogicSignature',
  kind: 'object',
  fields: [
    { name: 'logic', wireKey: 'l', optional: false, codec: bytesCodec },
    { name: 'args', wireKey: 'arg', optional: true, codec: bytesArrayCodec },
    { name: 'signature', wireKey: 'sig', optional: true, codec: fixedBytes64Codec },
    {
      name: 'multiSignature',
      wireKey: 'msig',
      optional: true,
      codec: new ObjectModelCodec(MultisigSignatureMeta),
    },
    {
      name: 'logicMultiSignature',
      wireKey: 'lmsig',
      optional: true,
      codec: new ObjectModelCodec(MultisigSignatureMeta),
    },
  ],
}

/**
 * Metadata for SignedTransaction
 */
export const SignedTransactionMeta: ObjectModelMetadata = {
  name: 'SignedTransaction',
  kind: 'object',
  fields: [
    {
      name: 'txn',
      wireKey: 'txn',
      optional: false,
      codec: new ObjectModelCodec(TransactionMeta),
    },
    { name: 'signature', wireKey: 'sig', optional: true, codec: fixedBytes64Codec },
    {
      name: 'multiSignature',
      wireKey: 'msig',
      optional: true,
      codec: new ObjectModelCodec(MultisigSignatureMeta),
    },
    {
      name: 'logicSignature',
      wireKey: 'lsig',
      optional: true,
      codec: new ObjectModelCodec(LogicSignatureMeta),
    },
    { name: 'authAddress', wireKey: 'sgnr', optional: true, codec: addressCodec },
  ],
}
