import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './users.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('/profile')
  getProfile(): any {
    return this.userService.findProfile(1);
  }
  @Get('/logs')
  getUsersLogs(): any {
    return this.userService.findUsersLogs(1);
  }
}
