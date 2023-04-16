import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Logs } from 'src/logs/logs.entity';
import { Roles } from 'src/roles/roles.entity';
import { Profile } from 'src/users/profile.entity';
import { Users } from 'src/users/users.entity';

export default {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: 'example',
  database: 'moment',
  entities: [Users, Profile, Logs, Roles],
  // 同步本地的schema与数据库 -> 初始化的时候去使用
  synchronize: true,
  // logging: process.env.NODE_ENV == 'development',
  logging: false,
} as TypeOrmModuleOptions;
