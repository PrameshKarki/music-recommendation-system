import { BadRequestException, Controller, Get, Param, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Request as Req } from 'express';
import { IFilter } from '../@types/pagination.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { getPaginationConfig } from '../utils/getPaginationConfig';
import { paginatedResponse } from '../utils/paginatedResponse';
import { User } from './entity/user.entity';
import { UserService } from './user.service';



@ApiTags('Users')
@Controller({
    version: '1',
    path: 'users'
})
export class UserController {

    constructor(
        private readonly userService: UserService
    ) {

    }
    @ApiOperation({
        summary: "Get the logged in user's profile",
    })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get("/profile")
    async findOwnProfile(@Request() req: Req) {
        const user = req.user as User;
        return { data: user }
    }


    @ApiOperation({
        summary: "Get a user's profile (ADMIN)",
    })
    @Get(':id')
    async findOne(@Param('id') id: string) {
        const user = await this.userService.findOne(id);
        if (!user)
            throw new BadRequestException("User not found")
        return { data: user }
    }

    @ApiOperation({
        summary: "Get all users (ADMIN)",
    })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'perPage', required: false })
    @Get()
    async find(@Query() filter: IFilter,) {
        const paginationConfig = getPaginationConfig(filter);
        const [data, count] = await this.userService.find(paginationConfig.take, paginationConfig.skip);
        return paginatedResponse<User>(data, count, paginationConfig)
    }

}
