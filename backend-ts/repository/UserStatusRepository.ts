import { injectable } from 'inversify';
import { Repository } from './Repository';
import { UserStatus } from '../model';

@injectable()
export class UserStatusRepository extends Repository<UserStatus> {

  constructor() {
    super(UserStatus);
  }
}
