import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { name } from '../package.json';
import { Public } from '@src/auth/decorators/public.decorator';

@ApiTags('Health-check')
@Controller()
export class AppController {
  @Get('/health')
  @Public()
  healthCheck(): string {
    return `Service ${name} is up and running`;
  }
}
