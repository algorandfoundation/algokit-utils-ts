import { expect, test, describe } from "vitest";

describe("AK-992", () => {
  // Polytest Suite: AK-992

  describe("AK-992", () => {
    // Polytest Group: AK-992

    /* 
      AK-993: Create address. As a user I would like to create an address using 24 or 25 mnemonic words so that I can receive funds

      Acceptance Criteria:
      +Given+ _I have the SDK running_

      +And+ I request an mnemonic

      +Then+ I can derive 20 addresses

      And have the private public keys



      Ref: [+BIP-44+|https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki]
     */
    test("AK-993", () => {
      throw new Error("TEST NOT IMPLEMENTED");
    });

    /* 
      AK-994: Recover address. As a user I would like to recover my 24 or 25 mnemonic words so I can see my funds

      Acceptance Criteria:
      +Given+ _I have the SDK running_

      +And+ I have an mnemonic

      +Then+ I can derive 20 addresses

      And have the public private keys



      Ref: [+BIP-44+|https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki]
     */
    test("AK-994", () => {
      throw new Error("TEST NOT IMPLEMENTED");
    });

    /* 
      AK-997: Create multi-sig. As a user I want to split the responsibility/security of my funds with other people so I can still recover it when I lose my mnemonic

      Acceptance Criteria:
      Given I have derived 20 addresses

      And I have my co-signers n public keys

      And I know the order

      Then I can derive the multi-sig address

      And track the address
     */
    test("AK-997", () => {
      throw new Error("TEST NOT IMPLEMENTED");
    });

    /* 
      AK-998: Recover multi-sig. As a user I want to be able to recover my joined account so I can view my balance

      Acceptance Criteria:
      Given I have derived 20 addresses

      And I have my co-signers n public keys

      And I know the order

      Then I can derive the multi-sig address

      And track the address
     */
    test("AK-998", () => {
      throw new Error("TEST NOT IMPLEMENTED");
    });

    /* 
      AK-999: Migrate wallet*. As a user I want to migrate from my single address 25 word to a multi-address 24 words wallet so I can split my funds

      Acceptance Criteria:
      Given I have a 25 word, single account

      And I have a 24 word, multi account

      Then I can move all my funds from my account to the second account
     */
    test("AK-999", () => {
      throw new Error("TEST NOT IMPLEMENTED");
    });

  });

});