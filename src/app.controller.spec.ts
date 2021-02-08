import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { join } from 'path';
import { Transport, GrpcOptions } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { TestService } from './app.controller';
import * as GRPC from 'grpc';
import * as GRPCJS from '@grpc/grpc-js';

let app: INestApplication;
let client: ClientGrpc;
let testService: TestService;

describe('Game Controller', () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          {
            name: 'TEST_SERVICE',
            transport: Transport.GRPC,
            options: {
              package: 'test',
              protoPath: join(__dirname, './app.proto'),
              loader: {
                enums: String,
              },
            },
          },
        ]),
      ],
      controllers: [TestService],
    }).compile();

    app = moduleRef.createNestApplication();
    app.connectMicroservice({
      transport: Transport.GRPC,
      options: {
        package: 'test',
        protoPath: join(__dirname, './app.proto'),
        loader: {
          enums: String,
        },
      },
    });
    await app.startAllMicroservicesAsync();
    await app.init();

    client = app.get('TEST_SERVICE');
    testService = client.getService('TestService');
  });

  afterAll(() => {
    app.close();
  });

  it('@grpc/grpc-js package meta will fail', async () => {
    const meta = new GRPCJS.Metadata();
    meta.set('clientId', 'dsads');

    try {
      //@ts-ignore
      await testService.test({}, meta).toPromise();
    } catch (e) {
      expect(e.details).toEqual('clientId is required');
      expect(e.code).toEqual(GRPCJS.status.UNAUTHENTICATED);
    }
  });

  it('grpc package meta will succed', async () => {
    const meta = new GRPC.Metadata();
    meta.set('clientId', 'dsads');

    //@ts-ignore
    const tmp = await testService.test({}, meta).toPromise();
    expect(tmp).toEqual({});
  });
});
