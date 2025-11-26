[@algorandfoundation/algokit-utils](../README.md) / types/indexer

# Module: types/indexer

## Table of contents

### Enumerations

- [AccountStatus](../enums/types_indexer.AccountStatus.md)
- [ApplicationOnComplete](../enums/types_indexer.ApplicationOnComplete.md)
- [SignatureType](../enums/types_indexer.SignatureType.md)

### Interfaces

- [LookupAssetHoldingsOptions](../interfaces/types_indexer.LookupAssetHoldingsOptions.md)

### Type Aliases

- [AccountLookupResult](types_indexer.md#accountlookupresult)
- [AccountParticipation](types_indexer.md#accountparticipation)
- [AccountResult](types_indexer.md#accountresult)
- [AccountStateDelta](types_indexer.md#accountstatedelta)
- [AppLocalState](types_indexer.md#applocalstate)
- [ApplicationCreatedLookupResult](types_indexer.md#applicationcreatedlookupresult)
- [ApplicationLookupResult](types_indexer.md#applicationlookupresult)
- [ApplicationParams](types_indexer.md#applicationparams)
- [ApplicationResult](types_indexer.md#applicationresult)
- [ApplicationTransactionResult](types_indexer.md#applicationtransactionresult)
- [AssetBalancesLookupResult](types_indexer.md#assetbalanceslookupresult)
- [AssetConfigTransactionResult](types_indexer.md#assetconfigtransactionresult)
- [AssetFreezeTransactionResult](types_indexer.md#assetfreezetransactionresult)
- [AssetHolding](types_indexer.md#assetholding)
- [AssetLookupResult](types_indexer.md#assetlookupresult)
- [AssetParams](types_indexer.md#assetparams)
- [AssetResult](types_indexer.md#assetresult)
- [AssetTransferTransactionResult](types_indexer.md#assettransfertransactionresult)
- [AssetsCreatedLookupResult](types_indexer.md#assetscreatedlookupresult)
- [AssetsLookupResult](types_indexer.md#assetslookupresult)
- [EvalDelta](types_indexer.md#evaldelta)
- [EvalDeltaKeyValue](types_indexer.md#evaldeltakeyvalue)
- [KeyRegistrationTransactionResult](types_indexer.md#keyregistrationtransactionresult)
- [LogicTransactionSignature](types_indexer.md#logictransactionsignature)
- [MerkleArrayProof](types_indexer.md#merklearrayproof)
- [MiniAssetHolding](types_indexer.md#miniassetholding)
- [MultisigTransactionSignature](types_indexer.md#multisigtransactionsignature)
- [MultisigTransactionSubSignature](types_indexer.md#multisigtransactionsubsignature)
- [PaymentTransactionResult](types_indexer.md#paymenttransactionresult)
- [StateDelta](types_indexer.md#statedelta)
- [StateProofTransactionResult](types_indexer.md#stateprooftransactionresult)
- [StateSchema](types_indexer.md#stateschema)
- [TransactionLookupResult](types_indexer.md#transactionlookupresult)
- [TransactionResult](types_indexer.md#transactionresult)
- [TransactionSearchResults](types_indexer.md#transactionsearchresults)
- [TransactionSignature](types_indexer.md#transactionsignature)

## Type Aliases

### AccountLookupResult

Ƭ **AccountLookupResult**: `indexerModels.AccountResponse`

**`Deprecated`**

Use `algosdk.indexerModels.AccountResponse`. Indexer result for an account lookup, https://dev.algorand.co/reference/rest-apis/indexer#get-v2accountsaccount-id

#### Defined in

[src/types/indexer.ts:7](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L7)

___

### AccountParticipation

Ƭ **AccountParticipation**: `indexerModels.AccountParticipation`

**`Deprecated`**

Use `algosdk.indexerModels.AccountParticipation`. Indexer AccountParticipation describes the parameters used by this account in consensus protocol. https://dev.algorand.co/reference/rest-apis/indexer#accountparticipation

#### Defined in

[src/types/indexer.ts:198](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L198)

___

### AccountResult

Ƭ **AccountResult**: `indexerModels.Account`

**`Deprecated`**

Use `algosdk.indexerModels.Account`. Indexer Account information at a given round https://dev.algorand.co/reference/rest-apis/indexer#account

#### Defined in

[src/types/indexer.ts:44](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L44)

___

### AccountStateDelta

Ƭ **AccountStateDelta**: `indexerModels.AccountStateDelta`

**`Deprecated`**

Use `algosdk.indexerModels.AccountStateDelta`.

#### Defined in

[src/types/indexer.ts:144](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L144)

___

### AppLocalState

Ƭ **AppLocalState**: `indexerModels.ApplicationLocalState`

**`Deprecated`**

Use `algosdk.indexerModels.ApplicationLocalState`. Indexer Stores local state associated with an application. https://dev.algorand.co/reference/rest-apis/indexer#applicationlocalstate

#### Defined in

[src/types/indexer.ts:201](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L201)

___

### ApplicationCreatedLookupResult

Ƭ **ApplicationCreatedLookupResult**: `indexerModels.ApplicationsResponse`

**`Deprecated`**

Use `algosdk.indexerModels.ApplicationsResponse`. Indexer result for an account's created applications, https://dev.algorand.co/reference/rest-apis/indexer#get-v2accountsaccount-idcreated-applications

#### Defined in

[src/types/indexer.ts:16](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L16)

___

### ApplicationLookupResult

Ƭ **ApplicationLookupResult**: `indexerModels.ApplicationResponse`

**`Deprecated`**

Use `algosdk.indexerModels.ApplicationResponse`. Indexer result for an application lookup, https://dev.algorand.co/reference/rest-apis/indexer#get-v2applicationsapplication-id

#### Defined in

[src/types/indexer.ts:38](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L38)

___

### ApplicationParams

Ƭ **ApplicationParams**: `indexerModels.ApplicationParams`

**`Deprecated`**

Use `algosdk.indexerModels.ApplicationParams`. Indexer Stores the global information associated with an application https://dev.algorand.co/reference/rest-apis/indexer#applicationparams

#### Defined in

[src/types/indexer.ts:153](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L153)

___

### ApplicationResult

Ƭ **ApplicationResult**: `indexerModels.Application`

**`Deprecated`**

Use `algosdk.indexerModels.Application`. Indexer result of looking up an application

#### Defined in

[src/types/indexer.ts:121](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L121)

___

### ApplicationTransactionResult

Ƭ **ApplicationTransactionResult**: `indexerModels.TransactionApplication`

**`Deprecated`**

Use `algosdk.indexerModels.TransactionApplication`. Indexer Fields for an application transaction https://dev.algorand.co/reference/rest-apis/indexer#transactionapplication

#### Defined in

[src/types/indexer.ts:98](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L98)

___

### AssetBalancesLookupResult

Ƭ **AssetBalancesLookupResult**: `indexerModels.AssetBalancesResponse`

**`Deprecated`**

Use `algosdk.indexerModels.AssetBalancesResponse`. Indexer result for an asset's account holdings, https://dev.algorand.co/reference/rest-apis/indexer#get-v2assetsasset-idbalances

#### Defined in

[src/types/indexer.ts:32](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L32)

___

### AssetConfigTransactionResult

Ƭ **AssetConfigTransactionResult**: `indexerModels.TransactionAssetConfig`

**`Deprecated`**

Use `algosdk.indexerModels.TransactionAssetConfig`. Indexer Fields for asset allocation, re-configuration, and destruction.
https://dev.algorand.co/reference/rest-apis/indexer#transactionassetconfig

A zero value for asset-id indicates asset creation. A zero value for the params indicates asset destruction.

#### Defined in

[src/types/indexer.ts:105](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L105)

___

### AssetFreezeTransactionResult

Ƭ **AssetFreezeTransactionResult**: `indexerModels.TransactionAssetFreeze`

**`Deprecated`**

Use `algosdk.indexerModels.TransactionAssetFreeze`. Indexer Fields for an asset freeze transaction. https://dev.algorand.co/reference/rest-apis/indexer#transactionassetfreeze

#### Defined in

[src/types/indexer.ts:108](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L108)

___

### AssetHolding

Ƭ **AssetHolding**: `indexerModels.AssetHolding`

**`Deprecated`**

Use `algosdk.indexerModels.AssetHolding`. Indexer Describes an asset held by an account. https://dev.algorand.co/reference/rest-apis/indexer#assetholding

#### Defined in

[src/types/indexer.ts:204](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L204)

___

### AssetLookupResult

Ƭ **AssetLookupResult**: `indexerModels.AssetResponse`

**`Deprecated`**

Use `algosdk.indexerModels.AssetResponse`. Indexer result for an asset lookup, https://dev.algorand.co/reference/rest-apis/indexer#get-v2assetsasset-id

#### Defined in

[src/types/indexer.ts:19](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L19)

___

### AssetParams

Ƭ **AssetParams**: `indexerModels.AssetParams`

**`Deprecated`**

Use `algosdk.indexerModels.AssetParams`. Indexer AssetParams specifies the parameters for an asset. https://dev.algorand.co/reference/rest-apis/indexer#assetparams

#### Defined in

[src/types/indexer.ts:175](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L175)

___

### AssetResult

Ƭ **AssetResult**: `indexerModels.Asset`

**`Deprecated`**

Use `algosdk.indexerModels.Asset`. Indexer Fields to specify both the unique identifier and the parameters for an asset. https://dev.algorand.co/reference/rest-apis/indexer#asset

#### Defined in

[src/types/indexer.ts:117](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L117)

___

### AssetTransferTransactionResult

Ƭ **AssetTransferTransactionResult**: `indexerModels.TransactionAssetTransfer`

**`Deprecated`**

Use `algosdk.indexerModels.TransactionAssetTransfer`. Indexer Fields for an asset transfer transaction. https://dev.algorand.co/reference/rest-apis/indexer#transactionassettransfer

#### Defined in

[src/types/indexer.ts:111](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L111)

___

### AssetsCreatedLookupResult

Ƭ **AssetsCreatedLookupResult**: `indexerModels.AssetsResponse`

**`Deprecated`**

Use `algosdk.indexerModels.AssetsResponse`. Indexer result for an account's created assets, https://dev.algorand.co/reference/rest-apis/indexer#get-v2accountsaccount-idcreated-assets

#### Defined in

[src/types/indexer.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L13)

___

### AssetsLookupResult

Ƭ **AssetsLookupResult**: `indexerModels.AssetHoldingsResponse`

**`Deprecated`**

Use `algosdk.indexerModels.AssetHoldingsResponse`. Indexer result for an account's asset holdings, https://dev.algorand.co/reference/rest-apis/indexer#get-v2accountsaccount-idassets

#### Defined in

[src/types/indexer.ts:10](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L10)

___

### EvalDelta

Ƭ **EvalDelta**: `indexerModels.EvalDelta`

**`Deprecated`**

Use `algosdk.indexerModels.EvalDelta`. Indexer Represents a TEAL value delta. https://dev.algorand.co/reference/rest-apis/indexer#evaldelta

#### Defined in

[src/types/indexer.ts:150](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L150)

___

### EvalDeltaKeyValue

Ƭ **EvalDeltaKeyValue**: `indexerModels.EvalDeltaKeyValue`

**`Deprecated`**

Use `algosdk.indexerModels.EvalDeltaKeyValue`.

#### Defined in

[src/types/indexer.ts:141](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L141)

___

### KeyRegistrationTransactionResult

Ƭ **KeyRegistrationTransactionResult**: `indexerModels.TransactionKeyreg`

**`Deprecated`**

Use `algosdk.indexerModels.TransactionKeyreg`. Indexer Fields for a `keyreg` transaction https://dev.algorand.co/reference/rest-apis/indexer#transactionkeyreg

#### Defined in

[src/types/indexer.ts:114](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L114)

___

### LogicTransactionSignature

Ƭ **LogicTransactionSignature**: `indexerModels.TransactionSignatureLogicsig`

**`Deprecated`**

Use `algosdk.indexerModels.TransactionSignatureLogicsig`. Indexer [lsig] Programatic transaction signature.

https://dev.algorand.co/reference/rest-apis/indexer#transactionsignaturelogicsig

https://dev.algorand.co/concepts/smart-contracts/logic-sigs

#### Defined in

[src/types/indexer.ts:132](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L132)

___

### MerkleArrayProof

Ƭ **MerkleArrayProof**: `indexerModels.MerkleArrayProof`

**`Deprecated`**

Use `algosdk.indexerModels.MerkleArrayProof`. Indexer Merkle array Proof.

Proof is used to convince a verifier about membership of leaves: h0,h1...hn
at indexes i0,i1...in on a tree. The verifier has a trusted value of the tree
root hash.

Path is bounded by MaxNumLeaves since there could be multiple reveals, and
given the distribution of the elt positions and the depth of the tree,
the path length can increase up to 2^MaxTreeDepth / 2

Consider two different reveals for the same tree:
```
.                z5
.         z3              z4
.     y       z       z1      z2
.   q   r   s   t   u   v   w   x
.  a b c d e f g h i j k l m n o p
.    ^
. hints: [a, r, z, z4]
. len(hints) = 4
```
You need a to combine with b to get q, need r to combine with the computed q and get y, and so on.

The worst case is this:
```
.               z5
.        z3              z4
.    y       z       z1      z2
.  q   r   s   t   u   v   w   x
. a b c d e f g h i j k l m n o p
. ^   ^     ^   ^ ^   ^     ^   ^
.
. hints: [b, d, e, g, j, l, m, o]
. len(hints) = 2^4/2
```

#### Defined in

[src/types/indexer.ts:95](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L95)

___

### MiniAssetHolding

Ƭ **MiniAssetHolding**: `indexerModels.MiniAssetHolding`

**`Deprecated`**

Use `algosdk.indexerModels.MiniAssetHolding`. Indexer Describes an asset holding for an account of a known asset. https://dev.algorand.co/reference/rest-apis/indexer#miniassetholding

#### Defined in

[src/types/indexer.ts:207](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L207)

___

### MultisigTransactionSignature

Ƭ **MultisigTransactionSignature**: `indexerModels.TransactionSignatureMultisig`

**`Deprecated`**

Use `algosdk.indexerModels.TransactionSignatureMultisig`. Indexer [msig] structure holding multiple subsignatures. https://dev.algorand.co/reference/rest-apis/indexer#transactionsignaturemultisig

#### Defined in

[src/types/indexer.ts:135](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L135)

___

### MultisigTransactionSubSignature

Ƭ **MultisigTransactionSubSignature**: `indexerModels.TransactionSignatureMultisigSubsignature`

**`Deprecated`**

Use `algosdk.indexerModels.TransactionSignatureMultisigSubsignature`. Indexer Sub-signature for a multisig signature https://dev.algorand.co/reference/rest-apis/indexer#transactionsignaturemultisigsubsignature

#### Defined in

[src/types/indexer.ts:138](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L138)

___

### PaymentTransactionResult

Ƭ **PaymentTransactionResult**: `indexerModels.TransactionPayment`

**`Deprecated`**

Use `algosdk.indexerModels.TransactionPayment`. Indexer Fields for a payment transaction https://dev.algorand.co/reference/rest-apis/indexer#transactionpayment

#### Defined in

[src/types/indexer.ts:47](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L47)

___

### StateDelta

Ƭ **StateDelta**: [`EvalDeltaKeyValue`](types_indexer.md#evaldeltakeyvalue)[]

**`Deprecated`**

Use `algosdk.indexerModels.EvalDeltaKeyValue[]`.

#### Defined in

[src/types/indexer.ts:147](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L147)

___

### StateProofTransactionResult

Ƭ **StateProofTransactionResult**: `indexerModels.TransactionStateProof`

**`Deprecated`**

Use `algosdk.indexerModels.TransactionStateProof`. Indexer Fields for a state proof transaction https://dev.algorand.co/reference/rest-apis/indexer#transactionstateproof.

See also https://dev.algorand.co/concepts/protocol/state-proofs/,
https://github.com/algorand/go-algorand/blob/master/data/transactions/stateproof.go,
https://github.com/algorand/go-algorand/blob/master/crypto/stateproof/structs.go,
https://github.com/algorand/go-algorand/blob/master/data/stateproofmsg/message.go, and
https://dev.algorand.co/reference/rest-apis/algod/#stateproof.

#### Defined in

[src/types/indexer.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L57)

___

### StateSchema

Ƭ **StateSchema**: `indexerModels.StateSchema`

**`Deprecated`**

Use `algosdk.indexerModels.StateSchema`. Indexer Represents a [apls] local-state or [apgs] global-state schema.
https://dev.algorand.co/reference/rest-apis/indexer#stateschema

These schemas determine how much storage may be used in a local-state or global-state for an application.

The more space used, the larger minimum balance must be maintained in the account holding the data.

#### Defined in

[src/types/indexer.ts:162](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L162)

___

### TransactionLookupResult

Ƭ **TransactionLookupResult**: `indexerModels.TransactionResponse`

**`Deprecated`**

Use `algosdk.indexerModels.TransactionResponse`. Indexer result for a transaction lookup, https://dev.algorand.co/reference/rest-apis/indexer#get-v2transactionstxid

#### Defined in

[src/types/indexer.ts:35](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L35)

___

### TransactionResult

Ƭ **TransactionResult**: `indexerModels.Transaction`

**`Deprecated`**

Use `algosdk.indexerModels.Transaction`. Indexer result for a transaction, https://dev.algorand.co/reference/rest-apis/indexer#transaction

#### Defined in

[src/types/indexer.ts:41](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L41)

___

### TransactionSearchResults

Ƭ **TransactionSearchResults**: `indexerModels.TransactionsResponse`

**`Deprecated`**

Use `algosdk.indexerModels.TransactionsResponse`. Indexer result for a transaction search, https://dev.algorand.co/reference/rest-apis/indexer#get-v2transactions

#### Defined in

[src/types/indexer.ts:4](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L4)

___

### TransactionSignature

Ƭ **TransactionSignature**: `indexerModels.TransactionSignature`

**`Deprecated`**

Use `algosdk.indexerModels.TransactionSignature`. Indexer Validation signature associated with some data. Only one of the signatures should be provided. https://dev.algorand.co/reference/rest-apis/indexer#transactionsignature

#### Defined in

[src/types/indexer.ts:124](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L124)
