/**
 * Supply represents the current supply of MicroAlgos in the system
 */
export type GetSupply = {
  /**
   * Round
   */
  currentRound: bigint;

  /**
   * OnlineMoney
   */
  onlineMoney: bigint;

  /**
   * TotalMoney
   */
  totalMoney: bigint;
};
