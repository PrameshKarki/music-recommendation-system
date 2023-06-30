import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRegisterDTO } from '../auth/dto/user-register.dto';
import { Provider, User } from './entity/user.entity';
import { Detail } from './entity/userDetail.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Detail)
        private userDetailsRepository: Repository<Detail>
    ) { }

    async findOne(value: string, fetchPassword: boolean = false, provider?: Provider) {
        const query = this.usersRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.detail', 'detail')
            .where('user.id = :id', { id: value })
            .orWhere('user.email = :email', { email: value })
            .orWhere('user.mobileNumber = :mobileNumber', { mobileNumber: value })
            .andWhere("user.provider=:provider", { provider: provider ?? Provider.WEB })
        if (fetchPassword)
            query.addSelect(['user.password', 'user.email', 'user.mobileNumber'])
        return await query.getOne();
    }

    async find(take: number, skip: number) {
        const query = this.usersRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.detail', 'detail')
            .take(take)
            .skip(skip)
        return await query.getManyAndCount();
    }


    async create(body: UserRegisterDTO, provider?: Provider) {
        const { detail, ...rest } = body
        const userDetail = await this.userDetailsRepository.create(detail).save();
        return await this.usersRepository.create({
            ...rest,
            provider,
            detail: userDetail,
        }).save();

    }

}
