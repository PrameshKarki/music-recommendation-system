import { AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity, OneToOne } from "typeorm";
import { Base } from "../../common/entity/base.entity";
import { BcryptService } from '../../utils/bcrypt.service';
import { Detail } from "./detail.entity";

export enum RoleLevel {
    ONE = 1,
    TWO = 2,
}

@Entity()
export class Admin extends Base {
    @Column({
        unique: true
    })
    email: string

    @Column({
        select: false
    })
    password: string

    @Column({
        type: "enum",
        enum: RoleLevel,
    })
    roleLevel: RoleLevel

    @OneToOne(() => Detail, detail => detail.admin)
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