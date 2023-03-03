import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from './entities/meeting.entity';
import { Post } from './entities/Post.entity';
import { Profile } from './entities/Profile.entity';
import { User } from './entities/User.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: "mariadb",
    host: "localhost",
    port: 3306,
    username: "santi",
    password: "password11",
    database: "nestjs_mysql_template",
    entities: [User, Profile, Post, Meeting],
    synchronize: true,
  }), UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
