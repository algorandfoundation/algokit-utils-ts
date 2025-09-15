import type { ApplicationLocalState, ApplicationParams } from "./index";

export type AccountApplicationInformation = {
  /**
   * The round for which this information is relevant.
   */
  round: bigint;
  appLocalState?: ApplicationLocalState;
  createdApp?: ApplicationParams;
};
