/* eslint-disable no-console */

import { ed25519SigningKeyFromWrappedSecret, WrappedEd25519Seed } from '@algorandfoundation/algokit-crypto'
import { algo, AlgorandClient, microAlgo } from '@algorandfoundation/algokit-utils'
import { mnemonicFromSeed, seedFromMnemonic } from '@algorandfoundation/algokit-utils/algo25'
import { generateAddressWithSigners } from '@algorandfoundation/algokit-utils/transact'
import { Entry } from '@napi-rs/keyring'

const MNEMONIC_NAME = 'algorand-mainnet-mnemonic'

// Demo
const seed = crypto.getRandomValues(new Uint8Array(32))
const mnemonic = mnemonicFromSeed(seed)

const entry = new Entry('algorand', MNEMONIC_NAME)
entry.setPassword(mnemonic)

const wrappedSeed: WrappedEd25519Seed = {
  unwrapEd25519Seed: async () => {
    const entry = new Entry('algorand', MNEMONIC_NAME)
    const mn = entry.getPassword()

    if (!mn) {
      throw new Error(`No mnemonic found in keyring for ${MNEMONIC_NAME}`)
    }

    return seedFromMnemonic(mn)
  },
  wrapEd25519Seed: async () => {},
}

const signingKey = await ed25519SigningKeyFromWrappedSecret(wrappedSeed)
const algorandAccount = generateAddressWithSigners(signingKey)

const algorand = AlgorandClient.defaultLocalNet()

await algorand.account.ensureFundedFromEnvironment(algorandAccount.addr, algo(1))

// FIXME: No signer found when algorandAccount is sender without explicit signer
// FIXME: Logs show Sending 0 µALGO from [object Object] to [object Object] via transaction UKEP7PS5G7YAX22ECEQZAOFGHKZZOAMJ3SMJ3VC3UYCJVTRQIN4A
const pay = await AlgorandClient.defaultLocalNet().send.payment({
  sender: algorandAccount,
  signer: algorandAccount,
  receiver: algorandAccount,
  amount: microAlgo(0),
})

if (!pay.confirmation.confirmedRound) {
  console.error('Payment failed')
  process.exit(1)
}
