import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { name } from '../package.json';

@ApiTags('Health-check')
@Controller()
export class AppController {
  @Get('/health')
  healthCheck(): string {
    return `Service ${name} is up and running`;
  }
}
