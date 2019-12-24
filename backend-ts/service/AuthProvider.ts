import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { IncorrectTokenError } from '../model/error/IncorrectTokenError';
import { injectable } from 'inversify';
import { interfaces } from 'inversify-express-utils';
import { logger } from './logger';
import { Principal } from '../model/Principal';

@injectable()
export class AuthProvider implements interfaces.AuthProvider {

  getUser(req: express.Request, res: express.Response, next: express.NextFunction): Promise<interfaces.Principal> {
    if (!req.headers.authorization) {
      throw new IncorrectTokenError();
    }
    const token = this.getAndValidateBearerToken(req.headers.authorization);
    let user = null;

    try {
      user = jwt.verify(token, process.env.JWT_SECRET).data;
    } catch(err) {
      logger.info('Authentication error');
    }

    return Promise.resolve(new Principal(user));
  }

  getAndValidateBearerToken(bearerAuthorization: string): string {
    if (!bearerAuthorization.includes('Bearer')) {
      throw new IncorrectTokenError();
    }
    const tokenParts = bearerAuthorization.split(' ');
    if (tokenParts.length !== 2) {
      throw new IncorrectTokenError();
    }

    return tokenParts[1];
  }
}
