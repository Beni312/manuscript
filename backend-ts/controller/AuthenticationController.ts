import * as express from 'express';
import { authentication } from '../middleware/Authentication';
import { authorize } from '../middleware/Authorize';
import { controller, httpPost, interfaces } from 'inversify-express-utils';

@controller('')
export class AuthenticationController implements interfaces.Controller {

  @httpPost('/logout', authorize())
  private async logout(req: express.Request): Promise<any> {
    req.logout();
    return {success: true};
  }

  @httpPost('/login', authentication())
  public async login(): Promise<void> {
  }
}
