import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './users.service';
import { ConfigService } from '@nestjs/config';
// import { ConfigEnum } from 'src/enum/config.enum';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  @Get()
  getUsers(): any {
    const db = this.configService.get('db');
    console.log(db);

    return this.userService.getUsers();
  }

  @Post()
  addUser(): any {
    return this.userService.addUser();
  }
}
