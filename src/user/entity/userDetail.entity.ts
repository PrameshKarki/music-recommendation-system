import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Base } from "../../common/entity/base.entity";
import { User } from "./user.entity";

export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHERS = "OTHERS"

}

@Entity()
export class Detail extends Base {
    @Column()
    firstName: string;

    @Column({ nullable: true })
    middleName?: string

    @Column()
    lastName: string;

    @Column({
        nullable: true,
    })
    dateOfBirth?: Date;

    @Column({
        nullable: true
    })
    gender?: Gender

    @OneToOne(() => User, user => user.detail, { onDelete: "CASCADE" })
    @JoinColumn({
        name: "user_id",
    })
    user: User
}