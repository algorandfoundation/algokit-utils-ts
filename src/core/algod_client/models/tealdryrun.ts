import type { DryrunTxnResult } from "./index";

export type TealDryrun = {
  txns: DryrunTxnResult[];
  error: string;

  /**
   * Protocol version is the protocol version Dryrun was operated under.
   */
  protocolVersion: string;
};
