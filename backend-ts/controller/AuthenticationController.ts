import * as express from 'express';
import * as passport from 'passport';
import { authorize } from '../middleware/Authorize';
import { controller, httpPost, interfaces } from 'inversify-express-utils';

@controller('')
export class AuthenticationController implements interfaces.Controller {

  @httpPost('/logout', authorize())
  private async logout(req: express.Request): Promise<any> {
    req.logout();
    return {success: true};
  }

  @httpPost('/login', passport.authenticate('local', {successMessage: 'Success login', failureMessage: 'Wrong username or password'}))
  public async login(): Promise<void> {
  }
}
