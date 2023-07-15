import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Media } from '../media/entities/media.entity';
import { Music } from '../music/entities/music.entity';
import { User } from '../user/entity/user.entity';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { Playlist } from './entities/playlist.entity';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
  ) { }

  async create(
    createPlaylistDto: CreatePlaylistDto,
    thumbnail: Media,
    musics: Music[],
    user: User,
  ) {
    return await this.playlistRepository
      .create({
        ...createPlaylistDto,
        thumbnail,
        musics,
        createdBy: user,
      })
      .save();
  }
  async update(
    playlist: Playlist,
    createPlaylistDto: CreatePlaylistDto,
    thumbnail: Media,
    musics: Music[],
  ) {
    return await this.playlistRepository
      .merge(playlist, {
        ...createPlaylistDto,
        thumbnail,
        musics,
      })
      .save();
  }

  findAll(take: number, skip: number, searchQuery?: string, user?: User) {
    const query = this.playlistRepository
      .createQueryBuilder('playlist')
      .leftJoinAndSelect('playlist.musics', 'musics')
      .leftJoinAndSelect('musics.media', 'media')
      .leftJoinAndSelect('playlist.thumbnail', 'thumbnail')
      .leftJoinAndSelect('playlist.createdBy', 'createdBy')
      .take(take)
      .skip(skip);
    if (searchQuery) {
      query.where(
        new Brackets((qb) => {
          qb.where('playlist.name LIKE :query').orWhere(
            'playlist.description LIKE :query',
            { query: `%${searchQuery}%` },
          );
        }),
      );
    }
    if (!user)
      query.andWhere('playlist.isPrivate = :isPrivate', { isPrivate: false });
    else query.andWhere('createdBy.id = :userId', { userId: user.id });

    return query.getManyAndCount();
  }
  async findOne(id: number | string, relations?: string[], user?: User) {
    const query = this.playlistRepository.createQueryBuilder("playlist")
      .leftJoinAndSelect("playlist.musics", "musics")
      .leftJoinAndSelect("playlist.thumbnail", "thumbnail")
      .leftJoinAndSelect("playlist.createdBy", "createdBy")

    if (relations) {
      relations.forEach((relation) => {
        query.leftJoinAndSelect(`playlist.${relation}`, relation);
      });
    }
    const playlist = await query.where("playlist.id = :id", { id })
      .andWhere("createdBy.id = :creatorID", { creatorID: user?.id })
      .getOne();


    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    return playlist;
  }



  remove(playlist: Playlist) {
    return this.playlistRepository.softRemove(playlist);
  }

  async toggleLikeStatusOfPlaylist(playlist: Playlist, user: User) {
    const isLiked = playlist?.likedBy.some((user) => user.id === user.id);

    if (!isLiked) {
      playlist.likedBy.push(user);
      await this.playlistRepository.save(playlist);
      return;
    } else {
      playlist.likedBy = playlist.likedBy.filter((el) => el.id !== user.id);
      await this.playlistRepository.save(playlist);
      return;
    }
  }

  async findAllLikedByUser(
    take: number,
    skip: number,
    user: User,
    searchQuery?: string,
  ) {
    const query = this.playlistRepository
      .createQueryBuilder('playlist')
      .leftJoinAndSelect('playlist.musics', 'musics')
      .leftJoinAndSelect('musics.media', 'media')
      .leftJoinAndSelect('playlist.thumbnail', 'thumbnail')
      .leftJoinAndSelect('playlist.likedBy', 'likedBy')
      .where('likedBy.id = :userId', { userId: user.id })
      .take(take)
      .skip(skip);
    if (searchQuery) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('playlist.name LIKE :query').orWhere(
            'playlist.description LIKE :query',
            { query: `%${searchQuery}%` },
          );
        }),
      );
    }
    return query.getManyAndCount();
  }
}
