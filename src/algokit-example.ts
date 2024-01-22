import algosdk from 'algosdk'
import { AlgoKit } from './algokit'
import * as ak from './index'
;(async () => {
  // Easy to instantiate with clear semantics for picking the network you are targeting
  // Having an instance has other benefits too like no longer need to pass algod etc. into
  //   everything and we can cache suggestedParams for a period of time to reduce extra HTTP
  //   requests (see below)
  const mainnet = AlgoKit.mainNet()
  const customConfig = AlgoKit.fromConfig({
    algodConfig: ak.getAlgoNodeConfig('testnet', 'algod'),
    // Can just specify algod, or can aldo specify indexer and/or kmd
  })
  const customConfig2 = AlgoKit.fromClients({
    algod: new algosdk.Algodv2('aaaaa...', 'http://localhost:4001'),
    indexer: new algosdk.Indexer('aaaaa...', 'http://localhost:8980'),
    kmd: new algosdk.Kmd('aaaaa...', 'http://localhost:4002'),
  })
  const algokit = AlgoKit.fromEnvironment()

  // Get cleaner intellisense - try this in your IDE:
  //algokit.

  // Cached transaction params (largely you won't need to use this unless you are manually constructing transactions)
  console.log((await algokit.getTransactionParams()) === (await algokit.getTransactionParams())) // true

  // Build a transaction object - signature has no SendTransactionFrom or signer - just strings
  // Intellisense on `algokit.transaction.` is really clean (for now I just added 3 methods to illustrate)
  // To keep it clean I removed a lot of the configuration options - if you want to do something more
  // advanced you can switch to the underlying methods still where you have full flexibility
  const transfer = algokit.transaction.transferAlgos({
    amount: (1).algos(),
    from: 'ABC...',
    to: 'XYZ...',
    note: 'Hi! (this is an optional parameter)',
  })
  // transfer is an algosdk.Transaction - no noise of optional confirmation parameter and no need to pass in `skipSending: true`

  const randomAccount = ak.randomAccount()
  const signer = ak.getSenderTransactionSigner(randomAccount)

  // Send a one-off transaction - signature takes an additional signer which is simply a transaction signer
  // Similarly, intellisense on `algokit.send.` is really clean, same notes as above about configurability
  const transferConfirmation = algokit.send.transferAlgos({
    amount: (1).algos(),
    from: 'ABC...',
    to: 'XYZ...',
    signer,
  })
  // transferConfirmation has `transaction` and `confirmation`
  //   (where `confirmation` is required so no awkward undefined semantics)

  // Send a group of transactions - you can pass in a default signer or an existing atc to compose method
  const result = await algokit
    .compose()
    .transferAlgos({
      amount: (1).algos(),
      from: 'ABC...',
      to: 'XYZ...',
      // You can override signer per transaction, or use the default,
      //   or if you are going to `.transactions` then it will use emptySigners by default
      signer,
    })
    .assetOptIn({ account: 'ACB...', assetId: 1234 })
    .send()
  // Or .atc(), or .simulate(), or .transactions(), or .transactionsWithSigners()
})()
