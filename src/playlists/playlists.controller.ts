import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Request as Req } from 'express';
import { IFilter } from '../@types/pagination.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MediaType } from '../media/entities/media.entity';
import { MediaService } from '../media/media.service';
import { MusicService } from '../music/music.service';
import { User } from '../user/entity/user.entity';
import { getPaginationConfig } from '../utils/getPaginationConfig';
import { paginatedResponse } from '../utils/paginatedResponse';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { Playlist } from './entities/playlist.entity';
import { PlaylistsService } from './playlists.service';

@ApiTags("Playlists")
@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService
    , private readonly musicService: MusicService,
    private readonly mediaService: MediaService
  ) { }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("/create")
  async create(@Body() createPlaylistDto: CreatePlaylistDto, @Request() req: Req) {
    const user = req.user as User;
    const thumbnail = await this.mediaService.findOne(createPlaylistDto.thumbnail, MediaType.PROFILE_IMAGE);
    const musics = await this.musicService.findAllByIds(createPlaylistDto.musics);
    return this.playlistsService.create(createPlaylistDto, thumbnail, musics, user);
  }

  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'query', required: false })
  @ApiOperation({ summary: "Get all music playlist in the server" })
  @Get()
  async findAll(@Query() filter: IFilter) {
    const paginationConfig = getPaginationConfig(filter);
    const [data, count] = await this.playlistsService.findAll(paginationConfig.take, paginationConfig.skip, filter?.query);
    return paginatedResponse<Playlist>(data, count, paginationConfig)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'query', required: false })
  @ApiOperation({ summary: "Get all playlists uploaded by the logged in user" })
  @Get("/own")
  async findOwnPlaylists(@Query() filter: IFilter, @Request() req: Req) {
    const user = req.user as User;
    const paginationConfig = getPaginationConfig(filter);
    const [data, count] = await this.playlistsService.findAll(paginationConfig.take, paginationConfig.skip, filter?.query, user);
    return paginatedResponse<Playlist>(data, count, paginationConfig)
  }




  @Get(':id')
  async findOne(@Param('id') id: string) {
    const playlist = await this.playlistsService.findOne(id);
    return { data: playlist }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlaylistDto: UpdatePlaylistDto) {
    return this.playlistsService.update(+id, updatePlaylistDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    let playlist = await this.playlistsService.findOne(id);
    playlist = await this.playlistsService.remove(playlist);
    return { data: playlist }
  }
}
