import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IJWTPayload } from '../@types/jwt.interface';
import { AdminsService } from '../admins/admins.service';
import { Admin } from '../admins/entities/admin.entity';
import EmailService from '../common/services/email.service';
import { OTP } from '../user/entity/otp.entity';
import { Provider, User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { BcryptService } from '../utils/bcrypt.service';

@Injectable()
export class AuthService {
    bcryptService: BcryptService

    constructor(
        @InjectRepository(OTP)
        private otpRepository: Repository<OTP>,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly adminService: AdminsService,
        private readonly mailerService: MailerService,
        private readonly emailService: EmailService
    ) {
        this.bcryptService = new BcryptService()
    }

    async validateUser(username: string, password: string) {
        let user: User | Admin | null = await this.userService.findOne(username, true);
        if (!user) {
            // TODO: Refactor this logic
            user = await this.adminService.findOne(username, true);
            if (!user)
                return null;
        }
        const isValidPassword = await this.bcryptService.compare(password, user.password!)
        if (isValidPassword) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async createOTP(user: User) {
        // * Generate random number of 5 digits
        const number = Math.floor(10000 + Math.random() * 90000);
        // * Save the number in the database
        const email = await this.mailerService.sendMail({
            to: user.email,
            subject: 'OTP for login',
            html: await this.emailService.getOTPTemplate(number),
        })
        await this.otpRepository.create({
            user,
            number
        }).save()
    }

    async loginWithGoogle(user: any) {
        await this.userService.create({
            email: user.email,
            detail: {
                firstName: user.firstName,
                lastName: user.lastName
            }
        }, Provider.GOOGLE)
        return {
            data: {
                email: user.email,
            },
            tokens: {
                accessToken: user.accessToken,
            }
        }
    }

    async login(user: User) {
        const payload: IJWTPayload = { id: user.id, role: user.role };
        return {
            data: {
                email: user.email,
                isOTPVerified: user.isOTPVerified,
            },
            tokens: {
                accessToken: user.isOTPVerified ? this.jwtService.sign(payload) : null,
            }
        };
    }
}