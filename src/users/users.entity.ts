import { Logs } from '../logs/logs.entity';
import { Roles } from '../roles/roles.entity';
import {
  AfterInsert,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Logs, (logs) => logs.users)
  logs: Logs[];

  @ManyToMany(() => Roles, (roles) => roles.users)
  roles: Roles[];

  @OneToOne(() => Profile, (profile) => profile.users)
  profile: Profile;
}
