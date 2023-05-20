import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Media } from '../media/entities/media.entity';
import { User } from '../user/entity/user.entity';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
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

  async find(take: number, skip: number, searchQuery?: string, user?: User) {
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

    return await query.getManyAndCount()

  }



  async findOne(id: number | string) {
    const music = await this.musicRepository.createQueryBuilder("music")
      .leftJoinAndSelect("music.media", "media")
      .where("music.id = :id", { id })
      .getOne();
    if (!music)
      throw new NotFoundException("Music not found");
    return music;

  }

  update(id: number, updateMusicDto: UpdateMusicDto) {
    return `This action updates a #${id} music`;
  }

  async remove(music: Music) {
    return await this.musicRepository.softRemove(music);
  }
}
