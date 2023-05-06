import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Users } from 'src/users/users.entity';
import { UserService } from 'src/users/users.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    // 获取用户信息,进行角色判断
    const user = (await this.userService.find(req.user.username)) as Users;
    console.log(user);

    if (user.roles.filter((r) => r.id === 1).length > 0) return true;

    return false;
  }
}
