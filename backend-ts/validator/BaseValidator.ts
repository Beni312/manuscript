import { AuthenticationError } from '../model/error/AuthenticationError';
import { BaseMiddleware } from 'inversify-express-utils';
import { Principal } from '../model/Principal';

export abstract class BaseValidator extends BaseMiddleware {

  getPrincipal(): Principal {
    if (!this.httpContext.user.details) {
      throw new AuthenticationError();
    }

    return this.httpContext.user as Principal;
  }
}
