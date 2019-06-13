import * as express from 'express';
import * as passport from 'passport';
import { controller, httpPost, interfaces } from 'inversify-express-utils';

@controller('')
export class AuthenticationController implements interfaces.Controller {

  @httpPost('/logout')
  private async logout(req: express.Request, res: express.Response): Promise<any> {
    req.logout();
    return {success: true};
  }

  @httpPost('/login', passport.authenticate('local', {successMessage: 'Success login', failureMessage: 'Wrong username or password'}))
  public async login(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
  }
}
