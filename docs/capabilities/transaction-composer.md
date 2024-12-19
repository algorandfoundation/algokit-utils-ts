# Transaction composer

The `TransactionComposer` class allows you to easily compose one or more compliant Algorand transactions and execute and/or simulate them.

It's the core of how the [`AlgorandClient`](./algorand-client.md) class composes and sends transactions.

To get an instance of `TransactionComposer` you can either get it from an [app client](./app-client.md), from an [`AlgorandClient`](./algorand-client.md), or by new-ing up via the constructor.

```typescript
const composerFromAlgorand = algorand.newGroup()
const composerFromAppClient = appClient.newGroup()
const composerFromConstructor = new TransactionComposer({
  algod,
  /* Return the algosdk.TransactionSigner for this address*/
  getSigner: (address: string) => signer,
})
const composerFromConstructorWithOptionalParams = new TransactionComposer({
  algod,
  /* Return the algosdk.TransactionSigner for this address*/
  getSigner: (address: string) => signer,
  getSuggestedParams: () => algod.getTransactionParams().do(),
  defaultValidityWindow: 1000,
  appManager: new AppManager(algod),
})
```

## Constructing a transaction

To construct a transaction you need to add it to the composer, passing in the relevant [params object](../code/modules/types_composer.md#type-aliases) for that transaction. Params are normal JavaScript objects and all of them extend the [common call parameters](./algorand-client.md#transaction-parameters).

The [methods to construct a transaction](../code/classes/types_composer.default.md#methods) are all named `add{TransactionType}` and return an instance of the composer so they can be chained together fluently to construct a transaction group.

For example:

```typescript
const myMethod = algosdk.ABIMethod.fromSignature('my_method()void')
const result = algorand
  .newGroup()
  .addPayment({ sender: 'SENDER', receiver: 'RECEIVER', amount: (100).microAlgo() })
  .addAppCallMethodCall({
    sender: 'SENDER',
    appId: 123n,
    method: myMethod,
    args: [1, 2, 3],
  })
```

## Sending a transaction

Once you have constructed all the required transactions, they can be sent by calling `send()` on the `TransactionComposer`.
Additionally `send()` takes a number of parameters which allow you to opt-in to some additional behaviours as part of sending the transaction or transaction group, mostly significantly `populateAppCallResources` and `coverAppCallInnerTransactionFees`.

### populateAppCallResources

As the name suggests, this setting automatically updates the relevant app call transactions in the group to include the account, app, asset and box resources required for the transactions to execute successfully. It leverages the simulate endpoint to discover the accessed resources, which have not been explicitly specified. This setting only applies when you have constucted at least one app call transaction. You can read more about [resources and the reference arrays](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/?from_query=resources#reference-arrays) in the docs.

For example:

```typescript
const myMethod = algosdk.ABIMethod.fromSignature('my_method()void')
const result = algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: 'SENDER',
    appId: 123n,
    method: myMethod,
    args: [1, 2, 3],
  })
  .send({
    populateAppCallResources: true,
  })
```

If `my_method` in the above example accesses any resources, they will be automatically discovered and added before sending the transaction to the network.

### coverAppCallInnerTransactionFees

This setting will automatically calculate the required fee for a parent app call transaction that sends inner transactions. It leverages the simulate endpoint to discover the inner transactions sent and calculates a fee delta to resolve the optimal fee. This feature also takes care of accounting for any surplus transaction fee at the various levels, so as to effectively minimise the fees needed to successfully handle complex scenarios. This setting only applies when you have constucted at least one app call transaction.

For example:

```typescript
const myMethod = algosdk.ABIMethod.fromSignature('my_method()void')
const result = algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: 'SENDER',
    appId: 123n,
    method: myMethod,
    args: [1, 2, 3],
    maxFee: microAlgo(5000), // NOTE: a maxFee value is required when enabling coverAppCallInnerTransactionFees
  })
  .send({
    coverAppCallInnerTransactionFees: true,
  })
```

Assuming the app account is not covering any of the inner transaction fees, if `my_method` in the above example sends 2 inner transactions, then the fee calculated for the parent transaction will be 3000 µALGO when the transaction is sent to the network.

The above example also has a `maxFee` of 5000 µALGO specified. An exception will be thrown if the transaction fee execeeds that value, which allows you to set fee limits. The `maxFee` field is required when enabling `coverAppCallInnerTransactionFees`.

Because `maxFee` is required and an `algosdk.Transaction` does not hold any max fee information, you cannot use the generic `addTransaction()` method on the composer with `coverAppCallInnerTransactionFees` enabled. Instead use the below, which provides a better overall experience:

```typescript
const myMethod = algosdk.ABIMethod.fromSignature('my_method()void')

// Does not work
const result = algorand
  .newGroup()
  .addTransaction((await localnet.algorand.createTransaction.appCallMethodCall({
    sender: 'SENDER',
    appId: 123n,
    method: myMethod,
    args: [1, 2, 3],
    maxFee: microAlgo(5000), // This is only used to create the algosdk.Transaction object and isn't made available to the composer.
  })).transactions[0]),
  .send({
    coverAppCallInnerTransactionFees: true,
  })

// Works as expected
const result = algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: 'SENDER',
    appId: 123n,
    method: myMethod,
    args: [1, 2, 3],
    maxFee: microAlgo(5000),
  })
  .send({
    coverAppCallInnerTransactionFees: true,
  })
```

A more complex valid scenario which leverages an app client to send an ABI method call with ABI method call transactions argument is below:

```typescript
const appFactory = algorand.client.getAppFactory({
  appSpec: 'APP_SPEC',
  defaultSender: sender.addr,
})

const { appClient: appClient1 } = await appFactory.send.bare.create()
const { appClient: appClient2 } = await appFactory.send.bare.create()

const paymentArg = algorand.createTransaction.payment({
  sender: sender.addr,
  receiver: receiver.addr,
  amount: microAlgo(1),
})

// Note the use of .params. here, this ensure that maxFee is still available to the composer
const appCallArg = await appClient2.params.call({
  method: 'my_other_method',
  args: [],
  maxFee: microAlgo(2000),
})

const result = await appClient1.algorand
  .newGroup()
  .addAppCallMethodCall(
    await appClient1.params.call({
      method: 'my_method',
      args: [paymentArg, appCallArg],
      maxFee: microAlgo(5000),
    }),
  )
  .send({
    coverAppCallInnerTransactionFees: true,
  })
```

This feature should efficiently calculate the minimum fee needed to execute an app call transaction with inners, however we always recommend testing your specific scenario behaves as expected before releasing.

## Simulating a transaction

Transactions can be simulated using the simulate endpoint in algod, which enables evaluating the transaction on the network without it actually being commited to a block.
This is a powerful feature, which has a number of options which are detailed in the [simulate API docs](https://developer.algorand.org/docs/rest-apis/algod/#post-v2transactionssimulate).

For example you can simulate a transaction group like below:

```typescript
const result = await algorand
  .newGroup()
  .addPayment({ sender: 'SENDER', receiver: 'RECEIVER', amount: (100).microAlgo() })
  .addAppCallMethodCall({
    sender: 'SENDER',
    appId: 123n,
    method: abiMethod,
    args: [1, 2, 3],
  })
  .simulate()
```

The above will execute a simulate request asserting that all transactions in the group are correctly signed.

### Simulate without signing

There are situations where you may not be able to (or want to) sign the transactions when executing simulate.
In these instances you should set `skipSignatures: true` which automatically builds empty transaction signers and sets both `fix-signers` and `allow-empty-signatures` to `true` when sending the algod API call.

For example:

```typescript
const result = await algorand
  .newGroup()
  .addPayment({ sender: 'SENDER', receiver: 'RECEIVER', amount: (100).microAlgo() })
  .addAppCallMethodCall({
    sender: 'SENDER',
    appId: 123n,
    method: abiMethod,
    args: [1, 2, 3],
  })
  .simulate({
    skipSignatures: true,
  })
```
