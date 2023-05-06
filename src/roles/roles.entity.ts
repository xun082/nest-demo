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
  name: string;

  @ManyToMany(() => Users, (users) => users.roles, {
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'users_roles' })
  users: Users[];
}
