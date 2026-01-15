import { secretKeyToMnemonic } from '@algorandfoundation/algokit-algo25'
import { generateAddressWithSigners, LogicSigAccount, MultisigAccount } from '@algorandfoundation/algokit-transact'
import nacl from 'tweetnacl'
import { v4 as uuid } from 'uuid'
import { beforeEach, describe, expect, test } from 'vitest'
import { algo } from '../amount'
import { algorandFixture } from '../testing'

describe('AccountManager', () => {
  const localnet = algorandFixture()

  beforeEach(localnet.newScope, 10e6)

  test('New account is retrieved and funded', async () => {
    const { algorand } = localnet.context

    const account = await algorand.account.fromEnvironment(uuid())

    const accountInfo = await algorand.account.getInformation(account.addr)
    expect(accountInfo.balance.microAlgo).toBeGreaterThan(0)
  }, 10e6)

  test('Same account is subsequently retrieved', async () => {
    const { algorand } = localnet.context
    const name = uuid()

    const account = await algorand.account.fromEnvironment(name)
    const account2 = await algorand.account.fromEnvironment(name)

    expect(account).not.toBe(account2)
    expect(account.addr).toEqual(account2.addr)
  }, 10e6)

  test('Environment is used in preference to kmd', async () => {
    const { algorand } = localnet.context
    const keys = nacl.sign.keyPair()
    const account = generateAddressWithSigners({
      ed25519Pubkey: keys.publicKey,
      rawEd25519Signer: async (b) => nacl.sign.detached(b, keys.secretKey),
    })

    const name2 = 'TEST'
    process.env.TEST_MNEMONIC = secretKeyToMnemonic(keys.secretKey)
    const account2 = await algorand.account.fromEnvironment(name2)

    expect(account).not.toBe(account2)
    expect(account.addr).toEqual(account2.addr)
  }, 10e6)

  test('Rekeyed account is retrievable', async () => {
    const { algorand, generateAccount } = localnet.context

    const rekeyed = await generateAccount({ initialFunds: algo(1) })
    const rekeyTo = await generateAccount({ initialFunds: algo(0.1) })

    await algorand.account.rekeyAccount(rekeyed.addr, rekeyTo)

    const accountInfo = await algorand.account.getInformation(rekeyed.addr)
    expect(accountInfo.address.toString()).toBe(rekeyed.addr.toString())
    expect(accountInfo.authAddr!.toString()).toBe(rekeyTo.addr.toString())
  }, 10e6)

  test('Logicsig account lmsig signing is supported', async () => {
    const { algorand, generateAccount, testAccount } = localnet.context
    const account1 = await generateAccount({ initialFunds: algo(1) })
    const account2 = await generateAccount({ initialFunds: algo(1) })
    const account3 = await generateAccount({ initialFunds: algo(1) })

    const msigParams = {
      version: 1,
      threshold: 2,
      addrs: [account1.addr, account2.addr, account3.addr],
    }

    const msigAccount1 = new MultisigAccount(msigParams, [account1])
    const msigAccount2 = new MultisigAccount(msigParams, [account2])

    // Setup the multisig delegated logicsig
    const lsigAccount = new LogicSigAccount(
      Uint8Array.from([1, 32, 1, 1, 34]), // int 1
      [Uint8Array.from([1]), Uint8Array.from([2, 3])],
      msigAccount1.addr,
    )

    await lsigAccount.signForDelegation(msigAccount1) // sign with the first account
    await lsigAccount.signForDelegation(msigAccount2) // sign with the second account

    await localnet.algorand.account.ensureFunded(lsigAccount.address(), testAccount, algo(1)) // Fund the lsig account

    algorand.setSignerFromAccount(lsigAccount)

    const result = await algorand.send.payment({
      sender: lsigAccount.address(),
      receiver: testAccount.addr,
      amount: algo(0.1),
    })

    expect(result.confirmation.txn.lsig?.msig).toBeUndefined()
    expect(result.confirmation.txn.lsig?.lmsig).toBeDefined()
    expect(result.confirmation.txn.lsig?.lmsig?.threshold).toBe(2)
    expect(result.confirmation.txn.lsig?.lmsig?.version).toBe(1)
    expect(result.confirmation.txn.lsig?.lmsig?.subsigs.length).toBe(3)
    expect(result.confirmation.txn.lsig?.lmsig?.subsigs[0].sig).toBeDefined()
    expect(result.confirmation.txn.lsig?.lmsig?.subsigs[1].sig).toBeDefined()
    expect(result.confirmation.txn.lsig?.lmsig?.subsigs[2].sig).toBeUndefined()
  })
})
