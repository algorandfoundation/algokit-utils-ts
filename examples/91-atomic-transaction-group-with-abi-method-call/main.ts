import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { TestingAppFactory } from './artifacts/TestingApp/client'

/**
 * This example demonstrates creating an atomic transaction group that includes
 * both a payment transaction and an ABI method call to a smart contract.
 *
 * Atomic groups ensure that either all transactions succeed or all fail,
 * which is essential for complex operations that require multiple steps.
 */

async function atomicGroupWithMethodCall() {
  // Initialize the Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get the dispenser account for funding
  const dispenser = await algorand.account.localNetDispenser()

  // Create and fund Alice
  const alice = algorand.account.random()
  await algorand.account.ensureFunded(alice, dispenser, (10).algos())

  // Create and fund Bob
  const bob = algorand.account.random()
  await algorand.account.ensureFunded(bob, dispenser, (1).algos())

  console.log('Setting up accounts...')
  console.log(`Alice: ${alice.addr}`)
  console.log(`Bob: ${bob.addr}`)
  console.log()

  // Deploy the test contract using the typed app factory
  const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
    defaultSender: alice.addr,
  })

  const { appClient, result: createResult } = await appFactory.send.create.bare({
    deployTimeParams: {
      TMPL_UPDATABLE: 1,
      TMPL_DELETABLE: 1,
      TMPL_VALUE: 123,
    },
  })

  const appId = BigInt(createResult.appId)
  console.log(`Contract deployed with App ID: ${appId}`)
  console.log()

  // Get account balances before the transaction
  const alicePreBalanceInfo = await algorand.account.getInformation(alice.addr)
  const bobPreBalanceInfo = await algorand.account.getInformation(bob.addr)
  const alicePreBalance = alicePreBalanceInfo.balance.microAlgo
  const bobPreBalance = bobPreBalanceInfo.balance.microAlgo

  console.log(`Balances before transaction:`)
  console.log(`Alice: ${alicePreBalance} microAlgos`)
  console.log(`Bob: ${bobPreBalance} microAlgos`)
  console.log()

  console.log(`Building atomic transaction group...`)
  console.log(`1. Payment: Alice → Bob (100000 microAlgos)`)
  console.log(`2. App call: call_abi("atomic group demo")`)
  console.log()

  // Create an atomic group with a payment and an ABI method call
  // Using the AlgorandClient to build the group
  const groupResult = await algorand.newGroup()
    .addPayment({
      sender: alice.addr,
      receiver: bob.addr,
      amount: (0.1).algos(),
    })
    .addAppCallMethodCall({
      sender: alice.addr,
      appId,
      method: appClient.appClient.getABIMethod('call_abi')!,
      args: ['atomic group demo'],
      signer: alice,
    })
    .send()

  console.log(`✓ Atomic transaction group executed successfully!`)
  console.log(`Transaction IDs: ${groupResult.txIds.join(', ')}`)
  console.log(`Group ID: ${groupResult.groupId}`)
  console.log()

  // Get account balances after the transaction
  const alicePostBalanceInfo = await algorand.account.getInformation(alice.addr)
  const bobPostBalanceInfo = await algorand.account.getInformation(bob.addr)
  const alicePostBalance = alicePostBalanceInfo.balance.microAlgo
  const bobPostBalance = bobPostBalanceInfo.balance.microAlgo

  console.log(`Balances after transaction:`)
  console.log(`Alice: ${alicePostBalance} microAlgos (spent ${alicePreBalance - alicePostBalance} microAlgos including fees)`)
  console.log(`Bob: ${bobPostBalance} microAlgos (received ${bobPostBalance - bobPreBalance} microAlgos)`)
  console.log()

  // Access the return value from the ABI method call
  // The returns array contains only method call results (not payment transactions)
  const returnValue = groupResult.returns?.[0]?.returnValue?.valueOf()
  console.log(`Smart contract method result: "${returnValue}"`)
  console.log(`Expected output: "Hello, atomic group demo"`)
  console.log()
  console.log(`✓ Both transactions executed atomically!`)
  console.log(`  - Payment transferred 100000 microAlgos from Alice to Bob`)
  console.log(`  - Smart contract method returned the expected value`)

  return groupResult
}

// Run the example
atomicGroupWithMethodCall().catch(console.error)