import beaker
import pyteal as pt

UPDATABLE_TEMPLATE_NAME = "TMPL_UPDATABLE"
DELETABLE_TEMPLATE_NAME = "TMPL_DELETABLE"


class BareCallAppState:
    value = beaker.GlobalStateValue(stack_type=pt.TealType.uint64)


app = beaker.Application("BareCallApp", state=BareCallAppState)


@app.create(authorize=beaker.Authorize.only_creator(), bare=True)
def create() -> pt.Expr:
    return app.state.value.set(pt.Tmpl.Int("TMPL_VALUE"))


@app.update(authorize=beaker.Authorize.only_creator(), bare=True)
def update() -> pt.Expr:
    return pt.Assert(pt.Tmpl.Int(UPDATABLE_TEMPLATE_NAME), comment="Check app is updatable")


@app.delete(authorize=beaker.Authorize.only_creator(), bare=True)
def delete() -> pt.Expr:
    return pt.Assert(pt.Tmpl.Int(DELETABLE_TEMPLATE_NAME), comment="Check app is deletable")
