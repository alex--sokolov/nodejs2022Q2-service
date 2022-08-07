import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      throw new Error('Smth went wrong');
    }
    return data ? request.user[data] : request.user;
  },
);
