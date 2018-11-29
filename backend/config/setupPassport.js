const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {User, sequelize} = require('../sequelize');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt-nodejs');

/**
 * Passport authentication config with LocalStrategy
 */
passport.use(new LocalStrategy(function(username, password, done) {
  //sequelize.query('select role.name as role, user.id, password.userId, password.password from password ' +
    //'inner join login on password.id = login.passwordId ' +
    //'inner join user on user.id = password.userId ' +
    //'inner join role on role.id = user.roleId ' +
    //'where login.username = "' + username + '"',
    //{type: Sequelize.QueryTypes.SELECT})
  sequelize.query('select password.userId, password.password from password inner join login on password.id = login.passwordId where login.username = "' + username + '"', {type: Sequelize.QueryTypes.SELECT})
    .then(function(properties) {
      if(properties[0]) {
        let isMatch = bcrypt.compareSync(password, properties[0].password);
        if (isMatch) {
          return done(null, properties[0].userId);
        }
      }
      return done(null, false, { message: 'Invalid username or password' });
    })
    .catch(function(err) { // something went wrong with query to db
      done(err);
    });
}));

/**
 * Serialize session, store oly the user id in the session information
 */
passport.serializeUser(function(user, done) {
  done(null, user);
});

/**
 * From the user id, figure out who the user and it's role, username
 */
passport.deserializeUser(function(user, done){
  sequelize.query('select userAlias.userId as userId, userAlias.username, role.name as role from user inner join userAlias on userAlias.userId = user.id inner join role on role.id = user.roleId where user.id = ' + user, {type: Sequelize.QueryTypes.SELECT})
    .then(properties => {
      done(null, {userId: properties[0].userId, username: properties[0].username, role: properties[0].role});
    })
    .catch(err => done(err, null));
});
