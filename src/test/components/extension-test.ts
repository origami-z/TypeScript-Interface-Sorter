/* eslint-disable */
/** Test file to be used when running extension locally in dev. */

interface IInteface1 {
  /**
   * Some jsDoc to describe the property
   */
  name: string;

  /** One liner of the jsDoc */
  length: number;
}

type CustomType = {
  /**
   * Some jsDoc to describe the property
   */
  name: string;

  /** One liner of the jsDoc */
  length: number;
}

interface IInterface {
  requiredProp1: string;
  optionalProp1?: string;
  RequiredProp2: string;
  OptionalProp2?: string;
}

type CustomType2 = {
  requiredProp1: string;
  optionalProp1?: string;
  RequiredProp2: string;
  OptionalProp2?: string;
}