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
- [AppCallTransactionResultOfType](../interfaces/types_app.AppCallTransactionResultOfType.md)
- [AppCompilationResult](../interfaces/types_app.AppCompilationResult.md)
- [AppDeployMetadata](../interfaces/types_app.AppDeployMetadata.md)
- [AppDeploymentParams](../interfaces/types_app.AppDeploymentParams.md)
- [AppLookup](../interfaces/types_app.AppLookup.md)
- [AppMetadata](../interfaces/types_app.AppMetadata.md)
- [AppReference](../interfaces/types_app.AppReference.md)
- [AppState](../interfaces/types_app.AppState.md)
- [AppStorageSchema](../interfaces/types_app.AppStorageSchema.md)
- [BoxName](../interfaces/types_app.BoxName.md)
- [BoxReference](../interfaces/types_app.BoxReference.md)
- [BoxValueRequestParams](../interfaces/types_app.BoxValueRequestParams.md)
- [BoxValuesRequestParams](../interfaces/types_app.BoxValuesRequestParams.md)
- [CompiledTeal](../interfaces/types_app.CompiledTeal.md)
- [CoreAppCallArgs](../interfaces/types_app.CoreAppCallArgs.md)
- [CreateAppParams](../interfaces/types_app.CreateAppParams.md)
- [RawAppCallArgs](../interfaces/types_app.RawAppCallArgs.md)
- [TealTemplateParams](../interfaces/types_app.TealTemplateParams.md)
- [UpdateAppParams](../interfaces/types_app.UpdateAppParams.md)

### Type Aliases

- [ABIAppCallArg](types_app.md#abiappcallarg)
- [ABIReturn](types_app.md#abireturn)
- [AppCallArgs](types_app.md#appcallargs)
- [BoxIdentifier](types_app.md#boxidentifier)

### Variables

- [ABI\_RETURN\_PREFIX](types_app.md#abi_return_prefix)
- [APP\_DEPLOY\_NOTE\_DAPP](types_app.md#app_deploy_note_dapp)
- [APP\_PAGE\_MAX\_SIZE](types_app.md#app_page_max_size)
- [DELETABLE\_TEMPLATE\_NAME](types_app.md#deletable_template_name)
- [UPDATABLE\_TEMPLATE\_NAME](types_app.md#updatable_template_name)

## Type Aliases

### ABIAppCallArg

Ƭ **ABIAppCallArg**: `ABIArgument` \| [`TransactionToSign`](../interfaces/types_transaction.TransactionToSign.md) \| `Transaction` \| `Promise`<[`SendTransactionResult`](../interfaces/types_transaction.SendTransactionResult.md)\>

An argument for an ABI method, either a primitive value, or a transaction with or without signer, or the unawaited async return value of an algokit method that returns a `SendTransactionResult`

#### Defined in

[src/types/app.ts:89](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L89)

___

### ABIReturn

Ƭ **ABIReturn**: { `decodeError`: `undefined` ; `rawReturnValue`: `Uint8Array` ; `returnValue`: `ABIValue`  } \| { `decodeError`: `Error` ; `rawReturnValue`: `undefined` ; `returnValue`: `undefined`  }

The return value of an ABI method call

#### Defined in

[src/types/app.ts:189](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L189)

___

### AppCallArgs

Ƭ **AppCallArgs**: [`RawAppCallArgs`](../interfaces/types_app.RawAppCallArgs.md) \| [`ABIAppCallArgs`](../interfaces/types_app.ABIAppCallArgs.md)

Arguments to pass to an app call either:
  * The raw app call values to pass through into the transaction (after processing); or
  * An ABI method definition (method and args)

#### Defined in

[src/types/app.ts:105](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L105)

___

### BoxIdentifier

Ƭ **BoxIdentifier**: `string` \| `Uint8Array` \| [`SendTransactionFrom`](types_transaction.md#sendtransactionfrom)

Something that identifies a box name - either a:
 * `Uint8Array`
 * `string` (that will be encoded to a Uint8Array)
 * `SendTransactionFrom` (encoded into the public key address of the corresponding account)

#### Defined in

[src/types/app.ts:64](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L64)

## Variables

### ABI\_RETURN\_PREFIX

• `Const` **ABI\_RETURN\_PREFIX**: `Uint8Array`

First 4 bytes of SHA-512/256 hash of "return" for retrieving ABI return values

#### Defined in

[src/types/app.ts:34](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L34)

___

### APP\_DEPLOY\_NOTE\_DAPP

• `Const` **APP\_DEPLOY\_NOTE\_DAPP**: ``"ALGOKIT_DEPLOYER"``

The app create/update ARC-2 transaction note prefix

#### Defined in

[src/types/app.ts:28](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L28)

___

### APP\_PAGE\_MAX\_SIZE

• `Const` **APP\_PAGE\_MAX\_SIZE**: ``2048``

The maximum number of bytes in a single app code page

#### Defined in

[src/types/app.ts:31](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L31)

___

### DELETABLE\_TEMPLATE\_NAME

• `Const` **DELETABLE\_TEMPLATE\_NAME**: ``"TMPL_DELETABLE"``

The name of the TEAL template variable for deploy-time permanence control

#### Defined in

[src/types/app.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L25)

___

### UPDATABLE\_TEMPLATE\_NAME

• `Const` **UPDATABLE\_TEMPLATE\_NAME**: ``"TMPL_UPDATABLE"``

The name of the TEAL template variable for deploy-time immutability control

#### Defined in

[src/types/app.ts:22](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L22)
