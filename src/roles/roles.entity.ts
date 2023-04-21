import { Users } from '../users/users.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Roles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: number;

  @ManyToMany(() => Users, (users) => users.roles)
  @JoinTable({ name: 'users_roles' })
  users: Users[];
}
