[@algorandfoundation/algokit-utils](../README.md) / types/application-client

# Module: types/application-client

## Table of contents

### Classes

- [ApplicationClient](../classes/types_application_client.ApplicationClient.md)

### Type Aliases

- [AppSpecAppDetails](types_application_client.md#appspecappdetails)

## Type Aliases

### AppSpecAppDetails

Ƭ **AppSpecAppDetails**: { `app`: [`AppSpec`](../interfaces/types_appspec.AppSpec.md) \| `string` ; `params?`: `SuggestedParams` ; `sender?`: [`SendTransactionFrom`](types_transaction.md#sendtransactionfrom)  } & { `id`: `number`  } \| { `creatorAddress`: `string` ; `existingDeployments?`: [`AppLookup`](../interfaces/types_app.AppLookup.md)  }

The details of an ARC-0032 app spec specified app

#### Defined in

[types/application-client.ts:22](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L22)
