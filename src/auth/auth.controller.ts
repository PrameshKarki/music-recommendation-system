import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { OTP } from '../user/entity/otp.entity';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { BcryptService } from '../utils/bcrypt.service';
import { AuthService } from './auth.service';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { LoginDTO } from './dto/login.dto';
import { OTPDTO, UserRegisterDTO } from './dto/user-register.dto';
import { GoogleAuthGuard } from './gogle-auth.guard';
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
        user = await this.userService.findOne(body.mobileNumber!)
        if (user) throw new BadRequestException("User already exists")
        user = await this.userService.create(body);
        this.authService.createOTP(user)
        return this.authService.login(user)

    }

    @ApiOperation({
        summary: "Verifies OTP",
    })
    @Post('/user/verify-otp')
    async verifyOTP(@Body() body: OTPDTO) {
        let user = await User.findOne({
            where: {
                email: body.email
            }
        })
        if (!user)
            throw new UnauthorizedException("User not found")
        const otp = await OTP.findOne(
            {
                where: {
                    user: {
                        id: user.id
                    },
                }
            })
        if (!otp)
            throw new UnauthorizedException("OTP do not match")

        if (otp.number !== body.otp) {
            throw new UnauthorizedException("OTP do not match")
        }
        user.isOTPVerified = true;
        user = await user.save()
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
        const isValidOldPassword = await this.bcryptService.compare(body.oldPassword, user.password!)
        if (!isValidOldPassword)
            throw new BadRequestException("Invalid old password")
        user.password = body.newPassword;
        // @ts-ignore
        const { password, tempPassword, ...rest } = await user.save()
        return { message: "Password has changed successfully", data: rest };

    }

    @Get("/google/login")
    @UseGuards(GoogleAuthGuard)
    async googleAuth(@Req() req: Request) { }

    @Get('google/redirect')
    @UseGuards(GoogleAuthGuard)
    googleAuthRedirect(@Req() req: Request) {
        return this.authService.loginWithGoogle(req.user)
    }
}
