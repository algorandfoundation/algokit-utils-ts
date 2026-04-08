from typing import Literal

from algopy import (
    Account,
    Application,
    ARC4Contract,
    Asset,
    BoxMap,
    Bytes,
    Global,
    LocalState,
    String,
    TemplateVar,
    Txn,
    UInt64,
    arc4,
    gtxn,
    subroutine,
)

DELETABLE_TEMPLATE_NAME = "DELETABLE"
UPDATABLE_TEMPLATE_NAME = "UPDATABLE"
VALUE_TEMPLATE_NAME = "VALUE"

class BaseARC4Contract(ARC4Contract):
    @subroutine
    def authorize_creator(self) -> None:
        assert Txn.sender == Global.creator_address, "unauthorized"

    @subroutine
    def itoa(self, i: UInt64) -> String:
        if i == UInt64(0):
            return String("0")
        else:
            return (self.itoa(i // UInt64(10)) if (i // UInt64(10)) > UInt64(0) else String("")) + String.from_bytes(
                String("0123456789").bytes[i % UInt64(10)]
            )

class ImmutabilityControlARC4Contract(BaseARC4Contract):
    @arc4.baremethod(allow_actions=["UpdateApplication"])
    def update(self) -> None:
        assert TemplateVar[bool](UPDATABLE_TEMPLATE_NAME), "Check app is updatable"
        self.authorize_creator()


class PermanenceControlARC4Contract(BaseARC4Contract):
    @arc4.baremethod(allow_actions=["DeleteApplication"])
    def delete(self) -> None:
        assert TemplateVar[bool](DELETABLE_TEMPLATE_NAME), "Check app is deletable"
        self.authorize_creator()

class ExampleARC4Contract(ImmutabilityControlARC4Contract, PermanenceControlARC4Contract):
    pass

class Input(arc4.Struct):
    name: arc4.String
    age: arc4.UInt64


class Output(arc4.Struct):
    message: arc4.String
    result: arc4.UInt64


class State(ExampleARC4Contract):
    value: UInt64
    bytes1: Bytes
    bytes2: Bytes
    int1: UInt64
    int2: UInt64
    local_bytes1: LocalState[Bytes]
    local_bytes2: LocalState[Bytes]
    local_int1: LocalState[UInt64]
    local_int2: LocalState[UInt64]
    box: BoxMap[arc4.StaticArray[arc4.Byte, Literal[4]], arc4.String]

    def __init__(self) -> None:
        self.local_int1 = LocalState(UInt64)
        self.local_int2 = LocalState(UInt64)
        self.local_bytes1 = LocalState(Bytes)
        self.local_bytes2 = LocalState(Bytes)

        self.box = BoxMap(arc4.StaticArray[arc4.Byte, Literal[4]], arc4.String, key_prefix=b"")

    @arc4.baremethod(create="require", allow_actions=["NoOp", "OptIn"])
    def create(self) -> None:
        self.authorize_creator()
        self.value = TemplateVar[UInt64](VALUE_TEMPLATE_NAME)

    @arc4.abimethod(create="require")
    def create_abi(self, input: String) -> String:  # noqa: A002
        self.authorize_creator()
        return input

    @arc4.abimethod(allow_actions=["UpdateApplication"])
    def update_abi(self, input: String) -> String:  # noqa: A002
        self.authorize_creator()
        assert TemplateVar[bool](UPDATABLE_TEMPLATE_NAME), "Check app is updatable"
        return input

    @arc4.abimethod(allow_actions=["DeleteApplication"])
    def delete_abi(self, input: String) -> String:  # noqa: A002
        self.authorize_creator()
        assert TemplateVar[bool](DELETABLE_TEMPLATE_NAME), "Check app is deletable"
        return input

    @arc4.abimethod(allow_actions=["OptIn"])
    def opt_in(self) -> None:
        pass

    @arc4.abimethod(readonly=True)
    def error(self) -> None:
        assert False, "Deliberate error"  # noqa: PT015, B011

    @arc4.abimethod(readonly=True)
    def call_abi(self, value: String) -> String:
        return String("Hello, ") + value

    @arc4.abimethod
    def call_abi_uint32(self, input: arc4.UInt32) -> arc4.UInt32:
        return input

    @arc4.abimethod(readonly=True)
    def call_abi_uint32_readonly(self, input: arc4.UInt32) -> arc4.UInt32:
        return input

    @arc4.abimethod
    def call_abi_uint64(self, input: arc4.UInt64) -> arc4.UInt64:
        return input

    @arc4.abimethod(readonly=True)
    def call_abi_uint64_readonly(self, input: arc4.UInt64) -> arc4.UInt64:
        return input

    @arc4.abimethod(readonly=True)
    def call_abi_txn(self, txn: gtxn.PaymentTransaction, value: String) -> String:
        return String("Sent ") + self.itoa(txn.amount) + String(". ") + value

    @arc4.abimethod
    def call_with_references(self, asset: Asset, account: Account, application: Application) -> UInt64:
        assert asset, "asset not provided"
        assert account, "account not provided"
        assert application, "application not provided"
        return UInt64(1)

    @arc4.abimethod(readonly=True, default_args={"arg_with_default": arc4.String("default value")})
    def default_value(self, arg_with_default: arc4.String) -> arc4.String:
        return arg_with_default

    @arc4.abimethod(readonly=True, default_args={"arg_with_default": arc4.UInt64(123)})
    def default_value_int(self, arg_with_default: arc4.UInt64) -> arc4.UInt64:
        return arg_with_default

    @arc4.abimethod(readonly=True, default_args={"arg_with_default": arc4.String("default value")})
    def default_value_from_abi(self, arg_with_default: arc4.String) -> arc4.String:
        return String("ABI, ") + arg_with_default

    @arc4.abimethod(readonly=True, default_args={"arg_with_default": "int1"})
    def default_value_from_global_state(self, arg_with_default: arc4.UInt64) -> arc4.UInt64:
        return arg_with_default

    @arc4.abimethod(readonly=True, default_args={"arg_with_default": "local_bytes1"})
    def default_value_from_local_state(self, arg_with_default: String) -> arc4.String:
        return arc4.String(String("Local state, ") + arg_with_default)

    @arc4.abimethod
    def structs(self, name_age: Input) -> Output:
        return Output(arc4.String(String("Hello, ") + name_age.name.native), arc4.UInt64(name_age.age.native * 2))

    @arc4.abimethod
    def set_global(
        self, int1: UInt64, int2: UInt64, bytes1: String, bytes2: arc4.StaticArray[arc4.Byte, Literal[4]]
    ) -> None:
        self.int1 = int1
        self.int2 = int2
        self.bytes1 = bytes1.bytes
        self.bytes2 = bytes2.bytes

    @arc4.abimethod
    def set_local(
        self, int1: UInt64, int2: UInt64, bytes1: String, bytes2: arc4.StaticArray[arc4.Byte, Literal[4]]
    ) -> None:
        self.local_int1[Txn.sender] = int1
        self.local_int2[Txn.sender] = int2
        self.local_bytes1[Txn.sender] = bytes1.bytes
        self.local_bytes2[Txn.sender] = bytes2.bytes

    @arc4.abimethod
    def set_box(self, name: arc4.StaticArray[arc4.Byte, Literal[4]], value: arc4.String) -> None:
        self.box[name] = value
