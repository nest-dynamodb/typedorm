<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" />
  </a>
</p>

<p align="center">
  A DynamoDB module for Nest framework (node.js) using <a href="https://github.com/typedorm/typedorm">typeDorm</a> library
</p>

### Installation

#### with npm
```sh
npm install --save @nest-dynamodb/typedorm
```

#### with yarn
```sh
yarn add @nest-dynamodb/typedorm
```

### How to use?

#### TypeDormModule.forRoot(options)

```ts
import { Module } from '@nestjs/common';
import { TypeDormModule } from '@nest-dynamodb/typedorm';
import { AppController } from './app.controller';
@Module({
  imports: [
    TypeDormModule.forRoot({
        table,
        entities: [],
        documentClient: new DocumentClientV3(new DynamoDBClient({})),
        name: instanceName
      }),
  ],
  controllers: [AppController],
})
export class AppModule {}
```

#### TypeDormModule.forRootAsync(options)

```ts
import { Module } from '@nestjs/common';
import { TypeDormModule } from '@nest-dynamodb/typedorm';
import { AppController } from './app.controller';
@Module({
  imports: [
    TypeDormModule.forRootAsync({
        // need another name here for dependency injection, @InjectTypeDorm(instanceName)
        name: instanceName,
        useFactory: async () => {
          return {
            table,
            entities: [],
            documentClient: new DocumentClientV3(new DynamoDBClient({})),
            name: instanceName
          }
        },
      }),
  ],
  controllers: [AppController],
})
export class AppModule {}
```

#### InjectTypeDorm(name?)

```ts
import { Controller, Get, } from '@nestjs/common';
import { InjectTypeDorm, TypeDormConnection } from '@nest-dynamodb/typedorm';
@Controller()
export class AppController {
  constructor(
    @InjectTypeDorm() private readonly connection: TypeDormConnection,
  ) {}
  @Get()
  async getHello() {
    const item = await this.connection.entityManager.findOne(...);
    return { item };
  }
}
```

#### TypeDormModule.forRootNonInjection(options)

```ts
import { Module } from '@nestjs/common';
import { TypeDormModule } from '@nest-dynamodb/typedorm';
import { AppController } from './app.controller';
@Module({
  imports: [
    TypeDormModule.forRootNonInjection({
        table,
        entities: [],
        documentClient: new DocumentClientV3(new DynamoDBClient({})),
      }),
  ],
  controllers: [AppController],
})
export class AppModule {}
```

```ts
import { Controller, Get, } from '@nestjs/common';
import { TypeDormConnection } from '@nest-dynamodb/typedorm';
@Controller()
export class AppController {
  constructor(
    // do not need InjectTypeDorm here
    private readonly connection: TypeDormConnection,
  ) {}
  @Get()
  async getHello() {
    const item = await this.connection.entityManager.findOne(...);
    return { item };
  }
}
```

## License

MIT