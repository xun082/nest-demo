import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Headers,
  UseFilters,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './users.service';
import { Users } from './users.entity';
import { getUserDto } from './dto/get-user.dto';
import { TypeOrmFilter } from 'src/filters/typeOrm.filter';

@Controller('user')
@UseFilters(new TypeOrmFilter())
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

  @Get()
  getUsers(@Query() query: getUserDto): any {
    return this.userService.findAll(query);
  }

  @Post()
  addUser(@Body() dto: any): any {
    const user = dto as Users;

    return this.userService.create(user);
  }

  @Patch('/:id')
  updateUser(
    @Body() dto: any,
    @Param('id') id: number,
    @Headers('Authorization') headers: any,
  ): any {
    if (headers === id) {
      const user = dto as Users;
      return this.userService.update(id, user);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: number): any {
    return this.userService.remove(id);
  }
}
