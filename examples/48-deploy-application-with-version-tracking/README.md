# Deploy Application with Version Tracking

This example demonstrates deploying an application with version tracking to enable idempotent deployments and prevent accidental duplicate deployments.

## What This Example Shows

- Version tracking for app deployments
- Testing idempotency by attempting duplicate deployment
- Detecting when an app already exists
- Managing app versions
- Preventing accidental duplicate deployments

## Running the Example

1. Start LocalNet:
   ```bash
   algokit localnet start
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the example:
   ```bash
   npm start
   ```

## Expected Output

```
=== Deploy Application with Version Tracking ===

Test account address: YR3TGJUKCAY6KYXHN4X63IXG3FHMAULGVJKZPXI3XHTRJ7HUXC2EP42JAA

Step 1: Deploying application (Version 1.0)...
✓ App deployed with ID: 1074
  Version: 1.0

Step 2: Checking version from create method...
✓ Create method returned: "v1.0"

Step 3: Verifying app was deployed...
✓ App exists on blockchain

Step 4: Testing idempotency...
✓ Second deployment prevented

💡 Version Tracking Benefits:
   • Prevents accidental duplicate deployments
   • Tracks which version is deployed
   • Enables controlled updates
   • Provides deployment history

✅ Example completed successfully
```

## Key Takeaways

- Version tracking helps manage app deployments
- Attempting to create an existing app is correctly prevented
- Return values from create methods can include version info
- Idempotent operations ensure consistent state
- Deploy-time parameters control app configuration

This example demonstrates version tracking during deployment, essential for managing application lifecycles and preventing deployment errors.
