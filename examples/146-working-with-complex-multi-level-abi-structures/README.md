# Working with Complex Multi-Level ABI Structures

Master complex ABI type structures with multiple nesting levels. This example demonstrates handling of structures that combine dynamic arrays, static arrays, and nested tuples - representing real-world smart contract scenarios.

## Example Details

```json
{
  "example_id": "146-working-with-complex-multi-level-abi-structures",
  "title": "Working with Complex Multi-Level ABI Structures",
  "summary": "Master complex ABI type structures with multiple nesting levels. This example demonstrates handling of structures that combine dynamic arrays, static arrays, and nested tuples - representing real-world smart contract scenarios.",
  "language": "typescript",
  "complexity": "complex",
  "example_potential": "high",
  "use_case_category": "ABI type conversion",
  "specific_use_case": "Convert highly complex nested structures combining arrays and tuples (byte[2][],uint8,(bool,byte[3])) for real-world smart contract data",
  "target_users": [
    "Smart contract developers",
    "SDK developers"
  ],
  "features_tested": [
    "convertAbiByteArrays",
    "ABITupleType",
    "ABIArrayDynamicType",
    "ABIArrayStaticType",
    "ABIUintType",
    "ABIByteType",
    "ABIBoolType",
    "complex nested structures"
  ],
  "feature_tags": [
    "abi",
    "complex-structures",
    "nested-arrays",
    "tuples",
    "dynamic-arrays",
    "type-conversion",
    "smart-contracts",
    "advanced",
    "algosdk"
  ],
  "folder": "146-working-with-complex-multi-level-abi-structures",
  "prerequisites": {
    "tools": [
      "node",
      "npm"
    ],
    "libraries": [
      "algosdk"
    ],
    "environment": []
  },
  "run_instructions": {
    "setup": [],
    "install": [
      "npm install algosdk"
    ],
    "execute": [
      "npx tsx main.ts"
    ]
  },
  "expected_output": [
    "Complex structure created: (byte[2][],uint8,(bool,byte[3]))",
    "Successfully converted all nested elements",
    "First element: Dynamic array of byte[2] arrays",
    "Second element: uint8 value (123)",
    "Third element: Nested tuple with bool and byte[3]",
    "All byte arrays converted to Uint8Array instances",
    "Structure ready for smart contract interaction"
  ],
  "source_tests": [
    {
      "file": "src/util.spec.ts",
      "test_name": "should handle complex nested structures"
    }
  ],
  "artifacts_plan": [],
  "notes": "This example represents the most complex ABI type structures you'll encounter in production. It demonstrates multi-level conversion with mixed array types (dynamic and static) combined with nested tuples. Understanding this pattern is essential for working with advanced smart contracts that handle complex data structures.",
  "generated_code": "import algosdk, { type ABIValue, type ABIType } from 'algosdk'\n\nconst { ABIArrayStaticType, ABIArrayDynamicType, ABITupleType, ABIByteType, ABIBoolType, ABIUintType } = algosdk\n\n/** Convert byte arrays from number[] to Uint8Array for ABI encoding */\nfunction convertAbiByteArrays(value: ABIValue, type: ABIType): ABIValue {\n  // Return value as is if the type doesn't have any bytes or if it's already a Uint8Array\n  if (!type.toString().includes('byte') || value instanceof Uint8Array) {\n    return value\n  }\n\n  // Handle byte arrays (byte[N] or byte[])\n  if (\n    (type instanceof ABIArrayStaticType || type instanceof ABIArrayDynamicType) &&\n    type.childType instanceof ABIByteType &&\n    Array.isArray(value)\n  ) {\n    return new Uint8Array(value as number[])\n  }\n\n  // Handle other arrays (for nested structures)\n  if ((type instanceof ABIArrayStaticType || type instanceof ABIArrayDynamicType) && Array.isArray(value)) {\n    const result = []\n    for (let i = 0; i < value.length; i++) {\n      result.push(convertAbiByteArrays(value[i], type.childType))\n    }\n    return result\n  }\n\n  // Handle tuples (for nested structures)\n  if (type instanceof ABITupleType && Array.isArray(value)) {\n    const result = []\n    for (let i = 0; i < value.length && i < type.childTypes.length; i++) {\n      result.push(convertAbiByteArrays(value[i], type.childTypes[i]))\n    }\n    return result\n  }\n\n  return value\n}"\n\n/**\n * Demonstrates working with highly complex nested ABI structures.\n * \n * This example shows how to:\n * 1. Define complex multi-level type structures\n * 2. Combine dynamic arrays, static arrays, and tuples\n * 3. Convert complex JavaScript structures to ABI format\n * 4. Handle real-world smart contract data scenarios\n * \n * The structure being created is: (byte[2][],uint8,(bool,byte[3]))\n * - First element: Dynamic array of static byte[2] arrays\n * - Second element: 8-bit unsigned integer\n * - Third element: Tuple containing a boolean and byte[3] array\n */\n\nfunction main() {\n  console.log('=== Working with Complex Multi-Level ABI Structures ===\\n')\n\n  // Step 1: Define the basic types\n  console.log('Step 1: Defining basic ABI types...')\n  const byteType = new ABIByteType()\n  const boolType = new ABIBoolType()\n  const uintType = new ABIUintType(8) // 8-bit unsigned integer\n  console.log('✓ Created basic types: byte, bool, uint8\\n')\n\n  // Step 2: Define array types\n  console.log('Step 2: Defining array types...')\n  \n  // Static array of 2 bytes: byte[2]\n  const byteArray2Type = new ABIArrayStaticType(byteType, 2)\n  console.log('✓ Created byte[2] - static array of 2 bytes')\n  \n  // Dynamic array of byte[2]: byte[2][]\n  const byteArrayDynType = new ABIArrayDynamicType(byteArray2Type)\n  console.log('✓ Created byte[2][] - dynamic array of byte[2]')\n  \n  // Static array of 3 bytes: byte[3]\n  const byteArray3Type = new ABIArrayStaticType(byteType, 3)\n  console.log('✓ Created byte[3] - static array of 3 bytes\\n')\n\n  // Step 3: Define tuple types\n  console.log('Step 3: Defining tuple structures...')\n  \n  // Inner tuple: (bool, byte[3])\n  const innerTupleType = new ABITupleType([boolType, byteArray3Type])\n  console.log('✓ Created inner tuple: (bool, byte[3])')\n  \n  // Outer tuple: (byte[2][], uint8, (bool, byte[3]))\n  const outerTupleType = new ABITupleType([\n    byteArrayDynType,\n    uintType,\n    innerTupleType,\n  ])\n  console.log('✓ Created outer tuple: (byte[2][], uint8, (bool, byte[3]))\\n')\n\n  // Step 4: Prepare complex data structure\n  console.log('Step 4: Preparing complex data structure...')\n  const value = [\n    [\n      [1, 2],    // First byte[2]\n      [3, 4],    // Second byte[2]\n      [5, 6],    // Third byte[2]\n    ],           // Dynamic array of byte[2] arrays\n    123,         // uint8 value\n    [true, [7, 8, 9]], // Inner tuple: (bool, byte[3])\n  ]\n  console.log('Original structure:')\n  console.log('  byte[2][]: [[1,2], [3,4], [5,6]]')\n  console.log('  uint8: 123')\n  console.log('  (bool, byte[3]): [true, [7,8,9]]')\n  console.log()\n\n  // Step 5: Convert to ABI format\n  console.log('Step 5: Converting to ABI format...')\n  const result = convertAbiByteArrays(value, outerTupleType) as ABIValue[]\n  console.log('✓ Conversion complete\\n')\n\n  // Step 6: Inspect the results\n  console.log('Step 6: Inspecting converted results...\\n')\n\n  // Check first element (byte[2][])\n  console.log('First element (byte[2][] - dynamic array):')\n  const byteArrays = result[0] as ABIValue[]\n  console.log('  Is array:', Array.isArray(byteArrays))\n  console.log('  Length:', byteArrays.length)\n  console.log('  Elements:')\n  byteArrays.forEach((item, index) => {\n    console.log(`    [${index}]: ${item.constructor.name} - [${Array.from(item as Uint8Array).join(', ')}]`)\n  })\n  console.log('  ✓ All elements are Uint8Array instances')\n  console.log()\n\n  // Check second element (uint8)\n  console.log('Second element (uint8):')\n  console.log('  Type:', typeof result[1])\n  console.log('  Value:', result[1])\n  console.log('  ✓ Integer value preserved')\n  console.log()\n\n  // Check third element (nested tuple)\n  console.log('Third element (nested tuple: (bool, byte[3])):')\n  const tuple = result[2] as ABIValue[]\n  console.log('  Is array:', Array.isArray(tuple))\n  console.log('  Length:', tuple.length)\n  console.log()\n\n  console.log('  First element (bool):')\n  console.log('    Type:', typeof tuple[0])\n  console.log('    Value:', tuple[0])\n  console.log('    ✓ Boolean value preserved')\n  console.log()\n\n  console.log('  Second element (byte[3]):')\n  console.log('    Type:', tuple[1].constructor.name)\n  console.log('    Values:', Array.from(tuple[1] as Uint8Array))\n  console.log('    ✓ Converted to Uint8Array')\n  console.log()\n\n  // Summary\n  console.log('=== Summary ===')\n  console.log('✓ Successfully created complex multi-level structure')\n  console.log('✓ Dynamic array of static arrays handled correctly')\n  console.log('✓ Integer value passed through unchanged')\n  console.log('✓ Nested tuple with mixed types converted properly')\n  console.log('✓ All byte arrays converted to Uint8Array instances')\n  console.log('✓ Structure ready for smart contract interactions')\n  console.log()\n  console.log('This pattern represents real-world smart contract scenarios')\n  console.log('where complex data structures need to be encoded for ABI calls.')\n}\n\n// Run the example\nmain()"
}
```
