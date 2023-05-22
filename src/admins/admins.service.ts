import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';
import { Detail } from './entities/detail.entity';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(Detail)
    private detailRepository: Repository<Detail>,
  ) {

  }

  async create(createAdminDto: CreateAdminDto) {
    const { detail, ...rest } = createAdminDto;
    const adminDetail = await this.detailRepository.create(detail).save();
    return await this.adminRepository.create({
      ...rest,
      detail: adminDetail
    }).save();


  }

  async findAll(take: number, skip: number, searchQuery?: string) {
    const query = this.adminRepository.createQueryBuilder('admin')
      .leftJoinAndSelect('admin.detail', 'detail')
      .take(take)
      .skip(skip)
    if (searchQuery) {
      query.where('admin.email LIKE :email')
        .orWhere('detail.firstName LIKE :firstName')
        .orWhere('detail.lastName LIKE :lastName', { lastName: `%${searchQuery}%` })
    }
    return await query.getManyAndCount();
  }
  async findOne(value: string, fetchPassword: boolean = false) {
    const query = this.adminRepository.createQueryBuilder('admin')
      .leftJoinAndSelect('admin.detail', 'detail')
      .where('admin.id = :id', { id: value })
      .orWhere('admin.email = :email', { email: value })
    if (fetchPassword)
      query.addSelect(['admin.password', 'admin.email', 'admin.roleLevel'])
    return await query.getOne();
  }


  async update(admin: Admin, updateAdminDto: UpdateAdminDto) {
    const { detail, ...rest } = updateAdminDto;
    await this.detailRepository.merge(admin.detail, detail).save();
    return await this.adminRepository.merge(admin, rest).save();
  }


  async remove(admin: Admin) {
    this.detailRepository.softRemove(admin.detail);
    return this.adminRepository.softRemove(admin);
  }
}
