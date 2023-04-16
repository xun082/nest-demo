import { Controller, Get, Logger, Post } from '@nestjs/common';
import { UserService } from './users.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly logger: Logger,
  ) {
    this.logger.log('你个叼毛');
  }
  @Get('/profile')
  getProfile(): any {
    return this.userService.findProfile(1);
  }
  @Get('/logs')
  getUsersLogs(): any {
    return this.userService.findUsersLogs(1);
  }
}
