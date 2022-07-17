import {ClassSerializerInterceptor, Module} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {APP_INTERCEPTOR} from "@nestjs/core";

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor
  }]
})
export class UsersModule {}
