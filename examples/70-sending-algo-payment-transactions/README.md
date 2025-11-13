# Sending ALGO Payment Transactions

Demonstrates sending ALGO payment transactions and verifying transaction details and recipient balance.

## What This Example Shows

1. **Account Setup** - Creating and funding test accounts
2. **Payment Transaction** - Sending 5 ALGO between accounts
3. **Transaction Confirmation** - Getting confirmation details
4. **Transaction ID** - Retrieving the unique transaction identifier
5. **Balance Verification** - Checking recipient balance after payment
6. **Account Information** - Retrieving account details including min balance
7. **Amount Display** - Converting between microAlgo and ALGO units

## Why This Matters

Sending and verifying payments is essential for:
- **Value Transfer**: Moving ALGO between accounts
- **Transaction Tracking**: Monitoring payment status
- **Balance Management**: Ensuring correct amounts transferred
- **Verification**: Confirming transactions completed successfully
- **Account Funding**: Initializing accounts with minimum balance
- **Financial Applications**: Building payment systems on Algorand

## How It Works

### 1. Setup Accounts

```typescript
const algorand = AlgorandClient.defaultLocalNet()

// Get dispenser and create test account
const dispenser = await algorand.account.localNetDispenser()
const testAccount = await algorand.account.random()

// Fund test account
await algorand.send.payment({
  sender: dispenser.addr,
  receiver: testAccount.addr,
  amount: algo(10),
})

// Create receiver account
const secondAccount = await algorand.account.random()
```

**Why**: Set up funded sender and unfunded receiver accounts for testing.

### 2. Send Payment

```typescript
const result = await algorand.send.payment({
  sender: testAccount.addr,
  receiver: secondAccount.addr,
  amount: algo(5), // Send 5 ALGO
  note: 'Transfer 5 Algos',
})

console.log(`Transaction ID: ${result.transaction.txID()}`)
console.log(`Confirmed in round: ${result.confirmation.confirmedRound}`)
```

**Key Points**:
- Use `algo(5)` helper for 5 ALGO (5,000,000 microAlgo)
- Optional `note` field for transaction metadata
- Transaction automatically includes 1000 microAlgo fee

### 3. Verify Transaction

```typescript
// Get account information
const accountInfo = await algorand.account.getInformation(secondAccount.addr)

console.log(`Balance: ${accountInfo.balance} microAlgos`)
console.log(`Balance: ${Number(accountInfo.balance) / 1_000_000} Algos`)

// Verify expected balance
if (Number(accountInfo.balance) === 5_000_000) {
  console.log('✓ Payment verified!')
}
```

**Why**: Confirmation that the exact amount was transferred.

## Prerequisites

- AlgoKit installed
- Docker Desktop (for LocalNet)
- Node.js and npm

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
Account Information:
  Sender: CRE54TOJYTRO72DIMWNYH4CH5YOHD65X5QYC5YGOYVRUVHXTWQKLHE4RWU
  Receiver: 5ZD2CVOY35XGMZMOESVTAJE6Z3HXNG43YHBZAJVH6HYUJOE4PTCONAMZUU

Sending 5 Algos...

✓ Payment transaction sent successfully!
  Transaction ID: DG5BA7RBORVWRJ5ZFPG2GFAA5CGNXGYCD3IFWCVQTS3HCFX43GHQ
  Confirmed in round: 152

Transaction Details:
  Amount: 5000000 microAlgos (5 Algos)
  Sender: CRE54TOJYTRO72DIMWNYH4CH5YOHD65X5QYC5YGOYVRUVHXTWQKLHE4RWU
  Receiver: 5ZD2CVOY35XGMZMOESVTAJE6Z3HXNG43YHBZAJVH6HYUJOE4PTCONAMZUU

Verifying receiver balance...

Receiver Account Information:
  Address: 5ZD2CVOY35XGMZMOESVTAJE6Z3HXNG43YHBZAJVH6HYUJOE4PTCONAMZUU
  Balance: 5,000,000 microAlgos (5 Algos)
  Min Balance: 100,000 microAlgos

✓ Payment verified! Receiver has the correct balance.
✓ Payment transaction example completed!
✅ Example completed successfully
```

## Key Concepts

### Payment Transaction Structure

```typescript
await algorand.send.payment({
  sender: senderAddress,      // Who sends the ALGO
  receiver: receiverAddress,  // Who receives the ALGO
  amount: algo(5),            // Amount to send
  note: 'Optional message',   // Optional transaction note
})
```

### Transaction Result

The result object contains:
```typescript
{
  transaction: {
    txID(): string // Unique transaction ID
  },
  confirmation: {
    confirmedRound: number // Block number where confirmed
  }
}
```

### Account Information

```typescript
const accountInfo = await algorand.account.getInformation(address)

// Available properties:
accountInfo.address      // Account address
accountInfo.balance      // Current balance in microAlgo (bigint)
accountInfo['min-balance'] // Minimum balance requirement
```

### Amount Conversion

```
1 ALGO = 1,000,000 microAlgo
5 ALGO = 5,000,000 microAlgo
0.001 ALGO = 1,000 microAlgo (typical fee)
```

**Helper function**:
```typescript
import { algo } from '@algorandfoundation/algokit-utils'

algo(5)           // Creates 5 ALGO = 5,000,000 microAlgo
algo(5).microAlgo // Access microAlgo value: 5000000
```

## Common Patterns

### 1. Send with Custom Note

```typescript
await algorand.send.payment({
  sender: alice.addr,
  receiver: bob.addr,
  amount: algo(10),
  note: 'Invoice #12345 payment',
})
```

### 2. Send Multiple Payments

```typescript
const recipients = [
  { address: bob.addr.toString(), amount: 5 },
  { address: charlie.addr.toString(), amount: 3 },
  { address: dave.addr.toString(), amount: 2 },
]

for (const recipient of recipients) {
  const result = await algorand.send.payment({
    sender: alice.addr,
    receiver: recipient.address,
    amount: algo(recipient.amount),
  })
  console.log(`✓ Sent ${recipient.amount} ALGO to ${recipient.address}`)
  console.log(`  Transaction: ${result.transaction.txID()}`)
}
```

### 3. Verify Payment Before Sending

```typescript
async function sendWithVerification(
  algorand: AlgorandClient,
  sender: Account,
  receiver: string,
  amount: number // in ALGO
) {
  // Check sender balance
  const senderInfo = await algorand.account.getInformation(sender.addr)
  const required = amount * 1_000_000 + 1000 // amount + fee
  
  if (Number(senderInfo.balance) < required) {
    throw new Error('Insufficient balance')
  }

  // Send payment
  const result = await algorand.send.payment({
    sender: sender.addr,
    receiver,
    amount: algo(amount),
  })

  // Verify receiver balance
  const receiverInfo = await algorand.account.getInformation(receiver)
  console.log(`Receiver balance: ${Number(receiverInfo.balance) / 1_000_000} ALGO`)

  return result
}
```

### 4. Track Transaction Status

```typescript
const result = await algorand.send.payment({
  sender: alice.addr,
  receiver: bob.addr,
  amount: algo(5),
})

console.log('Transaction Details:')
console.log(`  ID: ${result.transaction.txID()}`)
console.log(`  Round: ${result.confirmation.confirmedRound}`)
console.log(`  Sender: ${alice.addr.toString()}`)
console.log(`  Receiver: ${bob.addr.toString()}`)
console.log(`  Amount: 5 ALGO`)
```

## Best Practices

### 1. Always Use algo() Helper

**Good**:
```typescript
await algorand.send.payment({
  sender: alice.addr,
  receiver: bob.addr,
  amount: algo(5), // Clear and readable
})
```

**Avoid**:
```typescript
await algorand.send.payment({
  sender: alice.addr,
  receiver: bob.addr,
  amount: 5000000, // What unit? Unclear
})
```

### 2. Verify Balances After Large Transfers

**Good**:
```typescript
const result = await algorand.send.payment({
  sender: alice.addr,
  receiver: bob.addr,
  amount: algo(1000),
})

// Verify the transfer
const receiverInfo = await algorand.account.getInformation(bob.addr)
const expected = 1000 * 1_000_000
if (Number(receiverInfo.balance) >= expected) {
  console.log('✓ Large transfer verified')
}
```

**Avoid**:
```typescript
// Large transfer without verification
await algorand.send.payment({
  sender: alice.addr,
  receiver: bob.addr,
  amount: algo(1000),
})
// No confirmation it succeeded
```

### 3. Handle Transaction Errors

**Good**:
```typescript
try {
  const result = await algorand.send.payment({
    sender: alice.addr,
    receiver: bob.addr,
    amount: algo(5),
  })
  console.log(`✓ Sent: ${result.transaction.txID()}`)
} catch (error) {
  if (error.message.includes('overspend')) {
    console.error('Error: Insufficient balance')
  } else if (error.message.includes('below min')) {
    console.error('Error: Would violate minimum balance')
  } else {
    console.error('Error:', error.message)
  }
}
```

**Avoid**:
```typescript
// No error handling
const result = await algorand.send.payment({
  sender: alice.addr,
  receiver: bob.addr,
  amount: algo(5),
})
```

### 4. Add Meaningful Notes

**Good**:
```typescript
await algorand.send.payment({
  sender: alice.addr,
  receiver: bob.addr,
  amount: algo(5),
  note: 'Payment for services rendered - Invoice #12345',
})
```

**Avoid**:
```typescript
await algorand.send.payment({
  sender: alice.addr,
  receiver: bob.addr,
  amount: algo(5),
  // No note - harder to track purpose
})
```

## Minimum Balance Requirements

Every Algorand account must maintain a minimum balance:
- **Base minimum**: 100,000 microAlgo (0.1 ALGO)
- **Per asset**: +100,000 microAlgo for each asset opted in
- **Per app**: +100,000 microAlgo for each app opted into

**Example**:
```
New account (no assets/apps): 100,000 microAlgo
Account with 2 assets: 300,000 microAlgo
Account with 1 app: 200,000 microAlgo
```

**Check minimum balance**:
```typescript
const accountInfo = await algorand.account.getInformation(address)
const minBalance = accountInfo['min-balance'] || 100000
console.log(`Minimum required: ${minBalance} microAlgo`)
```

## Key Takeaways

1. **Use `algo()` helper** for clear amount specifications
2. **Transaction ID** uniquely identifies each transaction
3. **Sender pays 1000 microAlgo fee** automatically
4. **Receiver gets exact amount** specified (not reduced by fee)
5. **Verify balances** after important transfers
6. **Account minimum** is 100,000 microAlgo (0.1 ALGO)
7. **Add notes** to payments for better tracking
8. **Handle errors** gracefully for production code

