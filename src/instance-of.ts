/**
 * A type that represents the interface of the class given as the generic parameter
 */
export type InterfaceOf<ClassType> = {
  [Member in keyof ClassType]: ClassType[Member]
}
