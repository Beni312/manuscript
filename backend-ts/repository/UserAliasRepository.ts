import { injectable } from 'inversify';
import { Repository } from './Repository';
import { UserAlias } from '../model';

@injectable()
export class UserAliasRepository extends Repository<UserAlias> {
  constructor() {
    super(UserAlias);
  }
}
