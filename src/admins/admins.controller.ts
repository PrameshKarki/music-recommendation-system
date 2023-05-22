import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { IFilter } from '../@types/pagination.interface';
import { getPaginationConfig } from '../utils/getPaginationConfig';
import { paginatedResponse } from '../utils/paginatedResponse';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';

@ApiTags("Admins")
@Controller({
  version: "1",
  path: "admins"
})
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) { }


  @ApiOperation({
    summary: "Create a new admin",
  })
  @Post()
  async create(@Body() createAdminDto: CreateAdminDto) {
    let admin = await this.adminsService.findOne(createAdminDto.email)
    if (admin) throw new BadRequestException("Admin already exists")
    admin = await this.adminsService.create(createAdminDto);
    const { password, ...rest } = admin
    return { message: "Admin created successfully", data: rest }

  }

  @ApiOperation({
    summary: "Update a admin's profile (ADMIN)",
  })
  @Patch()
  async update(@Param('id') id: string, @Body() updateAdminDTO: UpdateAdminDto) {
    console.log("🚀 ~ file: admins.controller.ts:38 ~ AdminsController ~ update ~ id:", id)
    let admin = await this.adminsService.findOne(id)
    if (!admin) throw new BadRequestException("Admin not found")
    admin = await this.adminsService.update(admin, updateAdminDTO);
    const { password, ...rest } = admin
    return { message: "Admin updated successfully", data: rest }

  }


  @ApiOperation({
    summary: "Get all admins (ADMIN)",
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @Get()
  async findAll(@Query() filter: IFilter,) {
    const paginationConfig = getPaginationConfig(filter);
    const [data, count] = await this.adminsService.findAll(paginationConfig.take, paginationConfig.skip, filter.query);
    return paginatedResponse<Admin>(data, count, paginationConfig)
  }

  @ApiOperation({
    summary: "Delete a admin's profile (ADMIN)",
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    let admin = await this.adminsService.findOne(id);
    if (!admin)
      throw new BadRequestException("Admin not found")
    admin = await this.adminsService.remove(admin);
    return {
      message: "Admin deleted successfully",
      data: admin
    }
  }


}
