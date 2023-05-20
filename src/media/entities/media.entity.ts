import { Column, Entity, ManyToOne } from "typeorm";
import { Base } from "../../common/entity/base.entity";
import { Music } from "../../music/entities/music.entity";

export enum MediaType {
    MUSIC = "MUSIC",
    PROFILE_IMAGE = "PROFILE_IMAGE",
    THUMBNAIL = "THUMBNAIL"
}

@Entity()
export class Media extends Base {
    @Column()
    name: string

    @Column({
        enum: MediaType,
        type: 'enum'
    })
    type: MediaType

    @Column()
    mimeType: string

    @ManyToOne(() => Music, (music) => music.media, { onDelete: "CASCADE" })
    music: Music

    public path: string

}
