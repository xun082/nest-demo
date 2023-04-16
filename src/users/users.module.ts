import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Logs } from 'src/logs/logs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Logs])],
  controllers: [UserController],
  providers: [UserService],
})
export class UsersModule {}
