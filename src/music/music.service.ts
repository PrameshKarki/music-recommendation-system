import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, Repository } from 'typeorm';
import { Mood } from '../@types/global.types';
import { Media } from '../media/entities/media.entity';
import { User } from '../user/entity/user.entity';
import { CreateMusicDto } from './dto/create-music.dto';
import { Music } from './entities/music.entity';

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(Music)
    private musicRepository: Repository<Music>,
  ) {

  }

  create(body: CreateMusicDto, musicFile: Media, thumbnail: Media, user: User) {
    return this.musicRepository.create({
      ...body,
      media: [musicFile, thumbnail],
      uploadedBy: user

    }).save();
  }

  async findAllByIds(ids: string[]) {
    return await this.musicRepository.findBy({
      id: In(ids)
    });
  }

  async find(take: number, skip: number, searchQuery?: string, user?: User, type?: Mood) {
    console.log("🚀 ~ file: music.service.ts:35 ~ MusicService ~ find ~ type:", type)
    const query = this.musicRepository.createQueryBuilder("music")
      .leftJoinAndSelect("music.media", "media")
      .take(take)
      .skip(skip)

    if (searchQuery) {
      query.where(new Brackets(qb => {
        qb.where("music.title LIKE :searchQuery")
          .orWhere("music.album LIKE :searchQuery")
          .orWhere("music.genre LIKE :searchQuery", { searchQuery: `%${searchQuery}%` })

      }))
    }
    if (user) {
      query.leftJoinAndSelect("music.uploadedBy", "uploadedBy")
      query.andWhere("uploadedBy.id = :user", { user: user.id })
    }
    query.andWhere("music.isPublished = :isPublished", { isPublished: true })
    if (type)
      query.andWhere("music.type = :type", { type })

    return await query.getManyAndCount()

  }



  async findOne(id: number | string, relations?: string[]) {
    const query = this.musicRepository.createQueryBuilder("music")
      .leftJoinAndSelect("music.media", "media")

    if (relations) {
      relations.forEach(relation => {
        query.leftJoinAndSelect(`music.${relation}`, relation)
      }
      )
    }
    const music = await query.where("music.id = :id", { id })
      .andWhere("music.isPublished = :isPublished", { isPublished: true })
      .getOne();
    if (!music)
      throw new NotFoundException("Music not found");
    return music;

  }

  async toggleLikeStatusOfMusic(music: Music, user: User) {
    const isLiked = music?.likedBy.some(user => user.id === user.id)

    if (!isLiked) {
      music.likedBy.push(user);
      await this.musicRepository.save(music);
      return;
    }
    else {
      music.likedBy = music.likedBy.filter(el => el.id !== user.id);
      await this.musicRepository.save(music);
      return;
    }
  }
  async remove(music: Music) {
    return await this.musicRepository.softRemove(music);
  }

  async findAllLikedByUser(take: number, skip: number, user: User, searchQuery?: string) {
    const query = this.musicRepository.createQueryBuilder("music")
      .leftJoinAndSelect("music.media", "media")
      .leftJoinAndSelect("music.likedBy", "likedBy")
      .where("likedBy.id = :userId", { userId: user.id })
      .take(take)
      .skip(skip);
    if (searchQuery) {
      query.andWhere(new Brackets(qb => {
        qb.where("music.name LIKE :query")
          .orWhere("music.album LIKE :query", { query: `%${searchQuery}%` })
      }))
    }
    return query.getManyAndCount();

  }
}
