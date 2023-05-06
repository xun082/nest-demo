import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Logs } from '../logs/logs.entity';
import { Roles } from '../roles/roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Logs, Roles])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
