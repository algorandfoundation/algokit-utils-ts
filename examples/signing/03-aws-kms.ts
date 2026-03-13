/**
 * Example: Ed25519 Signing from AWS KMS
 *
 * This example demonstrates how to use the AWS KMS to perform Ed25519 signing for Algorand transactions.
 *
 * Prerequisites:
 * - LocalNet running (via `algokit localnet start`)
 */

/* eslint-disable no-console */

import { RawEd25519Signer } from '@algorandfoundation/algokit-utils/crypto'
import { AlgorandClient, microAlgos } from '@algorandfoundation/algokit-utils'
import { generateAddressWithSigners } from '@algorandfoundation/algokit-utils/transact'
import { KMSClient, SignCommand, GetPublicKeyCommand, SignCommandInput, GetPublicKeyCommandInput } from '@aws-sdk/client-kms'
import nacl from 'tweetnacl'
import 'dotenv/config'

// Mock KMSClient for local development/testing when AWS credentials are not available
class MockKMSClient {
  private keyPair: nacl.SignKeyPair

  constructor() {
    console.warn('AWS_REGION not set, using MockKMSClient with in-memory key pair. This is not secure and should only be used for testing.')
    // Generate a deterministic key pair for consistent testing
    this.keyPair = nacl.sign.keyPair()
  }

  async send(command: SignCommand | GetPublicKeyCommand): Promise<unknown> {
    const cmd = command as { constructor: { name: string }; input?: SignCommandInput | GetPublicKeyCommandInput }

    if (command instanceof SignCommand) {
      const input = command.input as SignCommandInput
      if (!input.Message) {
        throw new Error('No message provided for signing')
      }

      // Sign the message using tweetnacl
      const signature = nacl.sign.detached(input.Message, this.keyPair.secretKey)

      return {
        Signature: signature,
        SigningAlgorithm: 'ED25519_SHA_512',
      }
    }

    if (command instanceof GetPublicKeyCommand) {
      // Create SPKI format public key (DER-encoded SubjectPublicKeyInfo)
      // Ed25519 SPKI prefix: 0x30 0x2a 0x30 0x05 0x06 0x03 0x2b 0x65 0x70 0x03 0x21 0x00
      const ed25519SpkiPrefix = Buffer.from([0x30, 0x2a, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, 0x03, 0x21, 0x00])
      const publicKey = Buffer.concat([ed25519SpkiPrefix, Buffer.from(this.keyPair.publicKey)])

      return {
        PublicKey: publicKey,
        KeySpec: 'ED25519',
      }
    }

    throw new Error(`Unsupported command type: ${cmd.constructor.name}`)
  }
}

// Use mock client if AWS_REGION is not set, otherwise use real AWS KMS
const kms = process.env.AWS_REGION ? new KMSClient({ region: process.env.AWS_REGION }) : (new MockKMSClient() as unknown as KMSClient)

const rawEd25519Signer: RawEd25519Signer = async (data: Uint8Array): Promise<Uint8Array> => {
  const resp = await kms.send(
    new SignCommand({
      KeyId: process.env.KEY_ID,
      Message: data,
      MessageType: 'RAW',
      SigningAlgorithm: 'ED25519_SHA_512',
    }),
  )

  if (!resp.Signature) {
    throw new Error('No signature returned from KMS')
  }

  return resp.Signature
}

const pubkeyResp = await kms.send(
  new GetPublicKeyCommand({
    KeyId: process.env.KEY_ID,
  }),
)

if (!pubkeyResp.PublicKey) {
  throw new Error('No public key returned from KMS')
}

const spki = Buffer.from(pubkeyResp.PublicKey as Uint8Array)

const ed25519SpkiPrefix = Buffer.from([0x30, 0x2a, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, 0x03, 0x21, 0x00])

if (!spki.subarray(0, 12).equals(ed25519SpkiPrefix)) {
  throw new Error('Unexpected public key format')
}

const ed25519Pubkey = spki.subarray(12) // 32 bytes

const algorandAccount = generateAddressWithSigners({ rawEd25519Signer, ed25519Pubkey })

const algorand = AlgorandClient.defaultLocalNet()

await algorand.account.ensureFundedFromEnvironment(algorandAccount.addr, microAlgos(1e6))

await algorand.send.payment({
  sender: algorandAccount,
  signer: algorandAccount,
  amount: microAlgos(0),
  receiver: algorandAccount,
})
