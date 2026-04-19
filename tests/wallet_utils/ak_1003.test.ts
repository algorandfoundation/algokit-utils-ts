import { expect, test, describe } from "vitest";

describe("AK-1003", () => {
  // Polytest Suite: AK-1003

  describe("AK-1003", () => {
    // Polytest Group: AK-1003

    /* 
      AK-1022: Stake funds. As a user I want to be able to stake my funds so that I can receive rewards

      Acceptance Criteria:
      Given I have setup my wallet

      And I have a balance over 30K Algo

      Then I can request a keyreg transaction from a node

      And I can sign the keyreg transaction



      exclusion: pooled staking
     */
    test("AK-1022", () => {
      throw new Error("TEST NOT IMPLEMENTED");
    });

    /* 
      AK-1023: View rewards. As a user I want to view how much rewards I got and when so that I can accurately report my income

      Acceptance Criteria:
      Given I have staked my funds to a node

      Then I can see how much rewards I’m getting per address

      And which block I received those rewards

      return object:

      * when I won the block
      * When I got the payment block
      * reward amount
      * convert block to date:time UTC
      * fees paid
     */
    test("AK-1023", () => {
      throw new Error("TEST NOT IMPLEMENTED");
    });

    /* 
      AK-1024: View current amount staked. As a user I want to know how much funds I current have staked so I can calculate the amount of rewards I can expect.

      Acceptance Criteria:
      Given I have created a wallet

      And split my funds over addresses

      And staked my funds

      Then I can see which addresses are staked

      Do I have more than 30K algo
     */
    test("AK-1024", () => {
      throw new Error("TEST NOT IMPLEMENTED");
    });

  });

});