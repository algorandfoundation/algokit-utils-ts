# Retrieve and Decode Application State (Global, Local, and Box Storage)

Demonstrates how to retrieve and decode all types of application state including global state, local state (account-specific), and box storage. Shows how to work with different data types (integers, strings, raw bytes) and decode box values using ABI types.

## Example Details

```json
{
  "example_id": "145-retrieve-and-decode-application-state-global-local-and-box-storage",
  "title": "Retrieve and Decode Application State (Global, Local, and Box Storage)",
  "summary": "Demonstrates how to retrieve and decode all types of application state including global state, local state (account-specific), and box storage. Shows how to work with different data types (integers, strings, raw bytes) and decode box values using ABI types.",
  "language": "typescript",
  "complexity": "complex",
  "example_potential": "high",
  "use_case_category": "state management",
  "specific_use_case": "Retrieve and decode global state, local state, and box storage values",
  "target_users": [
    "SDK developers",
    "Smart contract developers"
  ],
  "features_tested": [
    "client.getGlobalState",
    "client.getLocalState",
    "client.getBoxValues",
    "client.getBoxValue",
    "client.getBoxValuesFromABIType",
    "client.getBoxValueFromABIType"
  ],
  "feature_tags": [
    "state-management",
    "global-state",
    "local-state",
    "box-storage",
    "abi-decoding",
    "app-client",
    "typed-client"
  ],
  "folder": "145-retrieve-and-decode-application-state-global-local-and-box-storage",
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
      "Start LocalNet using 'algokit localnet start'",
      "Ensure you have a deployed smart contract with state methods (set_global, set_local, set_box, opt_in)"
    ],
    "install": [
      "npm install"
    ],
    "execute": [
      "npm run start"
    ]
  },
  "expected_output": [
    "Global state values (int1, int2, bytes1, bytes2) displayed",
    "Local state values (local_int1, local_int2, local_bytes1, local_bytes2) displayed",
    "Box storage values retrieved and decoded",
    "ABI-typed box values decoded and displayed"
  ],
  "source_tests": [
    {
      "file": "src/types/app-client.spec.ts",
      "test_name": "Retrieve state"
    }
  ],
  "artifacts_plan": [
    {
      "target_file": "state_contract.py",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "Sample smart contract with global, local, and box state methods"
    }
  ],
  "notes": "This example requires a smart contract with methods: set_global, set_local, set_box, and opt_in. The contract should support global state (int1, int2, bytes1, bytes2), local state (local_int1, local_int2, local_bytes1, local_bytes2), and box storage.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundation/algokit-utils'\nimport { ABIUintType } from 'algosdk'\nimport * as algokit from '@algorandfoundation/algokit-utils'\n\n/**\n * This example demonstrates how to retrieve and decode different types of\n * application state: global state, local state, and box storage.\n * \n * Prerequisites:\n * - AlgoKit installed and LocalNet running\n * - A deployed smart contract with state management methods\n */\n\nasync function retrieveApplicationState() {\n  // Initialize AlgorandClient to connect to LocalNet\n  const algorand = AlgorandClient.defaultLocalNet()\n  const algod = algorand.client.algod\n  const indexer = algorand.client.indexer\n\n  // Get a test account with funds\n  const testAccount = await algorand.account.localNetDispenser()\n\n  console.log('Deploying smart contract...')\n  // Note: Replace this with your actual contract deployment\n  // const { client } = await deploy(testAccount, algod, indexer)\n  // For this example, assume 'client' is your typed application client\n  \n  // ==========================================\n  // GLOBAL STATE MANAGEMENT\n  // ==========================================\n  console.log('\\n=== Working with Global State ===')\n  \n  // Set global state values with different types\n  // int1=1, int2=2, bytes1='asdf', bytes2=[1,2,3,4]\n  await client.call({ \n    method: 'set_global', \n    methodArgs: [1, 2, 'asdf', new Uint8Array([1, 2, 3, 4])] \n  })\n  \n  // Retrieve global state\n  const globalState = await client.getGlobalState()\n  \n  console.log('Global State Keys:', Object.keys(globalState).sort())\n  console.log('int1:', globalState.int1.value) // Expected: 1n\n  console.log('int2:', globalState.int2.value) // Expected: 2n\n  console.log('bytes1:', globalState.bytes1.value) // Expected: 'asdf'\n  console.log('bytes2 (raw):', globalState.bytes2.valueRaw) // Expected: Uint8Array([1, 2, 3, 4])\n  \n  // ==========================================\n  // LOCAL STATE MANAGEMENT\n  // ==========================================\n  console.log('\\n=== Working with Local State ===')\n  \n  // First, opt into the application to enable local state\n  await client.optIn({ method: 'opt_in', methodArgs: [] })\n  console.log('Account opted into application')\n  \n  // Set local state values\n  await client.call({ \n    method: 'set_local', \n    methodArgs: [1, 2, 'asdf', new Uint8Array([1, 2, 3, 4])] \n  })\n  \n  // Retrieve local state for the test account\n  const localState = await client.getLocalState(testAccount)\n  \n  console.log('Local State Keys:', Object.keys(localState).sort())\n  console.log('local_int1:', localState.local_int1.value) // Expected: 1n\n  console.log('local_int2:', localState.local_int2.value) // Expected: 2n\n  console.log('local_bytes1:', localState.local_bytes1.value) // Expected: 'asdf'\n  console.log('local_bytes2 (raw):', localState.local_bytes2.valueRaw) // Expected: Uint8Array([1, 2, 3, 4])\n  \n  // ==========================================\n  // BOX STORAGE MANAGEMENT\n  // ==========================================\n  console.log('\\n=== Working with Box Storage ===')\n  \n  // Define box names\n  const boxName1 = new Uint8Array([0, 0, 0, 1])\n  const boxName1Base64 = Buffer.from(boxName1).toString('base64')\n  const boxName2 = new Uint8Array([0, 0, 0, 2])\n  const boxName2Base64 = Buffer.from(boxName2).toString('base64')\n  \n  // Fund the app account to pay for box storage\n  await client.fundAppAccount(algokit.algo(1))\n  console.log('App account funded for box storage')\n  \n  // Create box 1 with string value\n  await client.call({\n    method: 'set_box',\n    methodArgs: [boxName1, 'value1'],\n    boxes: [boxName1],\n  })\n  console.log('Box 1 created with value: \"value1\"')\n  \n  // Create box 2 with string value\n  await client.call({\n    method: 'set_box',\n    methodArgs: [boxName2, 'value2'],\n    boxes: [boxName2],\n  })\n  console.log('Box 2 created with value: \"value2\"')\n  \n  // Retrieve all box values\n  const boxValues = await client.getBoxValues()\n  console.log('\\nAll boxes:', boxValues.map((b) => b.name.nameBase64))\n  \n  // Find and display box 1 value\n  const box1 = boxValues.find((b) => b.name.nameBase64 === boxName1Base64)\n  console.log('Box 1 value:', Buffer.from(box1!.value).toString()) // 'value1'\n  \n  // Retrieve a specific box value\n  const box1Value = await client.getBoxValue(boxName1)\n  console.log('Box 1 value (direct):', Buffer.from(box1Value).toString())\n  \n  // Find and display box 2 value\n  const box2 = boxValues.find((b) => b.name.nameBase64 === boxName2Base64)\n  console.log('Box 2 value:', Buffer.from(box2!.value).toString()) // 'value2'\n  \n  // ==========================================\n  // ABI-TYPED BOX VALUES\n  // ==========================================\n  console.log('\\n=== Working with ABI-Typed Box Values ===')\n  \n  // Store an ABI-encoded uint32 value in box 1\n  const expectedValue = 1234524352\n  await client.call({\n    method: 'set_box',\n    methodArgs: [boxName1, new ABIUintType(32).encode(expectedValue)],\n    boxes: [boxName1],\n  })\n  console.log(`Box 1 updated with ABI uint32 value: ${expectedValue}`)\n  \n  // Retrieve and decode box values using ABI type\n  const boxes = await client.getBoxValuesFromABIType(\n    new ABIUintType(32), \n    (n) => n.nameBase64 === boxName1Base64\n  )\n  console.log('Number of matching boxes:', boxes.length)\n  console.log('Decoded value:', Number(boxes[0].value)) // Expected: 1234524352\n  \n  // Retrieve a single box value and decode it using ABI type\n  const box1AbiValue = await client.getBoxValueFromABIType(boxName1, new ABIUintType(32))\n  console.log('Box 1 decoded uint32:', Number(box1AbiValue)) // Expected: 1234524352\n  \n  console.log('\\n✅ Successfully retrieved and decoded all application state types!')\n}\n\n// Run the example\nretrieveApplicationState().catch((error) => {\n  console.error('Error:', error)\n  process.exit(1)\n})\n"
}
```
