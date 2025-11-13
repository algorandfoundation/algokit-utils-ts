# ABI Methods with Default Arguments

This example demonstrates how to call ABI methods that have default argument values, allowing you to omit optional parameters and simplify your smart contract interactions.

## What This Example Shows

This example teaches you how to:
- Call an ABI method with an explicit argument value
- Call the same method using `undefined` to trigger the default value
- Configure default arguments in your smart contract's application spec
- Use AlgoKit Utils to automatically handle default argument resolution

## Why This Matters

Default arguments in ABI methods provide several benefits:

1. **Cleaner API**: Developers can omit commonly-used values, making method calls more concise
2. **Better UX**: Users don't need to know or provide values that rarely change
3. **Reduced Complexity**: Fewer arguments mean simpler transaction construction
4. **Flexibility**: You can still override defaults when needed

Common use cases include:
- Configuration values that rarely change (e.g., fee percentages, rate limits)
- Fallback values for optional features
- Default settings for user preferences

## How It Works

The smart contract includes a method `default_value(string)string` with a default argument configured in the application spec:

```json
"default_value(string)string": {
  "default_arguments": {
    "arg_with_default": {
      "source": "constant",
      "data": "default value"
    }
  }
}
```

When you call this method:
- **With an argument**: The method receives and returns your provided value
- **With `undefined`**: AlgoKit Utils automatically uses the default value from the spec

## Prerequisites

- AlgoKit installed
- Docker installed (for LocalNet)
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
--- ABI Methods with Default Arguments Example ---

Deploying the application...
Application deployed with ID: [app-id]

1. Calling method with explicit argument:
   Input: "defined value"
   Output: defined value

2. Calling method without explicit argument (using default):
   Input: undefined (will use default value)
   Output: default value
```

## Key Takeaways

- Pass `undefined` as an argument to use the default value configured in the smart contract
- Default values are defined in the `hints.default_arguments` section of your application spec
- The default value source can be `"constant"`, `"abi-method"`, `"global-state"`, or `"local-state"`
- This example uses `"constant"`, the simplest type of default value
