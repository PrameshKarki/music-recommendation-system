import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media, MediaType } from './entities/media.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>

  ) {

  }

  async findOne(id: string, type?: MediaType) {
    const media = await this.mediaRepository.findOne({
      where: {
        id,
        type,
      }
    });
    if (!media)
      throw new NotFoundException("Media not found");
    return media;
  }

  create(name: string, mimeType: string, type: MediaType) {
    return this.mediaRepository.create({
      name,
      mimeType,
      type
    }).save();
  }

  async softRemove(media: Media) {
    await this.mediaRepository.softRemove(media);
  }
}
