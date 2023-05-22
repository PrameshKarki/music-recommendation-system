import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Base } from "../../common/entity/base.entity";
import { Admin } from "./admin.entity";

export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHERS = "OTHERS"

}

@Entity("admin_details")
export class Detail extends Base {
    @Column()
    firstName: string;

    @Column({ nullable: true })
    middleName?: string

    @Column()
    lastName: string;

    @OneToOne(() => Admin, user => user.detail, { onDelete: "CASCADE" })
    @JoinColumn({
        name: "admin_id",
    })
    admin: Admin
}