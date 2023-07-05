import { Body, Controller, Delete, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Request as Req } from 'express';
import { IFilter } from '../@types/pagination.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MediaType } from '../media/entities/media.entity';
import { MediaService } from '../media/media.service';
import { MusicService } from '../music/music.service';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { getPaginationConfig } from '../utils/getPaginationConfig';
import { paginatedResponse } from '../utils/paginatedResponse';
import { AddMusicInAPlaylistDTO } from './dto/add-music.dto';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { ToggleLikePlaylistDto } from './dto/toggle-like-playlist.dto';
import { Playlist } from './entities/playlist.entity';
import { PlaylistsService } from './playlists.service';

@ApiTags("Playlists")
@Controller({
  version: '1',
  path: 'playlists'
})
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService
    , private readonly musicService: MusicService,
    private readonly mediaService: MediaService,
    private readonly userService: UserService
  ) { }

  @ApiOperation({
    summary: "Create a new playlist (USER)",
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("/create")
  async create(@Body() createPlaylistDto: CreatePlaylistDto, @Request() req: Req) {
    const user = req.user as User;
    const thumbnail = await this.mediaService.findOne(createPlaylistDto.thumbnail, MediaType.THUMBNAIL);
    const musics = await this.musicService.findAllByIds(createPlaylistDto.musics);
    return this.playlistsService.create(createPlaylistDto, thumbnail, musics, user);
  }
  @ApiOperation({
    summary: "Add a new music in a playlist. If it already exist in a playlist it simply removes (USER)",
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("/add-music")
  async addMusic(@Body() addMusicInAPlaylistDTO: AddMusicInAPlaylistDTO, @Request() req: Req) {
    const user = req.user as User;
    const playlist = await this.playlistsService.findOne(addMusicInAPlaylistDTO.playlist);
    const music = await this.musicService.findOne(addMusicInAPlaylistDTO.music);
    if (playlist.musics.includes(music)) {
      // * Simply remove from playlist
      playlist.musics = playlist.musics.filter(el => el.id !== music.id)
      await playlist.save()
      return "Successfully removed from a playlist."
    } else {
      playlist.musics = [...playlist.musics, music]
      await playlist.save()
      return "Successfully added in a playlist."
    }
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

  @ApiOperation({ summary: "Get all playlists liked by a user" })
  @Get("/liked")
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'query', required: false })
  @ApiBearerAuth()
  async getLikedPlaylists(@Query() filter: IFilter, @Request() req: Req) {
    const user = req.user as User;
    const paginationConfig = getPaginationConfig(filter);
    const [playlists, total] = await this.playlistsService.findAllLikedByUser(paginationConfig.take, paginationConfig.skip, user, filter.query);
    return paginatedResponse<Playlist>(playlists, total, paginationConfig);
  }

  @ApiOperation({ summary: "Get a playlist by id" })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const playlist = await this.playlistsService.findOne(id);
    return { data: playlist }
  }

  @Delete(':id')
  @ApiOperation({ summary: "Remove a playlist by id" })
  async remove(@Param('id') id: string) {
    let playlist = await this.playlistsService.findOne(id);
    playlist = await this.playlistsService.remove(playlist);
    return { data: playlist }
  }

  @ApiOperation({ summary: "Toggle like status of a playlist by a user" })
  @Post("/toggle-like")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async toggleLike(@Body() body: ToggleLikePlaylistDto, @Request() req: Req) {
    const user = req.user as User;
    const playlist = await this.playlistsService.findOne(body.playlist, ["likedBy"]);
    await this.playlistsService.toggleLikeStatusOfPlaylist(playlist, user);
    return {
      message: "Like status toggled successfully",
      playlist
    }
  }



}
