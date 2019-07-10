import { AuthenticationError } from '../model/error/AuthenticationError';
import { PermissionError } from '../model/error/PermissionError';

export const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return next(new AuthenticationError());
      }

      if (roles.length > 0 && roles.indexOf(req.user.role) == -1) {
        return next(new PermissionError());
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
