import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDto, TestDto, PublicDto } from './dto/login-user.dto';
import { Serialize } from 'src/decorators/serialize.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authServices: AuthService) {}
  @Post('/login')
  async login(@Body() dto: SignInUserDto) {
    const { username, password } = dto;
    const token = await this.authServices.login(username, password);
    return {
      access_token: token,
    };
  }

  @Get('githubLogin')
  async githubLogin() {
    return `https://gitee.com/oauth/authorize?client_id=06c49c3f3b4cebc369d4b487d8de070b272884ec131f2c3497b1fef83e7d6510&redirect_uri=http%3A%2F%2Flocalhost%3A3001&response_type=code`;
  }

  @Get('userinfo')
  async githubUserInfo(@Query() query: { token: string }) {
    return await this.authServices.getGitUserInfo(query.token);
  }

  @Get('/github/:code')
  async github(@Param('code') code: string) {
    return await this.authServices.github(code);
  }

  @Post('/registry')
  registry(@Body() dto: SignInUserDto) {
    const { username, password } = dto;
    return this.authServices.registry(username, password);
  }

  @Post('/test')
  @Serialize(TestDto)
  test(@Body() dto: TestDto) {
    return dto;
  }
}
