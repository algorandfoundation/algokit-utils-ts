import { Address, decodeMsgpack, encodeMsgpack } from '@algorandfoundation/algokit-common'
import { describe, expect, test } from 'vitest'
import { MultisigAccount } from './multisig'
import { MultisigSignature } from './transactions/signed-transaction'
import { multisigSignatureCodec } from './transactions/signed-transaction-meta'

describe('multisig', () => {
  describe('MultisigAccount.createMultisigSignature', () => {
    test('should create empty multisig signature with correct structure', () => {
      const addrs = [
        'RIMARGKZU46OZ77OLPDHHPUJ7YBSHRTCYMQUC64KZCCMESQAFQMYU6SL2Q',
        'ALGOC4J2BCZ33TCKSSAMV5GAXQBMV3HDCHDBSPRBZRNSR7BM2FFDZRFGXA',
      ].map((s) => Address.fromString(s))

      const msigAccount = new MultisigAccount({ version: 1, threshold: 2, addrs }, [])
      const multisig = msigAccount.createMultisigSignature()

      expect(multisig.version).toBe(1)
      expect(multisig.threshold).toBe(2)
      expect(multisig.subsigs).toHaveLength(2)
      expect(multisig.subsigs[0].publicKey).toEqual(addrs[0].publicKey)
      expect(multisig.subsigs[1].publicKey).toEqual(addrs[1].publicKey)
      expect(multisig.subsigs[0].sig).toBeUndefined()
      expect(multisig.subsigs[1].sig).toBeUndefined()
    })

    test('should handle single participant', () => {
      const addrs = ['RIMARGKZU46OZ77OLPDHHPUJ7YBSHRTCYMQUC64KZCCMESQAFQMYU6SL2Q'].map((s) => Address.fromString(s))

      const msigAccount = new MultisigAccount({ version: 1, threshold: 1, addrs }, [])
      const multisig = msigAccount.createMultisigSignature()

      expect(multisig.version).toBe(1)
      expect(multisig.threshold).toBe(1)
      expect(multisig.subsigs).toHaveLength(1)
      expect(multisig.subsigs[0].publicKey).toEqual(addrs[0].publicKey)
    })
  })

  describe('participantsFromMultisigSignature', () => {
    test('should extract participants from multisig signature', () => {
      const addrs = [
        'RIMARGKZU46OZ77OLPDHHPUJ7YBSHRTCYMQUC64KZCCMESQAFQMYU6SL2Q',
        'ALGOC4J2BCZ33TCKSSAMV5GAXQBMV3HDCHDBSPRBZRNSR7BM2FFDZRFGXA',
      ].map((s) => Address.fromString(s))

      const msigAccount = new MultisigAccount({ version: 1, threshold: 2, addrs }, [])
      const multisig = msigAccount.createMultisigSignature()
      const extractedParticipants = multisig.subsigs.map((subsig) => subsig.publicKey)

      expect(extractedParticipants).toEqual(addrs.map((a) => a.publicKey))
    })

    test('should extract participants even when signatures are present', () => {
      const addrs = [
        'RIMARGKZU46OZ77OLPDHHPUJ7YBSHRTCYMQUC64KZCCMESQAFQMYU6SL2Q',
        'ALGOC4J2BCZ33TCKSSAMV5GAXQBMV3HDCHDBSPRBZRNSR7BM2FFDZRFGXA',
      ].map((s) => Address.fromString(s))

      const msigAccount = new MultisigAccount({ version: 1, threshold: 2, addrs }, [])
      const multisig = msigAccount.createMultisigSignature()
      const signature = new Uint8Array(64).fill(42) // Mock signature
      const signedMultisig = msigAccount.applySignature(multisig, addrs[0].publicKey, signature)

      const extractedParticipants = signedMultisig.subsigs.map((subsig) => subsig.publicKey)

      expect(extractedParticipants).toEqual(addrs.map((a) => a.publicKey))
    })
  })

  describe('MultisigAccount.fromSignature address', () => {
    test('should derive multisig address - matches Rust reference', () => {
      const addrs = [
        'RIMARGKZU46OZ77OLPDHHPUJ7YBSHRTCYMQUC64KZCCMESQAFQMYU6SL2Q',
        'ALGOC4J2BCZ33TCKSSAMV5GAXQBMV3HDCHDBSPRBZRNSR7BM2FFDZRFGXA',
      ].map((s) => Address.fromString(s))

      const msigAccount = new MultisigAccount({ version: 1, threshold: 2, addrs }, [])
      const multisig = msigAccount.createMultisigSignature()
      const msigAccountFromSig = MultisigAccount.fromSignature(multisig)

      expect(msigAccountFromSig.addr.toString()).toBe('TZ6HCOKXK54E2VRU523LBTDQMQNX7DXOWENPFNBXOEU3SMEWXYNCRJUTBU')
    })

    test('should produce different addresses for different participant orders', () => {
      const addrs1 = [
        'RIMARGKZU46OZ77OLPDHHPUJ7YBSHRTCYMQUC64KZCCMESQAFQMYU6SL2Q',
        'ALGOC4J2BCZ33TCKSSAMV5GAXQBMV3HDCHDBSPRBZRNSR7BM2FFDZRFGXA',
      ].map((s) => Address.fromString(s))
      const addrs2 = [
        'ALGOC4J2BCZ33TCKSSAMV5GAXQBMV3HDCHDBSPRBZRNSR7BM2FFDZRFGXA',
        'RIMARGKZU46OZ77OLPDHHPUJ7YBSHRTCYMQUC64KZCCMESQAFQMYU6SL2Q',
      ].map((s) => Address.fromString(s))

      const msigAccount1 = new MultisigAccount({ version: 1, threshold: 2, addrs: addrs1 }, [])
      const msigAccount2 = new MultisigAccount({ version: 1, threshold: 2, addrs: addrs2 }, [])

      expect(msigAccount1.addr.toString()).not.toBe(msigAccount2.addr.toString())
    })

    test('should handle large version and threshold values', () => {
      const addrs = [
        'RIMARGKZU46OZ77OLPDHHPUJ7YBSHRTCYMQUC64KZCCMESQAFQMYU6SL2Q',
        'ALGOC4J2BCZ33TCKSSAMV5GAXQBMV3HDCHDBSPRBZRNSR7BM2FFDZRFGXA',
      ].map((s) => Address.fromString(s))

      const msigAccountLarge = new MultisigAccount({ version: 254, threshold: 2, addrs }, [])
      const msigAccountSmall = new MultisigAccount({ version: 1, threshold: 2, addrs }, [])

      expect(msigAccountLarge.addr.toString()).not.toBe(msigAccountSmall.addr.toString())
    })
  })

  describe('MultisigAccount.applySignature', () => {
    test('should apply signature to participant', () => {
      const addrs = [
        'RIMARGKZU46OZ77OLPDHHPUJ7YBSHRTCYMQUC64KZCCMESQAFQMYU6SL2Q',
        'ALGOC4J2BCZ33TCKSSAMV5GAXQBMV3HDCHDBSPRBZRNSR7BM2FFDZRFGXA',
      ].map((s) => Address.fromString(s))

      const msigAccount = new MultisigAccount({ version: 1, threshold: 2, addrs }, [])
      const multisig = msigAccount.createMultisigSignature()
      const signature = new Uint8Array(64).fill(42)

      const signedMultisig = msigAccount.applySignature(multisig, addrs[0].publicKey, signature)

      expect(signedMultisig.version).toBe(multisig.version)
      expect(signedMultisig.threshold).toBe(multisig.threshold)
      expect(signedMultisig.subsigs[0].sig).toEqual(signature)
      expect(signedMultisig.subsigs[1].sig).toBeUndefined()
    })

    test('should replace existing signature', () => {
      const addrs = [
        'RIMARGKZU46OZ77OLPDHHPUJ7YBSHRTCYMQUC64KZCCMESQAFQMYU6SL2Q',
        'ALGOC4J2BCZ33TCKSSAMV5GAXQBMV3HDCHDBSPRBZRNSR7BM2FFDZRFGXA',
      ].map((s) => Address.fromString(s))

      const msigAccount = new MultisigAccount({ version: 1, threshold: 2, addrs }, [])
      const multisig = msigAccount.createMultisigSignature()
      const signature1 = new Uint8Array(64).fill(42)
      const signature2 = new Uint8Array(64).fill(84)

      // Apply first signature
      const signedMultisig1 = msigAccount.applySignature(multisig, addrs[0].publicKey, signature1)
      expect(signedMultisig1.subsigs[0].sig).toEqual(signature1)

      // Replace with second signature
      const signedMultisig2 = msigAccount.applySignature(signedMultisig1, addrs[0].publicKey, signature2)
      expect(signedMultisig2.subsigs[0].sig).toEqual(signature2)
    })
  })

  describe('merge multisignatures via applySignature', () => {
    test('should merge compatible multisignatures by applying signatures individually', () => {
      const addrs = [
        'RIMARGKZU46OZ77OLPDHHPUJ7YBSHRTCYMQUC64KZCCMESQAFQMYU6SL2Q',
        'ALGOC4J2BCZ33TCKSSAMV5GAXQBMV3HDCHDBSPRBZRNSR7BM2FFDZRFGXA',
      ].map((s) => Address.fromString(s))

      const msigAccount = new MultisigAccount({ version: 1, threshold: 2, addrs }, [])

      const signature1 = new Uint8Array(64).fill(11)
      const signature2 = new Uint8Array(64).fill(22)

      // Apply both signatures to the same multisig
      let multisig = msigAccount.createMultisigSignature()
      multisig = msigAccount.applySignature(multisig, addrs[0].publicKey, signature1)
      multisig = msigAccount.applySignature(multisig, addrs[1].publicKey, signature2)

      expect(multisig.version).toBe(1)
      expect(multisig.threshold).toBe(2)
      expect(multisig.subsigs[0].sig).toEqual(signature1)
      expect(multisig.subsigs[1].sig).toEqual(signature2)
    })

    test('should throw error for incompatible versions', () => {
      const addrs = [
        'RIMARGKZU46OZ77OLPDHHPUJ7YBSHRTCYMQUC64KZCCMESQAFQMYU6SL2Q',
        'ALGOC4J2BCZ33TCKSSAMV5GAXQBMV3HDCHDBSPRBZRNSR7BM2FFDZRFGXA',
      ].map((s) => Address.fromString(s))

      const msigAccount1 = new MultisigAccount({ version: 1, threshold: 2, addrs }, [])
      const msigAccount2 = new MultisigAccount({ version: 2, threshold: 2, addrs }, [])

      const msig2 = msigAccount2.createMultisigSignature()

      expect(() => msigAccount1.applySignature(msig2, addrs[0].publicKey, new Uint8Array(64))).toThrow(
        `Multisig signature parameters do not match expected multisig parameters. Multisig params: {"version":1,"threshold":2,"participants":["RIMARGKZU46OZ77OLPDHHPUJ7YBSHRTCYMQUC64KZCCMESQAFQMYU6SL2Q","ALGOC4J2BCZ33TCKSSAMV5GAXQBMV3HDCHDBSPRBZRNSR7BM2FFDZRFGXA"]}, signature: {"version":2,"threshold":2,"participants":["RIMARGKZU46OZ77OLPDHHPUJ7YBSHRTCYMQUC64KZCCMESQAFQMYU6SL2Q","ALGOC4J2BCZ33TCKSSAMV5GAXQBMV3HDCHDBSPRBZRNSR7BM2FFDZRFGXA"]}`,
      )
    })
  })

  describe('decode MultisigSignature', () => {
    test('should decode encoded multisig signature', () => {
      const addrs = [
        Address.fromString('RIMARGKZU46OZ77OLPDHHPUJ7YBSHRTCYMQUC64KZCCMESQAFQMYU6SL2Q'),
        Address.fromString('ALGOC4J2BCZ33TCKSSAMV5GAXQBMV3HDCHDBSPRBZRNSR7BM2FFDZRFGXA'),
      ]

      const msigAccount = new MultisigAccount({ version: 1, threshold: 2, addrs }, [])
      const emptyMultisignature = msigAccount.createMultisigSignature()
      const signature = new Uint8Array(64).fill(42)
      const signedMultiSig = msigAccount.applySignature(emptyMultisignature, addrs[0].publicKey, signature)
      const encoded = encodeMsgpack(multisigSignatureCodec.encode(signedMultiSig, 'msgpack'))

      const decodedData = decodeMsgpack(encoded)
      const decoded: MultisigSignature = multisigSignatureCodec.decode(decodedData, 'msgpack')

      expect(decoded.version).toBe(emptyMultisignature.version)
      expect(decoded.threshold).toBe(emptyMultisignature.threshold)
      expect(decoded.subsigs).toHaveLength(emptyMultisignature.subsigs.length)
      expect(decoded.subsigs[0].publicKey).toEqual(addrs[0].publicKey)
      expect(decoded.subsigs[1].publicKey).toEqual(addrs[1].publicKey)
      expect(decoded.subsigs[0].sig).toEqual(signature)
      expect(decoded.subsigs[1].sig).toBeUndefined()
    })
  })

  describe('example', () => {
    test('should create multisig matching observed transaction pattern', () => {
      const addrs = [
        'AXJVIQR43APV5HZ6F3J4MYNYR3GRRFHU56WTRFLJXFNNUJHDAX5SCGF3SQ',
        'QKR2CYWG4MQQAYCAF4LQARVQLLUF2JIDQO42OQ5YN2E7CHTLDURSJGNQRU',
      ].map((s) => Address.fromString(s))

      const msigAccount = new MultisigAccount({ version: 1, threshold: 2, addrs }, [])

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
      let multisig = msigAccount.createMultisigSignature()
      multisig = msigAccount.applySignature(multisig, addrs[0].publicKey, signature1)
      multisig = msigAccount.applySignature(multisig, addrs[1].publicKey, signature2)

      expect(multisig.version).toBe(1)
      expect(multisig.threshold).toBe(2)
      expect(multisig.subsigs).toHaveLength(2)
      expect(multisig.subsigs[0].publicKey).toEqual(addrs[0].publicKey)
      expect(multisig.subsigs[1].publicKey).toEqual(addrs[1].publicKey)
      expect(multisig.subsigs[0].sig).toEqual(signature1)
      expect(multisig.subsigs[1].sig).toEqual(signature2)
    })
  })
})
