/**
 * Module dependencies.
 */
import * as passport from "passport";
import * as LocalStrategy from "passport-local";
import * as bcrypt from "bcrypt";
import { Password, Role, User, UserAlias } from '../model';

export class Auth {

  static serializeUser() {
    passport.serializeUser(function (user, done) {
      done(null, user);
    });

    passport.deserializeUser(function (user: any, done) {
      User.findByPk(user, {
        include: [
          {
            model: UserAlias
          },
          {
            model: Role
          }
        ]
      }).then((user: User) => {
        done(null, {userId: user.id, username: user.userAlias.username, role: user.role.name});
        return null;
      }).catch(err => {
        done(err, {});
        return null;
      });
    });
  }

  /**
   * LocalStrategy
   *
   * This strategy is used to authenticate users based on a username and password.
   * Anytime a request is made to authorize an application, we must ensure that
   * a user is logged in before asking them to approve the request.
   */
  static useLocalStrategy() {
    passport.use(new LocalStrategy(async function (username, password, done) {
      User.findOne({
        include: [
          {
            model: Password
          },
          {
            model: UserAlias,
            where: {
              username: username
            }
          }
        ]
      }).then((user: User) => {
        if (user) {
          if (bcrypt.compareSync(password, user.password.password)) {
            done(null, user.id);
            return null;
          }
        }
        done(null, false, {message: 'Invalid username or password'});
        return null;
      }).catch(err => {
        console.log(err);
      });
    }));
  }
}








