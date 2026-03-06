/**
 * Example: HD Signing From Keyring
 *
 * This example demonstrates how to retrieve secrets from a keyring and use them to sign
 * transactions.
 *
 * Prerequisites:
 * - LocalNet running (via `algokit localnet start`)
 * - OS that has keyring support
 */

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

    // The last 32 bytes of the extended private key is the chain code, which is not needed for signing. This means in most cases you can
    // just store the first 64 bytes and then pad the secret to 96 bytes in the unwrap function. If you are storing the full 96 bytes,
    // you can just return the secret as is.
    if (esk.length === 64) {
      const paddedEsk = new Uint8Array(96)
      paddedEsk.set(esk, 0)
      return paddedEsk
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
