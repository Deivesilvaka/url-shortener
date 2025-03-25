import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    data;
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
