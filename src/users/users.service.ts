import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { In, Repository } from 'typeorm';
import { Logs } from '../logs/logs.entity';
import { getUserDto } from './dto/get-user.dto';
import { Roles } from '../roles/roles.entity';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) {}
  async findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async findUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  async find(username: string) {
    return this.userRepository.findOne({
      where: { username },
      relations: ['roles'],
    });
  }

  findProfile(id: number) {
    return this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        profile: true,
        roles: true,
      },
    });
  }
  async findUsersLogs(id: number) {
    const users = await this.findOne(id);

    return this.logsRepository.find({
      where: {
        users: users.logs,
      },
      relations: {
        users: true,
      },
    });
  }

  async findAll(query: getUserDto) {
    const { limit: take = 10, page, username, gender, role } = query;
    const skip = (page || 1 - 1) * take;
    return this.userRepository.find({
      relations: {
        profile: true,
        roles: true,
      },
      select: {
        id: true,
        username: true,
      },
      where: {
        username,
        profile: {
          gender,
        },
        roles: {
          id: role,
        },
      },
      take,
      skip,
    });
  }

  async create(user: Users) {
    if (user.roles instanceof Array && typeof user.roles[0] === 'number') {
      user.roles = await this.rolesRepository.find({
        where: {
          id: In(user.roles),
        },
      });
    }
    const userTmp = await this.userRepository.create(user);

    userTmp.password = await argon2.hash(userTmp.password);

    const res = await this.userRepository.save(userTmp);
    return res;
  }

  async update(id: number, user: Partial<Users>) {
    const userTemp = await this.findProfile(id);
    const newUser = this.userRepository.merge(userTemp, user);
    return this.userRepository.save(newUser);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
