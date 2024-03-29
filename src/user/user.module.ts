import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Detail } from './entity/userDetail.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Detail])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {

}
