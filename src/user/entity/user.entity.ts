import { AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne } from "typeorm";
import { Base } from "../../common/entity/base.entity";
import { Music } from "../../music/entities/music.entity";
import { Playlist } from "../../playlists/entities/playlist.entity";
import { BcryptService } from '../../utils/bcrypt.service';
import { OTP } from "./otp.entity";
import { Detail } from "./userDetail.entity";

export enum Role {
    CONSUMER = "CONSUMER",
    CREATOR = "CREATOR",
}

export enum Provider {
    GOOGLE = "GOOGLE",
    WEB = "WEB"
}

@Entity()
export class User extends Base {
    @Column({
    })
    email: string

    @Column({
        select: false,
        nullable: true
    })
    password?: string

    @Column({
        unique: true,
        nullable: true
    })
    mobileNumber?: string

    @Column({
        type: "enum",
        enum: Role,
        default: Role.CONSUMER
    })
    role: Role

    @Column({
        type: "enum",
        enum: Provider,
        default: Provider.WEB
    })
    provider: Provider

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
    likedMusics: Music[]

    @OneToOne(() => OTP, otp => otp.user, { nullable: true })
    otp?: OTP

    private tempPassword!: string;

    @AfterLoad()
    private loadPassword() {
        if (this.password)
            this.tempPassword = this.password;
    }
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password && this.password !== this.tempPassword) {
            this.password = await new BcryptService().hash(this.password);
        }
    }
}