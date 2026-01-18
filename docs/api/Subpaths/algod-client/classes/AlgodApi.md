[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/algod-client](../README.md) / AlgodApi

# Class: AlgodApi

Defined in: [packages/algod\_client/src/apis/api-service.ts:70](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L70)

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extended by

- [`AlgodClient`](AlgodClient.md)

## Constructors

### Constructor

> **new AlgodApi**(`httpRequest`): `AlgodApi`

Defined in: [packages/algod\_client/src/apis/api-service.ts:71](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L71)

#### Parameters

##### httpRequest

[`BaseHttpRequest`](BaseHttpRequest.md)

#### Returns

`AlgodApi`

## Properties

### httpRequest

> `readonly` **httpRequest**: [`BaseHttpRequest`](BaseHttpRequest.md)

Defined in: [packages/algod\_client/src/apis/api-service.ts:71](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L71)

## Methods

### accountApplicationInformation()

> **accountApplicationInformation**(`address`, `applicationId`): `Promise`\<[`AccountApplicationResponse`](../type-aliases/AccountApplicationResponse.md)\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:80](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L80)

Given a specific account public key and application ID, this call returns the account's application local state and global state (AppLocalState and AppParams, if either exists). Global state will only be returned if the provided address is the application's creator.

#### Parameters

##### address

[`ReadableAddress`](../../../algokit-utils/type-aliases/ReadableAddress.md)

##### applicationId

`number` | `bigint`

#### Returns

`Promise`\<[`AccountApplicationResponse`](../type-aliases/AccountApplicationResponse.md)\>

***

### accountAssetInformation()

> **accountAssetInformation**(`address`, `assetId`): `Promise`\<[`AccountAssetResponse`](../type-aliases/AccountAssetResponse.md)\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:100](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L100)

Given a specific account public key and asset ID, this call returns the account's asset holding and asset parameters (if either exist). Asset parameters will only be returned if the provided address is the asset's creator.

#### Parameters

##### address

[`ReadableAddress`](../../../algokit-utils/type-aliases/ReadableAddress.md)

##### assetId

`number` | `bigint`

#### Returns

`Promise`\<[`AccountAssetResponse`](../type-aliases/AccountAssetResponse.md)\>

***

### accountInformation()

> **accountInformation**(`address`, `params?`): `Promise`\<[`Account`](../type-aliases/Account.md)\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:120](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L120)

Given a specific account public key, this call returns the account's status, balance and spendable amounts

#### Parameters

##### address

[`ReadableAddress`](../../../algokit-utils/type-aliases/ReadableAddress.md)

##### params?

###### exclude?

`"all"` \| `"none"`

#### Returns

`Promise`\<[`Account`](../type-aliases/Account.md)\>

***

### applicationBoxByName()

> **applicationBoxByName**(`applicationId`, `boxName`): `Promise`\<[`Box`](../type-aliases/Box.md)\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:789](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L789)

Given an application ID and box name, it returns the round, box name, and value.

#### Parameters

##### applicationId

`number` | `bigint`

##### boxName

`Uint8Array`

#### Returns

`Promise`\<[`Box`](../type-aliases/Box.md)\>

***

### applicationBoxes()

> **applicationBoxes**(`applicationId`, `params?`): `Promise`\<[`BoxesResponse`](../type-aliases/BoxesResponse.md)\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:160](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L160)

Given an application ID, return all Box names. No particular ordering is guaranteed. Request fails when client or server-side configured limits prevent returning all Box names.

#### Parameters

##### applicationId

`number` | `bigint`

##### params?

###### max?

`number`

#### Returns

`Promise`\<[`BoxesResponse`](../type-aliases/BoxesResponse.md)\>

***

### applicationById()

> **applicationById**(`applicationId`): `Promise`\<[`Application`](../type-aliases/Application.md)\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:180](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L180)

Given a application ID, it returns application information including creator, approval and clear programs, global and local schemas, and global state.

#### Parameters

##### applicationId

`number` | `bigint`

#### Returns

`Promise`\<[`Application`](../type-aliases/Application.md)\>

***

### assetById()

> **assetById**(`assetId`): `Promise`\<[`Asset`](../type-aliases/Asset.md)\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:200](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L200)

Given a asset ID, it returns asset information including creator, name, total supply and special addresses.

#### Parameters

##### assetId

`number` | `bigint`

#### Returns

`Promise`\<[`Asset`](../type-aliases/Asset.md)\>

***

### block()

> **block**(`round`, `params?`): `Promise`\<[`BlockResponse`](../type-aliases/BlockResponse.md)\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:217](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L217)

#### Parameters

##### round

`number` | `bigint`

##### params?

###### headerOnly?

`boolean`

#### Returns

`Promise`\<[`BlockResponse`](../type-aliases/BlockResponse.md)\>

***

### blockHash()

> **blockHash**(`round`): `Promise`\<[`BlockHashResponse`](../type-aliases/BlockHashResponse.md)\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:234](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L234)

#### Parameters

##### round

`number` | `bigint`

#### Returns

`Promise`\<[`BlockHashResponse`](../type-aliases/BlockHashResponse.md)\>

***

### blockTimeStampOffset()

> **blockTimeStampOffset**(): `Promise`\<[`GetBlockTimeStampOffsetResponse`](../type-aliases/GetBlockTimeStampOffsetResponse.md)\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:254](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L254)

Gets the current timestamp offset.

#### Returns

`Promise`\<[`GetBlockTimeStampOffsetResponse`](../type-aliases/GetBlockTimeStampOffsetResponse.md)\>

***

### blockTxIds()

> **blockTxIds**(`round`): `Promise`\<[`BlockTxidsResponse`](../type-aliases/BlockTxidsResponse.md)\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:271](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L271)

#### Parameters

##### round

`number` | `bigint`

#### Returns

`Promise`\<[`BlockTxidsResponse`](../type-aliases/BlockTxidsResponse.md)\>

***

### genesis()

> **genesis**(): `Promise`\<[`Genesis`](../type-aliases/Genesis.md)\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:291](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L291)

Returns the entire genesis file in json.

#### Returns

`Promise`\<[`Genesis`](../type-aliases/Genesis.md)\>

***

### healthCheck()

> **healthCheck**(): `Promise`\<`void`\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:308](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L308)

#### Returns

`Promise`\<`void`\>

***

### ledgerStateDelta()

> **ledgerStateDelta**(`round`): `Promise`\<[`LedgerStateDelta`](../type-aliases/LedgerStateDelta.md)\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:326](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L326)

Get ledger deltas for a round.

#### Parameters

##### round

`number` | `bigint`

#### Returns

`Promise`\<[`LedgerStateDelta`](../type-aliases/LedgerStateDelta.md)\>

***

### ledgerStateDeltaForTransactionGroup()

> **ledgerStateDeltaForTransactionGroup**(`id`): `Promise`\<[`LedgerStateDelta`](../type-aliases/LedgerStateDelta.md)\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:346](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L346)

Get a ledger delta for a given transaction group.

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`LedgerStateDelta`](../type-aliases/LedgerStateDelta.md)\>

***

### lightBlockHeaderProof()

> **lightBlockHeaderProof**(`round`): `Promise`\<[`LightBlockHeaderProof`](../type-aliases/LightBlockHeaderProof.md)\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:363](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L363)

#### Parameters

##### round

`number` | `bigint`

#### Returns

`Promise`\<[`LightBlockHeaderProof`](../type-aliases/LightBlockHeaderProof.md)\>

***

### pendingTransactionInformation()

> **pendingTransactionInformation**(`txId`): `Promise`\<[`PendingTransactionResponse`](../type-aliases/PendingTransactionResponse.md)\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:387](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L387)

Given a transaction ID of a recently submitted transaction, it returns information about it.  There are several cases when this might succeed:
- transaction committed (committed round > 0)
- transaction still in the pool (committed round = 0, pool error = "")
- transaction removed from pool due to error (committed round = 0, pool error != "")
Or the transaction may have happened sufficiently long ago that the node no longer remembers it, and this will return an error.

#### Parameters

##### txId

`string`

#### Returns

`Promise`\<[`PendingTransactionResponse`](../type-aliases/PendingTransactionResponse.md)\>

***

### pendingTransactions()

> **pendingTransactions**(`params?`): `Promise`\<[`PendingTransactionsResponse`](../type-aliases/PendingTransactionsResponse.md)\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:407](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L407)

Get the list of pending transactions, sorted by priority, in decreasing order, truncated at the end at MAX. If MAX = 0, returns all pending transactions.

#### Parameters

##### params?

###### max?

`number`

#### Returns

`Promise`\<[`PendingTransactionsResponse`](../type-aliases/PendingTransactionsResponse.md)\>

***

### pendingTransactionsByAddress()

> **pendingTransactionsByAddress**(`address`, `params?`): `Promise`\<[`PendingTransactionsResponse`](../type-aliases/PendingTransactionsResponse.md)\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:427](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L427)

Get the list of pending transactions by address, sorted by priority, in decreasing order, truncated at the end at MAX. If MAX = 0, returns all pending transactions.

#### Parameters

##### address

[`ReadableAddress`](../../../algokit-utils/type-aliases/ReadableAddress.md)

##### params?

###### max?

`number`

#### Returns

`Promise`\<[`PendingTransactionsResponse`](../type-aliases/PendingTransactionsResponse.md)\>

***

### ready()

> **ready**(): `Promise`\<`void`\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:465](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L465)

#### Returns

`Promise`\<`void`\>

***

### sendRawTransaction()

> **sendRawTransaction**(`stxOrStxs`): `Promise`\<[`PostTransactionsResponse`](../type-aliases/PostTransactionsResponse.md)\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:773](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L773)

Send a signed transaction or array of signed transactions to the network.

#### Parameters

##### stxOrStxs

`Uint8Array` | `Uint8Array`[]

#### Returns

`Promise`\<[`PostTransactionsResponse`](../type-aliases/PostTransactionsResponse.md)\>

***

### setBlockTimeStampOffset()

> **setBlockTimeStampOffset**(`offset`): `Promise`\<`void`\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:483](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L483)

Sets the timestamp offset (seconds) for blocks in dev mode. Providing an offset of 0 will unset this value and try to use the real clock for the timestamp.

#### Parameters

##### offset

`number`

#### Returns

`Promise`\<`void`\>

***

### setSyncRound()

> **setSyncRound**(`round`): `Promise`\<`void`\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:501](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L501)

Sets the minimum sync round on the ledger.

#### Parameters

##### round

`number` | `bigint`

#### Returns

`Promise`\<`void`\>

***

### simulateRawTransactions()

> **simulateRawTransactions**(`stxOrStxs`): `Promise`\<[`SimulateResponse`](../type-aliases/SimulateResponse.md)\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:822](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L822)

Simulate an encoded signed transaction or array of encoded signed transactions.

#### Parameters

##### stxOrStxs

`Uint8Array` | `Uint8Array`[]

#### Returns

`Promise`\<[`SimulateResponse`](../type-aliases/SimulateResponse.md)\>

***

### simulateTransactions()

> **simulateTransactions**(`body`): `Promise`\<[`SimulateResponse`](../type-aliases/SimulateResponse.md)\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:516](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L516)

#### Parameters

##### body

[`SimulateRequest`](../type-aliases/SimulateRequest.md)

#### Returns

`Promise`\<[`SimulateResponse`](../type-aliases/SimulateResponse.md)\>

***

### stateProof()

> **stateProof**(`round`): `Promise`\<[`StateProof`](../type-aliases/StateProof.md)\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:538](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L538)

#### Parameters

##### round

`number` | `bigint`

#### Returns

`Promise`\<[`StateProof`](../type-aliases/StateProof.md)\>

***

### status()

> **status**(): `Promise`\<[`NodeStatusResponse`](../type-aliases/NodeStatusResponse.md)\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:555](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L555)

#### Returns

`Promise`\<[`NodeStatusResponse`](../type-aliases/NodeStatusResponse.md)\>

***

### statusAfterBlock()

> **statusAfterBlock**(`round`): `Promise`\<[`NodeStatusResponse`](../type-aliases/NodeStatusResponse.md)\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:575](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L575)

Waits for a block to appear after round {round} and returns the node's status at the time. There is a 1 minute timeout, when reached the current status is returned regardless of whether or not it is the round after the given round.

#### Parameters

##### round

`number` | `bigint`

#### Returns

`Promise`\<[`NodeStatusResponse`](../type-aliases/NodeStatusResponse.md)\>

***

### suggestedParams()

> **suggestedParams**(): `Promise`\<\{ `consensusVersion`: `string`; `fee`: `bigint`; `firstValid`: `bigint`; `flatFee`: `boolean`; `genesisHash`: `Uint8Array`; `genesisId`: `string`; `lastValid`: `bigint`; `minFee`: `bigint`; \}\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:797](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L797)

Returns the common needed parameters for a new transaction.

#### Returns

`Promise`\<\{ `consensusVersion`: `string`; `fee`: `bigint`; `firstValid`: `bigint`; `flatFee`: `boolean`; `genesisHash`: `Uint8Array`; `genesisId`: `string`; `lastValid`: `bigint`; `minFee`: `bigint`; \}\>

***

### supply()

> **supply**(): `Promise`\<[`SupplyResponse`](../type-aliases/SupplyResponse.md)\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:592](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L592)

#### Returns

`Promise`\<[`SupplyResponse`](../type-aliases/SupplyResponse.md)\>

***

### syncRound()

> **syncRound**(): `Promise`\<[`GetSyncRoundResponse`](../type-aliases/GetSyncRoundResponse.md)\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:612](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L612)

Gets the minimum sync round for the ledger.

#### Returns

`Promise`\<[`GetSyncRoundResponse`](../type-aliases/GetSyncRoundResponse.md)\>

***

### tealCompile()

> **tealCompile**(`body`, `params?`): `Promise`\<[`CompileResponse`](../type-aliases/CompileResponse.md)\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:632](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L632)

Given TEAL source code in plain text, return base64 encoded program bytes and base32 SHA512_256 hash of program bytes (Address style). This endpoint is only enabled when a node's configuration file sets EnableDeveloperAPI to true.

#### Parameters

##### body

`string`

##### params?

###### sourcemap?

`boolean`

#### Returns

`Promise`\<[`CompileResponse`](../type-aliases/CompileResponse.md)\>

***

### tealDisassemble()

> **tealDisassemble**(`body`): `Promise`\<[`DisassembleResponse`](../type-aliases/DisassembleResponse.md)\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:657](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L657)

Given the program bytes, return the TEAL source code in plain text. This endpoint is only enabled when a node's configuration file sets EnableDeveloperAPI to true.

#### Parameters

##### body

`Uint8Array`

#### Returns

`Promise`\<[`DisassembleResponse`](../type-aliases/DisassembleResponse.md)\>

***

### transactionGroupLedgerStateDeltasForRound()

> **transactionGroupLedgerStateDeltasForRound**(`round`): `Promise`\<[`TransactionGroupLedgerStateDeltasForRoundResponse`](../type-aliases/TransactionGroupLedgerStateDeltasForRoundResponse.md)\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:681](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L681)

Get ledger deltas for transaction groups in a given round.

#### Parameters

##### round

`number` | `bigint`

#### Returns

`Promise`\<[`TransactionGroupLedgerStateDeltasForRoundResponse`](../type-aliases/TransactionGroupLedgerStateDeltasForRoundResponse.md)\>

***

### transactionParams()

> **transactionParams**(): `Promise`\<\{ `consensusVersion`: `string`; `fee`: `bigint`; `firstValid`: `bigint`; `flatFee`: `boolean`; `genesisHash`: `Uint8Array`; `genesisId`: `string`; `lastValid`: `bigint`; `minFee`: `bigint`; \}\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:815](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L815)

Returns the common needed parameters for a new transaction.

#### Returns

`Promise`\<\{ `consensusVersion`: `string`; `fee`: `bigint`; `firstValid`: `bigint`; `flatFee`: `boolean`; `genesisHash`: `Uint8Array`; `genesisId`: `string`; `lastValid`: `bigint`; `minFee`: `bigint`; \}\>

***

### transactionProof()

> **transactionProof**(`round`, `txId`, `params?`): `Promise`\<[`TransactionProof`](../type-aliases/TransactionProof.md)\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:715](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L715)

#### Parameters

##### round

`number` | `bigint`

##### txId

`string`

##### params?

###### hashtype?

`"sha512_256"` \| `"sha256"`

#### Returns

`Promise`\<[`TransactionProof`](../type-aliases/TransactionProof.md)\>

***

### unsetSyncRound()

> **unsetSyncRound**(): `Promise`\<`void`\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:735](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L735)

Unset the ledger sync round.

#### Returns

`Promise`\<`void`\>

***

### version()

> **version**(): `Promise`\<[`Version`](../type-aliases/Version.md)\>

Defined in: [packages/algod\_client/src/apis/api-service.ts:753](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/apis/api-service.ts#L753)

Retrieves the supported API versions, binary build versions, and genesis information.

#### Returns

`Promise`\<[`Version`](../type-aliases/Version.md)\>
