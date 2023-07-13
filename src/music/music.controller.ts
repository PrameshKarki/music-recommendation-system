import { Body, Controller, Delete, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Request as Req } from 'express';
import { IMusicFilter, Mood } from '../@types/global.types';
import { IFilter } from '../@types/pagination.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MediaType } from '../media/entities/media.entity';
import { MediaService } from '../media/media.service';
import { User } from '../user/entity/user.entity';
import { getPaginationConfig } from '../utils/getPaginationConfig';
import { paginatedResponse } from '../utils/paginatedResponse';
import { CreateMusicDto } from './dto/create-music.dto';
import { ToggleLikeMusicDto } from './dto/toggle-like-music.dto';
import { Music } from './entities/music.entity';
import { MusicService } from './music.service';

@ApiTags("Music")
@Controller({
  version: '1',
  path: 'music'
})
export class MusicController {
  constructor(private readonly musicService: MusicService,
    private readonly mediaService: MediaService
  ) { }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Upload a new music into the system, for this user must have CREATOR role (USER)" })
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
  @ApiOperation({ summary: "Get all musics uploaded by the logged in user (USER)" })
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
  @ApiQuery({ name: 'type', required: false, enum: Mood })
  @ApiOperation({ summary: "Get all musics in the server" })
  @Get()
  async find(@Query() filter: IMusicFilter) {
    const paginationConfig = getPaginationConfig(filter);
    const [data, count] = await this.musicService.find(paginationConfig.take, paginationConfig.skip, filter?.query, undefined, filter?.type);
    return paginatedResponse<Music>(data, count, paginationConfig)
  }

  @ApiOperation({ summary: "Get all musics liked by a user" })
  @Get("/liked")
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'query', required: false })
  @ApiBearerAuth()
  async getLikedMusics(@Query() filter: IFilter, @Request() req: Req) {
    const user = req.user as User;
    const paginationConfig = getPaginationConfig(filter);
    const [musics, total] = await this.musicService.findAllLikedByUser(paginationConfig.take, paginationConfig.skip, user, filter.query);
    return paginatedResponse<Music>(musics, total, paginationConfig);
  }


  @Get(':id')
  @ApiOperation({ summary: "Get a music by id" })
  async findOne(@Param('id') id: string) {
    const music = await this.musicService.findOne(id);
    const musicFile = music.media.find(media => media.type === MediaType.MUSIC);
    const thumbnail = music.media.find(media => media.type === MediaType.THUMBNAIL);
    const { media, ...rest } = music;
    return {
      data: {
        ...rest,
        music: musicFile,
        thumbnail
      }
    }
  }


  @ApiOperation({
    summary: "Delete a music by id (USER)"
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    let music = await this.musicService.findOne(id);
    music = await this.musicService.remove(music);
    return { data: music }
  }

  @ApiOperation({ summary: "Toggle like status of a music by a user (USER)" })
  @Post("/toggle-like")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async toggleLike(@Body() body: ToggleLikeMusicDto, @Request() req: Req) {
    const user = req.user as User;
    const music = await this.musicService.findOne(body.music, ["likedBy"]);
    const isLiked = await this.musicService.toggleLikeStatusOfMusic(music, user);
    if (isLiked) {
      return {
        message: "Music is liked successfully",
        music
      }
    } else {
      return {
        message: "Music is disliked successfully",
        music
      }
    }
  }

}
