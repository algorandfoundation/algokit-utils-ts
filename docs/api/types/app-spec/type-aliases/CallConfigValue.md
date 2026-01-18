[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-spec](../README.md) / CallConfigValue

# Type Alias: CallConfigValue

> **CallConfigValue** = `"NEVER"` \| `"CALL"` \| `"CREATE"` \| `"ALL"`

Defined in: [src/types/app-spec.ts:244](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-spec.ts#L244)

The various call configs:
 * `NEVER`: Will not be called
 * `CALL`: Can be called during a non-create call i.e. app id != 0
 * `CREATE`: Can be called during a create call i.e. app id = 0
 * `ALL`: Can be during a create OR non-create call
