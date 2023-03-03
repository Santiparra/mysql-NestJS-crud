import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from 'src/entities/meeting.entity';
import { Post } from 'src/entities/Post.entity';
import { Profile } from 'src/entities/Profile.entity';
import { User } from 'src/entities/User.entity';
import { UsersController } from './controllers/users/users.controller';
import { UsersService } from './services/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, Post, Meeting])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
