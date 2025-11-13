import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'

/**
 * Transaction Lease Idempotency Example
 * 
 * This example demonstrates how to use transaction leases to prevent duplicate
 * transactions and ensure idempotent operations. Leases are critical for:
 * - Preventing double-spending
 * - Building idempotent operations in distributed systems
 * - Ensuring transaction uniqueness
 * 
 * A lease is a 32-byte value that prevents a transaction with the same lease
 * from being confirmed until the previous transaction leaves the txn pool
 * (typically 1000 rounds).
 */

async function main() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get a funded test account from LocalNet
  const testAccount = await algorand.account.localNetDispenser()

  console.log('=== Transaction Lease Idempotency Demo ===')
  console.log()

  // Use unique lease values per run to avoid conflicts with previous runs
  const runId = Date.now()

  // ========================================
  // 1. String Lease Example
  // ========================================
  console.log('1. STRING LEASE EXAMPLE')
  console.log('Using string lease "test" to prevent duplicate payments')
  console.log()

  const receiverAccount1 = await algorand.account.random()

  try {
    // First payment with string lease
    console.log('Sending first payment with lease "test"...')
    const result1 = await algorand.send.payment({
      sender: testAccount.addr,
      receiver: receiverAccount1.addr,
      amount: algo(1),
      lease: `test-${runId}`, // String lease with unique run ID
    })
    console.log('✓ First payment successful')
    console.log(`  Transaction ID: ${result1.transaction.txID()}`)
    console.log()
    
    // Try to send another payment with the same lease (will fail)
    console.log('Attempting second payment with same lease "test"...')
    try {
      await algorand.send.payment({
        sender: testAccount.addr,
        receiver: receiverAccount1.addr,
        amount: algo(2),
        lease: `test-${runId}`, // Same lease - will be rejected
      })
      console.log('✗ Second payment should have failed!')
    } catch (error) {
      console.log('✓ Second payment rejected (expected behavior)')
      console.log(`  Error: ${(error as Error).message}`)
      console.log('  → Lease prevents duplicate transaction')
    }
  } catch (error) {
    console.error('Error in string lease example:', error)
  }
  
  console.log()
  console.log('---')
  console.log()
  
  // ========================================
  // 2. Byte Array Lease Example
  // ========================================
  console.log('2. BYTE ARRAY LEASE EXAMPLE')
  console.log('Using byte array lease [1,2,3,4] to prevent duplicate payments')
  console.log()
  
  const receiverAccount2 = await algorand.account.random()

  try {
    // Create a unique byte array lease by encoding runId
    const leaseBytes = new Uint8Array(8)
    const view = new DataView(leaseBytes.buffer)
    view.setBigUint64(0, BigInt(runId), false) // Use runId as the lease value

    // First payment with byte array lease
    console.log('Sending first payment with byte array lease [1,2,3,4]...')
    const result2 = await algorand.send.payment({
      sender: testAccount.addr,
      receiver: receiverAccount2.addr,
      amount: algo(1),
      lease: leaseBytes, // Byte array lease with unique run ID
    })
    console.log('✓ First payment successful')
    console.log(`  Transaction ID: ${result2.transaction.txID()}`)
    console.log()

    // Try to send another payment with the same byte array lease (will fail)
    console.log('Attempting second payment with same byte array lease...')
    try {
      await algorand.send.payment({
        sender: testAccount.addr,
        receiver: receiverAccount2.addr,
        amount: algo(2),
        lease: leaseBytes, // Same lease - will be rejected
      })
      console.log('✗ Second payment should have failed!')
    } catch (error) {
      console.log('✓ Second payment rejected (expected behavior)')
      console.log(`  Error: ${(error as Error).message}`)
      console.log('  → Byte array lease works the same as string lease')
    }
  } catch (error) {
    console.error('Error in byte array lease example:', error)
  }
  
  console.log()
  console.log('---')
  console.log()
  
  // ========================================
  // 3. ASA Transfer Lease Example
  // ========================================
  console.log('3. ASSET TRANSFER LEASE EXAMPLE')
  console.log('Using leases with ASA transfers to prevent duplicate asset operations')
  console.log()
  
  try {
    // Create a test asset
    console.log('Creating test asset...')
    const assetCreate = await algorand.send.assetCreate({
      sender: testAccount.addr,
      total: 100n,
      decimals: 0,
      assetName: 'Test Asset',
    })
    const assetId = BigInt(assetCreate.confirmation.assetIndex!)
    console.log(`✓ Asset created with ID: ${assetId}`)
    console.log()
    
    // Create and fund a second account
    const receiverAccount3 = await algorand.account.random()
    await algorand.send.payment({
      sender: testAccount.addr,
      receiver: receiverAccount3.addr,
      amount: algo(1),
    })
    console.log('✓ Receiver account funded')
    console.log()
    
    // Opt-in to the asset
    console.log('Opting in to asset...')
    await algorand.send.assetOptIn({
      sender: receiverAccount3.addr,
      assetId: assetId,
    })
    console.log('✓ Receiver opted in to asset')
    console.log()
    
    // First asset transfer with lease
    console.log('Sending first asset transfer with lease "asset-test"...')
    const result3 = await algorand.send.assetTransfer({
      sender: testAccount.addr,
      receiver: receiverAccount3.addr,
      assetId: assetId,
      amount: 1n,
      lease: `asset-test-${runId}`, // Lease for asset transfer with unique run ID
    })
    console.log('✓ First asset transfer successful')
    console.log(`  Transaction ID: ${result3.transaction.txID()}`)
    console.log()

    // Try to send another asset transfer with the same lease (will fail)
    console.log('Attempting second asset transfer with same lease "asset-test"...')
    try {
      await algorand.send.assetTransfer({
        sender: testAccount.addr,
        receiver: receiverAccount3.addr,
        assetId: assetId,
        amount: 2n,
        lease: `asset-test-${runId}`, // Same lease - will be rejected
      })
      console.log('✗ Second asset transfer should have failed!')
    } catch (error) {
      console.log('✓ Second asset transfer rejected (expected behavior)')
      console.log(`  Error: ${(error as Error).message}`)
      console.log('  → Leases work for asset transfers too')
    }
  } catch (error) {
    console.error('Error in asset transfer lease example:', error)
  }
  
  console.log()
  console.log('=== Demo Complete ===')
  console.log()
  console.log('KEY TAKEAWAYS:')
  console.log('• Leases prevent duplicate transactions during their validity period')
  console.log('• Both string and byte array formats are supported')
  console.log('• Leases work with all transaction types (payments, asset transfers, etc.)')
  console.log('• Use leases to build idempotent operations in distributed systems')
  console.log('• Overlapping leases are rejected with a clear error message')
}

main()
  .then(() => {
    console.log('\n✅ Example completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error:', error)
    process.exit(1)
  })
