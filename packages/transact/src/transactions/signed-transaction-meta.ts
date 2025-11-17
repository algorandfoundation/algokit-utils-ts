import type { ModelMetadata } from '@algorandfoundation/algokit-common'
import {
  ArrayCodec,
  ModelCodec,
  addressCodec,
  bytesArrayCodec,
  bytesCodec,
  fixedBytes64Codec,
  numberCodec,
} from '@algorandfoundation/algokit-common'
import { TransactionMeta } from './transaction-meta'

const MultisigSubsignatureMeta: ModelMetadata = {
  name: 'MultisigSubsignature',
  kind: 'object',
  fields: [
    { name: 'address', wireKey: 'pk', optional: false, nullable: false, codec: addressCodec },
    { name: 'signature', wireKey: 's', optional: true, nullable: false, codec: fixedBytes64Codec },
  ],
}

const MultisigSignatureMeta: ModelMetadata = {
  name: 'MultisigSignature',
  kind: 'object',
  fields: [
    { name: 'version', wireKey: 'v', optional: false, nullable: false, codec: numberCodec },
    { name: 'threshold', wireKey: 'thr', optional: false, nullable: false, codec: numberCodec },
    {
      name: 'subsignatures',
      wireKey: 'subsig',
      optional: false,
      nullable: false,
      codec: new ArrayCodec(new ModelCodec(MultisigSubsignatureMeta)),
    },
  ],
}

const LogicSignatureMeta: ModelMetadata = {
  name: 'LogicSignature',
  kind: 'object',
  fields: [
    { name: 'logic', wireKey: 'l', optional: false, nullable: false, codec: bytesCodec },
    { name: 'args', wireKey: 'arg', optional: true, nullable: false, codec: bytesArrayCodec },
    { name: 'signature', wireKey: 'sig', optional: true, nullable: false, codec: fixedBytes64Codec },
    {
      name: 'multiSignature',
      wireKey: 'msig',
      optional: true,
      nullable: false,
      codec: new ModelCodec(MultisigSignatureMeta),
    },
    {
      name: 'logicMultiSignature',
      wireKey: 'lmsig',
      optional: true,
      nullable: false,
      codec: new ModelCodec(MultisigSignatureMeta),
    },
  ],
}

/**
 * Metadata for SignedTransaction
 */
export const SignedTransactionMeta: ModelMetadata = {
  name: 'SignedTransaction',
  kind: 'object',
  fields: [
    {
      name: 'txn',
      wireKey: 'txn',
      optional: false,
      nullable: false,
      codec: new ModelCodec(TransactionMeta),
    },
    { name: 'signature', wireKey: 'sig', optional: true, nullable: false, codec: fixedBytes64Codec },
    {
      name: 'multiSignature',
      wireKey: 'msig',
      optional: true,
      nullable: false,
      codec: new ModelCodec(MultisigSignatureMeta),
    },
    {
      name: 'logicSignature',
      wireKey: 'lsig',
      optional: true,
      nullable: false,
      codec: new ModelCodec(LogicSignatureMeta),
    },
    { name: 'authAddress', wireKey: 'sgnr', optional: true, nullable: false, codec: addressCodec },
  ],
}
