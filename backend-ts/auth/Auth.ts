/**
 * Module dependencies.
 */
import * as bcrypt from 'bcrypt';
import * as LocalStrategy from 'passport-local';
import * as moment from 'moment';
import * as passport from 'passport';
import * as passportJWT from 'passport-jwt';

import { Login, Password, Role, User, UserAlias, UserStatus } from '../model';
import { UserInfo } from '../model/dto/UserInfo';
import { AuthenticationError } from '../model/error/AuthenticationError';

const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

export class Auth {

  private static TOO_MUCH_LOGIN_ERROR_MESSAGE_PATTERN = 'Too much failed login, try again after DATE';
  private static USER_DISABLED_ERROR_MESSAGE_PATTERN = 'User disabled!';
  private static INVALID_USERNAME_OR_PASSWORD_ERROR_MESSAGE_PATTERN = 'Invalid username or password';

  static serializeUser() {
    passport.serializeUser(async function (user, done) {
      done(null, user);
    });

    passport.deserializeUser(async function (user: any, done) {
      await User.findByPk(user.id, {
        include: [
          {
            model: UserAlias
          },
          {
            model: Role
          }
        ]
      }).then((user: User) => {
        done(null, new UserInfo(user.id, user.userAlias.username, user.role.name, user.avatar));
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
      await User.findOne({
        include: [
          {
            model: Password
          },
          {
            model: Role
          },
          {
            model: UserAlias,
            include: [
              {
                model: Login
              }
            ],
            where: {
              username: username
            }
          },
          {
            model: UserStatus
          }
        ]
      }).then((user: User) => {
        if (user) {
          if (!user.userAlias.login.enabled) {
            const nextLoginDate = moment(user.userAlias.login.updatedOn).add(10, 'minute');
            if (nextLoginDate.toDate() !> new Date()) {
              done(new AuthenticationError(Auth.TOO_MUCH_LOGIN_ERROR_MESSAGE_PATTERN.replace('DATE', nextLoginDate.format('DD MMM HH:mm:ss').toString())));
              return null;
            } else {
              user.userAlias.login.failedLoginCounter = 0;
              user.userAlias.login.enabled = true;
              user.userAlias.login.save();
            }
          }
        }

        if (bcrypt.compareSync(password, user.password.password)) {
          if (user.status.status !== 'OK') {
            done(new AuthenticationError(Auth.USER_DISABLED_ERROR_MESSAGE_PATTERN));
            return null;
          } else {
            done(null, new UserInfo(user.id, user.userAlias.username, user.role.name, user.avatar));
            return null;
          }
        } else {
          user.userAlias.login.failedLoginCounter++;
          if (user.userAlias.login.failedLoginCounter > 2) {
            user.userAlias.login.enabled = false;
          }
          user.userAlias.login.save();
          done(null, false, new AuthenticationError(Auth.INVALID_USERNAME_OR_PASSWORD_ERROR_MESSAGE_PATTERN));
          return null;
        }
      }).catch(err => {
        console.log(err);
      });
    }));
  }

  static useJWTStrategy() {
    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
      },
      function (jwtPayload, cb) {
        const userInfo: UserInfo = jwtPayload.data;
        return cb(null, userInfo);
      }
    ));
  }
}








