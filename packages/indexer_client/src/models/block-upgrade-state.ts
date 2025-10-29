import type { ModelMetadata } from '../core/model-runtime'

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
  nextProtocolApprovals?: bigint

  /**
   * \[nextswitch\] Round on which the protocol upgrade will take effect.
   */
  nextProtocolSwitchOn?: bigint

  /**
   * \[nextbefore\] Deadline round for this protocol upgrade (No votes will be consider after this round).
   */
  nextProtocolVoteBefore?: bigint
}

export const BlockUpgradeStateMeta: ModelMetadata = {
  name: 'BlockUpgradeState',
  kind: 'object',
  fields: [
    {
      name: 'currentProtocol',
      wireKey: 'current-protocol',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'nextProtocol',
      wireKey: 'next-protocol',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'nextProtocolApprovals',
      wireKey: 'next-protocol-approvals',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'nextProtocolSwitchOn',
      wireKey: 'next-protocol-switch-on',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'nextProtocolVoteBefore',
      wireKey: 'next-protocol-vote-before',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
