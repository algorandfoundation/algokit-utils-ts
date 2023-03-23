[@algorandfoundation/algokit-utils](../README.md) / types/app

# Module: types/app

## Table of contents

### Enumerations

- [OnSchemaBreak](../enums/types_app.OnSchemaBreak.md)
- [OnUpdate](../enums/types_app.OnUpdate.md)

### Interfaces

- [ABIAppCallArgs](../interfaces/types_app.ABIAppCallArgs.md)
- [AppCallParams](../interfaces/types_app.AppCallParams.md)
- [AppCallTransactionResult](../interfaces/types_app.AppCallTransactionResult.md)
- [AppDeployMetadata](../interfaces/types_app.AppDeployMetadata.md)
- [AppDeploymentParams](../interfaces/types_app.AppDeploymentParams.md)
- [AppLookup](../interfaces/types_app.AppLookup.md)
- [AppMetadata](../interfaces/types_app.AppMetadata.md)
- [AppReference](../interfaces/types_app.AppReference.md)
- [AppStorageSchema](../interfaces/types_app.AppStorageSchema.md)
- [BoxReference](../interfaces/types_app.BoxReference.md)
- [CompiledTeal](../interfaces/types_app.CompiledTeal.md)
- [CreateAppParams](../interfaces/types_app.CreateAppParams.md)
- [RawAppCallArgs](../interfaces/types_app.RawAppCallArgs.md)
- [TealTemplateParameters](../interfaces/types_app.TealTemplateParameters.md)
- [UpdateAppParams](../interfaces/types_app.UpdateAppParams.md)

### Type Aliases

- [ABIReturn](types_app.md#abireturn)
- [AppCallArgs](types_app.md#appcallargs)

### Variables

- [ABI\_RETURN\_PREFIX](types_app.md#abi_return_prefix)
- [APP\_DEPLOY\_NOTE\_DAPP](types_app.md#app_deploy_note_dapp)
- [APP\_PAGE\_MAX\_SIZE](types_app.md#app_page_max_size)
- [DELETABLE\_TEMPLATE\_NAME](types_app.md#deletable_template_name)
- [UPDATABLE\_TEMPLATE\_NAME](types_app.md#updatable_template_name)

## Type Aliases

### ABIReturn

Ƭ **ABIReturn**: { `decodeError`: `undefined` ; `rawReturnValue`: `Uint8Array` ; `returnValue`: `ABIValue`  } \| { `decodeError`: `Error` ; `rawReturnValue`: `undefined` ; `returnValue`: `undefined`  }

The return value of an ABI method call

#### Defined in

[types/app.ts:158](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L158)

___

### AppCallArgs

Ƭ **AppCallArgs**: [`RawAppCallArgs`](../interfaces/types_app.RawAppCallArgs.md) \| [`ABIAppCallArgs`](../interfaces/types_app.ABIAppCallArgs.md)

Arguments to pass to an app call either:
  * The raw app call values to pass through into the transaction (after processing); or
  * An ABI method definition (method and args)

#### Defined in

[types/app.ts:80](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L80)

## Variables

### ABI\_RETURN\_PREFIX

• `Const` **ABI\_RETURN\_PREFIX**: `Uint8Array`

First 4 bytes of SHA-512/256 hash of "return" for retrieving ABI return values

#### Defined in

[types/app.ts:17](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L17)

___

### APP\_DEPLOY\_NOTE\_DAPP

• `Const` **APP\_DEPLOY\_NOTE\_DAPP**: ``"ALGOKIT_DEPLOYER"``

The app create/update ARC-2 transaction note prefix

#### Defined in

[types/app.ts:11](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L11)

___

### APP\_PAGE\_MAX\_SIZE

• `Const` **APP\_PAGE\_MAX\_SIZE**: ``2048``

The maximum number of bytes in a single app code page

#### Defined in

[types/app.ts:14](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L14)

___

### DELETABLE\_TEMPLATE\_NAME

• `Const` **DELETABLE\_TEMPLATE\_NAME**: ``"TMPL_DELETABLE"``

The name of the TEAL template variable for deploy-time permanence control

#### Defined in

[types/app.ts:8](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L8)

___

### UPDATABLE\_TEMPLATE\_NAME

• `Const` **UPDATABLE\_TEMPLATE\_NAME**: ``"TMPL_UPDATABLE"``

The name of the TEAL template variable for deploy-time immutability control

#### Defined in

[types/app.ts:5](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L5)
