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

    async findOne(value: string) {
        return await this.usersRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.detail', 'detail')
            .where('user.id = :id', { id: value })
            .orWhere('user.email = :email', { email: value })
            .orWhere('user.mobileNumber = :mobileNumber', { mobileNumber: value })
            .getOne();
    }


    async create(body: UserRegisterDTO) {
        const { detail, ...rest } = body
        const userDetail = await this.userDetailsRepository.create(detail).save();
        return await this.usersRepository.create({
            ...rest,
            detail: userDetail
        }).save();

    }

}
