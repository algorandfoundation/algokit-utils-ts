import { Address, Addressable, concatArrays, decodeMsgpack, hash } from '@algorandfoundation/algokit-common'
import { MultisigAccount } from './multisig'
import { AddressWithDelegatedLsigSigner, TransactionSigner } from './signer'
import { LogicSignature, MultisigSignature, SignedTransaction, encodeSignedTransaction } from './transactions/signed-transaction'
import { Transaction } from './transactions/transaction'
import { logicSignatureCodec } from './transactions/signed-transaction-meta'

const PROGRAM_TAG = new TextEncoder().encode('Program')
const MSIG_PROGRAM_TAG = new TextEncoder().encode('MsigProgram')
const SIGN_PROGRAM_DATA_PREFIX = new TextEncoder().encode('ProgData')

/** Function for signing logic signatures for delegation
 *  @param lsig - The logic signature that is being signed for delegation
 *  @param msig - Optional multisig account that should be set when a public key is signing as a subsigner of a multisig
 *  @returns The address of the delegator
 * */
export type DelegatedLsigSigner = (
  lsig: LogicSigAccount,
  msig?: MultisigAccount,
) => Promise<{ addr: Address } & ({ sig?: Uint8Array } | { lmsig?: MultisigSignature })>

/** Function for signing program data for a logic signature */
export type ProgramDataSigner = (data: Uint8Array, lsig: LogicSig) => Promise<Uint8Array>

export class LogicSig implements Addressable {
  logic: Uint8Array
  args: Uint8Array[]
  protected _addr: Address

  constructor(program: Uint8Array, programArgs?: Array<Uint8Array>) {
    this.logic = program
    this.args = programArgs ?? []
    const toBeSigned = concatArrays(PROGRAM_TAG, this.logic)
    const h = hash(toBeSigned)
    this._addr = new Address(h)
  }

  static fromSignature(signature: LogicSignature): LogicSig {
    return new LogicSig(signature.logic, signature.args || [])
  }

  static fromBytes(encodedLsig: Uint8Array): LogicSig {
    const decoded = decodeMsgpack(encodedLsig)
    const lsigSignature = logicSignatureCodec.decode(decoded, 'msgpack')
    return LogicSig.fromSignature(lsigSignature)
  }

  address(): Address {
    return this._addr
  }

  get addr(): Address {
    return this._addr
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

  account(): LogicSigAccount {
    return new LogicSigAccount(this.logic, this.args)
  }

  delegatedAccount(delegator: Address): LogicSigAccount {
    return new LogicSigAccount(this.logic, this.args, delegator)
  }
}

export class LogicSigAccount extends LogicSig {
  sig?: Uint8Array
  msig?: MultisigSignature
  lmsig?: MultisigSignature

  static fromSignature(signature: LogicSignature, delegator?: Address): LogicSigAccount {
    if (signature.lmsig || signature.msig) {
      const msigAddr = MultisigAccount.fromSignature((signature.lmsig || signature.msig)!).addr

      if (delegator && !msigAddr.equals(delegator)) {
        throw new Error('Provided delegator address does not match multisig address')
      }

      const lsig = new LogicSigAccount(signature.logic, signature.args || [], msigAddr)
      lsig.lmsig = signature.lmsig
      lsig.msig = signature.msig
      return lsig
    }

    const lsigAccount = new LogicSigAccount(signature.logic, signature.args || [], delegator)

    if (signature.sig && delegator === undefined) {
      throw new Error('Delegated address must be provided when logic sig has a signature')
    }

    if (signature.sig) {
      lsigAccount.sig = signature.sig
      return lsigAccount
    }

    return lsigAccount
  }

  static fromBytes(encodedLsig: Uint8Array, delegator?: Address): LogicSigAccount {
    const decoded = decodeMsgpack(encodedLsig)
    const lsigSignature = logicSignatureCodec.decode(decoded, 'msgpack')
    return LogicSigAccount.fromSignature(lsigSignature, delegator)
  }

  constructor(program: Uint8Array, programArgs?: Array<Uint8Array> | null, delegator?: Address) {
    super(program, programArgs ?? undefined)
    this._addr = delegator ?? this._addr
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

        if (!stxn.txn.sender.equals(this.addr)) {
          stxn.authAddress = this.addr
        }

        signedTxns.push(encodeSignedTransaction(stxn))
      }

      return signedTxns
    }
  }

  async signForDelegation(delegator: AddressWithDelegatedLsigSigner) {
    const result = await delegator.lsigSigner(this)

    if (!result.addr.equals(this._addr)) {
      throw new Error(
        `Delegator address from signer does not match expected delegator address. Expected: ${this._addr.toString()}, got: ${result.addr.toString()}`,
      )
    }

    if ('sig' in result && result.sig) {
      this.sig = result.sig
    } else if ('lmsig' in result && result.lmsig) {
      this.lmsig = result.lmsig
    } else {
      throw new Error('Delegated lsig signer must return either a sig or lmsig')
    }
  }
}
