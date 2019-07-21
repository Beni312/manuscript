import { injectable } from 'inversify';
import { Repository } from './Repository';
import { Role } from '../model';

@injectable()
export class RoleRepository extends Repository<Role> {

  constructor() {
    super(Role);
  }

}
