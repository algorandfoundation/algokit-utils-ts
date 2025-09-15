/**
 * DryrunSource is TEAL source text that gets uploaded, compiled, and inserted into transactions or application state.
 */
export type DryrunSource = {
  /**
   * FieldName is what kind of sources this is. If lsig then it goes into the transactions[this.TxnIndex].LogicSig. If approv or clearp it goes into the Approval Program or Clear State Program of application[this.AppIndex].
   */
  fieldName: string;
  source: string;
  txnIndex: bigint;
  appIndex: bigint;
};
