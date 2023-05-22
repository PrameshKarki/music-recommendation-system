import { BadRequestException, Body, Controller, InternalServerErrorException, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { BcryptService } from '../utils/bcrypt.service';
import { AuthService } from './auth.service';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { LoginDTO } from './dto/login.dto';
import { UserRegisterDTO } from './dto/user-register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';


@ApiTags('Auth')
@Controller({
    version: "1",
    path: "auth"
})
export class AuthController {
    bcryptService: BcryptService;
    constructor(
        private userService: UserService,
        private authService: AuthService,
    ) {
        this.bcryptService = new BcryptService()

    }

    @ApiOperation({
        summary: "Register a new user",
    })
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

    @ApiOperation({
        summary: "Login a user by email and password",
    })
    @UseGuards(LocalAuthGuard)
    @Post('user/login')
    async login(@Body() body: LoginDTO, @Req() req: Request) {
        return await this.authService.login(req.user as User)
    }

    @UseGuards(LocalAuthGuard)
    @Post('admin/login')
    async adminLoin(@Body() body: LoginDTO, @Req() req: Request) {
        console.log(req.user)
        return { pass: true }
    }

    @ApiOperation({
        summary: "Change the password of logged in user",

    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('change-password')
    async changePassword(@Body() body: ChangePasswordDTO, @Req() req: Request) {
        let user: User | null = req.user as User;
        user = await this.userService.findOne(user.id, true)
        if (!user)
            throw new InternalServerErrorException("Internal sever error")
        const isValidOldPassword = await this.bcryptService.compare(body.oldPassword, user.password)
        if (!isValidOldPassword)
            throw new BadRequestException("Invalid old password")
        user.password = body.newPassword;
        // @ts-ignore
        const { password, tempPassword, ...rest } = await user.save()
        return { message: "Password has changed successfully", data: rest };

    }
}
