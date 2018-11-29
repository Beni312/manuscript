module.exports.isLoggedIn = function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.status(400).json({
    'exceptionMessage': 'Access denied'
  });
};
