import { Logs } from '../logs/logs.entity';
import { Roles } from '../roles/roles.entity';
import {
  AfterInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Logs, (logs) => logs.users, { cascade: true })
  logs: Logs[];

  @ManyToMany(() => Roles, (roles) => roles.users, {
    cascade: ['insert'],
  })
  @JoinTable({ name: 'users_roles' })
  roles: Roles[];

  @OneToOne(() => Profile, (profile) => profile.users, {
    cascade: true,
  })
  profile: Profile;
}
