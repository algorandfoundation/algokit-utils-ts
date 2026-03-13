---
title: Secret management
description: AlgoKit utils provides interfaces and concrete functions to enable secure management of secret material for signing transactions. This includes support for using an external KMS or key wrapping and unwrapping with a secrets manager.
---

In general, there are three levels of security when it comes to signing transactions with secret material:

1. KMS - The secret material is never exposed to the application
1. Key Wrapping and Unwrapping - The secret material is stored outside of the app (i.e. keychain) and only loaded in memory when signing
1. Plaintext - The secret material is stored in plaintext (i.e. in the environment) and is accessible throughout the runtime of the application

While using plaintext environment variables may be the easier to setup, it is **not recommended** for production use. A compromised environment and/or dependency could lead to the secret material being compromised. Additionally, it is easy to accidentally leak secrets in plaintext through git commits.

The most secure option is to use an external KMS that completely isolates the secret material from the application. KMS', however, can have a high setup cost which may be difficult for a solo developer or small team to manage properly. In this case, the next recommended option is to use key wrapping and unwrapping with a secrets manager. This allows the secret material to be stored securely outside of the application and only loaded in memory when signing is necessary. For example, on a local machine, the OS keyring can be used to store the secret material and only load it when signing transactions.

## Signing with a Wrapped Secret

### Using Keyring Secrets

To read a mnemonic from the OS keyring, you can use the `@napi-rs/keyring` library. This prevents the mnemonic from being stored in
plaintext and ensures it is only loaded in memory when signing.

#### Ed25519 Seed or Mnemonic

When working with a ed25519 seed or mnemonic, you can implement the `WrappedEd25519Seed` interface which allows you to wrap and unwrap the seed as needed. For example, with `@napi-rs/keyring`:

```ts
import { ed25519SigningKeyFromWrappedSecret, WrappedEd25519Seed } from '@algorandfoundation/algokit-utils/crypto'
import { algo, AlgorandClient, microAlgo } from '@algorandfoundation/algokit-utils'
import { mnemonicFromSeed, seedFromMnemonic } from '@algorandfoundation/algokit-utils/algo25'
import { generateAddressWithSigners } from '@algorandfoundation/algokit-utils/transact'
import { Entry } from '@napi-rs/keyring'

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

const pay = await AlgorandClient.defaultLocalNet().send.payment({
  sender: algorandAccount,
  receiver: algorandAccount,
  amount: microAlgo(0),
})
```

### HD Expanded Secret Key

HD accounts have a 96-byte expanded secret key that can be used in a similar manner to the ed25519 seed, except we need to implement the `WrappedHdExtendedPrivateKey` interface. For example, with `@napi-rs/keyring`:

```ts
import {
  ed25519SigningKeyFromWrappedSecret,
  peikertXHdWalletGenerator,
  WrappedHdExtendedPrivateKey,
} from '@algorandfoundation/algokit-utils/crypto'
import { algo, AlgorandClient, microAlgo } from '@algorandfoundation/algokit-utils'
import { generateAddressWithSigners } from '@algorandfoundation/algokit-utils/transact'
import { Entry } from '@napi-rs/keyring'

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

await AlgorandClient.defaultLocalNet().send.payment({
  sender: algorandAccount,
  receiver: algorandAccount,
  amount: microAlgo(0),
})
```

## Signing with a KMS

### Note on KMS Authentication in CI

If you are using a KMS in CI, the best practice for performing signing operations OIDC. For guides for setting up OIDC, refer to the [GitHub documentation](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments).

### Signing with AWS KMS

Using the KMS, you can retrieve the public key and implement `RawEd25519Signer` signer which can then be used to generate an Algorand address and all Algorand-specific signing functions. For example, with AWS:

```ts
import { RawEd25519Signer } from '@algorandfoundation/algokit-utils/crypto'
import { AlgorandClient, microAlgos } from '@algorandfoundation/algokit-utils'
import { generateAddressWithSigners } from '@algorandfoundation/algokit-utils/transact'
import { KMSClient, SignCommand, GetPublicKeyCommand, SignCommandInput, GetPublicKeyCommandInput } from '@aws-sdk/client-kms'

// The following environment variables must be set for this to work:
// - AWS_REGION
// - KEY_ID
// - AWS_ACCESS_KEY_ID
// - AWS_SECRET_ACCESS_KEY
const kms = new KMSClient({ region: process.env.AWS_REGION });

const rawEd25519Signer: RawEd25519Signer = async (data: Uint8Array): Promise<Uint8Array> => {
  const resp = await kms.send(
    new SignCommand({
      KeyId: process.env.KEY_ID,
      Message: data,
      MessageType: "RAW",
      SigningAlgorithm: "ED25519_SHA_512",
    })
  );

  if (!resp.Signature) {
    throw new Error("No signature returned from KMS");
  }

  return resp.Signature;
}

const pubkeyResp = await kms.send(new GetPublicKeyCommand({
  KeyId: process.env.KEY_ID,
}));

if (!pubkeyResp.PublicKey) {
  throw new Error("No public key returned from KMS");
}

const spki = Buffer.from(pubkeyResp.PublicKey as Uint8Array);


const ed25519SpkiPrefix = Buffer.from([
  0x30, 0x2a, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, 0x03, 0x21, 0x00
]);

if (!spki.subarray(0, 12).equals(ed25519SpkiPrefix)) {
  throw new Error("Unexpected public key format");
}

const ed25519Pubkey = spki.subarray(12); // 32 bytes

const addrWithSigner = generateAddressWithSigners({ rawEd25519Signer, ed25519Pubkey });
```

## Sharing Secrets and Multisig

It's common for an application to have multiple developers that can deploy changes to mainnet. It may be tempting to share a secret for a single account (manually or through a secrets manager), but this is **not recommended**. Instead, it is recommended to setup a multisig account between all the developers. The multisig account can be a 1/N threshold, which would still allow a single developer to make changes. The benefit of a multisig is that secrets do not need to be shared and all actions are immutably auditable on-chain. Each developer should then follow the practices outlined above.

```ts
const addrWithSigners = generateAddressWithSigners({ rawEd25519Signer: signer, ed25519Pubkey: pubkey });
const msigData: MultisigMetadata = {
  version: 1,
  threshold: 1,
  addrs: [
    otherSigner, // Address of the other signer
    addrWithSigners.addr
  ],
}

const algorand = AlgorandClient.defaultLocalNet();

// Create a multisig account that can be used to sign as a 1/N signer
const msigAccount = new MultisigAccount(msigData, [addrWithSigners])

// Send a transaction using the multisig account
const pay = algorand.send.payment({
  sender: msigAccount,
  amount: microAlgos(0),
  receiver: otherSigner,
})
```

## Key Rotation

Algorand has native support for key rotation through a feature called rekeying. Rekeying allows the blockchain address to stay the same while allowing for rotation of the underlying keypair. For example, a common pattern is to have an admin address that can deploy changes to a production contract. Rekeying allows the admin address to remain constant in the contract but allow the secrets used to authorize transactions to rotate. Rekeying can be done with any transaction type, but the simplest is to do a 0 ALGO payment to oneself with the rekeyTo field set.

```ts
const originalAddrWithSigners = generateAddressWithSigners({ rawEd25519Signer: originalSigner, ed25519Pubkey: originalPubkey });

const newAddrWithSigners = generateAddressWithSigners({
  rawEd25519Signer: newSigner,
  ed25519Pubkey: newPubkey,
  // NOTE: We are specifying sendingAddress so we can properly sign transactions on behalf of the original address
  sendingAddress: originalAddrWithSigners.addr,
});


const algorand = AlgorandClient.defaultLocalNet();

algorand.send.payment({
  sender: originalAddrWithSigners,
  amount: microAlgos(0),
  receiver: originalAddrWithSigners,
  rekeyTo: newAddrWithSigners,
})
```
