import { Column, Entity, OneToOne } from "typeorm";
import { Base } from "../../common/base.entity";
import { Detail } from "./userDetail.entity";

export enum Role {
    CONSUMER = "CONSUMER",
    CREATOR = "CREATOR",
}

@Entity()
export class User extends Base {
    @Column()
    email: string

    @Column()
    password: string

    @Column()
    mobileNumber: string

    @Column({
        type: "enum",
        enum: Role,
        default: Role.CONSUMER
    })
    role: Role

    @OneToOne(() => Detail, detail => detail.user)
    detail: Detail
}