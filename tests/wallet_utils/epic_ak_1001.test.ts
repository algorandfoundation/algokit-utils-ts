import { expect, test, describe, beforeAll } from 'vitest'
import { balance, deriveHdAccountsFromMnemonic, getAssetBalance, getAssetInfo, getAccountAssets } from './common'
import { AlgorandClient, microAlgos, TransactionComposer } from '../../src'

describe('Epic AK-1001', async () => {
  let algorand: AlgorandClient

  beforeAll(async () => {
    algorand = AlgorandClient.defaultLocalNet()
  })

  // Polytest Suite: Epic AK-1001

  describe('AK-1001 Stories', () => {
    // Polytest Group: AK-1001 Stories

    /*
      AK-995: Split funds. As a user I would like to split my funds over various accounts without having to remember additional mnemonics

      Acceptance Criteria:
      Given I have derived 20 addresses

      Then I can send funds to one of those addresses

      And the wallet will keep track of those funds
     */
    test('AK-995', async () => {
      const accounts = await deriveHdAccountsFromMnemonic({ numAccounts: 20 })
      const [sender, receiver] = accounts
      await algorand.account.ensureFundedFromEnvironment(sender.addr, microAlgos(1_000_000))

      await algorand.send.payment({ sender, receiver, amount: microAlgos(500_000) })
      expect(await balance(algorand, sender)).toBe(BigInt(600_000 - 1_000))
      expect(await balance(algorand, receiver)).toBe(BigInt(500_000))
    })

    /*
      AK-1010: Make payment. As a user I want to make a payment to so I can pay my dues

      Acceptance Criteria:
      Given I have created addresses

      And I know the balance

      Then I can create a well formed Algo transaction
     */
    test('AK-1010', async () => {
      const accounts = await deriveHdAccountsFromMnemonic({ numAccounts: 20 })
      const [sender, receiver] = accounts
      await algorand.account.ensureFundedFromEnvironment(sender.addr, microAlgos(1_000_000))

      await algorand.send.payment({ sender, receiver, amount: microAlgos(500_000) })
      expect(await balance(algorand, sender)).toBe(BigInt(600_000 - 1_000))
      expect(await balance(algorand, receiver)).toBe(BigInt(500_000))
    })

    /*
      AK-1011: Make complex payment. As a user I want to send numerous interdependent transaction so that I can reduce costs and add business logic

      Acceptance Criteria:
      Given I have created my wallet

      And I know my balance

      Then I can create a sequence of well formed transactions with various assets and outputs
     */
    test('AK-1011', async () => {
      const accounts = await deriveHdAccountsFromMnemonic({ numAccounts: 20 })
      const [sender, recipient1, recipient2] = accounts

      await algorand.account.ensureFundedFromEnvironment(sender.addr, microAlgos(2_000_000))

      const assetResult = await algorand.send.assetCreate({
        sender,
        total: 1_000_000n,
        decimals: 2,
        assetName: 'Complex ASA',
        unitName: 'CASA',
      })
      const assetId = assetResult.assetId

      await algorand.account.ensureFundedFromEnvironment(recipient1.addr, microAlgos(500_000))
      await algorand.account.ensureFundedFromEnvironment(recipient2.addr, microAlgos(500_000))

      const result = await algorand
        .newGroup()
        .addPayment({
          sender,
          receiver: recipient2,
          amount: microAlgos(100_000),
        })
        .addAssetOptIn({ sender: recipient1, assetId })
        .addAssetTransfer({
          sender,
          receiver: recipient1,
          assetId,
          amount: 500n,
        })
        .send()

      expect(result.confirmations.length).toBe(3)
      expect(result.confirmations.every((c) => c.confirmedRound !== undefined)).toBe(true)

      expect(await balance(algorand, recipient2)).toBe(600_000n + 100_000n)
      expect(await getAssetBalance(algorand, recipient1, assetId)).toBe(500n)
    })

    /*
      AK-1012: Make multi-sig payment. As a user I want to create and co-sign a payment for n people, so we can pay out dues

      Acceptance Criteria:
      Given I have created a multisig- address

      And I know the balance

      Then I can create a well formed transaction
     */
    test('AK-1012', async () => {
      const accounts = await deriveHdAccountsFromMnemonic({ numAccounts: 20 })
      const [account1, account2, receiver] = accounts

      await algorand.account.ensureFundedFromEnvironment(account1.addr, microAlgos(1_000_000))

      const multisig = algorand.account.multisig(
        {
          addrs: [account1, account2].map((a) => a.addr),
          threshold: 1,
          version: 1,
        },
        [account1],
      )

      await algorand.send.payment({
        sender: account1,
        receiver: multisig,
        amount: microAlgos(500_000),
      })

      await algorand.send.payment({
        sender: multisig,
        receiver,
        amount: microAlgos(200_000),
      })

      expect(await balance(algorand, receiver)).toBe(200_000n)
    })

    /*
      AK-1013: Send ASA. As a user I want to send one or more native assets to people so I can pay my dues

      Acceptance Criteria:
      Given I have created addresses

      And I know the balance

      Then I can create a well formed ASA transaction
     */
    test('AK-1013', async () => {
      const accounts = await deriveHdAccountsFromMnemonic({ numAccounts: 20 })
      const [sender, receiver] = accounts

      await algorand.account.ensureFundedFromEnvironment(sender.addr, microAlgos(2_000_000))

      const assetResult = await algorand.send.assetCreate({
        sender,
        total: 1_000_000n,
        decimals: 2,
        assetName: 'Test ASA',
        unitName: 'TASA',
        url: 'https://example.com/asa',
      })
      const assetId = assetResult.assetId

      await algorand.account.ensureFundedFromEnvironment(receiver.addr, microAlgos(500_000))
      await algorand.send.assetOptIn({ sender: receiver, assetId })

      await algorand.send.assetTransfer({
        sender,
        receiver,
        assetId,
        amount: 500n,
      })

      expect(await getAssetBalance(algorand, receiver, assetId)).toBe(500n)
      expect(await getAssetBalance(algorand, sender, assetId)).toBe(1_000_000n - 500n)
    })

    /*
      AK-1014: Send smart contract asset. As a user I want to be able to send ARC20 tokens to people so that I can pay my dues

      Acceptance Criteria:
      Given I have created addresses

      And I know the balance

      Then I can create a well formed ARC20 transaction
     */
    test.skip('AK-1014', () => {
      // ARC20 → ARC84
      throw new Error('TEST NOT IMPLEMENTED')
    })

    /*
      AK-1015: Send NFT. As a user I want to be able to send ARC NFT tokens to people so that I can pay my dues

      Acceptance Criteria:
      Given I have created addresses

      And I know the balance

      Then I can create a well formed NFT transaction
     */
    test('AK-1015', async () => {
      const accounts = await deriveHdAccountsFromMnemonic({ numAccounts: 20 })
      const [sender, receiver] = accounts

      await algorand.account.ensureFundedFromEnvironment(sender.addr, microAlgos(2_000_000))

      const hash = new Uint8Array(32).fill(1)
      const assetResult = await algorand.send.assetCreate({
        sender,
        total: 1n,
        decimals: 0,
        assetName: 'Test NFT',
        unitName: 'TNFT',
        url: 'https://example.com/nft/1',
        metadataHash: hash,
      })
      const assetId = assetResult.assetId

      await algorand.account.ensureFundedFromEnvironment(receiver.addr, microAlgos(500_000))
      await algorand.send.assetOptIn({ sender: receiver, assetId })

      await algorand.send.assetTransfer({
        sender,
        receiver,
        assetId,
        amount: 1n,
      })

      const assets = await getAccountAssets(algorand, receiver)
      const nftAssets = []
      for (const holding of assets) {
        if (holding.amount === 0n) continue
        const assetInfo = await getAssetInfo(algorand, holding.assetId)
        if (assetInfo.total === 1n && assetInfo.decimals === 0) {
          nftAssets.push(assetInfo)
        }
      }

      expect(nftAssets.length).toBe(1)
      expect(nftAssets[0].assetName).toBe('Test NFT')
      expect(nftAssets[0].url).toBe('https://example.com/nft/1')
      expect(nftAssets[0].metadataHash).toEqual(hash)
    })

    /*
      AK-1016: Add Metadata. As a user I want to add Metadata to my payments so that I can append information (encrypted or not)

      Acceptance Criteria:
      Given I have a well formed transaction

      Then I can add metadata to that transactions of free form

      in ARC2 form
     */
    test('AK-1016', async () => {
      const accounts = await deriveHdAccountsFromMnemonic({ numAccounts: 20 })
      const [sender, receiver] = accounts

      await algorand.account.ensureFundedFromEnvironment(sender.addr, microAlgos(1_000_000))
      await algorand.account.ensureFundedFromEnvironment(receiver.addr, microAlgos(100_000))

      const note = TransactionComposer.arc2Note({
        dAppName: 'test-wallet',
        format: 'u',
        data: 'hello-world',
      })

      const { confirmation } = await algorand.send.payment({
        sender,
        receiver,
        amount: microAlgos(1),
        note,
      })

      expect(confirmation.txn.txn.note).toEqual(note)
    })

    /*
      AK-1017: Transaction costs. As a user I want to know what the cost is for executing the transaction so that I don’t run into any surprises (also tax reasons)

      Acceptance Criteria:
      Given I have a well formed transaction

      Then the SDK can tell me what the cost of executing this transaction will be



      (it might need to ask the node for this information)
     */
    test('AK-1017', async () => {
      const accounts = await deriveHdAccountsFromMnemonic({ numAccounts: 20 })
      const [sender, receiver] = accounts

      const txn = await algorand.createTransaction.payment({
        sender,
        receiver,
        amount: microAlgos(1),
      })

      expect(txn.fee).toBe(1000n)
    })
  })
})
