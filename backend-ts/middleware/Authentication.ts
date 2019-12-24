import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';
import { PreloadDto } from '../model/dto/PreloadDto';

export const authentication = () => {
  return async (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(401);
        res.json({exceptionMessage: info.message});
      } else {
        req.logIn(user, function (err) {
          if (err) {
            return next(err);
          }

          const token = jwt.sign({data: user}, process.env.JWT_SECRET);
          return res.json(new PreloadDto(user.id, user.username, user.role, token));
        });
      }
    })(req, res, next);
  };
};
