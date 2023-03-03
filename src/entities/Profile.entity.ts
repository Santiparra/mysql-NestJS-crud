import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User.entity";

@Entity({ name: "user_Profiles" })
export class Profile {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

    @Column()
    birthDate: string;

    @OneToOne( () => User, user => user.profile, { onDelete: "CASCADE" } )
    @JoinColumn()
    user: User;

}