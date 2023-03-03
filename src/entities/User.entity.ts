import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Meeting } from "./meeting.entity";
import { Post } from "./Post.entity";
import { Profile } from "./Profile.entity";

@Entity({ name: "users" })
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column( { unique: true } )
    userName: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    email: string;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date; 

    @ManyToOne( () => User, (user) => user.directReports, { onDelete: "SET NULL" } )
    manager: User;

    @OneToMany( () => User, user => user.manager )
    directReports: User[];

    @OneToOne( () => Profile, (profile) => profile.user )
    profile: Profile;
    
    @OneToMany( () => Post, (post) => post.user )
    posts: Post[];

    //auto cascade
    @ManyToMany( () => Meeting, (meeting) => meeting.attendees )    
    @JoinTable()
    meetings: Meeting[];

}
