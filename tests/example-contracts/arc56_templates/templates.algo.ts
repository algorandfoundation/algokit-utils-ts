import { Contract } from '@algorandfoundation/tealscript'

export class Templates extends Contract {
  bytesTmplVar = TemplateVar<bytes>()

  uint64TmplVar = TemplateVar<uint64>()

  bytes32TmplVar = TemplateVar<bytes32>()

  bytes64TmplVar = TemplateVar<bytes64>()

  tmpl(): void {
    log(this.bytesTmplVar)
    assert(this.uint64TmplVar)
  }

  specificLengthTemplateVar(): void {
    ed25519VerifyBare(this.bytesTmplVar, this.bytes64TmplVar, this.bytes32TmplVar)
  }

  throwError(): void {
    throw Error('this is an error')
  }

  itobTemplateVar(): bytes {
    return itob(this.uint64TmplVar)
  }
}
