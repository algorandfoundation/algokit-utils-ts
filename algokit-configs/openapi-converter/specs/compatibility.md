| Endpoint                                                 | Response-msgpack | Input-msgpack | Response-json | Input-json |
| -------------------------------------------------------- | ---------------- | ------------- | ------------- | ---------- |
| GET /health                                              | ❌               | N/A           | ✅            | N/A        |
| GET /ready                                               | ❌               | N/A           | ✅            | N/A        |
| GET /metrics                                             | ❌               | N/A           | ✅            | N/A        |
| GET /genesis                                             | ❌               | N/A           | ✅            | N/A        |
| GET /swagger.json                                        | ❌               | N/A           | ✅            | N/A        |
| GET /versions                                            | ❌               | N/A           | ✅            | N/A        |
| GET /debug/settings/pprof                                | ❌               | N/A           | ✅            | N/A        |
| PUT /debug/settings/pprof                                | ❌               | N/A           | ✅            | N/A        |
| GET /debug/settings/config                               | ❌               | N/A           | ✅            | N/A        |
| GET /v2/accounts/{address}                               | ✅               | N/A           | ✅            | N/A        |
| GET /v2/accounts/{address}/assets/{asset-id}             | ✅               | N/A           | ✅            | N/A        |
| GET /v2/accounts/{address}/assets                        | ❌               | N/A           | ✅            | N/A        |
| GET /v2/accounts/{address}/applications/{application-id} | ✅               | N/A           | ✅            | N/A        |
| GET /v2/accounts/{address}/transactions/pending          | ✅               | N/A           | ✅            | N/A        |
| GET /v2/blocks/{round}                                   | ✅               | N/A           | ✅            | N/A        |
| GET /v2/blocks/{round}/txids                             | ❌               | N/A           | ✅            | N/A        |
| GET /v2/blocks/{round}/hash                              | ❌               | N/A           | ✅            | N/A        |
| GET /v2/blocks/{round}/transactions/{txid}/proof         | ❌               | N/A           | ✅            | N/A        |
| GET /v2/blocks/{round}/logs                              | ❌               | N/A           | ✅            | N/A        |
| GET /v2/ledger/supply                                    | ❌               | N/A           | ✅            | N/A        |
| GET /v2/participation                                    | ❌               | N/A           | ✅            | N/A        |
| POST /v2/participation                                   | ❌               | ✅            | ✅            | ❌         |
| POST /v2/participation/generate/{address}                | ❌               | N/A           | ✅            | N/A        |
| GET /v2/participation/{participation-id}                 | ❌               | N/A           | ✅            | N/A        |
| POST /v2/participation/{participation-id}                | ❌               | ✅            | ✅            | ❌         |
| DELETE /v2/participation/{participation-id}              | ❌               | N/A           | ✅            | N/A        |
| POST /v2/shutdown                                        | ❌               | N/A           | ✅            | N/A        |
| GET /v2/status                                           | ❌               | N/A           | ✅            | N/A        |
| GET /v2/status/wait-for-block-after/{round}              | ❌               | N/A           | ✅            | N/A        |
| POST /v2/transactions                                    | ❌               | ❌            | ✅            | ❌         |
| POST /v2/transactions/async                              | ❌               | ❌            | ✅            | ❌         |
| POST /v2/transactions/simulate                           | ✅               | ✅            | ✅            | ✅         |
| GET /v2/transactions/params                              | ❌               | N/A           | ✅            | N/A        |
| GET /v2/transactions/pending                             | ✅               | N/A           | ✅            | N/A        |
| GET /v2/transactions/pending/{txid}                      | ✅               | N/A           | ✅            | N/A        |
| GET /v2/deltas/{round}                                   | ✅               | N/A           | ✅            | N/A        |
| GET /v2/deltas/{round}/txn/group                         | ✅               | N/A           | ✅            | N/A        |
| GET /v2/deltas/txn/group/{id}                            | ✅               | N/A           | ✅            | N/A        |
| GET /v2/stateproofs/{round}                              | ❌               | N/A           | ✅            | N/A        |
| GET /v2/blocks/{round}/lightheader/proof                 | ❌               | N/A           | ✅            | N/A        |
| GET /v2/applications/{application-id}                    | ❌               | N/A           | ✅            | N/A        |
| GET /v2/applications/{application-id}/boxes              | ❌               | N/A           | ✅            | N/A        |
| GET /v2/applications/{application-id}/box                | ❌               | N/A           | ✅            | N/A        |
| GET /v2/assets/{asset-id}                                | ❌               | N/A           | ✅            | N/A        |
| GET /v2/ledger/sync                                      | ❌               | N/A           | ✅            | N/A        |
| DELETE /v2/ledger/sync                                   | ❌               | N/A           | ✅            | N/A        |
| POST /v2/ledger/sync/{round}                             | ❌               | N/A           | ✅            | N/A        |
| POST /v2/teal/compile                                    | ❌               | N/A           | ✅            | ❌         |
| POST /v2/teal/disassemble                                | ❌               | N/A           | ✅            | ❌         |
| POST /v2/catchup/{catchpoint}                            | ❌               | N/A           | ✅            | N/A        |
| DELETE /v2/catchup/{catchpoint}                          | ❌               | N/A           | ✅            | N/A        |
| POST /v2/teal/dryrun                                     | ❌               | ✅            | ✅            | ✅         |
| GET /v2/experimental                                     | ❌               | N/A           | ✅            | N/A        |
| GET /v2/devmode/blocks/offset                            | ❌               | N/A           | ✅            | N/A        |
| POST /v2/devmode/blocks/offset/{offset}                  | ❌               | N/A           | ✅            | N/A        |

Similar to above but focused on abstractions:

| Abstraction                         | Related Endpoints                                                             | Supports msgpack Encoding | Supports msgpack Decoding |
| ----------------------------------- | ----------------------------------------------------------------------------- | ------------------------- | ------------------------- |
| Account                             | GET /v2/accounts/{address}                                                    | No                        | Yes                       |
| AccountAssetResponse                | GET /v2/accounts/{address}/assets/{asset-id}                                  | No                        | Yes                       |
| AccountApplicationResponse          | GET /v2/accounts/{address}/applications/{application-id}                      | No                        | Yes                       |
| AssetHolding                        | GET /v2/accounts/{address}/assets/{asset-id}                                  | No                        | Yes                       |
| ApplicationLocalState               | GET /v2/accounts/{address}/applications/{application-id}                      | No                        | Yes                       |
| BlockResponse                       | GET /v2/blocks/{round}                                                        | No                        | Yes                       |
| PendingTransactions                 | GET /v2/transactions/pending, GET /v2/accounts/{address}/transactions/pending | No                        | Yes                       |
| PendingTransactionResponse          | GET /v2/transactions/pending/{txid}                                           | No                        | Yes                       |
| LedgerStateDelta                    | GET /v2/deltas/{round}, GET /v2/deltas/txn/group/{id}                         | No                        | Yes                       |
| LedgerStateDeltaForTransactionGroup | GET /v2/deltas/{round}/txn/group                                              | No                        | Yes                       |
| SimulateRequest                     | POST /v2/transactions/simulate                                                | Yes                       | No                        |
| SimulateResponse                    | POST /v2/transactions/simulate (response)                                     | No                        | Yes                       |
| DryrunRequest                       | POST /v2/teal/dryrun                                                          | Yes                       | No                        |
| DryrunResponse                      | POST /v2/teal/dryrun (response)                                               | No                        | Yes                       |
| ErrorResponse                       | Various error responses across all endpoints                                  | No                        | Yes                       |

This table shows that while many abstractions in the Algorand API support msgpack decoding (receiving msgpack from the API), only two abstractions - SimulateRequest and DryrunRequest - support msgpack encoding (sending msgpack to the API).
