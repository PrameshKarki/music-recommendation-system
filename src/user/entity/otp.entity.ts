import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Base } from "../../common/entity/base.entity";
import { User } from "./user.entity";

@Entity()
export class OTP extends Base {
    @Column()
    number: number

    @OneToOne(() => User, user => user.otp, { nullable: true, onDelete: "CASCADE" })
    @JoinColumn()
    user: User
}