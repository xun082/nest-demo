import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from 'src/enum/config.enum';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  public apiServer =
    'https://gitee.com/oauth/token?grant_type=authorization_code';
  private accessTokenInfo: any;
  constructor(
    private userService: UserService,
    private jwt: JwtService,
    public configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}
  async login(username: string, password: string) {
    const user = await this.userService.find(username);
 
    if (!user) throw new ForbiddenException('用户不存在,请注册');
    // 用户密码进行比对
    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) throw new ForbiddenException('用户名或者密码错误');

    // 生成token
    const accessToken = await this.jwt.signAsync(
      {
        username: username,
        sub: user.id,
      },
      {
        expiresIn: '1d',
      },
    );

    return accessToken;
  }

  registry(username?: string, password?: string) {
    return '注册';
  }

  async github(code: string) {
    if (!code) throw new BadRequestException('请输入code授权码');
    // 获取token
    await this.getAccessToken(code);

    const res = await lastValueFrom(
      this.httpService.get(
        'https://gitee.com/api/v5/user?access_token=' +
          this.accessTokenInfo.accessToken,
      ),
    );
    const { data } = res;

    // // 查找用户是否存在
    const user = await this.getUserByAccessToken(data.name);
    // 如果用户不存在
    if (!user) {
      const registryInfo: any = {
        username: data.name,
        password: '123456',
        profile: {
          address: '广东',
          gender: 1,
          photo: data.avatar_url,
          roles: [
            {
              userId: data.id,
              rolesId: 3,
            },
          ],
        },
      };

      this.userService.create(registryInfo);
    }

    return this.accessTokenInfo;
  }

  async getUserByAccessToken(username: string) {
    console.log(
      '🚀 ~ file: auth.service.ts:88 ~ AuthService ~ getUserByAccessToken ~ username:',
      username,
    );
    return await this.userService.findUsername(username);
  }

  async getAccessToken(code: string) {
    const CLIENT_SECRET = this.configService.get<string>(
      ConfigEnum.CLIENT_SECRET,
    );
    const CLIENT_ID = this.configService.get<string>(ConfigEnum.CLIENT_ID);

    if (
      !this.accessTokenInfo ||
      (this.accessTokenInfo && this.accessTokenInfo)
    ) {
      const res = await lastValueFrom(
        this.httpService.post(this.apiServer, {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code: code,
          redirect_uri: 'http://localhost:3001',
        }),
      );

      if (res.status !== 200) {
        throw new BadRequestException(`获取token出错`);
      }

      const result = res.data;

      this.accessTokenInfo = {
        accessToken: result.access_token,
        tokenType: result.token_type,
        refreshToken: result.refresh_token,
        expiresIn: result.expires_in,
        createdAt: result.created_at,
      };
    }
  }

  async getGitUserInfo(token: string) {
    const res = await lastValueFrom(
      this.httpService.get(
        'https://gitee.com/api/v5/user?access_token=' + token,
      ),
    );
    // 获取用户名
    const { name } = res.data;
    return await this.getUserByAccessToken(name);
  }
}
