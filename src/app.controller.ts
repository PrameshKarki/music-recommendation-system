import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller({
  version: '1',
})
export class AppController {
  constructor() { }

  @ApiOperation({
    summary: 'Ping the server',
  })
  @ApiTags('Ping')
  @ApiResponse({
    status: 200,
    type: Object,

  })
  @Get('/ping')
  ping(): object {
    return {
      message: 'pong',
    };
  }
}
