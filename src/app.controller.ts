import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor() { }

  @ApiTags('Ping')
  @ApiResponse({
    status: 200,
    type: Object,

  })
  @Get('/ping')
  ping(): object {
    console.log(process.env);
    return {
      message: 'pong',
    };
  }
}
