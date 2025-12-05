import { Address, concatArrays, hash, isValidAddress } from '@algorandfoundation/algokit-common'
import { MultisigAccount } from './multisig'
import { encodeSignedTransaction, MultisigSignature } from './transactions/signed-transaction'
import { TransactionSigner } from './signer'
import { Transaction } from './transactions/transaction'
import { SignedTransaction } from './transactions/signed-transaction'
import { decodeMsgpack } from '@algorandfoundation/algokit-common'
import { LogicSignature } from './transactions/signed-transaction'
import { logicSignatureCodec } from './transactions/signed-transaction-meta'

// base64regex is the regex to test for base64 strings
const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/

/** sanityCheckProgram performs heuristic program validation:
 * check if passed in bytes are Algorand address or is B64 encoded, rather than Teal bytes
 *
 * @param program - Program bytes to check
 */
export function sanityCheckProgram(program: Uint8Array) {
  if (!program || program.length === 0) throw new Error('empty program')

  const lineBreakOrd = '\n'.charCodeAt(0)
  const blankSpaceOrd = ' '.charCodeAt(0)
  const tildeOrd = '~'.charCodeAt(0)

  const isPrintable = (x: number) => blankSpaceOrd <= x && x <= tildeOrd
  const isAsciiPrintable = program.every((x: number) => x === lineBreakOrd || isPrintable(x))

  if (isAsciiPrintable) {
    const programStr = new TextDecoder().decode(program)

    if (isValidAddress(programStr)) throw new Error('requesting program bytes, get Algorand address')

    if (base64regex.test(programStr)) throw new Error('program should not be b64 encoded')

    throw new Error('program bytes are all ASCII printable characters, not looking like Teal byte code')
  }
}

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

  constructor(program: Uint8Array, programArgs?: Array<Uint8Array> | null) {
    if (programArgs && (!Array.isArray(programArgs) || !programArgs.every((arg) => arg.constructor === Uint8Array))) {
      throw new TypeError('Invalid arguments')
    }

    let args: Uint8Array[] = []
    if (programArgs != null) args = programArgs.map((arg) => new Uint8Array(arg))

    sanityCheckProgram(program)

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
        subsignatures: [],
        version: msig.params.version,
        threshold: msig.params.threshold,
      }
    }
    for (const addrWithSigner of msig.subSigners) {
      const { lsigSigner, addr } = addrWithSigner
      const signature = await lsigSigner(this, msig)

      this.lmsig.subsignatures.push({ address: addr, signature })
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

/**
 * Decodes MsgPack bytes into a logic signature.
 *
 * @param encodedLogicSignature - The MsgPack encoded logic signature
 * @returns The decoded LogicSignature or an error if decoding fails.
 */
export function decodeLogicSignature(encodedLogicSignature: Uint8Array): LogicSignature {
  const decodedData = decodeMsgpack(encodedLogicSignature)
  return logicSignatureCodec.decode(decodedData, 'msgpack')
}
