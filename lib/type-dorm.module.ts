import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import { Connection, ConnectionOptions, createConnection } from "@typedorm/core";
import { TypeDormModuleAsyncOptions, TypeDormModuleOption, TypeDormModuleOptionFactory } from "./type-dorm.interface";
import { TypeDormConnection } from "./type-dorm.service";
import { getTypeDormConnectionToken, getTypeDormConnectionOptionToken } from "./type-dorm.util";

@Global()
@Module({})
export class TypeDormModule {
  static forRoot(option: TypeDormModuleOption) {
    const typeDormProvider: Provider<Connection> = {
      provide: getTypeDormConnectionToken(option.name),
      useValue: createConnection(option),
    }
    return {
      module: TypeDormModule,
      providers: [typeDormProvider],
      exports: [typeDormProvider],
    };
  }

  /* forRootAsync */
  public static forRootAsync(asyncOptions: TypeDormModuleAsyncOptions): DynamicModule {
    const {name} = asyncOptions;
    const typeDormProvider: Provider<Connection> = {
      provide: getTypeDormConnectionToken(name),
      useFactory(options: ConnectionOptions) {
        return createConnection(options)
      },
      inject: [getTypeDormConnectionOptionToken(name)],
    };

    return {
      module: TypeDormModule,
      imports: asyncOptions.imports,
      providers: [...this.createAsyncProviders(asyncOptions), typeDormProvider],
      exports: [typeDormProvider],
    };
  }

  /* createAsyncProviders */
  public static createAsyncProviders(options: TypeDormModuleAsyncOptions): Provider[] {
    if(!(options.useExisting || options.useFactory || options.useClass)) {
      throw new Error('Invalid configuration. Must provide useFactory, useClass or useExisting');
    }

    if (options.useExisting || options.useFactory) {
      return [
        this.createAsyncOptionsProvider(options)
      ];
    }

    return [ 
      this.createAsyncOptionsProvider(options), 
      { provide: options.useClass!, useClass: options.useClass! },
    ];
  }

  /* createAsyncOptionsProvider */
  public static createAsyncOptionsProvider({name, ...options}: TypeDormModuleAsyncOptions): Provider<ConnectionOptions> {

    if(!(options.useExisting || options.useFactory || options.useClass)) {
      throw new Error('Invalid configuration. Must provide useFactory, useClass or useExisting');
    }

    if (options.useFactory) {
      return {
        provide: getTypeDormConnectionOptionToken(name),
        useFactory: options.useFactory,
        inject: options.inject ?? [],
      };
    }

    return {
      provide: getTypeDormConnectionOptionToken(name),
      useFactory(optionsFactory: TypeDormModuleOptionFactory) {
        return optionsFactory.createTypeDormConnectionOptions();
      },
      inject: [options.useClass ?? options.useExisting!],
    };
  }

  static forRootNonInjection(connectionOptions: ConnectionOptions): DynamicModule {
    const connection = createConnection(connectionOptions);
    return {
      module: TypeDormModule,
      providers: [
        {
          provide: TypeDormConnection,
          useValue: connection,
        },
      ],
      exports: [TypeDormConnection],
    };
  }
}


