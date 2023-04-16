import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './../users/users.entity';

@Entity()
export class Logs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  methods: string;

  @Column()
  data: string;

  @Column()
  result: number;

  @ManyToOne(() => Users, (users) => users.logs)
  @JoinColumn()
  users: Users;
}
