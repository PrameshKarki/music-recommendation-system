import { BadRequestException, Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { UserRegisterDTO } from './dto/user-register.dto';
import { LocalAuthGuard } from './local-auth.guard';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private userService: UserService,
        private authService: AuthService
    ) {

    }

    @Post('/user/register')
    async register(@Body() body: UserRegisterDTO) {
        // TODO: Refactor this, by implementing a custom validator
        let user = await this.userService.findOne(body.email)
        if (user) throw new BadRequestException("User already exists")
        user = await this.userService.findOne(body.mobileNumber)
        if (user) throw new BadRequestException("User already exists")
        user = await this.userService.create(body);
        return this.authService.login(user)

    }

    @UseGuards(LocalAuthGuard)
    @Post('user/login')
    async login(@Body() body: LoginDTO, @Req() req: Request) {
        return await this.authService.login(req.user as User)
    }
}
