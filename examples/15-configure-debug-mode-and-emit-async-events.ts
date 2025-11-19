import { Config } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to configure debug mode and work with async events
 * in AlgoKit Utils. The event system allows you to emit and listen for events
 * asynchronously, which is useful for debugging, monitoring, and event-driven architectures.
 */

async function main() {
  // Step 1: Configure AlgoKit Utils with debug mode enabled
  console.log('Configuring debug mode...')
  Config.configure({
    debug: true,
  })
  console.log('Debug mode configured successfully')

  // Step 2: Register an event handler
  // This simulates what algokit-utils-ts-debug or similar packages would do
  console.log('Registering event listener...')
  Config.events.on('event_a', (data) => {
    console.log('Event received with data:', data)
  })
  console.log('Event listener registered')

  // Step 3: Emit an async event
  console.log('Emitting event: event_a')
  await Config.events.emitAsync('event_a', {
    hello: 'world',
  })

  // Wait a moment for async event processing to complete
  await new Promise((resolve) => setTimeout(resolve, 100))

  console.log('Event processing complete')
}

// Run the example
main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
