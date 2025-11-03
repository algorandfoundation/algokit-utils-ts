# MIGRATION NOTES

A collection of random notes pop up during the migration process.

- TODO: review the retry logic
- const { lastRound: firstRound } = suggestedParams! // TODO: document suggested params doesn't have first round anymore
- explain the type differences between transact and algod
- remove waitForIndexer
  - DO NOT remove it
- BIG CHANGE: transaction Id can be changed after sending with composer because the group Id can be added
- ATC was removed as a transaction type in the composer
- Fee calc inside the txn constructor
- error messages changed, for example, asset tests
- `AssetHoldingReference` replaced by `HoldingReference`
- `ApplicationLocalReference` replaced by `LocalsReference`
- BoxReference is gone too
- Error name is gone (snapshot tests updated)
- TODO: remove the ATC too
- TODO: add interface for breaking change, for example, Transaction
- TODO: simplify signer + account
- TODO: take notes of the legacy functions to be removed and communicate with devrels
- TODO: standardise box ref
- TODO: keep track of the changes we make to algokit_transact to fit with algosdk
- For integration with lora to work:
  - need to update subscriber to use the new utils and remove algosdk
- TODO: go ahead with resource/fee on build. Need to have backward compatibility, when resource population is set in send, do it but make sure that it only happens once.
- TODO: convert transaction to class
- Should we consolidate the duplicated types between SDK and Utils, for example `AccessReference` in `app-manager`
- `encodeUnsignedSimulateTransaction` was removed from sdk
- Consider align assetId and appId in PendingTransactionResponse with sdk?
- can't add atc into the composer anymore
- SendAtomicTransactionComposerResults.group is string | undefined
