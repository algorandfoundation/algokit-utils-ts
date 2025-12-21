import { Address, concatArrays, decodeMsgpack, hash } from '@algorandfoundation/algokit-common'
import { MultisigAccount } from './multisig'
import { TransactionSigner } from './signer'
import { LogicSignature, MultisigSignature, SignedTransaction, encodeSignedTransaction } from './transactions/signed-transaction'
import { Transaction } from './transactions/transaction'
import { logicSignatureCodec } from './transactions/signed-transaction-meta'

const PROGRAM_TAG = new TextEncoder().encode('Program')
const MSIG_PROGRAM_TAG = new TextEncoder().encode('MsigProgram')
const SIGN_PROGRAM_DATA_PREFIX = new TextEncoder().encode('ProgData')

/** Function for signing logic signatures for delegation */
export type DelegatedLsigSigner = (lsig: LogicSigAccount, msig?: MultisigAccount) => Promise<Uint8Array>

/** Function for signing program data for a logic signature */
export type ProgramDataSigner = (data: Uint8Array, lsig: LogicSigAccount) => Promise<Uint8Array>

export class LogicSigAccount {
  logic: Uint8Array
  args: Uint8Array[]
  sig?: Uint8Array
  msig?: MultisigSignature
  lmsig?: MultisigSignature

  static fromSignature(signature: LogicSignature): LogicSigAccount {
    const lsigAccount = new LogicSigAccount(signature.logic, signature.args || [])
    lsigAccount.sig = signature.sig
    lsigAccount.msig = signature.msig
    lsigAccount.lmsig = signature.lmsig
    return lsigAccount
  }

  static fromBytes(encodedLsig: Uint8Array): LogicSigAccount {
    const decoded = decodeMsgpack(encodedLsig)
    const lsigSignature = logicSignatureCodec.decode(decoded, 'msgpack')
    return LogicSigAccount.fromSignature(lsigSignature)
  }

  constructor(program: Uint8Array, programArgs?: Array<Uint8Array> | null) {
    if (programArgs && (!Array.isArray(programArgs) || !programArgs.every((arg) => arg.constructor === Uint8Array))) {
      throw new TypeError('Invalid arguments')
    }

    let args: Uint8Array[] = []
    if (programArgs != null) args = programArgs.map((arg) => new Uint8Array(arg))

    this.logic = program
    this.args = args
  }

  get signer(): TransactionSigner {
    return async (txns: Transaction[], indexes: number[]) => {
      const signedTxns: Uint8Array[] = []
      for (const index of indexes) {
        const txn = txns[index]

        const stxn: SignedTransaction = {
          txn,
          lsig: { logic: this.logic, args: this.args, msig: this.msig, lmsig: this.lmsig, sig: this.sig },
        }

        signedTxns.push(encodeSignedTransaction(stxn))
      }

      return signedTxns
    }
  }

  get addr(): Address {
    return this.address()
  }

  /**
   * Compute hash of the logic sig program (that is the same as escrow account address) as string address
   * @returns String representation of the address
   */
  address(): Address {
    const toBeSigned = concatArrays(PROGRAM_TAG, this.logic)
    const h = hash(toBeSigned)
    return new Address(h)
  }

  async delegate(signer: DelegatedLsigSigner) {
    this.sig = await signer(this)
  }

  async delegateMultisig(msig: MultisigAccount) {
    if (this.lmsig == undefined) {
      this.lmsig = {
        subsigs: [],
        version: msig.params.version,
        threshold: msig.params.threshold,
      }
    }
    for (const addrWithSigner of msig.subSigners) {
      const { lsigSigner, addr } = addrWithSigner
      const signature = await lsigSigner(this, msig)

      this.lmsig.subsigs.push({ publicKey: addr.publicKey, sig: signature })
    }
  }

  bytesToSignForDelegation(msig?: MultisigAccount): Uint8Array {
    if (msig) {
      return concatArrays(MSIG_PROGRAM_TAG, msig.addr.publicKey, this.logic)
    } else {
      return concatArrays(PROGRAM_TAG, this.logic)
    }
  }

  signProgramData(data: Uint8Array, signer: ProgramDataSigner): Promise<Uint8Array> {
    return signer(data, this)
  }

  programDataToSign(data: Uint8Array): Uint8Array {
    return concatArrays(SIGN_PROGRAM_DATA_PREFIX, this.address().publicKey, data)
  }
}
