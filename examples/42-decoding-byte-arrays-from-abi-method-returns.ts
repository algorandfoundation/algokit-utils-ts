import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import appSpecJson from './artifacts/TestingApp.json'


/**
 * Demonstrates decoding byte arrays from ABI method return values.
 *
 * This example shows how to properly handle both static and dynamic byte arrays
 * when calling smart contract methods. Static arrays have a fixed length known
 * at compile time, while dynamic arrays can vary in length.
 */
async function main() {
  console.log('=== Byte Array Decoding Example ===')
  console.log()

  // Initialize Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  const account = await algorand.account.fromEnvironment('ACCOUNT')

  console.log('Step 1: Deploy application with byte array methods')

  // Load app spec from file

  const appSpec = appSpecJson as AppSpec

  const factory = algorand.client.getAppFactory({
    appSpec,
    defaultSender: account.addr,
  })

  const { appClient } = await factory.send.bare.create({
    deployTimeParams: {
      UPDATABLE: 0,
      DELETABLE: 0,
      VALUE: 1,
    },
  })
  console.log(`✓ Application deployed with ID: ${appClient.appId}`)
  console.log()

  // Example: Working with Static Byte Arrays
  console.log('Step 2: Decode Static Byte Array')
  console.log('Static byte arrays have a fixed length (e.g., byte[8])')
  console.log()

  try {
    // Call method that returns a static byte array
    const staticResult = await appClient.send.call({
      method: 'getStaticByteArray',
    })

    // The return value is automatically decoded by the ABI
    const staticByteArray = staticResult.return as Uint8Array

    console.log('Static Byte Array Retrieved:')
    console.log(`  Length: ${staticByteArray.length} bytes (fixed)`)
    console.log(`  Hex: ${Buffer.from(staticByteArray).toString('hex')}`)
    console.log(`  UTF-8: ${Buffer.from(staticByteArray).toString('utf-8')}`)
    console.log()

    // You can work with the byte array directly
    console.log('Working with static byte array:')
    for (let i = 0; i < staticByteArray.length; i++) {
      console.log(`  Byte[${i}]: ${staticByteArray[i]} (0x${staticByteArray[i].toString(16).padStart(2, '0')})`)
    }
    console.log()
  } catch (e) {
    console.log(`Note: Method call may fail if contract not fully implemented`)
    console.log(`This is a demonstration of the decoding pattern`)
    console.log()
  }

  // Example: Working with Dynamic Byte Arrays
  console.log('Step 3: Decode Dynamic Byte Array')
  console.log('Dynamic byte arrays have variable length (e.g., byte[])')
  console.log()

  try {
    // Call method that returns a dynamic byte array
    const dynamicResult = await appClient.send.call({
      method: 'getDynamicByteArray',
    })

    // The return value is automatically decoded by the ABI
    const dynamicByteArray = dynamicResult.return as Uint8Array

    console.log('Dynamic Byte Array Retrieved:')
    console.log(`  Length: ${dynamicByteArray.length} bytes (variable)`)
    console.log(`  Hex: ${Buffer.from(dynamicByteArray).toString('hex')}`)
    console.log(`  UTF-8: ${Buffer.from(dynamicByteArray).toString('utf-8')}`)
    console.log()

    // Dynamic arrays can be of any length
    console.log('Working with dynamic byte array:')
    if (dynamicByteArray.length > 0) {
      console.log(`  First byte: ${dynamicByteArray[0]} (0x${dynamicByteArray[0].toString(16).padStart(2, '0')})`)
      console.log(`  Last byte: ${dynamicByteArray[dynamicByteArray.length - 1]} (0x${dynamicByteArray[dynamicByteArray.length - 1].toString(16).padStart(2, '0')})`)
    }
    console.log()
  } catch (e) {
    console.log(`Note: Method call may fail if contract not fully implemented`)
    console.log(`This is a demonstration of the decoding pattern`)
    console.log()
  }

  console.log('Key Differences:')
  console.log('  Static (byte[N]):')
  console.log('    • Fixed length known at compile time')
  console.log('    • More gas-efficient')
  console.log('    • Use when size is constant')
  console.log()
  console.log('  Dynamic (byte[]):')
  console.log('    • Variable length')
  console.log('    • Includes length prefix in ABI encoding')
  console.log('    • Use when size varies')
  console.log()

  console.log('Best Practices:')
  console.log('  • AlgoKit Utils automatically decodes ABI return values')
  console.log('  • Access decoded value via result.return')
  console.log('  • Cast to appropriate type (Uint8Array for byte arrays)')
  console.log('  • Use Buffer.from() to convert for display/manipulation')
  console.log()

  console.log('=== Example Complete ===')
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
