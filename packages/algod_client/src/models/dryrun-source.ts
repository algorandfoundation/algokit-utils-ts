import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  numberCodec,
  bigIntCodec,
} from '@algorandfoundation/algokit-common'

/**
 * DryrunSource is TEAL source text that gets uploaded, compiled, and inserted into transactions or application state.
 */
export type DryrunSource = {
  /**
   * FieldName is what kind of sources this is. If lsig then it goes into the transactions[this.TxnIndex].LogicSig. If approv or clearp it goes into the Approval Program or Clear State Program of application[this.AppIndex].
   */
  fieldName: string
  source: string
  txnIndex: number
  appId: bigint
}

export const DryrunSourceMeta: ObjectModelMetadata = {
  name: 'DryrunSource',
  kind: 'object',
  fields: [
    {
      name: 'fieldName',
      wireKey: 'field-name',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'source',
      wireKey: 'source',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'txnIndex',
      wireKey: 'txn-index',
      optional: false,
      codec: numberCodec,
    },
    {
      name: 'appId',
      wireKey: 'app-index',
      optional: false,
      codec: bigIntCodec,
    },
  ],
}
