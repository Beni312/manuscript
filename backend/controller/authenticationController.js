const passport = require('passport');

module.exports = function (app) {
  app.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(401);
        res.json({exceptionMessage: info.message})
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
  });

  app.post('/logout', function(req, res) {
    req.logout();
    res.status(200).send({"success":true});
  });
};
