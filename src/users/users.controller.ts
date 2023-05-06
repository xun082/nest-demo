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
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './users.service';
import { Users } from './users.entity';
import { getUserDto } from './dto/get-user.dto';
import { TypeOrmFilter } from 'src/filters/typeOrm.filter';
import { CreateUserPipe } from './pipes/create-user.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/guards/admin.guard';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('user')
@UseFilters(new TypeOrmFilter())
@UseInterceptors(ClassSerializerInterceptor)
// @UseGuards(JwtGuard)
export class UserController {
  constructor(
    private userService: UserService,
    private readonly logger: Logger,
  ) {}

  @Get('/profile/:id')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Param('id') id: number): any {
    return this.userService.findProfile(id);
  }

  @Get('/index')
  index() {
    return 1;
  }

  @Get('/logs')
  getUsersLogs(): any {
    return this.userService.findUsersLogs(1);
  }

  @Get()
  @UseGuards(AdminGuard)
  getUsers(@Query() query: getUserDto): any {
    return this.userService.findAll(query);
  }

  @Post()
  addUser(@Body(CreateUserPipe) dto: CreateUserDto): any {
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
