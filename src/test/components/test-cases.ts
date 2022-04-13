export const tcPrefixes = ['interface IInterface ', 'type CustomType '];

export const tcEmptyInterface = `
interface IInterface {} 
`;

export const tcPrefixExport = `export `;

export const typeWithOneProperty = `{
  name: string;
}`;

export const tcInterfaceWithOneProperty = `
interface IInterface 
`;

export const tcTypeWithOneProperty = `
type CustomType {
  name: string;
}
`;

export const tcClassImplementInterface = `
class MyClass implements IInterface {
  public name = "MyClass";
}
`;

export const tcInterfaceWithMultipleProperties = `
interface IInterface {
  name: string;

  length: number;

  description: string;
}
`;

export const tcInterfaceWithReadonlyProperties = `
interface IInterface {
  readonly name: string;

  readonly length: number;
}
`;

export const constJsDocComments = `/** This is an example interface */`;

export const tcInterfaceWithComment = `
${constJsDocComments}
${tcInterfaceWithOneProperty}`;

/**
 * member 1: 1-71
 * member 2: 72 - 121
 */
export const typeWithJsDocProperty = `{
  /**
   * Some jsDoc to describe the property
   */
  name: string;

  /** One liner of the jsDoc */
  length: number;
}
`;

export const tcInterfaceWithOptionalProperty = `
interface IInterface {
  requiredProp: string;

  optionalProp?: string;
}
`;

export const tcInterfaceWithMultipleOptionalProperty = `
interface IInterface {
  requiredProp1: string;
  optionalProp1?: string;
  RequiredProp2: string;
  OptionalProp2?: string;
}
`;

export const tcInterfaceWithExtends = `
${tcEmptyInterface}

interface IInterface extends IEmptyInterface {
  name: string;

  length: number;
}
`;

export const tcInterfaceWithCapitalLetter = `
interface IInterface {
  name: string;

  Length: number;

  description: string;
}
`;
