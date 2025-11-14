import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

/**
 * Look Up Applications Created by Account
 *
 * This example demonstrates how to look up all applications created by a specific account
 * using the Algorand indexer API directly.
 *
 * Topics covered:
 * 1. Creating multiple applications from different accounts
 * 2. Using the indexer to look up applications by creator
 * 3. Handling pagination for large result sets
 * 4. Filtering applications by creator address
 */

/**
 * Helper function to look up applications created by an account
 */
async function lookupApplicationsByCreator(
  indexer: algosdk.Indexer,
  creator: string,
  limit?: number,
): Promise<algosdk.indexerModels.Application[]> {
  const apps: algosdk.indexerModels.Application[] = []
  let nextToken: string | undefined

  do {
    const response = await indexer
      .searchForApplications()
      .creator(creator)
      .limit(limit || 100)
      .nextToken(nextToken || '')
      .do()

    apps.push(...(response.applications || []))
    nextToken = response.nextToken
  } while (nextToken)

  return apps
}

async function main() {
  console.log('=== Look Up Applications Created by Account ===\n')

  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get two different accounts
  const creator1 = await algorand.account.localNetDispenser()
  const creator2 = algorand.account.random()

  // Fund the second creator
  await algorand.send.payment({
    sender: creator1.addr,
    receiver: creator2.addr,
    amount: (10).algo(),
  })

  console.log('Creator 1:', creator1.addr.toString())
  console.log('Creator 2:', creator2.addr.toString())
  console.log()

  // Simple TEAL programs for testing
  const approvalProgram = '#pragma version 10\nint 1\nreturn'
  const clearProgram = '#pragma version 10\nint 1\nreturn'

  // ========================================
  // STEP 1: Create multiple applications
  // ========================================
  console.log('=== STEP 1: Creating Applications ===\n')

  // Creator 1 creates 3 applications
  console.log('Creator 1 creating applications...')

  const app1Result = await algorand.send.appCreate({
    sender: creator1.addr,
    approvalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 1,
      globalByteSlices: 0,
      localInts: 0,
      localByteSlices: 0,
    },
  })
  const app1Id = app1Result.appId
  console.log(`  ✅ App 1 created with ID: ${app1Id}`)

  const app2Result = await algorand.send.appCreate({
    sender: creator1.addr,
    approvalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 2,
      globalByteSlices: 0,
      localInts: 0,
      localByteSlices: 0,
    },
  })
  const app2Id = app2Result.appId
  console.log(`  ✅ App 2 created with ID: ${app2Id}`)

  const app3Result = await algorand.send.appCreate({
    sender: creator1.addr,
    approvalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 0,
      globalByteSlices: 1,
      localInts: 0,
      localByteSlices: 0,
    },
  })
  const app3Id = app3Result.appId
  console.log(`  ✅ App 3 created with ID: ${app3Id}`)
  console.log()

  // Creator 2 creates 2 applications
  console.log('Creator 2 creating applications...')

  const app4Result = await algorand.send.appCreate({
    sender: creator2.addr,
    approvalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 1,
      globalByteSlices: 1,
      localInts: 0,
      localByteSlices: 0,
    },
  })
  const app4Id = app4Result.appId
  console.log(`  ✅ App 4 created with ID: ${app4Id}`)

  const app5Result = await algorand.send.appCreate({
    sender: creator2.addr,
    approvalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 3,
      globalByteSlices: 0,
      localInts: 0,
      localByteSlices: 0,
    },
  })
  const app5Id = app5Result.appId
  console.log(`  ✅ App 5 created with ID: ${app5Id}`)
  console.log()

  // Wait for indexer to index the transactions
  console.log('Waiting for indexer to index transactions...')
  await new Promise((resolve) => setTimeout(resolve, 5000))
  console.log()

  // ========================================
  // STEP 2: Look up applications by creator
  // ========================================
  console.log('=== STEP 2: Looking Up Applications by Creator ===\n')

  // Look up applications created by Creator 1
  console.log(`Looking up applications created by Creator 1 (${creator1.addr.toString()})...`)
  const allCreator1Apps = await lookupApplicationsByCreator(algorand.client.indexer, creator1.addr.toString())

  // Filter to only the apps created in this example
  const creator1Apps = allCreator1Apps.filter((app) =>
    BigInt(app.id) === app1Id || BigInt(app.id) === app2Id || BigInt(app.id) === app3Id
  )

  console.log(`Found ${creator1Apps.length} applications created in this example (${allCreator1Apps.length} total):`)
  creator1Apps.forEach((app) => {
    console.log(`  - App ID: ${app.id}`)
    console.log(`    Created at round: ${app.createdAtRound}`)
    if (app.params.creator) {
      console.log(`    Creator: ${app.params.creator}`)
    }
  })
  console.log()

  // Look up applications created by Creator 2
  console.log(`Looking up applications created by Creator 2 (${creator2.addr.toString()})...`)
  const allCreator2Apps = await lookupApplicationsByCreator(algorand.client.indexer, creator2.addr.toString())

  // Filter to only the apps created in this example
  const creator2Apps = allCreator2Apps.filter((app) =>
    BigInt(app.id) === app4Id || BigInt(app.id) === app5Id
  )

  console.log(`Found ${creator2Apps.length} applications created in this example (${allCreator2Apps.length} total):`)
  creator2Apps.forEach((app) => {
    console.log(`  - App ID: ${app.id}`)
    console.log(`    Created at round: ${app.createdAtRound}`)
    if (app.params.creator) {
      console.log(`    Creator: ${app.params.creator}`)
    }
  })
  console.log()

  // ========================================
  // STEP 3: Demonstrate pagination
  // ========================================
  console.log('=== STEP 3: Demonstrating Pagination ===\n')

  console.log('Looking up Creator 1 apps with pagination (1 result per page)...')
  const allCreator1AppsPaginated = await lookupApplicationsByCreator(
    algorand.client.indexer,
    creator1.addr.toString(),
    1, // limit: 1 result per page
  )

  // Filter to only the apps created in this example
  const creator1AppsPaginated = allCreator1AppsPaginated.filter((app) =>
    BigInt(app.id) === app1Id || BigInt(app.id) === app2Id || BigInt(app.id) === app3Id
  )

  console.log(`Retrieved ${creator1AppsPaginated.length} applications from this example (${allCreator1AppsPaginated.length} total):`)
  creator1AppsPaginated.forEach((app) => {
    console.log(`  - App ID: ${app.id}`)
  })
  console.log()

  // ========================================
  // STEP 4: Verify results
  // ========================================
  console.log('=== STEP 4: Verifying Results ===\n')

  const creator1AppIds = creator1Apps.map((app) => BigInt(app.id)).sort((a, b) => (a < b ? -1 : 1))
  const expectedCreator1Ids = [app1Id, app2Id, app3Id].sort((a, b) => (a < b ? -1 : 1))

  console.log('Creator 1:')
  console.log(`  Expected app IDs: ${expectedCreator1Ids.join(', ')}`)
  console.log(`  Retrieved app IDs: ${creator1AppIds.join(', ')}`)

  // Check if arrays match
  const creator1Match = creator1AppIds.length === expectedCreator1Ids.length &&
    creator1AppIds.every((id, index) => id === expectedCreator1Ids[index])
  console.log(`  ✅ Match: ${creator1Match}`)
  console.log()

  const creator2AppIds = creator2Apps.map((app) => BigInt(app.id)).sort((a, b) => (a < b ? -1 : 1))
  const expectedCreator2Ids = [app4Id, app5Id].sort((a, b) => (a < b ? -1 : 1))

  console.log('Creator 2:')
  console.log(`  Expected app IDs: ${expectedCreator2Ids.join(', ')}`)
  console.log(`  Retrieved app IDs: ${creator2AppIds.join(', ')}`)

  // Check if arrays match
  const creator2Match = creator2AppIds.length === expectedCreator2Ids.length &&
    creator2AppIds.every((id, index) => id === expectedCreator2Ids[index])
  console.log(`  ✅ Match: ${creator2Match}`)
  console.log()

  // ========================================
  // Summary
  // ========================================
  console.log('=== Summary ===\n')
  console.log('Key Features Demonstrated:')
  console.log('  • Created applications from multiple accounts')
  console.log('  • Used indexer to look up applications by creator address')
  console.log('  • Demonstrated pagination support for large result sets')
  console.log('  • Verified that each creator\'s apps were correctly identified')
  console.log()

  console.log('Use Cases:')
  console.log('  • Discover all applications deployed by a specific user')
  console.log('  • Manage multi-app deployments for a project')
  console.log('  • Audit applications created by an account')
  console.log('  • Track application deployment history')
  console.log()

  console.log('✨ Example completed successfully!')
}

main().catch(console.error)