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
const result = algorand.addPayment({ sender: 'SENDER', receiver: 'RECEIVER', amount: (100).microAlgo() }).addAppCallMethodCall({
  sender: 'SENDER',
  appId: 123n,
  method: abiMethod,
  args: [1, 2, 3],
}).
```
