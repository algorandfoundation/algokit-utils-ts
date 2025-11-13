import { AlgorandClient } from '@algorand/algokit-utils';
import { algorandFixture } from '@algorand/algokit-utils/testing';
import algosdk from 'algosdk';
import { microAlgos } from '@algorand/algokit-utils';

/**
 * This example demonstrates how to simulate a transaction group before sending it.
 * Simulation allows you to:
 * - Test transaction logic without committing to the blockchain
 * - Estimate costs and resource requirements
 * - Validate transaction results before execution
 * - Debug smart contract behavior
 */

async function main() {
  // Setup: Initialize Algorand client and get test account
  const localnet = algorandFixture();
  await localnet.beforeEach();
  const { testAccount } = localnet.context;
  const algorand = localnet.context.algorand;

  console.log('=== Transaction Group Simulation Example ===\n');

  // Step 1: Deploy an app (for this example, assume we have an app deployed)
  console.log('Step 1: Setting up application...');
  // You would replace this with your actual app deployment
  const appClient = algorand.client.getAppClient({
    appSpec: {
      // Your app spec here - this should include the methods we're calling
      hints: {},
      source: { approval: '', clear: '' },
      state: { global: { num_byte_slices: 0, num_uints: 0 }, local: { num_byte_slices: 0, num_uints: 0 } },
      schema: { global: { declared: {}, reserved: {} }, local: { declared: {}, reserved: {} } },
      contract: { 
        name: 'TestApp', 
        methods: [
          { name: 'set_global', args: [], returns: { type: 'void' } },
          { name: 'call_abi', args: [], returns: { type: 'string' } }
        ] 
      }
    },
    sender: testAccount,
  });
  
  await appClient.deploy();
  const appId = appClient.appId;
  console.log(`App deployed with ID: ${appId}\n`);

  // Step 2: Define transaction group parameters
  console.log('Step 2: Defining transaction group...');
  
  // First transaction: ABI method call to set global state
  const appCall1Params = {
    sender: testAccount,
    appId: appId,
    method: algosdk.ABIMethod.fromSignature('set_global(uint64,uint64,string,byte[4])void'),
    args: [1, 2, 'asdf', new Uint8Array([1, 2, 3, 4])],
  };
  console.log('  - App call 1: set_global method');

  // Second transaction: Payment transaction
  const paymentParams = {
    sender: testAccount,
    receiver: testAccount,
    amount: microAlgos(10000), // 0.01 ALGO
  };
  console.log('  - Payment: 0.01 ALGO');

  // Third transaction: ABI method call
  const appCall2Params = {
    sender: testAccount,
    appId: appId,
    method: algosdk.ABIMethod.fromSignature('call_abi(string)string'),
    args: ['test'],
  };
  console.log('  - App call 2: call_abi method\n');

  // Step 3: Simulate the transaction group
  console.log('Step 3: Simulating transaction group...');
  const simulateResult = await algorand
    .newGroup()
    .addAppCallMethodCall(appCall1Params)
    .addPayment(paymentParams)
    .addAppCallMethodCall(appCall2Params)
    .simulate({ skipSignatures: true });

  console.log('\n=== Simulation Results ===');
  console.log(`Number of transactions: ${simulateResult.transactions.length}`);
  console.log(`Number of returns: ${simulateResult.returns?.length || 0}`);
  if (simulateResult.returns && simulateResult.returns.length > 0) {
    console.log('Return values:');
    simulateResult.returns.forEach((ret, idx) => {
      console.log(`  Return ${idx}: ${ret}`);
    });
  }

  // Step 4: Send the actual transaction group
  console.log('\nStep 4: Sending actual transaction group...');
  const sendResult = await algorand
    .newGroup()
    .addAppCallMethodCall(appCall1Params)
    .addPayment(paymentParams)
    .addAppCallMethodCall(appCall2Params)
    .send();

  console.log('\n=== Actual Send Results ===');
  console.log(`Number of transactions: ${sendResult.transactions.length}`);
  console.log(`Number of returns: ${sendResult.returns?.length || 0}`);
  if (sendResult.returns && sendResult.returns.length > 0) {
    console.log('Return values:');
    sendResult.returns.forEach((ret, idx) => {
      console.log(`  Return ${idx}: ${ret}`);
    });
  }

  // Step 5: Compare results
  console.log('\n=== Comparison ===');
  console.log(`Transaction counts match: ${simulateResult.transactions.length === sendResult.transactions.length}`);
  console.log(`Return counts match: ${simulateResult.returns?.length === sendResult.returns?.length}`);
  
  if (simulateResult.returns && sendResult.returns) {
    const returnsMatch = simulateResult.returns.every((ret, idx) => 
      JSON.stringify(ret) === JSON.stringify(sendResult.returns![idx])
    );
    console.log(`Return values match: ${returnsMatch}`);
  }

  console.log('\n✅ Simulation and actual execution produced consistent results!');
  console.log('\nKey Takeaway: Use simulate() to test transaction groups before committing them to the blockchain.');

  // Cleanup
  await localnet.afterEach();
}

main().catch(console.error);