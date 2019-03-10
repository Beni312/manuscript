import * as express from "express";
import * as passport from "passport";
import { BaseRouter } from "./BaseRouter";

export class AuthRouter extends BaseRouter {

  constructor() {
    super();
    this.buildRoutes();
  }

  private async logout(req: express.Request, res: express.Response, next: express.NextFunction) {
    req.logout();
    res.status(200).send({"success": true});
  }

  public async login(req: express.Request, res: express.Response, next: express.NextFunction) {
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
  }

  private buildRoutes() {
    this.router.post("/login", this.login.bind(this));
    this.router.post("/logout", this.logout.bind(this));
  }
}
