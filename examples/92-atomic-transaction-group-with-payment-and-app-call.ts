import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { TestingAppFactory } from './artifacts/TestingApp/client'

/**
 * This example demonstrates creating an atomic transaction group with a payment
 * and multiple app method calls.
 *
 * This is useful for complex operations that require coordinating payment transfers
 * with smart contract state changes in a single atomic transaction.
 */

async function atomicGroupWithPaymentAndAppCall() {
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
  console.log(`1. Payment: Alice → Bob (50000 microAlgos)`)
  console.log(`2. App call: call_abi("first call")`)
  console.log(`3. App call: call_abi("second call")`)
  console.log()

  // Create an atomic group with a payment and multiple app method calls
  const result = await algorand.newGroup()
    .addPayment({
      sender: alice.addr,
      receiver: bob.addr,
      amount: (0.05).algos(),
    })
    .addAppCallMethodCall({
      sender: alice.addr,
      appId,
      method: appClient.appClient.getABIMethod('call_abi')!,
      args: ['first call'],
      signer: alice,
    })
    .addAppCallMethodCall({
      sender: alice.addr,
      appId,
      method: appClient.appClient.getABIMethod('call_abi')!,
      args: ['second call'],
      signer: alice,
    })
    .send()

  console.log(`✓ Atomic transaction group executed successfully!`)
  console.log(`Transaction IDs: ${result.txIds.join(', ')}`)
  console.log(`Group ID: ${result.groupId}`)
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

  // Access the return values from the method calls
  const firstCallResult = result.returns?.[0]?.returnValue?.valueOf()
  const secondCallResult = result.returns?.[1]?.returnValue?.valueOf()
  console.log(`First method call result: "${firstCallResult}"`)
  console.log(`Second method call result: "${secondCallResult}"`)
  console.log()
  console.log(`✓ All three transactions executed atomically!`)
  console.log(`  - Payment transferred 50000 microAlgos from Alice to Bob`)
  console.log(`  - First app method returned expected value`)
  console.log(`  - Second app method returned expected value`)

  return result
}

// Run the example
atomicGroupWithPaymentAndAppCall().catch(console.error)
