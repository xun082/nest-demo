import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import { Logs } from '../logs/logs.entity';
import { getUserDto } from './dto/get-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
  ) {}
  async findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }
  findProfile(id: number) {
    return this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        profile: true,
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
    const userTmp = await this.userRepository.create(user);
    return this.userRepository.save(userTmp);
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
