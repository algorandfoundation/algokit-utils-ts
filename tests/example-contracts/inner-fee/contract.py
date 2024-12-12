from algopy import ARC4Contract, Global, UInt64, arc4, itxn


class InnerFeeContract(ARC4Contract):

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
