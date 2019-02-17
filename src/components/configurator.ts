export interface IInterfaceSorterConfiguration {
  indentSpace?: number;
  lineBetweenMembers?: boolean;
}

export type InterfaceSorterConfigurationKeys = keyof IInterfaceSorterConfiguration;

export interface IConfiguration<T extends { [key: string]: any }> {
  default: T;
  override?: T;
}

export interface IConfigurator<T extends { [key: string]: any }> {
  getValue(key: keyof T): any;
}

export class SimpleConfigurator<T extends { [key: string]: any }> implements IConfigurator<T> {
  private config: IConfiguration<T>;

  public constructor(config: IConfiguration<T>) {
    this.config = config;
  }

  public getValue(key: keyof T): any {
    if (this.config.override && this.config.override[key]) {
      return this.config.override[key];
    } else {
      return this.config.default[key];
    }
  }
}
