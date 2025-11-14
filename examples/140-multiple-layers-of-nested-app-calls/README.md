# Multiple Layers of Nested App Calls

This example demonstrates multiple layers of nested method calls between smart contract applications, showing how to compose complex multi-app operations in Algorand.

## Overview

In complex dApp architectures, you often need multiple applications to interact and call each other. This example shows how to:

- Deploy multiple interconnected smart contracts
- Call applications individually
- Compose multi-app calls in atomic transaction groups
- Understand the foundation for nested inner transactions

This is the building block for advanced patterns like:
- Multi-contract DeFi protocols
- Cross-contract lending and borrowing
- Complex governance systems
- Inter-contract communication chains

## What You'll Learn

- Creating multiple smart contract applications
- Testing each application independently
- Composing applications in transaction groups
- Understanding transaction group atomicity
- Foundation concepts for inner transaction calls
- Managing foreign app references

## Key Concepts

### Multi-Layer Application Architecture

```
Level 1 (Outer) ──► Level 2 (Middle) ──► Level 3 (Inner)
    └─ Entry point      └─ Middleware       └─ Core logic
```

In this example, we deploy three separate applications:

1. **Level 1 (Outer)**: Entry point application
   - Takes input, adds 10
   - Could initiate calls to Level 2

2. **Level 2 (Middle)**: Middleware application
   - Takes input, multiplies by 2
   - Could process and forward to Level 3

3. **Level 3 (Inner)**: Core logic application
   - Takes input, adds 100
   - Performs final computation

### Transaction Groups

Transaction groups allow multiple transactions to execute atomically - either all succeed or all fail. This is critical for multi-contract operations:

```typescript
const groupResult = await algorand
  .newGroup()
  .addAppCallMethodCall({ appId: level3AppId, method: getValue, args: [10n] })
  .addAppCallMethodCall({ appId: level2AppId, method: processValue, args: [20n] })
  .addAppCallMethodCall({ appId: level1AppId, method: initiateChain, args: [30n] })
  .send()
```

**Benefits of transaction groups:**
- Atomic execution (all or nothing)
- Shared context across transactions
- Coordinated state changes
- Enhanced security guarantees

### Inner Transactions (Advanced)

While this example uses transaction groups, production multi-layer apps typically use **inner transactions**:

```teal
// Example: Level 1 calling Level 2 via inner transaction
itxn_begin
int appl                    // Application call
itxn_field TypeEnum
int <level2_app_id>
itxn_field ApplicationID
// Set other fields...
itxn_submit
```

**Requirements for inner transactions:**
- Budget allocation for inner transaction execution
- Apps must be funded for minimum balance
- Foreign app references must be properly set
- ABI encoding/decoding for method arguments

## Example Walkthrough

### Step 1: Deploy Three Applications

Each application is deployed with a simple TEAL program:

**Level 3 (Inner)**: `getValue(uint64) -> uint64`
```teal
method_getValue:
txna ApplicationArgs 1
btoi
int 100
+
// Returns input + 100
```

**Level 2 (Middle)**: `processValue(uint64) -> uint64`
```teal
method_processValue:
txna ApplicationArgs 1
btoi
int 2
*
// Returns input * 2
```

**Level 1 (Outer)**: `initiateChain(uint64) -> uint64`
```teal
method_initiateChain:
txna ApplicationArgs 1
btoi
int 10
+
// Returns input + 10
```

### Step 2: Test Each Application Individually

Before composing applications, test each one independently:

```typescript
// Test Level 3: 50 + 100 = 150
const result = await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: deployer.addr,
    appId: level3AppId,
    method: getValueMethod,
    args: [50n],
  })
  .send()

console.log('Result:', result.returns[0].returnValue) // 150
```

This validates that each application works correctly before combining them.

### Step 3: Compose Applications in a Group

Call all three applications atomically:

```typescript
const groupResult = await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: deployer.addr,
    appId: level3AppId,
    method: getValueMethod,
    args: [10n],
  })
  .addAppCallMethodCall({
    sender: deployer.addr,
    appId: level2AppId,
    method: processValueMethod,
    args: [20n],
  })
  .addAppCallMethodCall({
    sender: deployer.addr,
    appId: level1AppId,
    method: initiateChainMethod,
    args: [30n],
  })
  .send()

// Results:
// Level 3: 10 + 100 = 110
// Level 2: 20 * 2 = 40
// Level 1: 30 + 10 = 40
```

Each app executes with its own input, but they're all atomic - if any fails, all revert.

### Step 4: Understanding Inner Transaction Chains (Advanced)

In production, you'd implement actual call chains using inner transactions:

**Example flow with value = 10:**
```
Level 1 receives: 10
  ↓ Adds 10 → 20
  ↓ Calls Level 2 with 20

Level 2 receives: 20
  ↓ Multiplies by 2 → 40
  ↓ Calls Level 3 with 40

Level 3 receives: 40
  ↓ Adds 100 → 140
  ↓ Returns 140 to Level 2

Level 2 returns: 140 to Level 1
Level 1 returns: 140 to caller
```

## Running the Example

### Prerequisites

```bash
# Start LocalNet
algokit localnet start

# Verify algod is running
curl http://localhost:4001/versions

# Install dependencies
npm install
```

### Execute

```bash
npm start
```

### Expected Output

```
=== Multiple Layers of Nested App Calls ===

Using deployer account: F2T4H...

=== STEP 1: Deploying Level 3 (Inner) Application ===

Deploying Level 3 application (innermost)...
✅ Level 3 app deployed with ID: 1055
   Purpose: Takes a number, adds 100, returns result

=== STEP 2: Deploying Level 2 (Middle) Application ===

Deploying Level 2 application (middle)...
✅ Level 2 app deployed with ID: 1056
   Purpose: Takes a number, multiplies by 2, returns result

=== STEP 3: Deploying Level 1 (Outer) Application ===

Deploying Level 1 application (outer)...
✅ Level 1 app deployed with ID: 1057
   Purpose: Takes a number, adds 10, returns result

=== STEP 4: Defining ABI Methods ===

ABI Methods defined:
  - getValue(uint64): Level 3 method
  - processValue(uint64): Level 2 method
  - initiateChain(uint64): Level 1 method

=== STEP 5: Testing Individual App Calls ===

Testing Level 3 app (getValue)...
  Input: 50
  Expected: 50 + 100 = 150
  ✅ Result: 150

Testing Level 2 app (processValue)...
  Input: 25
  Expected: 25 * 2 = 50
  ✅ Result: 50

Testing Level 1 app (initiateChain)...
  Input: 40
  Expected: 40 + 10 = 50
  ✅ Result: 50

=== STEP 6: Multi-Layer Nested Calls ===

In a production scenario, you would:
1. Level 1 app calls Level 2 app via inner transaction
2. Level 2 app calls Level 3 app via inner transaction
3. Results propagate back through the chain

=== STEP 7: Calling All Three Apps in a Group ===

✅ Group transaction sent successfully!

Results from each app in the group:
  Level 3 (10 + 100): 110
  Level 2 (20 * 2): 40
  Level 1 (30 + 10): 40

✨ Example completed successfully!
```

## Common Use Cases

### 1. DeFi Protocol with Multiple Contracts

```typescript
// Example: Lending protocol
// - Level 1: User-facing interface
// - Level 2: Interest calculation contract
// - Level 3: Collateral management contract

await algorand.newGroup()
  .addAppCallMethodCall({ appId: interfaceApp, method: 'borrow', args: [amount] })
  .addAppCallMethodCall({ appId: interestApp, method: 'calculateRate', args: [duration] })
  .addAppCallMethodCall({ appId: collateralApp, method: 'lockCollateral', args: [asset] })
  .send()
```

### 2. Governance System with Delegation

```typescript
// - Level 1: Governance contract
// - Level 2: Voting power calculator
// - Level 3: Token registry

await algorand.newGroup()
  .addAppCallMethodCall({ appId: governanceApp, method: 'propose', args: [proposalId] })
  .addAppCallMethodCall({ appId: votingPowerApp, method: 'getVotingPower', args: [account] })
  .addAppCallMethodCall({ appId: tokenRegistryApp, method: 'getBalance', args: [account] })
  .send()
```

### 3. Cross-Contract Asset Exchange

```typescript
// - Level 1: Exchange interface
// - Level 2: Price oracle
// - Level 3: Liquidity pool

await algorand.newGroup()
  .addAppCallMethodCall({ appId: exchangeApp, method: 'swap', args: [assetIn, assetOut] })
  .addAppCallMethodCall({ appId: oracleApp, method: 'getPrice', args: [asset] })
  .addAppCallMethodCall({ appId: poolApp, method: 'provideLiquidity', args: [amount] })
  .send()
```

## Advanced Patterns

### Inner Transaction Budget

Each application has a limited budget for inner transactions:

```teal
#pragma version 10
// Enable inner transactions
// Budget: 256 inner transactions per group
```

**Best practices:**
- Plan your transaction depth carefully
- Consider budget consumption at each level
- Test with realistic call chains

### Foreign App References

When making cross-contract calls, include foreign app references:

```typescript
await algorand.newGroup()
  .addAppCallMethodCall({
    sender: account.addr,
    appId: level1AppId,
    method: initiateChainMethod,
    args: [value],
    appForeignReferences: [level2AppId, level3AppId], // Required for inner txns
  })
  .send()
```

### Error Handling in Chains

If any application in the chain fails, the entire transaction group reverts:

```typescript
try {
  await algorand.newGroup()
    .addAppCallMethodCall({ appId: level1AppId, ... })
    .addAppCallMethodCall({ appId: level2AppId, ... })  // Fails here
    .addAppCallMethodCall({ appId: level3AppId, ... })  // Never executes
    .send()
} catch (error) {
  console.error('Transaction group failed:', error)
  // All apps revert - atomicity preserved
}
```

## Best Practices

1. **Test Independently First**: Validate each application works correctly before composing
2. **Plan Call Depth**: Consider inner transaction budget limitations
3. **Handle Errors Gracefully**: Implement proper error handling at each level
4. **Use Transaction Groups**: Leverage atomicity for critical operations
5. **Document Call Chains**: Clearly document which apps call which others
6. **Monitor Gas/Budget**: Track computational costs across all layers
7. **Version Your Contracts**: Plan for upgrades in multi-contract systems

## Limitations and Considerations

### Transaction Group Limits

- Maximum 16 transactions per group
- Each transaction can have inner transactions
- Total computation budget is shared

### Call Depth

- Maximum depth depends on inner transaction budget
- Each level consumes budget
- Plan your architecture accordingly

### State Management

- Each app maintains its own state
- Coordinate state changes carefully
- Consider data consistency across contracts

## Troubleshooting

### "Transaction group failed"

**Problem**: One or more apps in the group failed

**Solution**: Test each app individually to identify the failing component

### "Insufficient budget"

**Problem**: Too many inner transactions or complex logic

**Solution**: Reduce call depth or simplify logic at each level

### "Foreign app reference not found"

**Problem**: Missing app reference when making inner transaction calls

**Solution**: Include all referenced apps in `appForeignReferences`

## Key Takeaways

1. **Multi-Layer Architecture**: Applications can be composed in layers for complex functionality
2. **Transaction Groups**: Provide atomicity across multiple app calls
3. **Inner Transactions**: Enable apps to call other apps programmatically
4. **Testing Strategy**: Test each layer independently before composition
5. **Budget Management**: Plan for computational costs across all layers
6. **Error Propagation**: Failures at any level revert the entire group

## Additional Resources

- [Algorand Inner Transactions](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/inner-transactions/)
- [Transaction Groups](https://developer.algorand.org/docs/get-details/atomic_transfers/)
- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [TEAL Specification](https://developer.algorand.org/docs/get-details/dapps/avm/teal/)

## Related Examples

- Example 135: Using Foreign References in Application Calls
- Example 136: Working with Nested ABI Tuples
- Example 138: Full App Lifecycle (Create, Update, Delete)

---

This example provides the foundation for building complex multi-contract systems on Algorand, demonstrating how to architect and compose applications across multiple layers.
