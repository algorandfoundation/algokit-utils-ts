import { expect, test, describe } from "vitest";

describe("AK-1002", () => {
  // Polytest Suite: AK-1002

  describe("AK-1002", () => {
    // Polytest Group: AK-1002

    /* 
      AK-1018: Review transaction. As a user I want to review a transaction so I know that its safe to sign it

      Acceptance Criteria:
      Given I have a well formed transaction

      Then I can check variables like:

      # What assets are being send
      # Where they are sent to
      # Any meta data in the Tx
      # From which address its send
      # potential ramifications/understanding side effects like losing rekey
     */
    test("AK-1018", () => {
      throw new Error("TEST NOT IMPLEMENTED");
    });

    /* 
      AK-1019: Sign transaction. As a user I want to sign a transaction so it can be executed on the blockchain

      Acceptance Criteria:
      Given I have reviewed my transaction

      Then I can sign the transaction

      And share with thirdparty (dapp)
     */
    test("AK-1019", () => {
      throw new Error("TEST NOT IMPLEMENTED");
    });

    /* 
      AK-1020: Hardware sign transaction. As a user I want to share my unsigned transaction with a HSM so that they can sign it on my behalf

      Acceptance Criteria:
      Given I have review the transaction

      Then I can connect to a hardware module like Ledger or HashiCorp

      And get it to sign my transaction

      Then Submit it to the blockchain
     */
    test("AK-1020", () => {
      throw new Error("TEST NOT IMPLEMENTED");
    });

    /* 
      AK-1021: Export unsigned transaction. As a user I want to export an unsigned or partially signed transaction so that someone else can do something with it

      Acceptance Criteria:
      Given I have reviewed the transaction

      Then I can share the unsigned transaction with Base64 encoding
     */
    test("AK-1021", () => {
      throw new Error("TEST NOT IMPLEMENTED");
    });

    /* 
      AK-1248: sign arbitrary data. As a user I want to proof that I own a certain key, so I can get access to a service.

      Acceptance Criteria:
      Given I have setup a wallet

      And I contect to a service

      And the service requests me to sign a nounce with a specific key

      Then I can sign that nounce and return result



      examples:

      [https://docs.metamask.io/wallet/how-to/sign-data/siwe/|https://docs.metamask.io/wallet/how-to/sign-data/siwe/|smart-link] 

      [https://cips.cardano.org/cip/CIP-0008|https://cips.cardano.org/cip/CIP-0008|smart-link]
     */
    test("AK-1248", () => {
      throw new Error("TEST NOT IMPLEMENTED");
    });

  });

});