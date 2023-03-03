import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meeting } from 'src/entities/meeting.entity';
import { Post } from 'src/entities/Post.entity';
import { Profile } from 'src/entities/Profile.entity';
import { User } from 'src/entities/User.entity';
import { CreateUserPost } from 'src/types/post';
import { CreateUserProfile } from 'src/types/profile';
import { CreateUser, UpdateUser } from 'src/types/user';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

    constructor( 
        @InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(Profile) private usersProfileRepository: Repository<Profile>, 
        @InjectRepository(Post) private usersPostRepository: Repository<Post>,
        @InjectRepository(Meeting) private usersMetingRepository: Repository<Meeting>,
        ) {}

    async createUserPost(id: number, createUserPost: CreateUserPost) {
        //crea este metodo aparte pa no repetir, seria encontrar x id
        const user = await this.usersRepository.findOneBy({ id });
        if (!user) throw new HttpException(
            "El user no existe", 
            HttpStatus.BAD_REQUEST);
        const newPost = this.usersPostRepository.create({ ...createUserPost, user });
        return this.usersPostRepository.save(newPost);

    }

    //movesto
    async createUserProfile(id: number, createUserProfile: CreateUserProfile) {
        //idem arriba
        const user = await this.usersRepository.findOneBy({ id });
        if (!user) throw new HttpException(
            "El user no existe", 
            HttpStatus.NOT_FOUND);
        const newProfile = this.usersProfileRepository.create(createUserProfile)
        const savedProfile = await this.usersProfileRepository.save( newProfile )
        user.profile = savedProfile;
        return this.usersRepository.save(user)
    }
   
    async removeUser(id: number) {
        const userExist =  await this.usersRepository.delete({ id });
        if (userExist.affected === 0) throw new HttpException("El user con esta id no existe", HttpStatus.NOT_FOUND)
        return userExist
    }
    
    async replaceUser(id: number, updateUser: UpdateUser) {
        const userExist = await this.usersRepository.findOne({
            where: {
                id
            }
        });  
        if (!userExist) throw new HttpException("No existe ningún usuario con esta id", HttpStatus.NOT_FOUND);
        const finalObject = Object.assign(userExist, updateUser);
        return this.usersRepository.save(finalObject)
    }

    async createUser(createUser: CreateUser) {
        const userExist = await this.usersRepository.findOne({
            where: {
                userName: createUser.userName
            }
        });
        if (userExist) throw new HttpException("Ya existe un user con este nombre", HttpStatus.BAD_REQUEST);
        const newUser = this.usersRepository.create({
            ...createUser, createdAt: new Date() 
        });
        return this.usersRepository.save(newUser);
    }

    async findUserById(id: number) {
        const userExist = await this.usersRepository.findOne({
            where: {
                id: id
            }
        });
        if(!userExist) throw new HttpException("No existe ningún usuario con esta id", HttpStatus.NOT_FOUND);
        return userExist;
    }
    
    findAllUsers() {
       return this.usersRepository.find(/* {relations: ["profile"]} */);
    }



//EJEMPLOS DE IMPLEMENTACION
    async seed () {

        //generar el user ceo
        const ceo = this.usersRepository.create({ userName: "loco", password: "password", /* createdAt: new Date() */ });
        await this.usersRepository.save(ceo);


        //le damos un perfil
        const ceoProfile = this.usersProfileRepository.create({
            firstName: "sebastian",   
            lastName: "abreu",
            age: 33,    
            birthDate: "22-02-1978",
        });
        ceoProfile.user = ceo;
        await this.usersProfileRepository.save(ceoProfile);

        // creamos el user 2 que es el manager
        const manager = this.usersRepository.create({
            userName: "Wachington", 
            password: "password",
            //esto se puede hacer como arriba, entidad.manager
            manager: ceo,
        });

        //le damos al manager 2 posts(tareas)
        const post1 = this.usersPostRepository.create({
            tittle: "coso",
            details: "pum"
        })
        await this.usersPostRepository.save(post1)

        const post2 = this.usersPostRepository.create({
            tittle: "pin",
            details: "patapam"
        })
        await this.usersPostRepository.save(post2)

        manager.posts = [post1, post2]

        //creamos 1 reunion, como es bidireccional primero 
        //solo va el ceo pero despues se une el manager
        const meeting1 = this.usersMetingRepository.create({
            gMeetUrl: "estareunion.com"
        })

        meeting1.attendees = [ceo]
        await this.usersMetingRepository.save(meeting1)

        manager.meetings = [meeting1]

        await this.usersRepository.save(manager)
    }

    getuserbyid (id: number ) {
        /* return this.usersRepository.findOne({
            where: {id,},
            relations: ["manager", "directReports", "posts", "profile", "meetings"] }) */
            return this.usersRepository.createQueryBuilder("user")
            .leftJoinAndSelect("user.directReports", "directReports")
            .leftJoinAndSelect("user.meetings", "meetings")
            .leftJoinAndSelect("user.posts", "posts")
            .leftJoinAndSelect("user.profile", "profile")
            .where("user.id = :userId", {userId: id})
            .getOne()
        }
 

}
