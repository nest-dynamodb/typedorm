import { ModuleMetadata, Type } from "@nestjs/common";
import { ConnectionOptions } from "@typedorm/core";

export interface TypeDormModuleOption extends ConnectionOptions {}

export interface TypeDormModuleOptionFactory {
  createTypeDormConnectionOptions(): Promise<ConnectionOptions> | ConnectionOptions;
}

export interface TypeDormModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  inject?: any[];
  useClass?: Type<TypeDormModuleOptionFactory>;
  useExisting?: Type<TypeDormModuleOptionFactory>;
  useFactory?: (...args: any[]) => Promise<ConnectionOptions> | ConnectionOptions;
}