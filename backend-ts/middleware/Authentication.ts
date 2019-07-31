import * as passport from 'passport';

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
          res.status(200);
          res.json({
            'successMessage': "Success login"
          });
        });
      }
    })(req, res, next);
  };
};
