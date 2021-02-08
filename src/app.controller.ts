import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices';
import { IUserDecorator, User } from './common/decorator/user';

@Controller()
export class TestService {
  @GrpcMethod('TestService', 'Test')
  async test(@User() user: IUserDecorator) {
    return {};
  }
}
