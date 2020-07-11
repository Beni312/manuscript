import { injectable } from 'inversify';
import { Repository } from './Repository';
import { Login } from '../model';

@injectable()
export class LoginRepository extends Repository<Login> {

  constructor() {
    super(Login);
  }
}
