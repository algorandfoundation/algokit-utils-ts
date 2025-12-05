import { Address, MULTISIG_DOMAIN_SEPARATOR, PUBLIC_KEY_BYTE_LENGTH, decodeMsgpack, hash } from '@algorandfoundation/algokit-common'
import { MultisigSignature, MultisigSubsignature } from './transactions/signed-transaction'
import { multiSignatureCodec } from './transactions/signed-transaction-meta'

/**
 * Creates an empty multisignature signature from a list of participant public keys.
 */
export function newMultisigSignature(version: number, threshold: number, participants: Uint8Array[]): MultisigSignature {
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
    subsignatures: participants.map((publicKey) => ({ publicKey })),
  }
}

/**
 * Returns the list of participant public keys from a multisignature signature.
 */
export function participantsFromMultisigSignature(multisigSignature: MultisigSignature): Uint8Array[] {
  return multisigSignature.subsignatures.map((subsig) => subsig.publicKey)
}

/**
 * Returns the address of the multisignature account.
 */
export function addressFromMultisigSignature(multisigSignature: MultisigSignature): Address {
  const prefixBytes = new TextEncoder().encode(MULTISIG_DOMAIN_SEPARATOR)
  const participantPublicKeys = multisigSignature.subsignatures.map((subsig) => subsig.publicKey)

  const bufferLength = prefixBytes.length + 2 + participantPublicKeys.length * PUBLIC_KEY_BYTE_LENGTH
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

  // Add participant public keys
  for (const publicKey of participantPublicKeys) {
    addressBytes.set(publicKey, offset)
    offset += PUBLIC_KEY_BYTE_LENGTH
  }

  return new Address(hash(addressBytes))
}

/**
 * Applies a subsignature for a participant to a multisignature signature, replacing any existing signature.
 *
 * This method applies the signature to ALL instances of the given public key (to support weighted multisig).
 * Since ed25519 signatures are deterministic, there's only one valid signature for a given message and public key.
 */
export function applyMultisigSubsignature(
  multisigSignature: MultisigSignature,
  participant: Uint8Array,
  signature: Uint8Array,
): MultisigSignature {
  let found = false
  const newSubsignatures = multisigSignature.subsignatures.map((subsig) => {
    if (arraysEqual(subsig.publicKey, participant)) {
      found = true
      return { ...subsig, signature }
    }
    return subsig
  })

  if (!found) {
    throw new Error('Public key not found in multisig signature')
  }

  return {
    ...multisigSignature,
    subsignatures: newSubsignatures,
  }
}

function arraysEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
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

  // Check participants match exactly (same public keys in same order)
  const participantsA = participantsFromMultisigSignature(multisigSignatureA)
  const participantsB = participantsFromMultisigSignature(multisigSignatureB)
  const participantsMatch =
    participantsA.length === participantsB.length && participantsA.every((pk, i) => arraysEqual(pk, participantsB[i]))
  if (!participantsMatch) {
    throw new Error('Cannot merge multisig signatures with different participants')
  }

  const mergedSubsignatures: MultisigSubsignature[] = multisigSignatureA.subsignatures.map((s1, index) => {
    const s2 = multisigSignatureB.subsignatures[index]
    return {
      publicKey: s1.publicKey,
      signature: s2.signature || s1.signature, // Prefer s2, fall back to s1
    }
  })

  return {
    version: multisigSignatureA.version,
    threshold: multisigSignatureA.threshold,
    subsignatures: mergedSubsignatures,
  }
}

/**
 * Decodes MsgPack bytes into a multi signature.
 *
 * @param encodedMultiSignature - The MsgPack encoded multi signature
 * @returns The decoded MultisigSignature or an error if decoding fails.
 */
export function decodeMultiSignature(encodedMultiSignature: Uint8Array): MultisigSignature {
  const decodedData = decodeMsgpack(encodedMultiSignature)
  return multiSignatureCodec.decode(decodedData, 'msgpack')
}
