import * as express from 'express';
import { inject, injectable } from 'inversify';
import { next, request, response } from 'inversify-express-utils';
import { BaseValidator } from './BaseValidator';
import { RegistrationError } from '../model/error/RegistrationError';
import { RegistrationCommand } from '../model/command/RegistrationCommand';
import { UserAlias } from '../model';
import { UserAliasRepository } from '../repository/UserAliasRepository';

@injectable()
export class RegistrationCommandValidator extends BaseValidator {

  @inject(UserAliasRepository.name)
  userAliasRepository: UserAliasRepository;

  handler(@request() req: express.Request, @response() res: express.Response, @next() next: express.NextFunction): void {
    const command: RegistrationCommand = req.body;
    if (command.password.password != command.password.passwordAgain) {
      next(new RegistrationError("Password parity check failed. The given passwords are not matched."));
    }

    this.userAliasRepository._findOne({
      where: {
        username: command.user.username
      }
    })
      .then((userAlias: UserAlias | undefined) => {
        if (userAlias) {
          next(new RegistrationError('Username is already used!'));
        }
        next();
      })
      .catch(error => {
        next(error);
      });
  }
}
