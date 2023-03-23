import beaker
import pyteal as pt

UPDATABLE_TEMPLATE_NAME = "TMPL_UPDATABLE"
DELETABLE_TEMPLATE_NAME = "TMPL_DELETABLE"


class BareCallAppState:
    value = beaker.GlobalStateValue(stack_type=pt.TealType.uint64)


app = beaker.Application("BareCallApp", state=BareCallAppState)


@app.external(read_only=True)
def call(value: pt.abi.String, *, output: pt.abi.String) -> pt.Expr:
    return output.set(pt.Concat(pt.Bytes("Hello, "), value.get()))


@app.external(read_only=True)
def call_txn(txn: pt.abi.PaymentTransaction, value: pt.abi.String, *, output: pt.abi.String) -> pt.Expr:
    return output.set(pt.Concat(pt.Bytes("Sent "), pt.Itob(txn.get().amount()), pt.Bytes(". "), value.get()))


@app.create(authorize=beaker.Authorize.only_creator(), bare=True)
def create() -> pt.Expr:
    return app.state.value.set(pt.Tmpl.Int("TMPL_VALUE"))


@app.update(authorize=beaker.Authorize.only_creator(), bare=True)
def update() -> pt.Expr:
    return pt.Assert(pt.Tmpl.Int(UPDATABLE_TEMPLATE_NAME), comment="Check app is updatable")


@app.delete(authorize=beaker.Authorize.only_creator(), bare=True)
def delete() -> pt.Expr:
    return pt.Assert(pt.Tmpl.Int(DELETABLE_TEMPLATE_NAME), comment="Check app is deletable")
