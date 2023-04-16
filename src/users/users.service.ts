import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import { Logs } from 'src/logs/logs.entity';

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
        users,
      },
      relations: {
        users: true,
      },
    });
  }
}
