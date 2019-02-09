export interface IConfiguration {
  default: object;
  override?: object;
}

export interface IConfigurator {
  getValue(key: any): any;
}

export class SimpleConfigurator implements IConfigurator {
  private config: IConfiguration;

  public constructor(config: IConfiguration) {
    throw new Error("Method not implemented.");
  }

  public getValue(key: any): any {
    throw new Error("Method not implemented.");
  }
}
