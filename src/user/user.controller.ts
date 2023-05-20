import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { IPagination } from '../@types/pagination.interface';
import { getPaginationConfig } from '../utils/getPaginationConfig';
import { paginatedResponse } from '../utils/paginatedResponse';
import { User } from './entity/user.entity';
import { UserService } from './user.service';



@ApiTags('Users')
@Controller('users')
export class UserController {

    constructor(
        private readonly userService: UserService
    ) {

    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.userService.findOne(id);
    }

    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'perPage', required: false })
    @Get()
    async find(@Query() pagination: IPagination,) {
        const paginationConfig = getPaginationConfig(pagination);
        const [data, count] = await this.userService.find(paginationConfig.take, paginationConfig.skip);
        return paginatedResponse<User>(data, count, paginationConfig)
    }



}
