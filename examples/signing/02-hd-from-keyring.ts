/* eslint-disable no-console */

import {
  ed25519SigningKeyFromWrappedSecret,
  peikertXHdWalletGenerator,
  WrappedHdExtendedPrivateKey,
} from '@algorandfoundation/algokit-crypto'
import { algo, AlgorandClient, microAlgo } from '@algorandfoundation/algokit-utils'
import { generateAddressWithSigners } from '@algorandfoundation/algokit-utils/transact'
import { Entry } from '@napi-rs/keyring'

const SECRET_NAME = 'algorand-mainnet-mnemonic'

// Setup: Creating an HD account an save the extended private key in the keyring.
const seed = crypto.getRandomValues(new Uint8Array(32))
const { accountGenerator } = await peikertXHdWalletGenerator(seed)
const esk = (await accountGenerator(0, 0)).extendedPrivateKey

const entry = new Entry('algorand', SECRET_NAME)
entry.setSecret(esk)

// Example: Signing a transaction using the extended private key from the keyring.
const wrappedSeed: WrappedHdExtendedPrivateKey = {
  unwrapHdExtendedPrivateKey: async () => {
    const entry = new Entry('algorand', SECRET_NAME)
    const esk = entry.getSecret()

    if (!esk) {
      throw new Error(`No mnemonic found in keyring for ${SECRET_NAME}`)
    }

    return new Uint8Array(esk)
  },
  wrapHdExtendedPrivateKey: async () => {},
}

const signingKey = await ed25519SigningKeyFromWrappedSecret(wrappedSeed)
const algorandAccount = generateAddressWithSigners(signingKey)

const algorand = AlgorandClient.defaultLocalNet()

await algorand.account.ensureFundedFromEnvironment(algorandAccount.addr, algo(1))

// FIXME: No signer found when algorandAccount is sender without explicit signer
// FIXME: Logs show Sending 0 µALGO from [object Object] to [object Object] via transaction UKEP7PS5G7YAX22ECEQZAOFGHKZZOAMJ3SMJ3VC3UYCJVTRQIN4A
await AlgorandClient.defaultLocalNet().send.payment({
  sender: algorandAccount,
  signer: algorandAccount,
  receiver: algorandAccount,
  amount: microAlgo(0),
})
