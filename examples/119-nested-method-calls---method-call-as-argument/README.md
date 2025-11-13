# Nested Method Calls - Method Call as Argument

Demonstrates how to compose method calls where one method accepts another method call as an argument, enabling complex interaction patterns and ABI composability.

## Example Details

```json
{
  "example_id": "119-nested-method-calls---method-call-as-argument",
  "title": "Nested Method Calls - Method Call as Argument",
  "summary": "Demonstrates how to compose method calls where one method accepts another method call as an argument, enabling complex interaction patterns and ABI composability.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "transaction management",
  "specific_use_case": "Call a smart contract method that takes another method call as an argument",
  "target_users": [
    "Smart contract developers",
    "dApp developers"
  ],
  "features_tested": [
    "algorand.newGroup.addAppCallMethodCall",
    "method call arguments",
    "nested method calls",
    "ABI composability"
  ],
  "feature_tags": [
    "nested-method-calls",
    "method-composition",
    "abi-composability",
    "advanced",
    "smart-contracts",
    "transaction-groups"
  ],
  "folder": "119-nested-method-calls---method-call-as-argument",
  "prerequisites": {
    "tools": [
      "algokit",
      "docker"
    ],
    "libraries": [
      "@algorandfoundation/algokit-utils",
      "algosdk"
    ],
    "environment": [
      {
        "name": "ALGOD_SERVER",
        "required": false,
        "example": "http://localhost"
      },
      {
        "name": "ALGOD_PORT",
        "required": false,
        "example": "4001"
      },
      {
        "name": "ALGOD_TOKEN",
        "required": false,
        "example": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      }
    ]
  },
  "run_instructions": {
    "setup": [
      "Start LocalNet: algokit localnet start"
    ],
    "install": [
      "npm install @algorandfoundation/algokit-utils algosdk"
    ],
    "execute": [
      "npx tsx main.ts"
    ]
  },
  "expected_output": [
    "Nested method call executed successfully",
    "Return value from inner helloWorld call showing 'Hello, World!'",
    "Return value from outer methodArg call showing the app ID",
    "Confirmation that method composition worked correctly"
  ],
  "source_tests": [
    {
      "file": "src/types/algorand-client.spec.ts",
      "test_name": "method with method call arg"
    }
  ],
  "artifacts_plan": [
    {
      "target_file": "contract.py",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "Contract with helloWorld and methodArg methods demonstrating method composition"
    }
  ],
  "notes": "This example showcases advanced ABI composability where methods can call other methods. This is particularly useful for DeFi protocols, multi-contract interactions, and building modular smart contract architectures.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundation/algokit-utils'\nimport { AppCallMethodCall } from '@algorandfoundation/algokit-utils/types/composer'\nimport algosdk from 'algosdk'\n\n/**\n * This example demonstrates how to compose method calls where one method accepts\n * another method call as an argument. This enables powerful composability patterns\n * in smart contract interactions.\n */\n\nasync function nestedMethodCallExample() {\n  // Initialize AlgorandClient - connects to your Algorand node\n  const algorand = AlgorandClient.defaultLocalNet()\n\n  // Get account from LocalNet\n  const alice = (await algorand.account.localNetDispenser()).account\n\n  // Deploy or reference your application\n  const appId = 1234 // Replace with your actual app ID\n\n  // Define ABI methods\n  // In a real scenario, you'd import these from your contract's ABI JSON\n  const helloWorldMethod = new algosdk.ABIMethod({\n    name: 'helloWorld',\n    args: [],\n    returns: { type: 'string', desc: 'Returns a greeting message' },\n  })\n\n  const methodArgMethod = new algosdk.ABIMethod({\n    name: 'methodArg',\n    args: [{ type: 'appl', name: 'innerCall', desc: 'An inner application call to execute' }],\n    returns: { type: 'uint64', desc: 'Returns the app ID of the inner call' },\n  })\n\n  console.log('Creating a method call that takes another method call as an argument...')\n\n  // Define the inner method call that will be used as an argument\n  // This call will be executed as part of the outer method\n  const helloWorldCall: AppCallMethodCall = {\n    sender: alice.addr,\n    appId: appId,\n    method: helloWorldMethod,\n  }\n\n  console.log('\\nInner method call: helloWorld()')\n  console.log('Outer method call: methodArg(helloWorldCall)')\n\n  // Create a transaction group with a method that accepts another method call as an argument\n  const methodArgResult = await algorand\n    .newGroup()\n    .addAppCallMethodCall({\n      sender: alice.addr,\n      appId: appId,\n      method: methodArgMethod,\n      // Pass the helloWorld method call as an argument\n      args: [helloWorldCall],\n    })\n    .send()\n\n  console.log('\\nNested method call executed successfully!')\n  console.log(`Transaction ID: ${methodArgResult.txIds[0]}`)\n\n  // Process return values\n  // The first return value is from the inner helloWorld call\n  // The second return value is from the outer methodArg call\n  if (methodArgResult.returns && methodArgResult.returns.length > 0) {\n    console.log('\\nReturn values:')\n\n    // Return value from the inner helloWorld call\n    const innerReturnValue = methodArgResult.returns[0].returnValue?.valueOf()\n    console.log(`Inner call (helloWorld) returned: ${innerReturnValue}`)\n\n    // Return value from the outer methodArg call\n    if (methodArgResult.returns.length > 1) {\n      const outerReturnValue = methodArgResult.returns[1].returnValue?.valueOf()\n      console.log(`Outer call (methodArg) returned: ${outerReturnValue}`)\n      console.log(`Expected app ID: ${appId}`)\n      console.log(`Match: ${outerReturnValue === BigInt(appId)}`)\n    }\n  }\n\n  console.log('\\nKey takeaways:')\n  console.log('- Methods can accept other method calls as arguments')\n  console.log('- This enables powerful composability and modularity in smart contracts')\n  console.log('- Inner method calls are executed as part of the outer method')\n  console.log('- Both inner and outer methods can return values')\n  console.log('- Use cases: DeFi protocols, multi-step workflows, contract orchestration')\n  console.log('\\nCommon patterns:')\n  console.log('- Oracle data fetching followed by processing')\n  console.log('- Multi-contract interactions in DeFi')\n  console.log('- Modular contract architectures')\n}\n\n// Run the example\nnestedMethodCallExample().catch(console.error)\n"
}
```
