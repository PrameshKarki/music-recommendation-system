import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaModule } from '../media/media.module';
import { Music } from './entities/music.entity';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Music]),
    MediaModule],
  controllers: [MusicController],
  providers: [MusicService]
})
export class MusicModule { }
