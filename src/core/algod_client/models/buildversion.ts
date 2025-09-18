export type BuildVersion = {
  branch: string;
  buildNumber: bigint;
  channel: string;
  commitHash: string;
  major: bigint;
  minor: bigint;
};
