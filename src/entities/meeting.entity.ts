import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User.entity";

@Entity({name: "user_Meetings"})
export class Meeting {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    gMeetUrl: string;

    @ManyToMany( () => User, (user) => user.meetings )
    attendees: User[];
}
