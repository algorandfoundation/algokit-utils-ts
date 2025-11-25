import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  numberCodec,
  bigIntCodec,
} from '@algorandfoundation/algokit-common'

/**
 * Fields relating to a protocol upgrade.
 */
export type BlockUpgradeState = {
  /**
   * \[proto\] The current protocol version.
   */
  currentProtocol: string

  /**
   * \[nextproto\] The next proposed protocol version.
   */
  nextProtocol?: string

  /**
   * \[nextyes\] Number of blocks which approved the protocol upgrade.
   */
  nextProtocolApprovals?: number

  /**
   * \[nextswitch\] Round on which the protocol upgrade will take effect.
   */
  nextProtocolSwitchOn?: bigint

  /**
   * \[nextbefore\] Deadline round for this protocol upgrade (No votes will be consider after this round).
   */
  nextProtocolVoteBefore?: bigint
}

export const BlockUpgradeStateMeta: ObjectModelMetadata = {
  name: 'BlockUpgradeState',
  kind: 'object',
  fields: [
    {
      name: 'currentProtocol',
      wireKey: 'current-protocol',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'nextProtocol',
      wireKey: 'next-protocol',
      optional: true,
      codec: stringCodec,
    },
    {
      name: 'nextProtocolApprovals',
      wireKey: 'next-protocol-approvals',
      optional: true,
      codec: numberCodec,
    },
    {
      name: 'nextProtocolSwitchOn',
      wireKey: 'next-protocol-switch-on',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'nextProtocolVoteBefore',
      wireKey: 'next-protocol-vote-before',
      optional: true,
      codec: bigIntCodec,
    },
  ],
}
