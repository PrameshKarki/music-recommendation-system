import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaModule } from '../media/media.module';
import { MusicModule } from '../music/music.module';
import { Playlist } from './entities/playlist.entity';
import { PlaylistsController } from './playlists.controller';
import { PlaylistsService } from './playlists.service';

@Module({
  controllers: [PlaylistsController],
  providers: [PlaylistsService],
  imports: [MediaModule, MusicModule, TypeOrmModule.forFeature([Playlist])]
})
export class PlaylistsModule { }
