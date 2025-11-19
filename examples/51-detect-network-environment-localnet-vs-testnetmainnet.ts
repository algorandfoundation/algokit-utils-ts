import { AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to detect which network environment
 * your Algorand client is connected to. This is useful for:
 * - Running different logic in development vs production
 * - Adjusting transaction fees or timeouts based on environment
 * - Displaying appropriate UI messages to users
 * - Preventing accidental production operations in development
 *
 * Key concepts:
 * - Network detection with isLocalNet()
 * - Environment-specific configuration
 * - Safe development vs production practices
 */

async function checkNetworkEnvironment() {
  console.log('=== Network Detection Example ===')
  console.log()

  // Example 1: Check if connected to LocalNet
  console.log('Step 1: Checking LocalNet connection...')
  const localNet = AlgorandClient.defaultLocalNet()

  try {
    const isLocal = await localNet.client.isLocalNet()
    console.log(`✓ Is LocalNet: ${isLocal}`)

    if (isLocal) {
      console.log('  → Running in development mode - safe to reset network state')
      console.log('  → LocalNet can be reset without affecting real funds')
    }
  } catch (error: any) {
    console.log('✗ LocalNet not available (this is expected if LocalNet is not running)')
    console.log('  Error:', error.message)
  }

  console.log()

  // Example 2: Check if TestNet is correctly identified as NOT LocalNet
  console.log('Step 2: Checking TestNet connection...')
  const testNet = AlgorandClient.testNet()

  try {
    const isLocal = await testNet.client.isLocalNet()
    console.log(`✓ Is LocalNet: ${isLocal}`)

    if (!isLocal) {
      console.log('  → Running on public network - use production safety measures')
      console.log('  → TestNet uses real blockchain consensus')
    }
  } catch (error: any) {
    console.error('✗ Failed to connect to TestNet:', error.message)
  }

  console.log()

  // Example 3: Check MainNet
  console.log('Step 3: Checking MainNet connection...')
  const mainNet = AlgorandClient.mainNet()

  try {
    const isLocal = await mainNet.client.isLocalNet()
    console.log(`✓ Is LocalNet: ${isLocal}`)

    if (!isLocal) {
      console.log('  → Running on MainNet - PRODUCTION environment')
      console.log('  → Use maximum caution - real assets at risk')
    }
  } catch (error: any) {
    console.error('✗ Failed to connect to MainNet:', error.message)
  }

  console.log()

  // Example 4: Practical use case - environment-specific configuration
  console.log('Step 4: Environment-specific configuration...')

  async function getOptimalTransactionParams(algorand: AlgorandClient) {
    const isLocal = await algorand.client.isLocalNet()

    if (isLocal) {
      return {
        fee: 1000, // Minimum fee for LocalNet
        timeout: 4, // Short timeout OK for LocalNet
        note: 'Development transaction',
        environment: 'LocalNet',
      }
    } else {
      return {
        fee: 1000, // Minimum fee, but might want higher for production
        timeout: 20, // Longer timeout for public networks
        note: 'Production transaction',
        environment: 'Public Network (TestNet/MainNet)',
      }
    }
  }

  try {
    const localParams = await getOptimalTransactionParams(localNet)
    console.log('✓ LocalNet params:', localParams)
  } catch (error: any) {
    console.log('  Could not get LocalNet params:', error.message)
  }

  try {
    const testParams = await getOptimalTransactionParams(testNet)
    console.log('✓ TestNet params:', testParams)
  } catch (error: any) {
    console.log('  Could not get TestNet params:', error.message)
  }

  console.log()

  console.log('💡 Key Takeaways:')
  console.log('   • Use isLocalNet() to detect development vs production')
  console.log('   • LocalNet is for safe testing without real funds')
  console.log('   • TestNet/MainNet are public networks requiring caution')
  console.log('   • Adjust timeouts, fees, and behavior based on network')
  console.log()

  console.log('=== Network detection complete ===')
}

// Run the example
checkNetworkEnvironment()
  .then(() => {
    console.log('✅ Example completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
