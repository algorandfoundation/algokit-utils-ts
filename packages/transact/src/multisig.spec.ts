import { Address, encodeMsgpack } from '@algorandfoundation/algokit-common'
import { describe, expect, test } from 'vitest'
import {
  addressFromMultisigSignature,
  applyMultisigSubsignature,
  decodeMultiSignature,
  mergeMultisignatures,
  newMultisigSignature,
  participantsFromMultisigSignature,
} from './multisig'
import { multiSignatureCodec } from './transactions/signed-transaction-meta'

describe('multisig', () => {
  describe('newMultisigSignature', () => {
    test('should create empty multisig signature with correct structure', () => {
      const participants = [
        'RIMARGKZU46OZ77OLPDHHPUJ7YBSHRTCYMQUC64KZCCMESQAFQMYU6SL2Q',
        'ALGOC4J2BCZ33TCKSSAMV5GAXQBMV3HDCHDBSPRBZRNSR7BM2FFDZRFGXA',
      ].map((s) => Address.fromString(s).publicKey)

      const multisig = newMultisigSignature(1, 2, participants)

      expect(multisig.version).toBe(1)
      expect(multisig.threshold).toBe(2)
      expect(multisig.subsigs).toHaveLength(2)
      expect(multisig.subsigs[0].publicKey).toEqual(participants[0])
      expect(multisig.subsigs[1].publicKey).toEqual(participants[1])
      expect(multisig.subsigs[0].sig).toBeUndefined()
      expect(multisig.subsigs[1].sig).toBeUndefined()
    })

    test('should handle single participant', () => {
      const participants = ['RIMARGKZU46OZ77OLPDHHPUJ7YBSHRTCYMQUC64KZCCMESQAFQMYU6SL2Q'].map((s) => Address.fromString(s).publicKey)

      const multisig = newMultisigSignature(1, 1, participants)

      expect(multisig.version).toBe(1)
      expect(multisig.threshold).toBe(1)
      expect(multisig.subsigs).toHaveLength(1)
      expect(multisig.subsigs[0].publicKey).toEqual(participants[0])
    })
  })

  describe('participantsFromMultisigSignature', () => {
    test('should extract participants from multisig signature', () => {
      const participants = [
        'RIMARGKZU46OZ77OLPDHHPUJ7YBSHRTCYMQUC64KZCCMESQAFQMYU6SL2Q',
        'ALGOC4J2BCZ33TCKSSAMV5GAXQBMV3HDCHDBSPRBZRNSR7BM2FFDZRFGXA',
      ].map((s) => Address.fromString(s).publicKey)

      const multisig = newMultisigSignature(1, 2, participants)
      const extractedParticipants = participantsFromMultisigSignature(multisig)

      expect(extractedParticipants).toEqual(participants)
    })

    test('should extract participants even when signatures are present', () => {
      const participants = [
        'RIMARGKZU46OZ77OLPDHHPUJ7YBSHRTCYMQUC64KZCCMESQAFQMYU6SL2Q',
        'ALGOC4J2BCZ33TCKSSAMV5GAXQBMV3HDCHDBSPRBZRNSR7BM2FFDZRFGXA',
      ].map((s) => Address.fromString(s).publicKey)

      const multisig = newMultisigSignature(1, 2, participants)
      const signature = new Uint8Array(64).fill(42) // Mock signature
      const signedMultisig = applyMultisigSubsignature(multisig, participants[0], signature)

      const extractedParticipants = participantsFromMultisigSignature(signedMultisig)

      expect(extractedParticipants).toEqual(participants)
    })
  })

  describe('addressFromMultisigSignature', () => {
    test('should derive multisig address - matches Rust reference', () => {
      const participants = [
        'RIMARGKZU46OZ77OLPDHHPUJ7YBSHRTCYMQUC64KZCCMESQAFQMYU6SL2Q',
        'ALGOC4J2BCZ33TCKSSAMV5GAXQBMV3HDCHDBSPRBZRNSR7BM2FFDZRFGXA',
      ].map((s) => Address.fromString(s).publicKey)

      const multisig = newMultisigSignature(1, 2, participants)
      const address = addressFromMultisigSignature(multisig)

      expect(address.toString()).toBe('TZ6HCOKXK54E2VRU523LBTDQMQNX7DXOWENPFNBXOEU3SMEWXYNCRJUTBU')
    })

    test('should produce different addresses for different participant orders', () => {
      const participants1 = [
        'RIMARGKZU46OZ77OLPDHHPUJ7YBSHRTCYMQUC64KZCCMESQAFQMYU6SL2Q',
        'ALGOC4J2BCZ33TCKSSAMV5GAXQBMV3HDCHDBSPRBZRNSR7BM2FFDZRFGXA',
      ].map((s) => Address.fromString(s).publicKey)
      const participants2 = [
        'ALGOC4J2BCZ33TCKSSAMV5GAXQBMV3HDCHDBSPRBZRNSR7BM2FFDZRFGXA',
        'RIMARGKZU46OZ77OLPDHHPUJ7YBSHRTCYMQUC64KZCCMESQAFQMYU6SL2Q',
      ].map((s) => Address.fromString(s).publicKey)

      const multisig1 = newMultisigSignature(1, 2, participants1)
      const multisig2 = newMultisigSignature(1, 2, participants2)

      const address1 = addressFromMultisigSignature(multisig1)
      const address2 = addressFromMultisigSignature(multisig2)

      expect(address1).not.toBe(address2)
    })

    test('should handle large version and threshold values', () => {
      const participants = [
        'RIMARGKZU46OZ77OLPDHHPUJ7YBSHRTCYMQUC64KZCCMESQAFQMYU6SL2Q',
        'ALGOC4J2BCZ33TCKSSAMV5GAXQBMV3HDCHDBSPRBZRNSR7BM2FFDZRFGXA',
      ].map((s) => Address.fromString(s).publicKey)

      const multisigLarge = newMultisigSignature(254, 2, participants)
      const addressLarge = addressFromMultisigSignature(multisigLarge)

      // Should be different from the original small values
      const multisigSmall = newMultisigSignature(1, 2, participants)
      const addressSmall = addressFromMultisigSignature(multisigSmall)
      expect(addressLarge).not.toBe(addressSmall)
    })
  })

  describe('applyMultisigSubsignature', () => {
    test('should apply signature to participant', () => {
      const participants = [
        'RIMARGKZU46OZ77OLPDHHPUJ7YBSHRTCYMQUC64KZCCMESQAFQMYU6SL2Q',
        'ALGOC4J2BCZ33TCKSSAMV5GAXQBMV3HDCHDBSPRBZRNSR7BM2FFDZRFGXA',
      ].map((s) => Address.fromString(s).publicKey)

      const multisig = newMultisigSignature(1, 2, participants)
      const signature = new Uint8Array(64).fill(42)

      const signedMultisig = applyMultisigSubsignature(multisig, participants[0], signature)

      expect(signedMultisig.version).toBe(multisig.version)
      expect(signedMultisig.threshold).toBe(multisig.threshold)
      expect(signedMultisig.subsigs[0].sig).toEqual(signature)
      expect(signedMultisig.subsigs[1].sig).toBeUndefined()
    })

    test('should replace existing signature', () => {
      const participants = [
        'RIMARGKZU46OZ77OLPDHHPUJ7YBSHRTCYMQUC64KZCCMESQAFQMYU6SL2Q',
        'ALGOC4J2BCZ33TCKSSAMV5GAXQBMV3HDCHDBSPRBZRNSR7BM2FFDZRFGXA',
      ].map((s) => Address.fromString(s).publicKey)

      const multisig = newMultisigSignature(1, 2, participants)
      const signature1 = new Uint8Array(64).fill(42)
      const signature2 = new Uint8Array(64).fill(84)

      // Apply first signature
      const signedMultisig1 = applyMultisigSubsignature(multisig, participants[0], signature1)
      expect(signedMultisig1.subsigs[0].sig).toEqual(signature1)

      // Replace with second signature
      const signedMultisig2 = applyMultisigSubsignature(signedMultisig1, participants[0], signature2)
      expect(signedMultisig2.subsigs[0].sig).toEqual(signature2)
    })
  })

  describe('mergeMultisignatures', () => {
    test('should merge compatible multisignatures', () => {
      const participants = [
        'RIMARGKZU46OZ77OLPDHHPUJ7YBSHRTCYMQUC64KZCCMESQAFQMYU6SL2Q',
        'ALGOC4J2BCZ33TCKSSAMV5GAXQBMV3HDCHDBSPRBZRNSR7BM2FFDZRFGXA',
      ].map((s) => Address.fromString(s).publicKey)

      const multisig1 = newMultisigSignature(1, 2, participants)
      const multisig2 = newMultisigSignature(1, 2, participants)

      const signature1 = new Uint8Array(64).fill(11)
      const signature2 = new Uint8Array(64).fill(22)

      const signedMultisig1 = applyMultisigSubsignature(multisig1, participants[0], signature1)
      const signedMultisig2 = applyMultisigSubsignature(multisig2, participants[1], signature2)

      const merged = mergeMultisignatures(signedMultisig1, signedMultisig2)

      expect(merged.version).toBe(1)
      expect(merged.threshold).toBe(2)
      expect(merged.subsigs[0].sig).toEqual(signature1)
      expect(merged.subsigs[1].sig).toEqual(signature2)
    })

    test('should throw error for incompatible versions', () => {
      const participants = [
        'RIMARGKZU46OZ77OLPDHHPUJ7YBSHRTCYMQUC64KZCCMESQAFQMYU6SL2Q',
        'ALGOC4J2BCZ33TCKSSAMV5GAXQBMV3HDCHDBSPRBZRNSR7BM2FFDZRFGXA',
      ].map((s) => Address.fromString(s).publicKey)

      const multisig1 = newMultisigSignature(1, 2, participants)
      const multisig2 = newMultisigSignature(2, 2, participants)

      expect(() => mergeMultisignatures(multisig1, multisig2)).toThrow('Cannot merge multisig signatures with different versions')
    })
  })

  describe('decodeMultiSignature', () => {
    test('should decode encoded multisig signature', () => {
      const participants = [
        Address.fromString('RIMARGKZU46OZ77OLPDHHPUJ7YBSHRTCYMQUC64KZCCMESQAFQMYU6SL2Q').publicKey,
        Address.fromString('ALGOC4J2BCZ33TCKSSAMV5GAXQBMV3HDCHDBSPRBZRNSR7BM2FFDZRFGXA').publicKey,
      ]

      const emptyMultisignature = newMultisigSignature(1, 2, participants)
      const signature = new Uint8Array(64).fill(42)
      const signedMultiSig = applyMultisigSubsignature(emptyMultisignature, participants[0], signature)
      const encoded = encodeMsgpack(multiSignatureCodec.encode(signedMultiSig, 'msgpack'))

      const decoded = decodeMultiSignature(encoded)

      expect(decoded.version).toBe(emptyMultisignature.version)
      expect(decoded.threshold).toBe(emptyMultisignature.threshold)
      expect(decoded.subsigs).toHaveLength(emptyMultisignature.subsigs.length)
      expect(decoded.subsigs[0].publicKey).toEqual(participants[0])
      expect(decoded.subsigs[1].publicKey).toEqual(participants[1])
      expect(decoded.subsigs[0].sig).toEqual(signature)
      expect(decoded.subsigs[1].sig).toBeUndefined()
    })
  })

  describe('example', () => {
    test('should create multisig matching observed transaction pattern', () => {
      const participants = [
        'AXJVIQR43APV5HZ6F3J4MYNYR3GRRFHU56WTRFLJXFNNUJHDAX5SCGF3SQ',
        'QKR2CYWG4MQQAYCAF4LQARVQLLUF2JIDQO42OQ5YN2E7CHTLDURSJGNQRU',
      ].map((s) => Address.fromString(s).publicKey)

      const multisig = newMultisigSignature(1, 2, participants)

      // Decode the known base64 signatures
      const signature1 = Uint8Array.from(
        atob('H0W1kLRR68uDwacLk0N7qPuvm4NP09AmiaG+X6HPdsZOCJ5YV5ytc+jCvonAEz2sg+0k388T9ZAbqSZGag93Cg=='),
        (c) => c.charCodeAt(0),
      )
      const signature2 = Uint8Array.from(
        atob('UzvbTgDEfdG6w/HzaiwMePmNLiIk5z+hK4EZoCLR9ghgYMxy0IdS7iTCvPVFmVTDYM+r/W8Lox+lE6m4N/OvCw=='),
        (c) => c.charCodeAt(0),
      )

      // Apply signatures
      const signedMultisig = applyMultisigSubsignature(
        applyMultisigSubsignature(multisig, participants[0], signature1),
        participants[1],
        signature2,
      )

      expect(signedMultisig.version).toBe(1)
      expect(signedMultisig.threshold).toBe(2)
      expect(signedMultisig.subsigs).toHaveLength(2)
      expect(signedMultisig.subsigs[0].publicKey).toEqual(participants[0])
      expect(signedMultisig.subsigs[1].publicKey).toEqual(participants[1])
      expect(signedMultisig.subsigs[0].sig).toEqual(signature1)
      expect(signedMultisig.subsigs[1].sig).toEqual(signature2)
    })
  })
})
