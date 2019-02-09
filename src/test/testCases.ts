export const tcEmptyInterface = `
interface IInterface {} 
`;

export const tcPrefixExport = `export `;

export const tcInterfaceWithOneProperty = `
interface IInterface {
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

export const tcInterfaceWithComment = `
/** This is an example interface */
${tcInterfaceWithOneProperty}`;

export const tcInterfaceWithJsDocProperty = `
interface IInterface {
  /**
   * Some jsDoc to describe the property
   */
  name: string;
  
  /** One liner of the jsDoc */
  length: number;
}
`;

export const tcInterfaceWithExtends = `
${tcEmptyInterface}

interface IInterface extends IEmptyInterface {
  name: string;

  length: number;
}
`;
