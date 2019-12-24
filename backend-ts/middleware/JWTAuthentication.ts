import * as passport from 'passport';
import { AuthenticationError } from '../model/error/AuthenticationError';
import { PermissionError } from '../model/error/PermissionError';
import { logger } from '../service/logger';

export const JWTAuthentication = (...roles) => {
  return async (req, res, next) => {
    passport.authenticate('jwt', {session: false}, function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        logger.info(info);
        return next(new AuthenticationError());
      }

      if (roles.length > 0 && roles.indexOf(req.user.role) == -1) {
        return next(new PermissionError());
      }

      next();
    })(req, res, next);
  };
};
