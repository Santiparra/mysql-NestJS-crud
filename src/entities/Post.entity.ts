import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User.entity";

@Entity({ name: "user_posts" })
export class Post {
   
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tittle: string;

    @Column()
    details: string;

    @Column()
    userId: number;
                    //con set null se puede volver a reasignar a otro user
    @ManyToOne( () => User, user => user.posts, { onDelete: "SET NULL" } )
    user: User;

}