import { Account } from 'algosdk'
// import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { AlgorandClient } from '../src'

/* eslint-disable no-console */
async function main() {
  const algorand = AlgorandClient.defaultLocalNet()

  // example: RANDOM_ACCOUNT_CREATE
  const alice = algorand.account.random()
  console.log(`Alice account: ${alice.addr}\n`)
  const bob = algorand.account.random()
  console.log(`Bob account: ${bob.addr}\n`)
  // example: RANDOM_ACCOUNT_CREATE

  // example: ACCOUNT_RECOVER_MNEMONIC
  // restore 25-word mnemonic from a string
  // Note the mnemonic should _never_ appear in your source code
  const mnemonic =
    'creek phrase island true then hope employ veteran rapid hurdle above liberty tissue connect alcohol timber idle ten frog bulb embody crunch taxi abstract month'
  const recoveredAccount = await algorand.account.fromMnemonic(mnemonic)
  console.log(`Recovered mnemonic account: ${recoveredAccount.addr}\n`)
  // example: ACCOUNT_RECOVER_MNEMONIC

  // example: DISPENSER_ACCOUNT_CREATE
  const dispenser = await algorand.account.localNetDispenser()
  console.log(`Dispenser account: ${dispenser.addr}\n`)

  // example: MULTISIG_CREATE
  const signerAccounts: Account[] = []
  signerAccounts.push(algorand.account.random().account)
  signerAccounts.push(algorand.account.random().account)
  signerAccounts.push(algorand.account.random().account)

  // multiSigParams is used when creating the address and when signing transactions
  const multiSigParams = {
    version: 1,
    threshold: 2,
    addrs: signerAccounts.map((a) => a.addr),
  }
  algorand.account.getAccount
  const multisigAccount = await algorand.account.multisig(multiSigParams, signerAccounts)
  console.log(`Multisig account: ${multisigAccount.addr}\n`)
  // example: MULTISIG_CREATE

  // example: MULTISIG_SIGN
  // fund the multisig account
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: multisigAccount.addr,
    amount: (1).algos(),
  })
  // TODO: send payment txn with multisigAccount
  // example: MULTISIG_SIGN

  // example: ACCOUNT_REKEY
  // fund Alice's account from the dispenser
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: alice.addr,
    amount: (1).algos(),
  })

  // rekey the original account to the new signer via a payment transaction
  // Note any transaction type can be used to rekey an account
  await algorand.account.rekeyAccount(alice, bob)

  let rekeyedAliceInfo = await algorand.account.getInformation(alice.addr)
  console.log(`\n Alice signer rekeyed to: ${rekeyedAliceInfo['authAddr']}\n`)
  // example: ACCOUNT_REKEY

  // rekey back to the original account
  await algorand.account.rekeyAccount(alice, alice)

  rekeyedAliceInfo = await algorand.account.getInformation(alice.addr)
  console.log(`\n authAddr for Alice: ${rekeyedAliceInfo['authAddr']}`)
}

main()
