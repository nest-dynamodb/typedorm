import { Test, TestingModule } from '@nestjs/testing';
import { Table } from '@typedorm/common';
import {DocumentClientV3} from '@typedorm/document-client';
import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import { TypeDormModule } from './type-dorm.module';
import { getTypeDormConnectionToken } from './type-dorm.util';
import { Connection, getEntityManager } from '@typedorm/core';
import { Injectable } from '@nestjs/common';
import { InjectTypeDorm } from './type-dorm.decorator';
import { TypeDormModuleOptionFactory } from './type-dorm.interface';
import { TypeDormConnection } from './type-dorm.service';

const table = new Table({
  name: 'test-table',
  partitionKey: 'pk',
  sortKey: 'sk',
});

describe('TypeDormModule', () => {
  it('Instance typeDorm', async () => {
    const instanceName = 'dummy';
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeDormModule.forRoot({
        table,
        entities: [],
        documentClient: new DocumentClientV3(new DynamoDBClient({})),
        name: instanceName
      })],
    }).compile();

    const typeDormModule = module.get(TypeDormModule);
    expect(typeDormModule).toBeInstanceOf(TypeDormModule);

    const typeDormConnection: Connection = module.get(getTypeDormConnectionToken(instanceName));
    expect(typeDormConnection).toBeInstanceOf(Connection);

    const entityManager = getEntityManager(instanceName)
    expect(entityManager).toStrictEqual(typeDormConnection.entityManager)
  });

  it('inject redis connection', async () => {

    @Injectable()
    class TestProvider {
      constructor(@InjectTypeDorm() private readonly connection: TypeDormConnection) {}

      getConnection() {
        return this.connection;
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeDormModule.forRoot({
        table,
        entities: [],
        documentClient: new DocumentClientV3(new DynamoDBClient({})),
      })],
      providers: [TestProvider],
    }).compile();


    const provider = module.get(TestProvider);
    expect(provider.getConnection()).toBeInstanceOf(Connection);

  });

  it('Instance async typeDorm', async () => {
    const instanceName = 'dummy2';
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeDormModule.forRootAsync({
        name: instanceName,
        useFactory: async () => {
          return {
            table,
            entities: [],
            documentClient: new DocumentClientV3(new DynamoDBClient({})),
            name: instanceName
          }
        },
      })],
    }).compile();

    const typeDormModule = module.get(TypeDormModule);
    expect(typeDormModule).toBeInstanceOf(TypeDormModule);

    const typeDormConnection: Connection = module.get(getTypeDormConnectionToken(instanceName));
    expect(typeDormConnection).toBeInstanceOf(Connection);

    const entityManager = getEntityManager(instanceName)
    expect(entityManager).toStrictEqual(typeDormConnection.entityManager)
  });

  it('Instance async typeDorm use class', async () => {
    class Factory implements TypeDormModuleOptionFactory {
      createTypeDormConnectionOptions() {
        return {
          table,
          entities: [],
          documentClient: new DocumentClientV3(new DynamoDBClient({})),
          name: instanceName
        }
      }
    }

    const instanceName = 'dummy3';
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeDormModule.forRootAsync({
        name: instanceName,
        useClass: Factory,
      })],
    }).compile();

    const typeDormModule = module.get(TypeDormModule);
    expect(typeDormModule).toBeInstanceOf(TypeDormModule);

    const typeDormConnection: Connection = module.get(getTypeDormConnectionToken(instanceName));
    expect(typeDormConnection).toBeInstanceOf(Connection);

    const entityManager = getEntityManager(instanceName)
    expect(entityManager).toStrictEqual(typeDormConnection.entityManager)
  });

  it('Instance typeDorm without injection', async () => {
    const instanceName = 'dummy5';
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeDormModule.forRootNonInjection({
        table,
        entities: [],
        documentClient: new DocumentClientV3(new DynamoDBClient({})),
        name: instanceName
      })],
    }).compile();

    const typeDormModule = module.get(TypeDormModule);
    expect(typeDormModule).toBeInstanceOf(TypeDormModule);

    const typeDormConnection = module.get(TypeDormConnection);
    expect(typeDormConnection).toBeInstanceOf(Connection);

    const entityManager = getEntityManager(instanceName)
    expect(entityManager).toStrictEqual(typeDormConnection.entityManager)
  });

  it('Throw error if pass invalid configuration', async () => {
    const instanceName = 'dummy6';
    expect(() => Test.createTestingModule({
      imports: [TypeDormModule.forRootAsync({
        name: instanceName,
      })],
    }).compile()).toThrow('Invalid configuration. Must provide useFactory, useClass or useExisting');
  });
});