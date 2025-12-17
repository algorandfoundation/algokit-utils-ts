/**
 * Auto-generated Zod schemas from OpenAPI specification.
 * Do not edit manually.
 *
 * Generated: 2025-12-17T00:50:00.270Z
 */

import { z } from 'zod'
import { Address } from '@algorandfoundation/algokit-common'

export const TxType = z.string()

export const Wallet = z.object({
  driverName: z.string(),
  driverVersion: z.number().int(),
  id: z.string(),
  mnemonicUx: z.boolean(),
  name: z.string(),
  supportedTxs: z.array(TxType)
})

export const ListWalletsResponse = z.object({
  wallets: z.array(Wallet)
})

export const ExportKeyResponse = z.object({
  privateKey: z.instanceof(Uint8Array)
})

export const ImportKeyResponse = z.object({
  address: z.instanceof(Address)
})

export const ListKeysResponse = z.object({
  addresses: z.array(z.instanceof(Address))
})

export const GenerateKeyResponse = z.object({
  address: z.instanceof(Address)
})

export const MasterDerivationKey = z.array(z.number().int())

export const ExportMasterKeyResponse = z.object({
  masterDerivationKey: MasterDerivationKey
})

export const ed25519PublicKey = z.array(z.number().int())

export const PublicKey = ed25519PublicKey

export const ExportMultisigResponse = z.object({
  multisigVersion: z.number().int(),
  publicKeys: z.array(PublicKey),
  threshold: z.number().int()
})

export const ImportMultisigResponse = z.object({
  address: z.instanceof(Address)
})

export const ListMultisigResponse = z.object({
  addresses: z.array(z.instanceof(Address))
})

export const SignProgramMultisigResponse = z.object({
  multisig: z.instanceof(Uint8Array)
})

export const SignMultisigResponse = z.object({
  multisig: z.instanceof(Uint8Array)
})

export const SignProgramResponse = z.object({
  sig: z.instanceof(Uint8Array)
})

export const SignTransactionResponse = z.object({
  signedTransaction: z.instanceof(Uint8Array)
})

export const WalletHandle = z.object({
  expiresSeconds: z.number().int(),
  wallet: Wallet
})

export const WalletInfoResponse = z.object({
  walletHandle: WalletHandle
})

export const InitWalletHandleTokenResponse = z.object({
  walletHandleToken: z.string()
})

export const RenameWalletResponse = z.object({
  wallet: Wallet
})

export const RenewWalletHandleTokenResponse = z.object({
  walletHandle: WalletHandle
})

export const CreateWalletResponse = z.object({
  wallet: Wallet
})

export const CreateWalletRequest = z.object({
  masterDerivationKey: MasterDerivationKey.optional(),
  walletDriverName: z.string().optional(),
  walletName: z.string(),
  walletPassword: z.string()
})

export const DeleteKeyRequest = z.object({
  address: z.instanceof(Address),
  walletHandleToken: z.string(),
  walletPassword: z.string().optional()
})

export const DeleteMultisigRequest = z.object({
  address: z.instanceof(Address),
  walletHandleToken: z.string(),
  walletPassword: z.string().optional()
})

export const Digest = z.array(z.number().int())

export const ExportKeyRequest = z.object({
  address: z.instanceof(Address),
  walletHandleToken: z.string(),
  walletPassword: z.string().optional()
})

export const ExportMasterKeyRequest = z.object({
  walletHandleToken: z.string(),
  walletPassword: z.string().optional()
})

export const ExportMultisigRequest = z.object({
  address: z.instanceof(Address),
  walletHandleToken: z.string()
})

export const GenerateKeyRequest = z.object({
  walletHandleToken: z.string()
})

export const ImportKeyRequest = z.object({
  privateKey: z.instanceof(Uint8Array),
  walletHandleToken: z.string()
})

export const ImportMultisigRequest = z.object({
  multisigVersion: z.number().int(),
  publicKeys: z.array(PublicKey),
  threshold: z.number().int(),
  walletHandleToken: z.string()
})

export const InitWalletHandleTokenRequest = z.object({
  walletId: z.string(),
  walletPassword: z.string()
})

export const ListKeysRequest = z.object({
  walletHandleToken: z.string()
})

export const ListMultisigRequest = z.object({
  walletHandleToken: z.string()
})

export const ListWalletsRequest = z.record(z.string(), z.any())

export const ed25519Signature = z.array(z.number().int())

export const Signature = ed25519Signature

export const MultisigSubsig = z.object({
  publicKey: PublicKey,
  signature: Signature.optional()
})

export const MultisigSig = z.object({
  subsignatures: z.array(MultisigSubsig),
  threshold: z.number().int(),
  version: z.number().int()
})

export const ed25519PrivateKey = z.array(z.number().int())

export const PrivateKey = ed25519PrivateKey

export const ReleaseWalletHandleTokenRequest = z.object({
  walletHandleToken: z.string()
})

export const RenameWalletRequest = z.object({
  walletId: z.string(),
  walletName: z.string(),
  walletPassword: z.string()
})

export const RenewWalletHandleTokenRequest = z.object({
  walletHandleToken: z.string()
})

export const SignMultisigTxnRequest = z.object({
  partialMultisig: MultisigSig.optional(),
  publicKey: PublicKey,
  signer: Digest.optional(),
  transaction: z.instanceof(Uint8Array),
  walletHandleToken: z.string(),
  walletPassword: z.string().optional()
})

export const SignProgramMultisigRequest = z.object({
  address: z.instanceof(Address),
  program: z.instanceof(Uint8Array),
  partialMultisig: MultisigSig.optional(),
  publicKey: PublicKey,
  useLegacyMsig: z.boolean().optional(),
  walletHandleToken: z.string(),
  walletPassword: z.string().optional()
})

export const SignProgramRequest = z.object({
  address: z.instanceof(Address),
  program: z.instanceof(Uint8Array),
  walletHandleToken: z.string(),
  walletPassword: z.string().optional()
})

export const SignTxnRequest = z.object({
  publicKey: PublicKey.optional(),
  transaction: z.instanceof(Uint8Array),
  walletHandleToken: z.string(),
  walletPassword: z.string().optional()
})

export const VersionsRequest = z.record(z.string(), z.any())

export const VersionsResponse = z.object({
  versions: z.array(z.string())
})

export const WalletInfoRequest = z.object({
  walletHandleToken: z.string()
})
