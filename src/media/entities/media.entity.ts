import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Base } from '../../common/entity/base.entity';
import { Music } from '../../music/entities/music.entity';
import { Playlist } from '../../playlists/entities/playlist.entity';

export enum MediaType {
  MUSIC = 'MUSIC',
  PROFILE_IMAGE = 'PROFILE_IMAGE',
  THUMBNAIL = 'THUMBNAIL',
}

@Entity()
export class Media extends Base {
  @Column()
  name: string;

  @Column({
    enum: MediaType,
    type: 'enum',
  })
  type: MediaType;

  @Column()
  mimeType: string;

  @ManyToOne(() => Music, (music) => music.media, { onDelete: 'CASCADE' })
  music: Music;

  @OneToOne(() => Playlist, (playlist) => playlist.thumbnail)
  @JoinColumn({ name: 'playlist_id' })
  playlistThumbnail: Playlist;

  public path: string;

  @AfterLoad()
  loadMediaPath() {
    this.path = `${process.env.BASE_URL}/${this.name}`;
  }
}
