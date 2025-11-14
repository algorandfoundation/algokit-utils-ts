# Call ABI Method with Foreign References

This example demonstrates how to call an ABI method with explicit foreign references to apps, accounts, and assets. Foreign references are resources that your smart contract needs to access during execution, and you can specify them manually when `populateAppCallResources` is set to `false`.

## Key Concepts

- **Foreign App References**: Other applications your contract needs to interact with
- **Foreign Account References**: Accounts your contract needs to read state from
- **Foreign Asset References**: Assets your contract needs to query or manage
- **Manual Resource Population**: Explicitly provide all references instead of automatic detection
- **Transaction Arrays**: Limited to specific sizes (8 apps, 8 accounts, 8 assets max)

## What This Example Shows

1. Deploying a main smart contract on LocalNet
2. Creating foreign resources (a second app, an asset, and an account)
3. Calling an ABI method with explicit foreign references
4. Disabling automatic resource population
5. Verifying the contract can access all foreign references

## Code Walkthrough

### Setup Accounts and Main App

```typescript
const algorand = AlgorandClient.defaultLocalNet()
const dispenser = await algorand.account.localNetDispenser()

const alice = algorand.account.random()
await algorand.account.ensureFunded(alice, dispenser, (5).algos())

const bob = algorand.account.random()
await algorand.account.ensureFunded(bob, dispenser, (1).algos())

// Deploy the main app
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
```

Create test accounts and deploy the main application that will access foreign references.

### Create Foreign Resources

```typescript
// Deploy a second app (foreign app)
const { result: foreignAppResult } = await appFactory.send.create.bare({
  deployTimeParams: {
    TMPL_UPDATABLE: 1,
    TMPL_DELETABLE: 1,
    TMPL_VALUE: 456,
  },
})
const foreignAppId = BigInt(foreignAppResult.appId)

// Create an asset (foreign asset)
const assetCreateResult = await algorand.send.assetCreate({
  sender: alice.addr,
  total: 1000n,
  decimals: 0,
  assetName: 'Test Token',
  unitName: 'TST',
})
const assetId = BigInt(assetCreateResult.confirmation.assetIndex!)

// Bob's account will be the foreign account reference
const foreignAccount = bob.addr
```

Create the resources that the main app will reference:
- A second application
- An asset
- Another account (Bob)

### Call Method with Foreign References

```typescript
const result = await appClient.send.callAbiForeignRefs({
  args: [],
  // Explicitly specify foreign app references
  appReferences: [foreignAppId],
  // Explicitly specify foreign account references
  accountReferences: [bob.addr],
  // Explicitly specify foreign asset references
  assetReferences: [assetId],
  // Disable automatic resource population
  populateAppCallResources: false,
})
```

**Key points**:
- `appReferences`: Array of app IDs the contract will access
- `accountReferences`: Array of addresses the contract will read from
- `assetReferences`: Array of asset IDs the contract will query
- `populateAppCallResources: false`: You must manually provide all references

### Access Return Value

```typescript
console.log('Transaction ID:', result.transaction.txID())
console.log('Return value:', result.return)
```

The return value shows that the contract successfully accessed all foreign references. The `call_abi_foreign_refs` method returns a string containing information about the referenced app, asset, and account.

## API Patterns (AlgoKit Utils v9.1.2)

### Call Method with Foreign References

```typescript
const result = await appClient.send.methodName({
  args: [...],  // Method arguments
  appReferences: [appId1, appId2],  // Foreign apps (max 8)
  accountReferences: [addr1, addr2],  // Foreign accounts (max 4)
  assetReferences: [assetId1, assetId2],  // Foreign assets (max 8)
  populateAppCallResources: false,  // Disable auto-population
})
```

### Foreign Reference Limits

Algorand has strict limits on foreign references per transaction:
- **Apps**: Maximum 8 foreign app references (including the app being called)
- **Accounts**: Maximum 4 foreign account references (plus sender)
- **Assets**: Maximum 8 foreign asset references
- **Boxes**: Maximum 8 box references

### Automatic vs Manual Resource Population

```typescript
// Automatic (default)
const result = await appClient.send.methodName({
  args: [...],
  // SDK automatically detects and populates references from simulation
})

// Manual (explicit)
const result = await appClient.send.methodName({
  args: [...],
  appReferences: [foreignAppId],
  accountReferences: [foreignAddr],
  assetReferences: [foreignAssetId],
  populateAppCallResources: false,  // Required for manual mode
})
```

### When to Use Manual References

Use manual references when:
1. **Performance**: Skip simulation overhead
2. **Determinism**: Know exact resources needed
3. **Complex Scenarios**: Resources depend on dynamic conditions
4. **Testing**: Verify contract handles specific references correctly

## Common Use Cases

### Cross-App Calls

One app calling methods on another:
```typescript
await mainAppClient.send.crossAppCall({
  args: [operation],
  appReferences: [targetAppId],  // The app to call
  populateAppCallResources: false,
})
```

### Reading Account State

Access state from specific accounts:
```typescript
await appClient.send.checkBalances({
  args: [],
  accountReferences: [user1.addr, user2.addr, user3.addr],
  populateAppCallResources: false,
})
```

### Asset Verification

Verify asset properties or holdings:
```typescript
await appClient.send.verifyAsset({
  args: [assetId],
  assetReferences: [assetId],
  accountReferences: [holderAddr],  // Check if account holds asset
  populateAppCallResources: false,
})
```

### Multi-App Coordination

Coordinate actions across multiple apps:
```typescript
await coordinatorApp.send.execute({
  args: [],
  appReferences: [app1Id, app2Id, app3Id],
  accountReferences: [sharedAccount],
  assetReferences: [sharedAsset],
  populateAppCallResources: false,
})
```

## Important Considerations

### Foreign Reference Array Limits

```typescript
// Maximum limits per transaction
const limits = {
  apps: 8,        // Including the app being called
  accounts: 4,    // Plus the sender (5 total)
  assets: 8,      // Total asset references
  boxes: 8,       // Box references
}
```

**Important**: If you need to reference more than the limits allow, you'll need to split operations across multiple transactions.

### Reference Order

The order of references matters:
- Apps are indexed starting at 1 (0 is the called app)
- Accounts are indexed starting at 1 (0 is the sender)
- Assets are indexed starting at 0

### populateAppCallResources Flag

```typescript
// When true (default):
// - SDK simulates transaction
// - Automatically detects required resources
// - Adds them to the transaction

// When false:
// - No simulation
// - You must provide all required references
// - Transaction fails if any required reference is missing
```

### Error Handling

```typescript
try {
  const result = await appClient.send.method({
    appReferences: [foreignAppId],
    populateAppCallResources: false,
  })
} catch (error) {
  // Common errors:
  // - Missing required reference
  // - Reference limit exceeded
  // - Referenced resource doesn't exist
  console.error('Failed to call with foreign references:', error)
}
```

### Performance Considerations

Manual references can be faster because they skip simulation:
```typescript
// Automatic: ~200-500ms (includes simulation)
const autoResult = await appClient.send.method({ args })

// Manual: ~100-200ms (no simulation)
const manualResult = await appClient.send.method({
  args,
  appReferences: [knownAppId],
  populateAppCallResources: false,
})
```

## Expected Output

```
Alice address: ABCD...
Bob address: EFGH...

Deploying main app...
Main app deployed with ID: 1234

Deploying second app (foreign app reference)...
Foreign app deployed with ID: 1235

Creating asset (foreign asset reference)...
Asset created with ID: 1236

Calling ABI method with foreign references...
Foreign references:
  - Foreign app ID: 1235
  - Foreign account: EFGH...
  - Foreign asset ID: 1236

✅ Transaction successful!
Transaction ID: ABC123...
Return value: App: 1235, Asset: 1236, Account: 239:45

The contract successfully accessed foreign references:
  ✓ App ID 1235 was accessible
  ✓ Account EFGH... was accessible
  ✓ Asset ID 1236 was accessible
```

## Running the Example

### Prerequisites
1. Start AlgoKit LocalNet:
   ```bash
   algokit localnet start
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Execute
```bash
npm start
```

The example will:
1. Create and fund test accounts
2. Deploy the main application
3. Create foreign resources (app, asset, account)
4. Call an ABI method with explicit foreign references
5. Display the transaction results

## Debugging Foreign References

### Check Required References

If your transaction fails due to missing references, check:
1. **App References**: Does your contract call another app?
2. **Account References**: Does your contract read state from other accounts?
3. **Asset References**: Does your contract query asset information?
4. **Box References**: Does your contract access boxes?

### Enable Simulation

Temporarily enable automatic population to see what's needed:
```typescript
// Let SDK detect requirements
const result = await appClient.send.method({
  args,
  // populateAppCallResources: true (default)
})

// Check what was added
console.log('Apps:', result.transaction.appAccounts)
console.log('Accounts:', result.transaction.accounts)
console.log('Assets:', result.transaction.foreignAssets)
```

## Learn More

- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [Algorand Foreign References](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/)
- [ABI Method Calls](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/ABI/)
- [Transaction Reference Arrays](https://developer.algorand.org/docs/get-details/transactions/transactions/#reference-arrays)
