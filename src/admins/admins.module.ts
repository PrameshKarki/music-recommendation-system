
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { Admin } from './entities/admin.entity';
import { Detail } from './entities/detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, Detail])],
  controllers: [AdminsController],
  providers: [AdminsService],
  exports: [AdminsService]
})
export class AdminsModule { }
