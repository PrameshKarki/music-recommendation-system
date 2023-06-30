import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJWTPayload } from '../@types/jwt.interface';
import { AdminsService } from '../admins/admins.service';
import { Admin } from '../admins/entities/admin.entity';
import { Provider, User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { BcryptService } from '../utils/bcrypt.service';

@Injectable()
export class AuthService {
    bcryptService: BcryptService

    constructor(private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly adminService: AdminsService
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
            },
            tokens: {
                accessToken: this.jwtService.sign(payload),
            }
        };
    }
}