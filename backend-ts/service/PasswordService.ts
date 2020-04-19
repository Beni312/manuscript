import * as bcrypt from 'bcrypt-nodejs';
import * as moment from 'moment';
import { inject, injectable } from 'inversify';
import { Password } from '../model';
import { PasswordRepository } from '../repository/PasswordRepository';

@injectable()
export class PasswordService {

  @inject(PasswordRepository.name)
  private passwordRepository: PasswordRepository;

  createPassword(userId: number, password: string): Promise<Password> {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);

    return this.passwordRepository.create({
      password: hashedPassword,
      salt: salt,
      userId: userId,
      expiryDate: moment().add(6, 'month').toDate()
    });
  }

  async modifyPassword(userId: number, newPassword: string): Promise<Password> {
    const password = await this.passwordRepository._findOne({
      where: {
        userId: userId
      }
    });
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newPassword, salt);
    return this.passwordRepository.updateByPk(password.id, {password: hashedPassword, salt: salt});
  }
}
