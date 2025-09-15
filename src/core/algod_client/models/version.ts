import type { BuildVersion } from "./index";

/**
 * algod version information.
 */
export type Version = {
  build: BuildVersion;
  genesisHashB64: string;
  genesisId: string;
  versions: string[];
};
