# ARC-56 Error Handling in Smart Contract Applications

This example demonstrates comprehensive error handling patterns in Algorand smart contracts, focusing on TEAL error handling techniques, input validation, and best practices for building robust applications.

## Overview

ARC-56 is the Algorand Application Specification standard that defines how to document contract interfaces, including error conditions. This example shows three fundamental error handling patterns:

1. **Basic error handling** with division by zero detection using the `err` opcode
2. **Input validation** using `assert` statements for bounds checking
3. **State management with validation** including balance tracking and withdrawal limits

## What You'll Learn

- How to use TEAL error opcodes (`err`, `assert`) to handle invalid inputs
- Stack manipulation techniques for complex validation logic
- Common validation patterns for amounts, addresses, and balances
- How to catch and handle errors in TypeScript when calling smart contracts
- Best practices for implementing safe arithmetic operations

## Key Concepts

### TEAL Error Handling Opcodes

**1. `err` - Immediate Failure**
```teal
division_by_zero:
err  // Transaction fails immediately
```
The `err` opcode immediately causes the transaction to fail. This is useful for critical errors where no recovery is possible.

**2. `assert` - Conditional Failure**
```teal
// Check amount > 0
dup
int 0
>
assert  // Fails if top stack value is 0
```
The `assert` opcode fails the transaction if the top stack value is 0 (false). It's ideal for input validation.

**3. `bnz/bz` - Conditional Branching**
```teal
// Check for division by zero
dup
int 0
==
bnz division_by_zero  // Branch to error handler if zero
```
Branch opcodes can be used to jump to error handling code based on conditions.

## Example Walkthrough

### Example 1: Basic Error Handling with Division

This example implements a `divide(numerator, denominator)` method that:
- Accepts two uint64 values
- Returns the division result
- Fails with `err` if denominator is zero

**TEAL Implementation:**
```teal
method_divide:
// Get arguments
txna ApplicationArgs 1
btoi  // numerator

txna ApplicationArgs 2
btoi  // denominator

// Check for division by zero
dup
int 0
==
bnz division_by_zero

// Perform division (numerator / denominator)
/

// Return the result
itob
byte 0x151f7c75  // ABI return prefix
swap
concat
log

int 1
return

division_by_zero:
// Error: division by zero
err  // This causes transaction to fail
```

**TypeScript Usage:**
```typescript
// Successful division
const result = await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: deployer.addr,
    appId: basicAppId,
    method: divideMethod,
    args: [10n, 2n],  // 10 / 2 = 5
  })
  .send()

console.log('Result:', result.returns[0].returnValue)  // Output: 5n

// Division by zero (will throw error)
try {
  await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId: basicAppId,
      method: divideMethod,
      args: [10n, 0n],  // This will fail
    })
    .send()
} catch (error) {
  console.log('Error caught:', error.message)
  // The TEAL "err" instruction caused the transaction to fail
}
```

### Example 2: Input Validation with Assert

This example implements a `transfer_tokens(amount, receiver)` method with validation rules:
- Amount must be > 0
- Amount must be <= 1,000,000 (max transfer)
- Receiver must be a valid 32-byte address

**TEAL Implementation:**
```teal
method_transfer_tokens:
// Get amount
txna ApplicationArgs 1
btoi

// Validate: amount > 0
dup
int 0
>
assert  // Fails if amount <= 0

// Validate: amount <= 1000000
dup
int 1000000
<=
assert  // Fails if amount > 1000000

// Get receiver address
txna ApplicationArgs 2
len
int 32
==
assert  // Receiver must be 32 bytes (valid address)

// All validations passed
int 1
return
```

**TypeScript Usage:**
```typescript
// Test invalid amount (zero)
try {
  await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId: validationAppId,
      method: transferMethod,
      args: [0n, deployer.addr],  // Invalid: amount = 0
    })
    .send()
} catch (error) {
  console.log('Validation error: Amount must be > 0')
}

// Test amount too large
try {
  await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId: validationAppId,
      method: transferMethod,
      args: [2000000n, deployer.addr],  // Invalid: exceeds max
    })
    .send()
} catch (error) {
  console.log('Validation error: Amount exceeds maximum (1,000,000)')
}
```

### Example 3: State Management with Balance Tracking

This example implements a `withdraw(amount)` method with:
- Initial balance of 1000 tokens stored in global state
- Validation that amount > 0
- Check for sufficient balance before withdrawal
- Balance update after successful withdrawal

**TEAL Implementation:**
```teal
create:
// Initialize state
byte "balance"
int 1000
app_global_put

int 1
return

method_withdraw:
// Get requested amount
txna ApplicationArgs 1
btoi

// Check amount > 0
dup
int 0
>
assert  // "Amount must be greater than zero"

// Get current balance
byte "balance"
app_global_get

// Stack is now: [amount, balance]
// Check sufficient balance: amount <= balance
dig 1      // Stack: [amount, balance, amount]
swap       // Stack: [amount, amount, balance]
<=         // Stack: [amount, (amount <= balance)]
assert     // "Insufficient balance"

// Calculate new balance: balance - amount
byte "balance"
app_global_get
swap
-

// Update balance
byte "balance"
swap
app_global_put

// Return withdrawn amount
txna ApplicationArgs 1
byte 0x151f7c75
swap
concat
log

int 1
return
```

**TypeScript Usage:**
```typescript
// Successful withdrawal
const result = await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: deployer.addr,
    appId: errorMsgAppId,
    method: withdrawMethod,
    args: [300n],  // Withdraw 300 from 1000 balance
  })
  .send()

console.log('Withdrawn:', result.returns[0].returnValue)  // Output: 300n
// New balance: 700 tokens

// Insufficient balance
try {
  await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId: errorMsgAppId,
      method: withdrawMethod,
      args: [800n],  // Trying to withdraw 800 from 700 balance
    })
    .send()
} catch (error) {
  console.log('Error: Insufficient balance (only 700 remaining)')
}

// Invalid amount
try {
  await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId: errorMsgAppId,
      method: withdrawMethod,
      args: [0n],  // Invalid: amount = 0
    })
    .send()
} catch (error) {
  console.log('Error: Amount must be greater than zero')
}
```

## Stack Manipulation Techniques

Understanding TEAL stack operations is crucial for implementing validation logic:

### Stack Operations Used in Examples

**`dup`** - Duplicate top stack item
```teal
int 10      // Stack: [10]
dup         // Stack: [10, 10]
```

**`dig N`** - Copy item from N positions down
```teal
int 5       // Stack: [5]
int 10      // Stack: [5, 10]
dig 1       // Stack: [5, 10, 5]
```

**`swap`** - Swap top two items
```teal
int 5       // Stack: [5]
int 10      // Stack: [5, 10]
swap        // Stack: [10, 5]
```

**`pop`** - Remove top item
```teal
int 10      // Stack: [10]
pop         // Stack: []
```

### Example: Balance Validation Logic

```teal
// Stack: [amount, balance]
// Goal: Check if amount <= balance

dig 1      // Stack: [amount, balance, amount]
swap       // Stack: [amount, amount, balance]
<=         // Stack: [amount, (amount <= balance)]
assert     // Verify condition is true
```

This sequence:
1. Duplicates `amount` from position 1
2. Swaps to get `balance` on top
3. Compares: `amount <= balance`
4. Asserts the result is true (1)

## Common Validation Patterns

### Amount Validation
```teal
// amount > 0
dup
int 0
>
assert

// amount <= max_value
dup
int 1000000
<=
assert
```

### Address Validation
```teal
// Check address length (32 bytes)
txna ApplicationArgs 2
len
int 32
==
assert
```

### Balance Checking
```teal
// Ensure sufficient balance
byte "balance"
app_global_get
txna ApplicationArgs 1
btoi
>=
assert
```

### Division Safety
```teal
// Check denominator != 0
dup
int 0
==
bnz division_error
```

## Best Practices

1. **Validate Early**: Check all inputs at the start of your method before performing operations
2. **Use Assert for Clarity**: `assert` makes validation logic easier to read and maintain
3. **Check Bounds**: Always validate that amounts are within acceptable ranges
4. **Safe Arithmetic**: Check for division by zero and potential overflows
5. **Address Validation**: Verify addresses are not zero and have correct length
6. **Balance Checks**: Confirm sufficient balance before transfers
7. **Document Errors**: Use ARC-56 specification to document expected error conditions

## Error Handling Summary

| Technique | Use Case | Example |
|-----------|----------|---------|
| `err` | Critical failures | Division by zero |
| `assert` | Input validation | Amount bounds checking |
| `bnz/bz` | Conditional branching | Jump to error handler |
| Stack manipulation | Complex validation | Balance >= amount |
| State checks | Resource validation | Sufficient balance |

## Running the Example

### Prerequisites
- AlgoKit installed
- Docker running (for LocalNet)
- Node.js and npm

### Setup
```bash
# Start LocalNet
algokit localnet start

# Install dependencies
npm install
```

### Run
```bash
npm start
```

### Expected Output
```
=== ARC-56 Error Handling in Smart Contract Applications ===

=== Example 1: Basic Error Handling ===
✅ App deployed with ID: 1001
Testing successful division: 10 / 2
✅ Division successful! Result: 5n
Testing division by zero: 10 / 0
✅ Error caught as expected!

=== Example 2: Input Validation with Assert ===
✅ App deployed with ID: 1002
Test 2: Invalid amount (0 tokens)
✅ Validation error caught!
Test 3: Amount too large (2,000,000 tokens)
✅ Validation error caught!

=== Example 3: Error Messages in ABI Methods ===
✅ App deployed with ID: 1003
   Initial balance: 1000 tokens
Test 1: Withdraw 300 tokens
✅ Withdrawal successful! Withdrawn: 300n
   New balance: 700 tokens
Test 2: Withdraw 800 tokens (exceeds balance)
✅ Error caught!
Test 3: Withdraw 0 tokens
✅ Error caught!

✨ Example completed successfully!
```

## Key Takeaways

- **TEAL provides multiple error handling mechanisms**: `err`, `assert`, and conditional branching
- **Input validation is critical**: Always validate amounts, addresses, and other inputs
- **Stack manipulation enables complex logic**: Use `dig`, `swap`, `dup` for validation patterns
- **State management requires careful validation**: Check balances before updates
- **TypeScript integration**: Errors from TEAL are caught as exceptions in JavaScript
- **ARC-56 documentation**: Document error conditions for better developer experience

## Additional Resources

- [ARC-56 Specification](https://arc.algorand.foundation/ARCs/arc-0056)
- [TEAL Opcodes Reference](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/)
- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [Algorand Smart Contract Guidelines](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/guidelines/)

## Related Examples

- Example 122: Raw application calls with manual argument encoding
- Example 135: Using foreign references in application calls
- Example 136: Working with nested ABI tuples

---

This example demonstrates production-ready error handling patterns that you should implement in your own Algorand smart contracts to ensure security and reliability.
