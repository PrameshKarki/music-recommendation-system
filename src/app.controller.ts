import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor() { }

  @ApiTags('Ping')
  @Get('/ping')
  ping(): object {
    return {
      message: 'pong',
    };
  }
}
