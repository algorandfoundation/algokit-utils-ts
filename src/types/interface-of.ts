export type InterfaceOf<ClassType> = {
  [Member in keyof ClassType]: ClassType[Member];
};

