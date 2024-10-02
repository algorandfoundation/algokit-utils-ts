from algopy import ARC4Contract, arc4, gtxn


class SampleReferenceTransaction(ARC4Contract):
    @arc4.abimethod
    def get_pay_txn_amount(self, pay_txn: gtxn.PaymentTransaction) -> arc4.UInt64:
        return arc4.UInt64(pay_txn.amount)

    @arc4.abimethod
    def get_returned_value_of_app_call_txn(
        self, app_call_txn: gtxn.ApplicationCallTransaction
    ) -> arc4.UInt64:
        return arc4.UInt64.from_log(app_call_txn.last_log)
