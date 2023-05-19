import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRegisterDTO } from './dto/user.dto';
import { User } from './entity/user.entity';
import { Detail } from './entity/userDetail.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Detail)
        private userDetailsRepository: Repository<Detail>
    ) { }

    async create(body: UserRegisterDTO) {
        const { detail, ...rest } = body
        const userDetail = await this.userDetailsRepository.create(detail).save();
        return await this.usersRepository.create({
            ...rest,
            detail: userDetail
        }).save();

    }

}
