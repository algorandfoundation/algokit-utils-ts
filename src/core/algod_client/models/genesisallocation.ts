export type GenesisAllocation = {
  addr: string;
  comment: string;
  state: {
    algo: bigint;
    onl: bigint;
    sel?: string;
    stprf?: string;
    vote?: string;
    voteKd?: bigint;
    voteFst?: bigint;
    voteLst?: bigint;
  };
};
