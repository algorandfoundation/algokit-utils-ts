import type { Account, AlgokitSignedTransaction, Application, DryrunSource } from "./index";

/**
 * Request data type for dryrun endpoint. Given the Transactions and simulated ledger state upload, run TEAL scripts and return debugging information.
 */
export type DryrunRequest = {
  txns: AlgokitSignedTransaction[];
  accounts: Account[];
  apps: Application[];

  /**
   * ProtocolVersion specifies a specific version string to operate under, otherwise whatever the current protocol of the network this algod is running in.
   */
  protocolVersion: string;

  /**
   * Round is available to some TEAL scripts. Defaults to the current round on the network this algod is attached to.
   */
  round: bigint;

  /**
   * LatestTimestamp is available to some TEAL scripts. Defaults to the latest confirmed timestamp this algod is attached to.
   */
  latestTimestamp: bigint;
  sources: DryrunSource[];
};
