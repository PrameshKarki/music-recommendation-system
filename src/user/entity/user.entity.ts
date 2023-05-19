import { AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity, OneToOne } from "typeorm";
import { Base } from "../../common/base.entity";
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