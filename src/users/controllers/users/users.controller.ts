import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Res } from '@nestjs/common';
import { User } from 'src/entities/User.entity';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { CreateUserPostDto } from 'src/users/dtos/createUserPost.dto';
import { CreateUserProfileDto } from 'src/users/dtos/CreateUserProfile.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    /* @Get("seed")
    async getseed(): Promise<any> {
      await this.usersService.seed()
      return this.usersService.getuserbyid(14)
    }

    @Get("todo")
    gettodo(){
      return this.usersService.getuserbyid(14)
    } */


    @Get()
    findAllUsers( ): Promise<User[]> {
    return this.usersService.findAllUsers();
    /* return users */
   // if (!users) throw new NotFoundException("La base de datos para users no se encuentra"); 
   // return res.status(HttpStatus.OK).json({ msg: "Users:", users });
    }

    @Get(":id")
    findUserByID( @Param("id", ParseIntPipe) id: number,  @Res() res ) {
      return this.usersService.findUserById(id);
    } 

  @Post()
  /* @UsePipes(new ValidationPipe({ whitelist: true })) */
  createUser( @Body() createUserDto: CreateUserDto ): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  //MOVE ESTO A OTRO MODULO 
  @Post("profiles/:id")
  createProfile( 
    @Body() createUserProfileDto: CreateUserProfileDto, 
    @Param("id", ParseIntPipe) id: number
    ) {
    return this.usersService.createUserProfile( id, createUserProfileDto );
  }

  @Post("posts/:id")
  createUserPost( 
    @Body() createUserPostDto: CreateUserPostDto, 
    @Param("id", ParseIntPipe) id: number
    ) {
    return this.usersService.createUserPost( id, createUserPostDto );
  }
  
  /* @Patch(":id")
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateUser( 
    @Param("id", ParseIntPipe) id: number, 
    @Body() updateUserDto: UpdateUserDto,  
    @Res() res ): User[] {
    const editedUser = this.usersService.updateUser(id, updateUserDto);   
    return res.status(HttpStatus.OK).json({ msg: "User editado con éxito:", editedUser });    
  } */

  @Patch(":id")
 // @UsePipes(new ValidationPipe({ whitelist: true }))
  async replaceUser( 
    @Param("id", ParseIntPipe) id: number, 
    @Body() updateUserDto: UpdateUserDto,  
   /* @Res() res*/ ) {
    await this.usersService.replaceUser(id, updateUserDto);
  }

  @Delete(":id")
  async removeUser( @Param("id", ParseIntPipe) id: number, /* @Res() res */ ) {
    await this.usersService.removeUser(id);
   // if (!deletedUser || deletedUser.length == 0) throw new NotFoundException("Este user no existe");      
   // return res.status(HttpStatus.OK).json({ msg: "El Usuario ya no se encuentra en la base de datos", deletedUser });
  } 

}
