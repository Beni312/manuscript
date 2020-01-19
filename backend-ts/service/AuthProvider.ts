import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';
import { injectable } from 'inversify';
import { interfaces, next, request, response } from 'inversify-express-utils';
import { Principal } from '../model/Principal';
import { UserInfo } from '../model/dto/UserInfo';

@injectable()
export class AuthProvider implements interfaces.AuthProvider {

  getUser(@request() req: express.Request, @response() res: express.Response, @next() next: express.NextFunction): Promise<interfaces.Principal> {
    let user = null;
    if (!req.headers.authorization) {
      return Promise.resolve(new Principal(null));
    }
    passport.authenticate('jwt', {session: false}, function (err, JWTData, info) {
      user = JWTData;
    })(req, res, next);
    return Promise.resolve(new Principal(user));
  }

  authenticate(req, res, next): UserInfo | null {
    let user: UserInfo | null = null;
    passport.authenticate('jwt', {session: false}, function (err, JWTData, info) {
      user = JWTData;
    })(req, res, next);

    return user;
  }


}
