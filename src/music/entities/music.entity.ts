import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { Mood } from "../../@types/global.types";
import { Base } from "../../common/entity/base.entity";
import { Media } from "../../media/entities/media.entity";
import { Playlist } from "../../playlists/entities/playlist.entity";
import { User } from "../../user/entity/user.entity";

@Entity()
export class Music extends Base {
    @Column()
    title: string;

    @Column()
    album: string;

    @Column()
    duration: number;

    @Column({
        type: "json"
    })
    singer: string[];

    @Column({
        type: "enum",
        enum: Mood
    })
    type: Mood

    @Column({
        type: "json"
    })
    writer: string[]

    @Column({
        type: "json"
    })
    composer: string[];

    @Column()
    genre: string;

    @Column({
        type: "json"
    })
    keywords: string[];

    @Column()
    releaseDate: Date;

    @Column({
        type: "boolean",
        default: true
    })
    isPublished: boolean

    @Column({
        type: "text",
        nullable: true
    })
    lyrics?: string

    @OneToMany(() => Media, (media) => media.music)
    media: Media[]

    @ManyToOne(() => User, user => user.musics)
    uploadedBy: User

    @ManyToMany(() => Playlist, playlist => playlist.musics)
    @JoinTable()
    playlists: Playlist[]

    @ManyToMany(() => User, user => user.likedPlaylists)
    likedBy: User[]

}
