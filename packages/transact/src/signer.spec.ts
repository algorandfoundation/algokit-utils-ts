import { describe, expect, test } from 'vitest'
import nacl from 'tweetnacl'
import * as ed from '@noble/ed25519'
import { AddressWithSigners, bytesForSigning, generateAddressWithSigners } from './signer'
import {
  ed25519Generator,
  ed25519Verifier,
  nobleEd25519Generator,
  nobleEd25519Verifier,
  peikertXHdAccountGenerator,
  peikertXHdWalletGenerator,
} from '@algorandfoundation/algokit-crypto'
import { LogicSig, LogicSigAccount } from './logicsig'
import { Transaction } from './transactions/transaction'
import { TransactionType } from './transactions/transaction-type'
import { decodeSignedTransaction } from './transactions/signed-transaction'

const lsig = new LogicSig(new Uint8Array([1, 2, 3, 4, 5]))
const txn = new Transaction({
  type: TransactionType.Payment,
  sender: lsig.address(),
  firstValid: 1n,
  lastValid: 1000n,
})

async function runTests(addressWithSigners: AddressWithSigners, expectedPubkey: Uint8Array) {
  const { addr, lsigSigner, signer, programDataSigner, mxBytesSigner } = addressWithSigners

  expect(addr.publicKey).toEqual(expectedPubkey)
  expect(ed25519Verifier).toEqual(nobleEd25519Verifier)

  const stxns = await signer([txn], [0])
  const sig = decodeSignedTransaction(stxns[0]).sig
  expect(await ed25519Verifier(sig!, bytesForSigning.transaction(txn), addr.publicKey)).toBe(true)

  const lsigAccount = new LogicSigAccount(lsig.logic, [], addr)
  const lsigSignResult = (await lsigSigner(lsigAccount)) as { sig: Uint8Array }
  expect(await ed25519Verifier(lsigSignResult.sig, bytesForSigning.lsigForDelegation(lsig), addr.publicKey)).toBe(true)

  const programData = new Uint8Array([10, 20, 30])
  const programDataSig = await programDataSigner(programData, lsig)
  expect(await ed25519Verifier(programDataSig, bytesForSigning.programData(lsig, programData), addr.publicKey)).toBe(true)

  const mxBytes = new Uint8Array([5, 4, 3, 2, 1])
  const mxBytesSig = await mxBytesSigner(mxBytes)
  expect(await ed25519Verifier(mxBytesSig, bytesForSigning.mxBytes(mxBytes), addr.publicKey)).toBe(true)
}

describe('signer', () => {
  test('generateSigners with tweetnacl', async () => {
    const keypair = nacl.sign.keyPair()
    const rawSigner = async (bytesToSign: Uint8Array): Promise<Uint8Array> => {
      return nacl.sign.detached(bytesToSign, keypair.secretKey)
    }
    const addressWithSigners = generateAddressWithSigners({ ed25519Pubkey: keypair.publicKey, rawEd25519Signer: rawSigner })

    runTests(addressWithSigners, keypair.publicKey)
  })

  test('generateSigners with @noble/ed25519', async () => {
    const privateKey = ed.utils.randomSecretKey()
    const publicKey = await ed.getPublicKeyAsync(privateKey)
    const rawSigner = async (bytesToSign: Uint8Array): Promise<Uint8Array> => {
      return ed.signAsync(bytesToSign, privateKey)
    }
    const addressWithSigners = generateAddressWithSigners({ ed25519Pubkey: publicKey, rawEd25519Signer: rawSigner })

    runTests(addressWithSigners, publicKey)
  })

  test('generateSigners with nobleEd25519Generator', async () => {
    expect(ed25519Generator).toEqual(nobleEd25519Generator)

    const generated = ed25519Generator()
    const addressWithSigners = generateAddressWithSigners(generated)

    runTests(addressWithSigners, generated.ed25519Pubkey)
  })

  test('generateSigners with peikertXHdAccountGenerator', async () => {
    const { hdRootKey } = await peikertXHdWalletGenerator()
    const generated = await peikertXHdAccountGenerator(hdRootKey, 0, 0)
    const addressWithSigners = generateAddressWithSigners(generated)

    runTests(addressWithSigners, generated.ed25519Pubkey)
  })

  test('full example xHD mx bytes flow', async () => {
    // Generate a new rootkey
    const { hdRootKey } = await peikertXHdWalletGenerator() // peikertXHdWalletGenerator from algokit-crypto

    // Generate an account at BIP44 path m/44'/283'/0'/0/0
    const generated = await peikertXHdAccountGenerator(hdRootKey, 0, 0) // peikertXHdAccountGenerator from algokit-crypto

    // Generate Algorand-specific signing functions
    const addressWithSigners = generateAddressWithSigners(generated) // generateAddressWithSigners from algokit-transact

    const message = new TextEncoder().encode('Hello, Algorand!')

    // Sign the message
    const mxBytesSig = await addressWithSigners.mxBytesSigner(message)

    // Get the bytes that were actually signed
    const signedBytes = bytesForSigning.mxBytes(message) // bytesForSigning from algokit-transact

    // Verify the signature
    const isValid = await ed25519Verifier(mxBytesSig, signedBytes, addressWithSigners.addr.publicKey)
    expect(isValid).toBe(true)

    // Demonstrate it is not a raw signature
    const isRawValid = await ed25519Verifier(mxBytesSig, message, addressWithSigners.addr.publicKey)
    expect(isRawValid).toBe(false)
  })
})
