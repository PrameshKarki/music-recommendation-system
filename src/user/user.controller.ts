import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserRegisterDTO } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService
    ) {

    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.userService.findOne(id);
    }


    @Post('register')
    async register(@Body() body: UserRegisterDTO) {
        // TODO: Refactor this, by implementing a custom validator
        let user = await this.userService.findOne(body.email)
        if (user) throw new BadRequestException("User with same email already exists")
        user = await this.userService.findOne(body.mobileNumber)
        if (user) throw new BadRequestException("User with same mobile number already exists")
        return await this.userService.create(body);

    }


}
