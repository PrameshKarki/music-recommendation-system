import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Request as Req } from 'express';
import { IFilter } from '../@types/pagination.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MediaType } from '../media/entities/media.entity';
import { MediaService } from '../media/media.service';
import { User } from '../user/entity/user.entity';
import { getPaginationConfig } from '../utils/getPaginationConfig';
import { paginatedResponse } from '../utils/paginatedResponse';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { Music } from './entities/music.entity';
import { MusicService } from './music.service';

@ApiTags("Music")
@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService,
    private readonly mediaService: MediaService
  ) { }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Upload a new music into the system, for this user must have CREATOR role" })
  @Post("/upload")
  async create(@Body() createMusicDto: CreateMusicDto, @Request() req: Req) {
    const user = req.user as User;
    const musicFile = await this.mediaService.findOne(createMusicDto.music, MediaType.MUSIC);
    const thumbnail = await this.mediaService.findOne(createMusicDto.thumbnail, MediaType.THUMBNAIL);
    const music = await this.musicService.create(createMusicDto, musicFile, thumbnail, user);
    return { data: music }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'query', required: false })
  @ApiOperation({ summary: "Get all musics uploaded by the logged in user" })
  @Get("/own")
  async findOwnMusic(@Query() filter: IFilter, @Request() req: Req) {
    const user = req.user as User;
    const paginationConfig = getPaginationConfig(filter);
    const [data, count] = await this.musicService.find(paginationConfig.take, paginationConfig.skip, filter?.query, user);
    return paginatedResponse<Music>(data, count, paginationConfig)
  }

  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'query', required: false })
  @ApiOperation({ summary: "Get all musics in the server" })
  @Get()
  async find(@Query() filter: IFilter) {
    const paginationConfig = getPaginationConfig(filter);
    const [data, count] = await this.musicService.find(paginationConfig.take, paginationConfig.skip, filter?.query);
    return paginatedResponse<Music>(data, count, paginationConfig)
  }

  @Get(':id')
  @ApiOperation({ summary: "Get a music by id" })
  findOne(@Param('id') id: string) {
    const music = this.musicService.findOne(id);
    return { data: music }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMusicDto: UpdateMusicDto) {
    return this.musicService.update(+id, updateMusicDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    let music = await this.musicService.findOne(id);
    music = await this.musicService.remove(music);
    return { data: music }
  }
}
