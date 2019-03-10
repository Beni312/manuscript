/**
 * Module dependencies.
 */
import * as passport from "passport";
import * as LocalStrategy from "passport-local";
import * as bcrypt from "bcrypt";
const Sequelize = require('sequelize');

export class Auth {

  static serializeUser(sequelize) {
    passport.serializeUser(function(user, done) {
      done(null, user);
    });

    passport.deserializeUser(function(user, done){
      sequelize.query('select userAlias.userId as userId, userAlias.username, role.name as role from user inner join userAlias on userAlias.userId = user.id inner join role on role.id = user.roleId where user.id = ' + user,
        {type: Sequelize.QueryTypes.SELECT})
        .then(properties => {
          done(null, {userId: properties[0].userId, username: properties[0].username, role: properties[0].role});
        })
        .catch(err => done(err, {}));
    });
  }

  /**
   * LocalStrategy
   *
   * This strategy is used to authenticate users based on a username and password.
   * Anytime a request is made to authorize an application, we must ensure that
   * a user is logged in before asking them to approve the request.
   */
  static useLocalStrategy(sequelize) {
    passport.use(new LocalStrategy(function(username, password, done) {
      sequelize.query('select password.userId, password.password from password inner join login on password.id = login.passwordId where login.username = "' + username + '"', {type: Sequelize.QueryTypes.SELECT})
        .then(function(properties) {
          if(properties[0]) {
            if (bcrypt.compareSync(password, properties[0].password)) {
              return done(null, properties[0].userId);
            }
          }
          return done(null, false, { message: 'Invalid username or password' });
        })
        .catch(function(err) { // something went wrong with query to db
          done(err);
        });
    }));
  }
}








