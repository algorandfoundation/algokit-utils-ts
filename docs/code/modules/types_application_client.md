[@algorandfoundation/algokit-utils](../README.md) / types/application-client

# Module: types/application-client

## Table of contents

### Classes

- [ApplicationClient](../classes/types_application_client.ApplicationClient.md)

### Interfaces

- [ResolveAppById](../interfaces/types_application_client.ResolveAppById.md)

### Type Aliases

- [AppSpecAppDetails](types_application_client.md#appspecappdetails)
- [ResolveAppByCreatorAndName](types_application_client.md#resolveappbycreatorandname)

## Type Aliases

### AppSpecAppDetails

Ƭ **AppSpecAppDetails**: { `app`: [`AppSpec`](../interfaces/types_appspec.AppSpec.md) \| `string` ; `params?`: `SuggestedParams` ; `sender?`: [`SendTransactionFrom`](types_transaction.md#sendtransactionfrom)  } & [`ResolveAppById`](../interfaces/types_application_client.ResolveAppById.md) \| [`ResolveAppByCreatorAndName`](types_application_client.md#resolveappbycreatorandname)

The details of an ARC-0032 app spec specified app

#### Defined in

[types/application-client.ts:47](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L47)

___

### ResolveAppByCreatorAndName

Ƭ **ResolveAppByCreatorAndName**: { `creatorAddress`: `string` ; `name?`: `string`  } & { `indexer`: `Indexer`  } \| { `existingDeployments`: [`AppLookup`](../interfaces/types_app.AppLookup.md)  }

Configuration to resolve app by creator and name

**`See`**

getCreatorAppsByName

#### Defined in

[types/application-client.ts:22](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L22)
