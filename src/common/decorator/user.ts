import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Metadata, status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';

export interface IUserDecorator {
  clientId: string;
}

export const User = createParamDecorator(
  (data, context: ExecutionContext): IUserDecorator => {
    console.log(JSON.stringify(context, null, 4));

    const metadata = context.switchToRpc().getContext() as Metadata;
    const { clientid } = metadata.getMap();

    if (!clientid) {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: 'clientId is required',
      });
    }

    return {
      clientId: clientid.toString(),
    };
  },
);
