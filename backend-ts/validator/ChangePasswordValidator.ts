import * as express from 'express';
import * as bcrypt from 'bcrypt-nodejs';
import { inject, injectable } from 'inversify';
import { request, response, next } from 'inversify-express-utils';
import { BaseValidator } from './BaseValidator';
import { ChangePasswordCommand } from '../model/command/ChangePasswordCommand';
import { ChangePasswordError } from '../model/error/ChangePasswordError';
import { PasswordRepository } from '../repository/PasswordRepository';

@injectable()
export class ChangePasswordValidator extends BaseValidator {

  @inject(PasswordRepository.name)
  passwordRepository: PasswordRepository;

  handler(@request() req: express.Request, @response() res: express.Response, @next() next: express.NextFunction): void {
    const command: ChangePasswordCommand = req.body;
    if (command.password.password != command.password.passwordAgain) {
      next(new ChangePasswordError('The given passwords are not matched!'));
    }

    this.passwordRepository._findOne({
      where: {
        userId: this.getPrincipal().details.id
      }
    }).then((password) => {
      const isMatch = bcrypt.compareSync(command.oldPassword, password.password);
      if (!isMatch) {
        next(new ChangePasswordError('Your password is wrong.'));
      }
      next();
    })
      .catch((err) => {
        next(err);
      });
  }
}
