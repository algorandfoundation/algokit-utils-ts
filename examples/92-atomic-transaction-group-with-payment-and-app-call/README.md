# Atomic Transaction Group with Payment and Multiple App Calls

This example demonstrates creating an atomic transaction group that combines a payment transaction with **multiple** ABI method calls to a smart contract. This pattern is essential for complex operations requiring coordinated payment transfers with multiple smart contract state changes in a single atomic transaction.

## Key Concepts

- **Atomic Transaction Groups**: All transactions in the group succeed or all fail together
- **Multiple Method Calls**: Execute multiple smart contract methods in one atomic group
- **Return Values**: Access multiple return values from method calls
- **Payment + App Calls**: Coordinate ALGO transfers with state changes

## What This Example Shows

1. Creating and funding test accounts on LocalNet
2. Deploying a smart contract using the typed app factory
3. Building an atomic group with:
   - 1 payment transaction (Alice → Bob)
   - 2 ABI method calls to the same contract
4. Accessing multiple return values from method calls
5. Verifying balance changes and method results

## Code Walkthrough

### Account Setup

```typescript
const algorand = AlgorandClient.defaultLocalNet()
const dispenser = await algorand.account.localNetDispenser()

const alice = algorand.account.random()
await algorand.account.ensureFunded(alice, dispenser, (10).algos())

const bob = algorand.account.random()
await algorand.account.ensureFunded(bob, dispenser, (1).algos())
```

Create random accounts for testing and fund them using the LocalNet dispenser.

### Contract Deployment

```typescript
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

const appId = BigInt(createResult.appId)
```

Deploy the TestingApp contract using the typed app factory with template parameters.

### Balance Tracking

```typescript
const alicePreBalanceInfo = await algorand.account.getInformation(alice.addr)
const alicePreBalance = alicePreBalanceInfo.balance.microAlgo
```

**Important**: Use `accountInfo.balance.microAlgo` to access account balances. AlgoKit Utils returns `AccountInformation` type with `balance: AlgoAmount`, not the raw algosdk `Account` type.

### Building the Atomic Group

```typescript
const result = await algorand.newGroup()
  .addPayment({
    sender: alice.addr,
    receiver: bob.addr,
    amount: (0.05).algos(),  // 50,000 microAlgos
  })
  .addAppCallMethodCall({
    sender: alice.addr,
    appId,
    method: appClient.appClient.getABIMethod('call_abi')!,
    args: ['first call'],
    signer: alice,
  })
  .addAppCallMethodCall({
    sender: alice.addr,
    appId,
    method: appClient.appClient.getABIMethod('call_abi')!,
    args: ['second call'],
    signer: alice,
  })
  .send()
```

This creates a group with 3 transactions that execute atomically:
1. Payment: Alice sends 50,000 microAlgos to Bob
2. First app call: Executes `call_abi("first call")`
3. Second app call: Executes `call_abi("second call")`

### Accessing Multiple Return Values

```typescript
const firstCallResult = result.returns?.[0]?.returnValue?.valueOf()
const secondCallResult = result.returns?.[1]?.returnValue?.valueOf()
```

**Important**: The `returns` array contains only method call results, not all transactions:
- `returns[0]` = First method call result (transaction index 1)
- `returns[1]` = Second method call result (transaction index 2)
- The payment transaction (index 0) is not included in the returns array

## API Patterns (AlgoKit Utils v9.1.2)

### Account Operations
```typescript
// Create random account
const account = algorand.account.random()

// Fund account
await algorand.account.ensureFunded(account, dispenser, (10).algos())

// Get account info
const accountInfo = await algorand.account.getInformation(account.addr)
const balance = accountInfo.balance.microAlgo  // NOT .amount
```

### Typed App Factory
```typescript
const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
  defaultSender: sender.addr,
})

const { appClient, result } = await appFactory.send.create.bare({
  deployTimeParams: { TMPL_UPDATABLE: 1, TMPL_DELETABLE: 1, TMPL_VALUE: 123 },
})
```

### Atomic Group Builder
```typescript
const result = await algorand.newGroup()
  .addPayment({ sender, receiver, amount })
  .addAppCallMethodCall({ sender, appId, method, args, signer })
  .addAppCallMethodCall({ sender, appId, method, args, signer })
  .send()
```

### Method Call Parameters
```typescript
{
  sender: alice.addr,           // Transaction sender
  appId: BigInt(123),           // Application ID
  method: appClient.appClient.getABIMethod('call_abi')!,  // ABI method
  args: ['first call'],         // Method arguments
  signer: alice,                // Transaction signer
}
```

## Common Use Cases

### DeFi Operations
Combine payment with multiple state updates:
```typescript
await algorand.newGroup()
  .addPayment({ /* deposit funds */ })
  .addAppCallMethodCall({ /* update liquidity pool */ })
  .addAppCallMethodCall({ /* mint LP tokens */ })
  .send()
```

### Multi-Contract Interactions
Coordinate calls across multiple contracts:
```typescript
await algorand.newGroup()
  .addAppCallMethodCall({ appId: contractA, method: 'prepare' })
  .addAppCallMethodCall({ appId: contractB, method: 'execute' })
  .addAppCallMethodCall({ appId: contractA, method: 'finalize' })
  .send()
```

### Asset Operations with State Updates
Combine asset transfers with contract calls:
```typescript
await algorand.newGroup()
  .addAssetTransfer({ /* transfer asset */ })
  .addAppCallMethodCall({ /* update contract state */ })
  .addAppCallMethodCall({ /* emit event */ })
  .send()
```

## Important Considerations

### Transaction Limits
- Maximum 16 transactions per atomic group
- Each transaction has individual fee and size limits
- Plan your group composition accordingly

### Transaction Ordering
- Transactions execute in the order added to the group
- Order matters for dependent operations
- Payment must occur before contract can access funds

### Signer Requirements
- Each transaction needs an explicit signer
- Must provide the `signer` parameter for method calls
- All signers must authorize before sending

### Return Value Indexing
- `returns` array only includes method call results
- Payments, asset transfers, etc. are not included
- Index maps to method call position, not transaction position

### Error Handling
- If any transaction fails, the entire group fails
- No partial execution - atomic all-or-nothing guarantee
- Check all preconditions before submitting group

## Expected Output

```
Setting up accounts...
Alice: 63CSZGUXJWMHXC7T4YGYBMZEJE7ZU6UC22PZNW4E2UL2ONLLLODKUJDCXQ
Bob: LJ2NM6AVDE6K33QNKZPI2LCBQXIRYPXUQBCRWA66DUNKRDYAR6A7BWMTLE

Contract deployed with App ID: 1379

Balances before transaction:
Alice: 10099000 microAlgos
Bob: 1100000 microAlgos

Building atomic transaction group...
1. Payment: Alice → Bob (50000 microAlgos)
2. App call: call_abi("first call")
3. App call: call_abi("second call")

✓ Atomic transaction group executed successfully!
Transaction IDs: P6XNQOLXICWCNEKWOGQEH7OU4QWIVXBDVWI4FSJ3LM7VVX7S66FA, H3DYMPTTRNL37R3TKXTJCQQTMYOT7I4OM5KSNCXUB4KISG6NWKCA, 4NLQHYDVHK2MYWBWU5BW7U63O2ONQHSR23KVIKR6EM4FXQKH6H2A
Group ID: FcIfh/lWliVT5ctSBvoR+TvANhu3hnROHc7swue/9fc=

Balances after transaction:
Alice: 10046000 microAlgos (spent 53000 microAlgos including fees)
Bob: 1150000 microAlgos (received 50000 microAlgos)

First method call result: "Hello, first call"
Second method call result: "Hello, second call"

✓ All three transactions executed atomically!
  - Payment transferred 50000 microAlgos from Alice to Bob
  - First app method returned expected value
  - Second app method returned expected value
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
2. Deploy the TestingApp contract
3. Execute the atomic transaction group
4. Display all transaction results and return values

## Differences from Example 91

- **Example 91**: 1 payment + 1 method call
- **Example 92**: 1 payment + 2 method calls
- Shows how to access multiple return values
- Demonstrates coordinating multiple state changes atomically
- More complex group composition pattern

## Learn More

- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [Algorand Atomic Transfers](https://developer.algorand.org/docs/get-details/atomic_transfers/)
- [ABI Method Calls](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/ABI/)
