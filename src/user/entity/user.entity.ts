import { AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne } from "typeorm";
import { Base } from "../../common/entity/base.entity";
import { Music } from "../../music/entities/music.entity";
import { Playlist } from "../../playlists/entities/playlist.entity";
import { BcryptService } from '../../utils/bcrypt.service';
import { Detail } from "./userDetail.entity";

export enum Role {
    CONSUMER = "CONSUMER",
    CREATOR = "CREATOR",
}

@Entity()
export class User extends Base {
    @Column({
        unique: true
    })
    email: string

    @Column({
        select: false
    })
    password: string

    @Column({
        unique: true
    })
    mobileNumber: string

    @Column({
        type: "enum",
        enum: Role,
        default: Role.CONSUMER
    })
    role: Role

    @OneToOne(() => Detail, detail => detail.user)
    detail: Detail

    @OneToMany(() => Music, music => music.uploadedBy)
    musics: Music[]

    @OneToMany(() => Music, music => music.playlists)
    playlists: Playlist[]

    @ManyToMany(() => Playlist, playlist => playlist.likedBy)
    @JoinTable()
    likedPlaylists: Playlist[]
    
    @ManyToMany(() => Music, music => music.likedBy)
    @JoinTable()
    likedMusics: Music[]

    private tempPassword!: string;



    @AfterLoad()
    private loadPassword() {
        this.tempPassword = this.password;
    }

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password !== this.tempPassword) {
            this.password = await new BcryptService().hash(this.password);
        }
    }
}