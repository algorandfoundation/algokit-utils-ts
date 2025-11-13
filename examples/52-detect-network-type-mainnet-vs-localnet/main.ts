import { AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to detect whether an Algorand client
 * is connected to LocalNet or a public network (MainNet/TestNet).
 *
 * This is critical for:
 * - Preventing accidental use of test behavior in production
 * - Conditional logic based on network type
 * - Deployment safety checks
 * - Environment validation before operations
 *
 * Key concepts:
 * - MainNet/TestNet detection using isLocalNet()
 * - Network validation for production safety
 * - Environment-aware application logic
 */

async function detectNetworkType() {
  console.log('=== Network Type Detection Example ===')
  console.log()

  // Step 1: Check MainNet (should NOT be LocalNet)
  console.log('Step 1: Creating MainNet client...')
  const mainNet = AlgorandClient.mainNet()

  console.log('Checking if MainNet client is LocalNet...')
  const isMainNetLocalNet = await mainNet.client.isLocalNet()

  console.log(`✓ MainNet is LocalNet: ${isMainNetLocalNet}`)
  if (!isMainNetLocalNet) {
    console.log('  → Correctly identified as public production network')
    console.log('  → This is the REAL Algorand blockchain with real assets')
  } else {
    console.log('  ⚠️  WARNING: Unexpectedly identified as LocalNet!')
  }
  console.log()

  // Step 2: Check TestNet (should NOT be LocalNet)
  console.log('Step 2: Creating TestNet client...')
  const testNet = AlgorandClient.testNet()

  console.log('Checking if TestNet client is LocalNet...')
  const isTestNetLocalNet = await testNet.client.isLocalNet()

  console.log(`✓ TestNet is LocalNet: ${isTestNetLocalNet}`)
  if (!isTestNetLocalNet) {
    console.log('  → Correctly identified as public test network')
    console.log('  → This is a public network with test tokens')
  } else {
    console.log('  ⚠️  WARNING: Unexpectedly identified as LocalNet!')
  }
  console.log()

  // Step 3: Check LocalNet (should BE LocalNet)
  console.log('Step 3: Creating LocalNet client...')
  const localNet = AlgorandClient.defaultLocalNet()

  try {
    console.log('Checking if LocalNet client is LocalNet...')
    const isLocalNetLocalNet = await localNet.client.isLocalNet()

    console.log(`✓ LocalNet is LocalNet: ${isLocalNetLocalNet}`)
    if (isLocalNetLocalNet) {
      console.log('  → Correctly identified as LocalNet')
      console.log('  → This is a local development environment')
    }
  } catch (error: any) {
    console.log('✗ LocalNet not available (expected if not running)')
    console.log('  Error:', error.message)
  }
  console.log()

  // Step 4: Practical use case - Conditional logic based on network type
  console.log('Step 4: Environment-specific behavior...')
  console.log()

  async function performOperation(algorand: AlgorandClient, networkName: string) {
    const isLocal = await algorand.client.isLocalNet()

    console.log(`${networkName}:`)
    if (isLocal) {
      console.log('  ⚠️  LocalNet detected - using test mode')
      console.log('  → Relaxed validation')
      console.log('  → Fast transactions')
      console.log('  → Safe to experiment')
    } else {
      console.log('  ✓ Public network detected - using production mode')
      console.log('  → Strict validation required')
      console.log('  → Careful with real assets')
      console.log('  → Confirmations needed')
    }
    console.log()
  }

  await performOperation(mainNet, 'MainNet')
  await performOperation(testNet, 'TestNet')

  try {
    await performOperation(localNet, 'LocalNet')
  } catch (error: any) {
    console.log('LocalNet: Not available')
    console.log()
  }

  console.log('💡 Key Takeaways:')
  console.log('   • MainNet and TestNet are public networks (isLocalNet = false)')
  console.log('   • LocalNet is a private development network (isLocalNet = true)')
  console.log('   • Always validate network type before critical operations')
  console.log('   • Use network detection to enable environment-specific behavior')
  console.log()
}

// Run the example
detectNetworkType()
  .then(() => {
    console.log('✅ Network detection complete')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })