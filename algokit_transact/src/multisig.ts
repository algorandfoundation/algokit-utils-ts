import {
  addressFromPublicKey,
  publicKeyFromAddress,
  MULTISIG_DOMAIN_SEPARATOR,
  PUBLIC_KEY_BYTE_LENGTH,
  hash,
} from '@algorandfoundation/algokit-common'
import { MultisigSignature, MultisigSubsignature } from './transactions/signed-transaction'

/**
 * Creates an empty multisignature signature from a list of participant addresses.
 */
export function newMultisigSignature(version: number, threshold: number, participants: string[]): MultisigSignature {
  if (version === 0) {
    throw new Error('Version cannot be zero')
  }
  if (participants.length === 0) {
    throw new Error('Participants cannot be empty')
  }
  if (threshold === 0 || threshold > participants.length) {
    throw new Error('Threshold must be greater than zero and less than or equal to the number of participants')
  }

  return {
    version,
    threshold,
    subsignatures: participants.map((address) => ({ address })),
  }
}

/**
 * Returns the list of participant addresses from a multisignature signature.
 */
export function participantsFromMultisigSignature(multisigSignature: MultisigSignature): string[] {
  return multisigSignature.subsignatures.map((subsig) => subsig.address)
}

/**
 * Returns the address of the multisignature account.
 */
export function addressFromMultisigSignature(multisigSignature: MultisigSignature): string {
  const prefixBytes = new TextEncoder().encode(MULTISIG_DOMAIN_SEPARATOR)
  const participantAddresses = multisigSignature.subsignatures.map((subsig) => subsig.address)

  const bufferLength = prefixBytes.length + 2 + participantAddresses.length * PUBLIC_KEY_BYTE_LENGTH
  const addressBytes = new Uint8Array(bufferLength)

  let offset = 0

  // Add domain separator
  addressBytes.set(prefixBytes, offset)
  offset += prefixBytes.length

  // Add version and threshold
  addressBytes[offset] = multisigSignature.version
  offset += 1
  addressBytes[offset] = multisigSignature.threshold
  offset += 1

  // Add participant public keys (extracted from their addresses)
  for (const address of participantAddresses) {
    const publicKey = publicKeyFromAddress(address)
    addressBytes.set(publicKey, offset)
    offset += PUBLIC_KEY_BYTE_LENGTH
  }

  return addressFromPublicKey(hash(addressBytes))
}

/**
 * Applies a subsignature for a participant to a multisignature signature, replacing any existing signature.
 *
 * This method applies the signature to ALL instances of the given address (to support weighted multisig).
 * Since ed25519 signatures are deterministic, there's only one valid signature for a given message and public key.
 */
export function applyMultisigSubsignature(
  multisigSignature: MultisigSignature,
  participant: string,
  signature: Uint8Array,
): MultisigSignature {
  let found = false
  const newSubsignatures = multisigSignature.subsignatures.map((subsig) => {
    if (subsig.address === participant) {
      found = true
      return { ...subsig, signature }
    }
    return subsig
  })

  if (!found) {
    throw new Error('Address not found in multisig signature')
  }

  return {
    ...multisigSignature,
    subsignatures: newSubsignatures,
  }
}

/**
 * Merges two multisignature signatures, replacing signatures in the first with those from the second where present.
 * For each participant, the resulting signature will be taken from the second multisig if present, otherwise from the first.
 */
export function mergeMultisignatures(multisigSignatureA: MultisigSignature, multisigSignatureB: MultisigSignature): MultisigSignature {
  if (multisigSignatureA.version !== multisigSignatureB.version) {
    throw new Error('Cannot merge multisig signatures with different versions')
  }
  if (multisigSignatureA.threshold !== multisigSignatureB.threshold) {
    throw new Error('Cannot merge multisig signatures with different thresholds')
  }

  // Check participants match exactly (same addresses in same order)
  const participantsA = participantsFromMultisigSignature(multisigSignatureA)
  const participantsB = participantsFromMultisigSignature(multisigSignatureB)
  if (JSON.stringify(participantsA) !== JSON.stringify(participantsB)) {
    throw new Error('Cannot merge multisig signatures with different participants')
  }

  const mergedSubsignatures: MultisigSubsignature[] = multisigSignatureA.subsignatures.map((s1, index) => {
    const s2 = multisigSignatureB.subsignatures[index]
    return {
      address: s1.address,
      signature: s2.signature || s1.signature, // Prefer s2, fall back to s1
    }
  })

  return {
    version: multisigSignatureA.version,
    threshold: multisigSignatureA.threshold,
    subsignatures: mergedSubsignatures,
  }
}
