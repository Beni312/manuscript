/**
 * Module dependencies.
 */
import * as passport from "passport";
import * as LocalStrategy from "passport-local";
import * as bcrypt from "bcrypt";
import * as passportJWT from 'passport-jwt';

import { Password, Role, User, UserAlias } from '../model';
import { UserInfo } from '../model/dto/UserInfo';

const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy   = passportJWT.Strategy;

export class Auth {

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
        done(null, new UserInfo(user.id, user.userAlias.username, user.role.name));
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
            where: {
              username: username
            }
          }
        ]
      }).then((user: User) => {
        if (user) {
          if (bcrypt.compareSync(password, user.password.password)) {
            done(null, new UserInfo(user.id, user.userAlias.username, user.role.name));
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








