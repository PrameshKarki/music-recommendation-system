import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GoogleAuthGuard } from './auth/gogle-auth.guard';

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
  @Get('auth/ping')
  @ApiTags('Ping')
  @ApiOperation({ summary: "Ensure authentication workflow is working." })
  @UseGuards(GoogleAuthGuard)
  authPing(): object {
    return {
      message: 'pong',
    };
  }
}
