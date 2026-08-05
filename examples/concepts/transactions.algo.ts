/* eslint-disable no-console -- examples print their results to demonstrate output */
/**
 * Demonstrates constructing, configuring, signing and sending transactions.
 *
 * This maps to the Concepts -> Transactions docs page. Each marked region is
 * rendered into the page via RemoteCode, so the code shown in the docs is real,
 * executed code. It covers payments, account closing, key registration, fee
 * control, leases, multisig / logic-signature accounts, atomic groups,
 * simulation, prebuilt transactions, manual signing, ARC-2 notes and send params.
 *
 * Prerequisites: a running LocalNet (`algokit localnet start`).
 * Run with: tsx --tsconfig examples/tsconfig.json examples/concepts/transactions.algo.ts
 */

import { AlgorandClient, algo, microAlgo } from '@algorandfoundation/algokit-utils'
import { TransactionComposer } from '@algorandfoundation/algokit-utils/types/composer'
import type { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount'
import type { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { setupLocalNetEnvironment } from './_helpers.algo'

/** Create a fresh random account (signer auto-registered) and fund it from `funder`. */
async function newFundedAccount(
  algorand: AlgorandClient,
  funder: TransactionSignerAccount,
  amount: AlgoAmount,
): Promise<TransactionSignerAccount> {
  const account = algorand.account.random()
  await algorand.send.payment({ sender: funder.addr, receiver: account.addr, amount })
  return account
}

async function main() {
  const { algorand, accountA, accountB } = await setupLocalNetEnvironment(algo(30))
  const balanceBefore = (await algorand.account.getInformation(accountB.addr)).balance

  // example: SEND_PAYMENT
  const result = await algorand.send.payment({ sender: accountA.addr, receiver: accountB.addr, amount: algo(1) })
  console.log(`Payment sent in transaction ${result.txIds[0]}`)
  // example: SEND_PAYMENT

  const balanceAfter = (await algorand.account.getInformation(accountB.addr)).balance
  if (balanceAfter.microAlgo !== balanceBefore.microAlgo + algo(1).microAlgo) {
    throw new Error('Unexpected balance after payment')
  }

  // Closing an account empties it, so use a throwaway account rather than accountA.
  const closingAccount = await newFundedAccount(algorand, accountA, algo(1))

  // example: CLOSE_ACCOUNT
  // closeRemainderTo sends the whole remaining balance and removes the sender
  // account from the ledger. `amount` is what to send on top of the close.
  await algorand.send.payment({
    sender: closingAccount.addr,
    receiver: accountB.addr,
    amount: algo(0),
    closeRemainderTo: accountB.addr,
  })
  // example: CLOSE_ACCOUNT

  // Key registration is a node-participation action, so use a dedicated account.
  const participant = await newFundedAccount(algorand, accountA, algo(1))
  const params = await algorand.getSuggestedParams()

  // example: KEY_REGISTRATION_ONLINE
  // Bring an account online for consensus participation. The vote and selection
  // keys come from participation keys generated on a node.
  await algorand.send.onlineKeyRegistration({
    sender: participant.addr,
    voteKey: new Uint8Array(Buffer.from('G/lqTV6MKspW6J8wH2d8ZliZ5XZVZsruqSBJMwLwlmo=', 'base64')),
    selectionKey: new Uint8Array(Buffer.from('LrpLhvzr+QpN/bivh6IPpOaKGbGzTTB5lJtVfixmmgk=', 'base64')),
    stateProofKey: new Uint8Array(
      Buffer.from('RpUpNWfZMjZ1zOOjv3MF2tjO714jsBt0GKnNsw0ihJ4HSZwci+d9zvUi3i67LwFUJgjQ5Dz4zZgHgGduElnmSA==', 'base64'),
    ),
    voteFirst: BigInt(params.firstValid),
    voteLast: BigInt(params.firstValid) + 10_000_000n,
    voteKeyDilution: 100n,
  })
  // example: KEY_REGISTRATION_ONLINE

  // example: KEY_REGISTRATION_OFFLINE
  // Take an account offline so it no longer participates in consensus.
  await algorand.send.offlineKeyRegistration({
    sender: participant.addr,
    preventAccountFromEverParticipatingAgain: false,
  })
  // example: KEY_REGISTRATION_OFFLINE

  // example: STATIC_FEE
  // staticFee overrides the calculated fee with an exact amount.
  await algorand.send.payment({
    sender: accountA.addr,
    receiver: accountB.addr,
    amount: algo(1),
    staticFee: microAlgo(1000),
    note: 'fixed-fee payment',
  })
  // example: STATIC_FEE

  // example: EXTRA_FEE
  // extraFee adds to the fee the client already calculated instead of replacing
  // it, so this payment pays the minimum fee plus 1000 microAlgo.
  await algorand.send.payment({
    sender: accountA.addr,
    receiver: accountB.addr,
    amount: algo(1),
    extraFee: microAlgo(1000),
    note: 'extra-fee payment',
  })
  // example: EXTRA_FEE

  // example: MAX_FEE
  // maxFee caps the fee the client will accept; sending raises if the calculated
  // fee would exceed it, guarding against fee spikes.
  await algorand.send.payment({
    sender: accountA.addr,
    receiver: accountB.addr,
    amount: algo(1),
    maxFee: microAlgo(2000),
    note: 'capped-fee payment',
  })
  // example: MAX_FEE

  // example: FEE_POOLING
  // In a group the network only requires the total fee to cover every
  // transaction. Here the second payment pays both fees and the first pays none.
  await algorand
    .newGroup()
    .addPayment({ sender: accountA.addr, receiver: accountB.addr, amount: algo(1), staticFee: microAlgo(0) })
    .addPayment({ sender: accountA.addr, receiver: accountB.addr, amount: algo(1), staticFee: microAlgo(2000) })
    .send()
  // example: FEE_POOLING

  // example: LEASE
  // A lease locks the (sender, lease) pair until the transaction's last-valid
  // round, so no second transaction with the same pair can also confirm.
  await algorand.send.payment({
    sender: accountA.addr,
    receiver: accountB.addr,
    amount: algo(1),
    lease: 'payroll-2024-01',
  })
  // example: LEASE

  // example: MULTISIG
  // A multisig account is authorized by a threshold of its member accounts.
  // Create it from the members; sending from it is then signed by the members
  // registered against it (here a 2-of-2), with no explicit signer needed.
  const member1 = algorand.account.random()
  const member2 = algorand.account.random()
  const multisig = algorand.account.multisig(
    { version: 1, threshold: 2, addrs: [member1.addr, member2.addr] },
    [member1.account, member2.account],
  )
  await algorand.send.payment({ sender: accountA.addr, receiver: multisig.addr, amount: algo(1) })
  await algorand.send.payment({ sender: multisig.addr, receiver: accountB.addr, amount: microAlgo(100_000) })
  // example: MULTISIG

  // example: LOGICSIG
  // A logic signature is a compiled program that authorizes transactions. This
  // one approves unconditionally (int 1); a real program encodes spending rules.
  const program = (await algorand.app.compileTeal('#pragma version 10\nint 1')).compiledBase64ToBytes
  const logicSig = algorand.account.logicsig(program)

  // The program's hash is a contract (escrow) account. Fund it, then spend from
  // it — the logic signature authorizes the payment, so no private key signs.
  await algorand.send.payment({ sender: accountA.addr, receiver: logicSig.addr, amount: algo(1) })
  await algorand.send.payment({ sender: logicSig.addr, receiver: accountB.addr, amount: microAlgo(100_000) })
  // example: LOGICSIG

  // example: ATOMIC_GROUP
  // Transactions added to a group either all confirm or all fail together.
  const groupResult = await algorand
    .newGroup()
    .addPayment({ sender: accountA.addr, receiver: accountB.addr, amount: algo(1), note: 'group payment 1' })
    .addPayment({ sender: accountB.addr, receiver: accountA.addr, amount: algo(2), note: 'group payment 2' })
    .send()
  console.log(`Group ${groupResult.groupId} sent ${groupResult.txIds.length} transactions`)
  // example: ATOMIC_GROUP

  if (groupResult.txIds.length !== 2) throw new Error('Expected 2 transactions in the group')

  // example: SIMULATE
  // Simulate runs the group against the current ledger without submitting it.
  // skipSignatures lets you preview execution without signing.
  const simulation = await algorand
    .newGroup()
    .addPayment({ sender: accountA.addr, receiver: accountB.addr, amount: algo(1), note: 'simulated payment' })
    .simulate({ skipSignatures: true })
  console.log(`Simulated ${simulation.transactions.length} transaction(s) before sending`)
  // example: SIMULATE

  // example: ADD_TRANSACTION
  // A transaction built elsewhere — here via createTransaction, but any algosdk
  // transaction works — can be dropped into a group alongside params-built ones.
  const prebuiltTxn = await algorand.createTransaction.payment({
    sender: accountA.addr,
    receiver: accountB.addr,
    amount: algo(1),
    note: 'prebuilt txn',
  })
  await algorand
    .newGroup()
    .addTransaction(prebuiltTxn)
    .addPayment({ sender: accountA.addr, receiver: accountB.addr, amount: algo(1), note: 'group with prebuilt' })
    .send()
  // example: ADD_TRANSACTION

  // example: BUILD_UNSIGNED
  // createTransaction builds the transaction without signing or sending it, so
  // you can hand it to a wallet or sign it yourself.
  const unsignedTxn = await algorand.createTransaction.payment({
    sender: accountA.addr,
    receiver: accountB.addr,
    amount: algo(1),
    note: 'manually signed',
  })
  // Sign with the sender's signer and submit through the underlying algod client.
  const [signedTxn] = await accountA.signer([unsignedTxn], [0])
  const { txid } = await algorand.client.algod.sendRawTransaction(signedTxn).do()
  // example: BUILD_UNSIGNED

  if (!txid) throw new Error('Expected a transaction id from the manual send')

  // example: ARC2_NOTE
  // ARC-2 is a convention for structured transaction notes. arc2Note encodes a
  // note as "<dAppName>:<format><data>"; pass the resulting bytes as the note.
  const note = TransactionComposer.arc2Note({ dAppName: 'my-dapp', format: 'j', data: { amount: 1 } })
  await algorand.send.payment({ sender: accountA.addr, receiver: accountB.addr, amount: algo(1), note })
  // example: ARC2_NOTE

  // example: SEND_PARAMS
  // Send params tune how a transaction is sent, not what it contains. They merge
  // into the params object — here, wait up to 10 rounds and suppress logs.
  await algorand.send.payment({
    sender: accountA.addr,
    receiver: accountB.addr,
    amount: algo(1),
    note: 'custom send params',
    maxRoundsToWaitForConfirmation: 10,
    suppressLog: true,
  })
  // example: SEND_PARAMS
}

main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
