import { test, describe, beforeAll, expect } from 'vitest'
import { balance, deriveHdAccountsFromMnemonic, getAccountAssets, getAssetBalance, getAssetInfo } from './common'
import { AlgorandClient, microAlgos } from '../../src'

describe('Epic AK-1000', () => {
  let algorand: AlgorandClient

  beforeAll(async () => {
    algorand = AlgorandClient.defaultLocalNet()
  })

  // Polytest Suite: Epic AK-1000

  describe('AK-1000 Stories', () => {
    // Polytest Group: AK-1000 Stories

    /*
      AK-996: View only wallet. As a user I want to add a public address to my wallet to view it's balance (and make transactions)

      Acceptance Criteria:
      Given I have a public key

      or a batch of public keys

      And track Balance

      And construct unsigned transactions



      (for hardware wallets)
     */
    test('AK-996', async () => {
      const [account] = await deriveHdAccountsFromMnemonic({ numAccounts: 1 })

      await algorand.account.ensureFundedFromEnvironment(account.addr, microAlgos(1_000_000))

      expect(await balance(algorand, account)).toBe(1_100_000n)

      const payTxn = await algorand.createTransaction.payment({ sender: account, receiver: account, amount: microAlgos(1) })
      expect(payTxn.sender.toString()).toBe(account.addr.toString())
    })

    /*
      AK-1006: Current balance. As a user I want to view my balance quickly so that I know how much algo I have

      Acceptance Criteria:
      Given I have created 20 addresses

      Then I can see how much Algo I have on those addresses

      And I can see how much Algo I have in my wallet
     */
    test('AK-1006', async () => {
      const accounts = await deriveHdAccountsFromMnemonic({ numAccounts: 20 })
      const fundedIndices = [0, 5, 10]
      const amounts = [1_000_000n, 500_000n, 250_000n]

      for (let i = 0; i < fundedIndices.length; i++) {
        await algorand.account.ensureFundedFromEnvironment(accounts[fundedIndices[i]].addr, microAlgos(amounts[i]))
      }

      let walletTotal = 0n
      for (const account of accounts) {
        const accountBalance = await balance(algorand, account)
        walletTotal += accountBalance
      }

      for (let i = 0; i < fundedIndices.length; i++) {
        const accountBalance = await balance(algorand, accounts[fundedIndices[i]])
        expect(accountBalance).toBeGreaterThanOrEqual(amounts[i])
      }

      for (let i = 0; i < accounts.length; i++) {
        if (fundedIndices.includes(i)) continue
        expect(await balance(algorand, accounts[i])).toBe(0n)
      }

      const expectedTotal = (await Promise.all(accounts.map((a) => balance(algorand, a)))).reduce((a, b) => a + b, 0n)
      expect(walletTotal).toBe(expectedTotal)
    })

    /*
      AK-1007: Current ASA balance. As a user I want to see my ASA balance quickly so I know what other currencies are in my wallet

      Acceptance Criteria:
      Given I have created 20 addresses

      Then I can see how much ASA I have on those addresses

      And I can see how much ASA I have in my wallet
     */
    test('AK-1007', async () => {
      const accounts = await deriveHdAccountsFromMnemonic({ numAccounts: 20 })
      const creator = accounts[0]

      await algorand.account.ensureFundedFromEnvironment(creator.addr, microAlgos(2_000_000))

      const assetResult = await algorand.send.assetCreate({
        sender: creator,
        total: 1_000_000n,
        decimals: 2,
        assetName: 'Test ASA',
        unitName: 'TASA',
        url: 'https://example.com/asa',
      })
      const assetId = assetResult.assetId

      const recipients = [accounts[1], accounts[2], accounts[3]]
      const transferAmounts = [100n, 250n, 500n]

      for (const recipient of recipients) {
        await algorand.account.ensureFundedFromEnvironment(recipient.addr, microAlgos(500_000))
      }

      for (const recipient of recipients) {
        await algorand.send.assetOptIn({ sender: recipient, assetId })
      }

      for (let i = 0; i < recipients.length; i++) {
        await algorand.send.assetTransfer({
          sender: creator,
          receiver: recipients[i],
          assetId,
          amount: transferAmounts[i],
        })
      }

      let walletTotal = 0n
      for (const account of accounts) {
        const assetBalance = await getAssetBalance(algorand, account, assetId)
        walletTotal += assetBalance
      }

      expect(await getAssetBalance(algorand, accounts[0], assetId)).toBe(1_000_000n - 850n)
      expect(await getAssetBalance(algorand, accounts[1], assetId)).toBe(100n)
      expect(await getAssetBalance(algorand, accounts[2], assetId)).toBe(250n)
      expect(await getAssetBalance(algorand, accounts[3], assetId)).toBe(500n)
      for (let i = 4; i < accounts.length; i++) {
        expect(await getAssetBalance(algorand, accounts[i], assetId)).toBe(0n)
      }
      expect(walletTotal).toBe(1_000_000n)
    })

    /*
      AK-1008: Current NFT balance. As a user I want to see my NFTs quickly so I know what NFTS are in my wallet

      Acceptance Criteria:
      Given I have created 20 addresses

      Then I can see how much NFTs I have on those addresses

      And I can see how much NFT I have in my wallet

      And its metadata
     */
    test('AK-1008', async () => {
      const accounts = await deriveHdAccountsFromMnemonic({ numAccounts: 20 })
      const creator = accounts[0]

      await algorand.account.ensureFundedFromEnvironment(creator.addr, microAlgos(2_000_000))

      const nfts: { assetId: bigint; assetName: string; url: string; metadataHash: Uint8Array }[] = []
      for (let i = 0; i < 3; i++) {
        const hash = new Uint8Array(32).fill(i + 1)
        const result = await algorand.send.assetCreate({
          sender: creator,
          total: 1n,
          decimals: 0,
          assetName: `NFT ${i + 1}`,
          unitName: `NFT${i + 1}`,
          url: `https://example.com/nft/${i + 1}`,
          metadataHash: hash,
        })
        nfts.push({
          assetId: result.assetId,
          assetName: `NFT ${i + 1}`,
          url: `https://example.com/nft/${i + 1}`,
          metadataHash: hash,
        })
      }

      const recipients = [accounts[1], accounts[2], accounts[3]]
      for (const recipient of recipients) {
        await algorand.account.ensureFundedFromEnvironment(recipient.addr, microAlgos(500_000))
      }

      for (let i = 0; i < recipients.length; i++) {
        await algorand.send.assetOptIn({ sender: recipients[i], assetId: nfts[i].assetId })
      }

      for (let i = 0; i < recipients.length; i++) {
        await algorand.send.assetTransfer({
          sender: creator,
          receiver: recipients[i],
          assetId: nfts[i].assetId,
          amount: 1n,
        })
      }

      let walletNftTotal = 0
      for (const account of accounts) {
        const assets = await getAccountAssets(algorand, account)
        const nftHoldings = []
        for (const holding of assets) {
          if (holding.amount === 0n) continue
          const assetInfo = await getAssetInfo(algorand, holding.assetId)
          if (assetInfo.total === 1n && assetInfo.decimals === 0) {
            nftHoldings.push({ ...holding, ...assetInfo })
          }
        }

        if (recipients.some((r) => r.addr.toString() === account.addr.toString())) {
          expect(nftHoldings.length).toBe(1)
          walletNftTotal += 1
        } else {
          expect(nftHoldings.length).toBe(0)
        }
      }

      expect(walletNftTotal).toBe(3)

      for (let i = 0; i < recipients.length; i++) {
        const assets = await getAccountAssets(algorand, recipients[i])
        const nftAssets = []
        for (const holding of assets) {
          if (holding.amount === 0n) continue
          const assetInfo = await getAssetInfo(algorand, holding.assetId)
          if (assetInfo.total === 1n && assetInfo.decimals === 0) {
            nftAssets.push(assetInfo)
          }
        }
        expect(nftAssets.length).toBe(1)
        expect(nftAssets[0].assetName).toBe(nfts[i].assetName)
        expect(nftAssets[0].url).toBe(nfts[i].url)
        expect(nftAssets[0].metadataHash).toEqual(nfts[i].metadataHash)
      }
    })

    /*
      AK-1009: View smart contract asset. As a user I want to know how much ARC20 assets I have so I know what I have in my wallet

      Acceptance Criteria:
      Given I have created 20 addresses

      Then I can see how much ARC20 I have on those addresses

      And I can see how much ARC20 I have in my wallet



      ARC20 → ARC84
     */
    test.skip('AK-1009', () => {
      throw new Error('TEST NOT IMPLEMENTED')
    })
  })
})
