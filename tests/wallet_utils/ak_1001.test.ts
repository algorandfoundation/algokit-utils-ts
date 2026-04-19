import { expect, test, describe } from "vitest";

describe("AK-1001", () => {
  // Polytest Suite: AK-1001

  describe("AK-1001", () => {
    // Polytest Group: AK-1001

    /* 
      AK-995: Split funds. As a user I would like to split my funds over various accounts without having to remember additional mnemonics

      Acceptance Criteria:
      Given I have derived 20 addresses

      Then I can send funds to one of those addresses

      And the wallet will keep track of those funds
     */
    test("AK-995", () => {
      throw new Error("TEST NOT IMPLEMENTED");
    });

    /* 
      AK-1010: Make payment. As a user I want to make a payment to so I can pay my dues

      Acceptance Criteria:
      Given I have created addresses

      And I know the balance

      Then I can create a well formed Algo transaction
     */
    test("AK-1010", () => {
      throw new Error("TEST NOT IMPLEMENTED");
    });

    /* 
      AK-1011: Make complex payment. As a user I want to send numerous interdependent transaction so that I can reduce costs and add business logic

      Acceptance Criteria:
      Given I have created my wallet

      And I know my balance

      Then I can create a sequence of well formed transactions with various assets and outputs
     */
    test("AK-1011", () => {
      throw new Error("TEST NOT IMPLEMENTED");
    });

    /* 
      AK-1012: Make multi-sig payment. As a user I want to create and co-sign a payment for n people, so we can pay out dues

      Acceptance Criteria:
      Given I have created a multisig- address

      And I know the balance

      Then I can create a well formed transaction
     */
    test("AK-1012", () => {
      throw new Error("TEST NOT IMPLEMENTED");
    });

    /* 
      AK-1013: Send ASA. As a user I want to send one or more native assets to people so I can pay my dues

      Acceptance Criteria:
      Given I have created addresses

      And I know the balance

      Then I can create a well formed ASA transaction
     */
    test("AK-1013", () => {
      throw new Error("TEST NOT IMPLEMENTED");
    });

    /* 
      AK-1014: Send smart contract asset. As a user I want to be able to send ARC20 tokens to people so that I can pay my dues

      Acceptance Criteria:
      Given I have created addresses

      And I know the balance

      Then I can create a well formed ARC20 transaction
     */
    test("AK-1014", () => {
      throw new Error("TEST NOT IMPLEMENTED");
    });

    /* 
      AK-1015: Send NFT. As a user I want to be able to send ARC NFT tokens to people so that I can pay my dues

      Acceptance Criteria:
      Given I have created addresses

      And I know the balance

      Then I can create a well formed NFT transaction
     */
    test("AK-1015", () => {
      throw new Error("TEST NOT IMPLEMENTED");
    });

    /* 
      AK-1016: Add Metadata. As a user I want to add Metadata to my payments so that I can append information (encrypted or not)

      Acceptance Criteria:
      Given I have a well formed transaction

      Then I can add metadata to that transactions of free form

      in ARC2 form
     */
    test("AK-1016", () => {
      throw new Error("TEST NOT IMPLEMENTED");
    });

    /* 
      AK-1017: Transaction costs. As a user I want to know what the cost is for executing the transaction so that I don’t run into any surprises (also tax reasons)

      Acceptance Criteria:
      Given I have a well formed transaction

      Then the SDK can tell me what the cost of executing this transaction will be



      (it might need to ask the node for this information)
     */
    test("AK-1017", () => {
      throw new Error("TEST NOT IMPLEMENTED");
    });

  });

});