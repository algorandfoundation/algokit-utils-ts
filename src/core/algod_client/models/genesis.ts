import type { GenesisAllocation } from "./index";

export type Genesis = {
  alloc: GenesisAllocation[];
  comment?: string;
  devmode?: boolean;
  fees: string;
  id: string;
  network: string;
  proto: string;
  rwd: string;
  timestamp: bigint;
};
