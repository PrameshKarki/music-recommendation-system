import { Body, Controller, Post } from '@nestjs/common';
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

    @Post('register')
    async register(@Body() body: UserRegisterDTO) {
        return await this.userService.create(body);

    }


}
