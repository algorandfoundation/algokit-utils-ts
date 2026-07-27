import { expect, test, describe, beforeAll } from 'vitest'
import { deriveHdAccountsFromMnemonic } from './common'
import { AlgorandClient, microAlgos } from '../../src'
import { encodeTransactionRaw, decodeTransaction, bytesForSigning, TransactionSigner } from '@algorandfoundation/algokit-transact'
import nacl from 'tweetnacl'

describe('Epic AK-1002', () => {
  let algorand: AlgorandClient

  beforeAll(async () => {
    algorand = AlgorandClient.defaultLocalNet()
  })

  // Polytest Suite: Epic AK-1002

  describe('AK-1002 Stories', () => {
    // Polytest Group: AK-1002 Stories

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
    test('AK-1018', async () => {
      const accounts = await deriveHdAccountsFromMnemonic({ numAccounts: 2 })
      const [sender, receiver] = accounts
      const note = new TextEncoder().encode('test-metadata')
      const rekeyAddress = receiver.addr

      const payTxn = await algorand.createTransaction.payment({
        sender,
        receiver,
        amount: microAlgos(100_000),
        note,
        rekeyTo: rekeyAddress,
      })

      expect(payTxn.sender.toString()).toBe(sender.addr.toString())
      expect(payTxn.payment?.receiver.toString()).toBe(receiver.addr.toString())
      expect(payTxn.payment?.amount).toBe(100_000n)
      expect(payTxn.note).toEqual(note)
      expect(payTxn.rekeyTo?.toString()).toBe(rekeyAddress.toString())

      const assetTxn = await algorand.createTransaction.assetTransfer({
        sender,
        receiver,
        assetId: 123n,
        amount: 50n,
      })

      expect(assetTxn.sender.toString()).toBe(sender.addr.toString())
      expect(assetTxn.assetTransfer?.receiver.toString()).toBe(receiver.addr.toString())
      expect(assetTxn.assetTransfer?.assetId).toBe(123n)
      expect(assetTxn.assetTransfer?.amount).toBe(50n)
    })

    /*
      AK-1019: Sign transaction. As a user I want to sign a transaction so it can be executed on the blockchain

      Acceptance Criteria:
      Given I have reviewed my transaction
      Then I can sign the transaction
      And share with thirdparty (dapp)
     */
    test('AK-1019', async () => {
      const accounts = await deriveHdAccountsFromMnemonic({ numAccounts: 2 })
      const [sender, receiver] = accounts

      await algorand.account.ensureFundedFromEnvironment(sender.addr, microAlgos(1_000_000))

      const txn = await algorand.createTransaction.payment({
        sender,
        receiver,
        amount: microAlgos(100_000),
      })

      const result = await algorand.send.newGroup().addTransaction(txn, sender.signer).send()

      expect(result.confirmations.length).toBe(1)
      expect(result.confirmations[0].confirmedRound).toBeGreaterThan(0n)
    })

    /*
      AK-1020: Hardware sign transaction. As a user I want to share my unsigned transaction with a HSM so that they can sign it on my behalf

      Acceptance Criteria:
      Given I have review the transaction
      Then I can connect to a hardware module like Ledger or HashiCorp
      And get it to sign my transaction
      Then Submit it to the blockchain
     */
    test('AK-1020', async () => {
      const accounts = await deriveHdAccountsFromMnemonic({ numAccounts: 2 })
      const [sender, receiver] = accounts

      await algorand.account.ensureFundedFromEnvironment(sender.addr, microAlgos(1_000_000))

      const txn = await algorand.createTransaction.payment({
        sender,
        receiver,
        amount: microAlgos(100_000),
      })

      // Simulate an HSM that proxies signing to the account signer
      const hsmSigner: TransactionSigner = async (txnGroup, indexesToSign) => {
        return sender.signer(txnGroup, indexesToSign)
      }

      const result = await algorand.send.newGroup().addTransaction(txn, hsmSigner).send()

      expect(result.confirmations.length).toBe(1)
      expect(result.confirmations[0].confirmedRound).toBeGreaterThan(0n)
    })

    /*
      AK-1021: Export unsigned transaction. As a user I want to export an unsigned or partially signed transaction so that someone else can do something with it

      Acceptance Criteria:
      Given I have reviewed the transaction
      Then I can share the unsigned transaction with Base64 encoding
     */
    test('AK-1021', async () => {
      const accounts = await deriveHdAccountsFromMnemonic({ numAccounts: 2 })
      const [sender, receiver] = accounts
      const note = new TextEncoder().encode('hello-world')

      const txn = await algorand.createTransaction.payment({
        sender,
        receiver,
        amount: microAlgos(1),
        note,
      })

      const encoded = encodeTransactionRaw(txn)
      const base64 = Buffer.from(encoded).toString('base64')
      const decodedBack = decodeTransaction(new Uint8Array(Buffer.from(base64, 'base64')))

      expect(decodedBack.sender.toString()).toBe(sender.addr.toString())
      expect(decodedBack.payment?.receiver.toString()).toBe(receiver.addr.toString())
      expect(decodedBack.payment?.amount).toBe(1n)
      expect(decodedBack.note).toEqual(note)
    })

    /*
      AK-1248: sign arbitrary data. As a user I want to proof that I own a certain key, so I can get access to a service.

      Acceptance Criteria:
      Given I have setup a wallet
      And I contect to a service
      And the service requests me to sign a nounce with a specific key
      Then I can sign that nounce and return result
     */
    test('AK-1248', async () => {
      const accounts = await deriveHdAccountsFromMnemonic({ numAccounts: 1 })
      const account = accounts[0]

      const nonce = new TextEncoder().encode('service-nonce-12345')
      const signature = await account.mxBytesSigner(nonce)

      expect(signature).toBeInstanceOf(Uint8Array)
      expect(signature.length).toBe(64)

      const bytesToSign = bytesForSigning.mxBytes(nonce)
      const isValid = nacl.sign.detached.verify(bytesToSign, signature, account.addr.publicKey)

      expect(isValid).toBe(true)
    })
  })
})
