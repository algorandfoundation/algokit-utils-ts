# Configure Debug Mode and Emit Async Events

This example demonstrates how to configure debug mode, register event handlers, and emit async events using the AlgoKit Utils event system. This is useful for implementing debug handlers, monitoring, and event-driven architectures.

## What This Example Shows

This example teaches you how to:
- Configure debug mode in AlgoKit Utils
- Register event handlers using the event system
- Emit async events with custom data
- Work with the AlgoKit event-driven architecture
- Understand how debug packages integrate with AlgoKit

## Why This Matters

The event system is important for several reasons:

1. **Debugging**: Enable debug mode to get detailed information about operations
2. **Monitoring**: Listen to events to monitor application behavior
3. **Event-Driven Architecture**: Build reactive applications using events
4. **Integration**: Integrate with debug packages like algokit-utils-ts-debug

Key concepts:
- **Config.configure()**: Configure AlgoKit Utils settings including debug mode
- **Event System**: Async event emitter for application-wide events
- **Event Handlers**: Register callbacks to respond to specific events
- **Async Events**: Events that support asynchronous processing

Common use cases:
- **Debug Handlers**: Capture and log debug information
- **Transaction Monitoring**: Track transaction lifecycle events
- **Performance Monitoring**: Monitor timing and performance metrics
- **Custom Integrations**: Build custom tools that react to AlgoKit events

## How It Works

The example demonstrates the complete event system workflow:

### 1. Configure Debug Mode

Enable debug mode to activate event emission:

```typescript
import { Config } from '@algorandfoundation/algokit-utils'

Config.configure({
  debug: true,
})
```

When debug mode is enabled, AlgoKit Utils will emit events for various operations.

### 2. Register Event Handlers

Register handlers to listen for specific events:

```typescript
Config.events.on('event_a', (data) => {
  console.log('Event received with data:', data)
})
```

Event handlers receive event data and can process it asynchronously. This pattern is used by debug packages to capture and display information.

### 3. Emit Async Events

Emit events with custom data:

```typescript
await Config.events.emitAsync('event_a', {
  hello: 'world',
})
```

The `emitAsync()` method ensures all event handlers complete before continuing. This is important for operations that depend on event processing.

### 4. Wait for Event Processing

Since events are async, you may need to wait for processing:

```typescript
// Wait for async event processing to complete
await new Promise((resolve) => setTimeout(resolve, 100))
```

This ensures all event handlers have finished executing.

## Event System Architecture

The AlgoKit event system follows this pattern:

1. **Configuration**: Enable features like debug mode via `Config.configure()`
2. **Registration**: Register event handlers via `Config.events.on()`
3. **Emission**: Emit events via `Config.events.emitAsync()`
4. **Processing**: Handlers execute asynchronously
5. **Completion**: `emitAsync()` resolves when all handlers complete

This architecture allows for:
- Decoupled components
- Extensible functionality
- Debug package integration
- Custom monitoring tools

## Real-World Integration

Debug packages like `algokit-utils-ts-debug` use this system:

```typescript
// What debug packages do internally:
Config.configure({ debug: true })

Config.events.on('TxnGroupSimulated', (event) => {
  // Display simulation results
  console.log('Transaction simulated:', event)
})

Config.events.on('AppDeployed', (event) => {
  // Log deployment information
  console.log('App deployed:', event.appId)
})
```

Your application code automatically triggers these events when debug mode is enabled.

## Prerequisites

- Node.js and npm installed

## Running the Example

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the example:
   ```bash
   npm start
   ```

## Expected Output

```
Configuring debug mode...
Debug mode configured successfully
Registering event listener...
Event listener registered
Emitting event: event_a
Event received with data: { hello: 'world' }
Event processing complete
```

## Key Takeaways

- Use `Config.configure({ debug: true })` to enable debug mode
- Register event handlers with `Config.events.on(eventName, handler)`
- Emit async events with `Config.events.emitAsync(eventName, data)`
- Event handlers execute asynchronously
- The event system enables debug packages and monitoring tools
- Events are central to AlgoKit's extensibility
- Debug packages use this system to capture and display information
- You can build custom tools using the same event system
- Events support both sync and async handlers
- `emitAsync()` waits for all handlers to complete before resolving
