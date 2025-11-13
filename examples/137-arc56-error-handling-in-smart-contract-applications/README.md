# ARC56 Error Handling in Smart Contract Applications

Comprehensive demonstration of ARC56 error handling including deployment errors, method call errors with template variables, and error propagation through nested inner application calls

## Example Details

```json
{
  "example_id": "137-arc56-error-handling-in-smart-contract-applications",
  "title": "ARC56 Error Handling in Smart Contract Applications",
  "summary": "Comprehensive demonstration of ARC56 error handling including deployment errors, method call errors with template variables, and error propagation through nested inner application calls",
  "language": "typescript",
  "complexity": "complex",
  "example_potential": "high",
  "use_case_category": "error handling",
  "specific_use_case": "Handle and display custom error messages from ARC56-compliant smart contracts in various scenarios including deployment, method calls, and nested app calls",
  "target_users": [
    "SDK developers",
    "Smart contract developers"
  ],
  "features_tested": [
    "ARC56 error handling",
    "deployment errors",
    "inner app errors",
    "nested app calls",
    "error propagation",
    "template variables with error messages"
  ],
  "feature_tags": [
    "arc56",
    "error-handling",
    "smart-contracts",
    "app-deployment",
    "inner-transactions",
    "nested-calls",
    "template-variables",
    "app-factory",
    "app-client"
  ],
  "folder": "137-arc56-error-handling-in-smart-contract-applications",
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
        "name": "ALGOD_TOKEN",
        "required": false,
        "example": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      },
      {
        "name": "ALGOD_SERVER",
        "required": false,
        "example": "http://localhost"
      },
      {
        "name": "ALGOD_PORT",
        "required": false,
        "example": "4001"
      }
    ]
  },
  "run_instructions": {
    "setup": [
      "Start AlgoKit LocalNet: algokit localnet start"
    ],
    "install": [
      "npm install @algorandfoundation/algokit-utils algosdk"
    ],
    "execute": [
      "npx tsx main.ts"
    ]
  },
  "expected_output": [
    "Deployment error caught with custom message: 'custom error message'",
    "Method call error caught with dynamic template variables: 'this is an error'",
    "Nested inner app error caught and propagated: 'custom error message'"
  ],
  "source_tests": [
    {
      "file": "src/types/app-factory-and-client.spec.ts",
      "test_name": "ARC56 error message on deploy"
    },
    {
      "file": "src/types/app-factory-and-client.spec.ts",
      "test_name": "ARC56 error messages with dynamic template vars (cblock offset)"
    },
    {
      "file": "src/types/app-factory-and-client.spec.ts",
      "test_name": "ARC56 error messages from inner app error"
    }
  ],
  "artifacts_plan": [
    {
      "target_file": "deploy-error-app.arc56.json",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "ARC56 application spec that throws an error during deployment"
    },
    {
      "target_file": "template-vars-error-app.arc56.json",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "ARC56 application spec with template variables that throws errors"
    },
    {
      "target_file": "error-inner-app.arc56.json",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "ARC56 spec for the innermost application in nested call chain"
    },
    {
      "target_file": "error-middle-app.arc56.json",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "ARC56 spec for the middle application that calls inner app"
    },
    {
      "target_file": "error-outer-app.arc56.json",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "ARC56 spec for the outer application that calls middle app"
    }
  ],
  "notes": "This example demonstrates three critical scenarios for ARC56 error handling: (1) errors during deployment, (2) errors in method calls with dynamic template variables that affect program counter offsets, and (3) error propagation through nested inner application calls. All scenarios show how custom error messages are properly extracted and surfaced to developers.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundation/algokit-utils'\nimport { microAlgos } from '@algorandfoundation/algokit-utils'\nimport * as deployErrorAppArc56Json from './deploy-error-app.arc56.json'\nimport * as templateVarsErrorAppArc56Json from './template-vars-error-app.arc56.json'\nimport * as errorInnerAppArc56Json from './error-inner-app.arc56.json'\nimport * as errorMiddleAppArc56Json from './error-middle-app.arc56.json'\nimport * as errorOuterAppArc56Json from './error-outer-app.arc56.json'\n\n/**\n * ARC56 Error Handling Examples\n * \n * This example demonstrates how to handle custom error messages from ARC56-compliant\n * smart contracts in three scenarios:\n * 1. Errors during application deployment\n * 2. Errors in method calls with dynamic template variables\n * 3. Error propagation through nested inner application calls\n */\n\nasync function main() {\n  // Initialize Algorand client for LocalNet\n  const algorand = AlgorandClient.defaultLocalNet()\n  \n  // Get a funded test account\n  const testAccount = await algorand.account.fromEnvironment('LOCALNET_ACCOUNT')\n  \n  console.log('=== ARC56 Error Handling Examples ===')\n  console.log()\n  \n  // ========================================\n  // Example 1: Deployment Error Handling\n  // ========================================\n  console.log('1. Testing deployment error handling...')\n  try {\n    // Create a factory for an app that throws an error during deployment\n    const deployErrorFactory = algorand.client.getAppFactory({\n      appSpec: deployErrorAppArc56Json as any,\n      defaultSender: testAccount.addr,\n    })\n    \n    // Attempt to deploy the app - this will fail with a custom error message\n    await deployErrorFactory.deploy({ \n      createParams: { method: 'createApplication' } \n    })\n    \n    console.log('❌ Expected an error but deployment succeeded')\n  } catch (error: any) {\n    // The ARC56 error message is extracted and surfaced here\n    console.log('✅ Deployment error caught successfully!')\n    console.log(`   Error message: \"${error.message}\"`)\n    console.log('   Expected: \"custom error message\"')\n  }\n  console.log()\n  \n  // ========================================\n  // Example 2: Error Messages with Template Variables\n  // ========================================\n  console.log('2. Testing error messages with dynamic template variables...')\n  try {\n    // Create a factory for an app with template variables\n    const templateVarsFactory = algorand.client.getAppFactory({\n      appSpec: templateVarsErrorAppArc56Json as any,\n      defaultSender: testAccount.addr,\n    })\n    \n    // Deploy the app with specific template variable values\n    // These template variables can affect the program counter (cblock offset),\n    // but error messages should still be correctly identified\n    const { appClient } = await templateVarsFactory.deploy({\n      createParams: {\n        method: 'createApplication',\n      },\n      deployTimeParams: {\n        bytes64TmplVar: '0'.repeat(64),\n        uint64TmplVar: 123,\n        bytes32TmplVar: '0'.repeat(32),\n        bytesTmplVar: 'foo',\n      },\n    })\n    \n    console.log(`   App deployed successfully with ID: ${appClient.appId}`)\n    \n    // Call a method that throws an error\n    await appClient.send.call({ method: 'throwError' })\n    \n    console.log('❌ Expected an error but method call succeeded')\n  } catch (error: any) {\n    // Even with template variables affecting code offsets,\n    // the ARC56 error message is correctly extracted\n    console.log('✅ Error caught successfully with template variables!')\n    console.log(`   Error message: \"${error.message}\"`)\n    console.log('   Expected: \"this is an error\"')\n  }\n  console.log()\n  \n  // ========================================\n  // Example 3: Nested Inner App Error Propagation\n  // ========================================\n  console.log('3. Testing error propagation through nested inner app calls...')\n  try {\n    // Deploy the innermost application\n    const innerFactory = algorand.client.getAppFactory({\n      appSpec: errorInnerAppArc56Json as any,\n      defaultSender: testAccount.addr,\n    })\n    const { appClient: innerClient } = await innerFactory.deploy({ \n      createParams: { method: 'createApplication' } \n    })\n    console.log(`   Inner app deployed with ID: ${innerClient.appId}`)\n    \n    // Deploy the middle application\n    const middleFactory = algorand.client.getAppFactory({\n      appSpec: errorMiddleAppArc56Json as any,\n      defaultSender: testAccount.addr,\n    })\n    const { appClient: middleClient } = await middleFactory.deploy({ \n      createParams: { method: 'createApplication' } \n    })\n    console.log(`   Middle app deployed with ID: ${middleClient.appId}`)\n    \n    // Deploy the outer application\n    const outerFactory = algorand.client.getAppFactory({\n      appSpec: errorOuterAppArc56Json as any,\n      defaultSender: testAccount.addr,\n    })\n    const { appClient: outerClient } = await outerFactory.deploy({ \n      createParams: { method: 'createApplication' } \n    })\n    console.log(`   Outer app deployed with ID: ${outerClient.appId}`)\n    \n    // Call the outer app, which calls the middle app, which calls the inner app\n    // The inner app will throw an error that should propagate up\n    // Note: Extra fee is needed for inner transactions\n    await outerClient.send.call({ \n      method: 'callMiddle', \n      args: [middleClient.appId, innerClient.appId], \n      extraFee: microAlgos(2000) \n    })\n    \n    console.log('❌ Expected an error but nested call succeeded')\n  } catch (error: any) {\n    // The error from the innermost app is propagated through the call chain\n    // and the ARC56 error message is correctly extracted\n    console.log('✅ Nested inner app error caught and propagated successfully!')\n    console.log(`   Error message: \"${error.message}\"`)\n    console.log('   Expected: \"custom error message\"')\n    console.log('   This error originated from the innermost app and propagated up')\n  }\n  console.log()\n  \n  console.log('=== All ARC56 error handling examples completed ===')\n}\n\nmain().catch((error) => {\n  console.error('Unexpected error:', error)\n  process.exit(1)\n})"
}
```
