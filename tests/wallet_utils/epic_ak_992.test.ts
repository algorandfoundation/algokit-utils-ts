import { expect, test, describe, beforeAll } from 'vitest'
import { MultisigAccount } from '@algorandfoundation/algokit-transact'
import { generateMnemonic } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english.js'
import { AlgorandClient, microAlgos } from '../../src'
import {
  balance,
  deriveHdAccountsFromMnemonic,
  deriveHdAccountsFromBip39Mnemonic,
  deriveHdAccountsFromAlgo25Mnemonic,
  generateAlgo25Mnemonic,
} from './common'

describe('Epic AK-992', () => {
  let algorand: AlgorandClient

  beforeAll(async () => {
    algorand = AlgorandClient.defaultLocalNet()
  })

  // Polytest Suite: Epic AK-992

  describe('AK-992 Stories', () => {
    // Polytest Group: AK-992 Stories

    /*
      AK-993: Create address. As a user I would like to create an address using 24 or 25 mnemonic words so that I can receive funds

      Acceptance Criteria:
      +Given+ _I have the SDK running_

      +And+ I request an mnemonic

      +Then+ I can derive 20 addresses

      And have the private public keys



      Ref: [+BIP-44+|https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki]
     */
    test('AK-993', async () => {
      // 24-word BIP39 mnemonic path
      const bip39Mnemonic = generateMnemonic(wordlist, 256)
      const bip39Accounts = await deriveHdAccountsFromBip39Mnemonic(bip39Mnemonic, 20)
      expect(bip39Accounts.length).toBe(20)
      for (const a of bip39Accounts) {
        expect(a.addr.publicKey).toBeInstanceOf(Uint8Array)
        expect(a.addr.publicKey.length).toBe(32)
        const sig = await a.mxBytesSigner(new Uint8Array([1]))
        expect(sig.length).toBe(64)
      }

      // 25-word Algorand mnemonic path
      const algo25Mnemonic = generateAlgo25Mnemonic()
      const algo25Accounts = await deriveHdAccountsFromAlgo25Mnemonic(algo25Mnemonic, 20)
      expect(algo25Accounts.length).toBe(20)
      for (const a of algo25Accounts) {
        expect(a.addr.publicKey).toBeInstanceOf(Uint8Array)
        expect(a.addr.publicKey.length).toBe(32)
        const sig = await a.mxBytesSigner(new Uint8Array([1]))
        expect(sig.length).toBe(64)
      }
    })

    /*
      AK-994: Recover address. As a user I would like to recover my 24 or 25 mnemonic words so I can see my funds

      Acceptance Criteria:
      +Given+ _I have the SDK running_

      +And+ I have an mnemonic

      +Then+ I can derive 20 addresses

      And have the public private keys



      Ref: [+BIP-44+|https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki]
     */
    test('AK-994', async () => {
      // 24-word BIP39 recover
      const bip39Mnemonic = generateMnemonic(wordlist, 256)
      const set1 = await deriveHdAccountsFromBip39Mnemonic(bip39Mnemonic, 20)
      const set2 = await deriveHdAccountsFromBip39Mnemonic(bip39Mnemonic, 20)
      for (let i = 0; i < 20; i++) {
        expect(set1[i].addr.toString()).toBe(set2[i].addr.toString())
      }

      // 25-word Algorand recover
      const algo25Mnemonic = generateAlgo25Mnemonic()
      const set3 = await deriveHdAccountsFromAlgo25Mnemonic(algo25Mnemonic, 20)
      const set4 = await deriveHdAccountsFromAlgo25Mnemonic(algo25Mnemonic, 20)
      for (let i = 0; i < 20; i++) {
        expect(set3[i].addr.toString()).toBe(set4[i].addr.toString())
      }
    })

    /*
      AK-997: Create multi-sig. As a user I want to split the responsibility/security of my funds with other people so I can still recover it when I lose my mnemonic

      Acceptance Criteria:
      Given I have derived 20 addresses

      And I have my co-signers n public keys

      And I know the order

      Then I can derive the multi-sig address

      And track the address
     */
    test('AK-997', async () => {
      const accounts = await deriveHdAccountsFromMnemonic({ numAccounts: 20 })
      const cosigners = accounts.slice(0, 2)
      const addrs = cosigners.map((a) => a.addr)

      // Derive multisig address (threshold 1, 2 co-signers)
      const msig = new MultisigAccount({ version: 1, threshold: 1, addrs }, [])

      // Track the address via algod
      await algorand.account.ensureFundedFromEnvironment(msig.addr, microAlgos(1_000_000))
      const info = await algorand.client.algod.accountInformation(msig.addr)
      expect(info.amount).toBeGreaterThanOrEqual(1_000_000n)

      // Use it to send a payment
      const tracked = algorand.account.multisig({ version: 1, threshold: 1, addrs }, [cosigners[0]])
      const [receiver] = await deriveHdAccountsFromMnemonic({ numAccounts: 1 })
      await algorand.send.payment({ sender: tracked, receiver, amount: microAlgos(500_000) })
      expect(await balance(algorand, receiver)).toBe(500_000n)
    })

    /*
      AK-998: Recover multi-sig. As a user I want to be able to recover my joined account so I can view my balance

      Acceptance Criteria:
      Given I have derived 20 addresses

      And I have my co-signers n public keys

      And I know the order

      Then I can derive the multi-sig address

      And track the address
     */
    test('AK-998', async () => {
      const accounts = await deriveHdAccountsFromMnemonic({ numAccounts: 20 })
      const cosigners = accounts.slice(0, 2)
      const addrs = cosigners.map((a) => a.addr)

      // Original
      const original = new MultisigAccount({ version: 1, threshold: 1, addrs }, [])

      // Recover with same ordered public keys
      const recovered = new MultisigAccount({ version: 1, threshold: 1, addrs }, [])
      expect(recovered.addr.toString()).toBe(original.addr.toString())

      // Track and verify via algod
      await algorand.account.ensureFundedFromEnvironment(recovered.addr, microAlgos(1_000_000))
      const info = await algorand.client.algod.accountInformation(recovered.addr)
      expect(info.amount).toBeGreaterThanOrEqual(1_000_000n)
    })

    /*
      AK-999: Migrate wallet*. As a user I want to migrate from my single address 25 word to a multi-address 24 words wallet so I can split my funds

      Acceptance Criteria:
      Given I have a 25 word, single account

      And I have a 24 word, multi account

      Then I can move all my funds from my account to the second account
     */
    test('AK-999', async () => {
      // 25-word single account
      const singleAccount = algorand.account.fromMnemonic(generateAlgo25Mnemonic())
      await algorand.account.ensureFundedFromEnvironment(singleAccount.addr, microAlgos(1_000_000))

      // 24-word multi-account
      const bip39Mnemonic = generateMnemonic(wordlist, 256)
      const multiAccounts = await deriveHdAccountsFromBip39Mnemonic(bip39Mnemonic, 20)
      const destination = multiAccounts[0]

      // Migrate all funds using closeRemainderTo
      await algorand.send.payment({
        sender: singleAccount,
        receiver: destination,
        closeRemainderTo: destination,
        amount: microAlgos(0),
      })

      expect(await balance(algorand, singleAccount)).toBe(0n)
      expect(await balance(algorand, destination)).toBeGreaterThanOrEqual(1_000_000n - 1000n)
    })
  })
})
