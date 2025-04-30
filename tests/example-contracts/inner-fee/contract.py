from algopy import (
    ARC4Contract,
    BigUInt,
    Global,
    UInt64,
    arc4,
    ensure_budget,
    itxn,
    op,
    urange,
)


class InnerFeeContract(ARC4Contract):
    @arc4.abimethod
    def burn_ops(self, op_budget: UInt64) -> None:
        # Uses approx 60 op budget per iteration
        count = op_budget // 60
        ensure_budget(op_budget)
        for i in urange(count):
            sqrt = op.bsqrt(BigUInt(i))
            assert(sqrt >= 0) # Prevent optimiser removing the sqrt

    @arc4.abimethod(readonly=True)
    def burn_ops_readonly(self, op_budget: UInt64) -> None:
        self.burn_ops(op_budget)

    @arc4.abimethod
    def no_op(self) -> None:
        pass

    @arc4.abimethod
    def send_x_inners_with_fees(self, app_id: UInt64, fees: arc4.DynamicArray[arc4.UInt64]) -> None:
        for fee in fees:
            arc4.abi_call('no_op', app_id=app_id, fee=fee.native)

    @arc4.abimethod
    def send_inners_with_fees(self, app_id_1: UInt64, app_id_2: UInt64, fees: arc4.Tuple[arc4.UInt64, arc4.UInt64, arc4.UInt64, arc4.UInt64, arc4.DynamicArray[arc4.UInt64]]) -> None:
        arc4.abi_call('no_op', app_id=app_id_1, fee=fees[0].native)
        arc4.abi_call('no_op', app_id=app_id_1, fee=fees[1].native)
        itxn.Payment(
            amount=0,
            receiver=Global.current_application_address,
            fee=fees[2].native
        ).submit()
        arc4.abi_call('send_x_inners_with_fees', app_id_2, fees[4], app_id=app_id_1, fee=fees[3].native)

    @arc4.abimethod
    def send_inners_with_fees_2(self, app_id_1: UInt64, app_id_2: UInt64, fees: arc4.Tuple[arc4.UInt64, arc4.UInt64, arc4.DynamicArray[arc4.UInt64], arc4.UInt64, arc4.UInt64, arc4.DynamicArray[arc4.UInt64]]) -> None:
        arc4.abi_call('no_op', app_id=app_id_1, fee=fees[0].native)
        arc4.abi_call('send_x_inners_with_fees', app_id_2, fees[2], app_id=app_id_1, fee=fees[1].native)
        arc4.abi_call('no_op', app_id=app_id_1, fee=fees[3].native)
        arc4.abi_call('send_x_inners_with_fees', app_id_2, fees[5], app_id=app_id_1, fee=fees[4].native)
