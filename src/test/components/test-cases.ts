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

export const constJsDocComments = `/** This is an example interface */`;

export const tcInterfaceWithComment = `
${constJsDocComments}
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

export const tcImportsReact = `
import React, { useState, useEffect } from 'react';
`;

export const tcImportsTwoLocalComponents = `
import { ComponentB } from './components/b';
import { LibA } from '../lib/a';
`;

export const tcImportsPlainCss = `
import 'foo.css';
`;

export const tcImportsCssModule = `
import * as styles from 'foo.css';
`;

export const tcImportsCommon1 = `
${tcImportsTwoLocalComponents}
${tcImportsReact}
${tcImportsPlainCss}
`;