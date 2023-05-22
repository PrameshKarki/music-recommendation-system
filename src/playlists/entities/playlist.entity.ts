import { Column, Entity, ManyToMany, ManyToOne, OneToOne } from "typeorm";
import { Base } from "../../common/entity/base.entity";
import { Media } from "../../media/entities/media.entity";
import { Music } from "../../music/entities/music.entity";
import { User } from "../../user/entity/user.entity";

@Entity()
export class Playlist extends Base {
    @Column()
    name: string

    @OneToOne(() => Media, media => media.playlistThumbnail)
    thumbnail: Media

    @Column({
        type: "json",
        nullable: true
    })
    tag?: string[]

    @Column({
        type: "boolean",
        default: false
    })
    isPrivate: boolean

    @ManyToMany(() => Music, (music) => music.playlists)
    musics: Music[]

    @ManyToMany(()=>User,user=>user.likedPlaylists)
    likedBy:User[]

    @ManyToOne(()=>User,user=>user.playlists,{onDelete:"CASCADE"})
    createdBy:User
}
