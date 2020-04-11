import { Password } from '../model';
import { injectable } from 'inversify';
import { Repository } from './Repository';

@injectable()
export class PasswordRepository extends Repository<Password> {

  constructor() {
    super(Password);
  }

  changeUserPassword() {
  }
}
