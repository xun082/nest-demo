import AppDataSource from '../ormConfig';
import { Users } from './users/users.entity';

AppDataSource.initialize()
  .then(async () => {
    const users = await AppDataSource.manager.find(Users);
  })
  .catch((error) => console.log(error));
