import * as express from 'express';
import { authentication } from '../middleware/Authentication';
import { controller, httpPost, interfaces, request } from 'inversify-express-utils';
import { JWTAuthentication } from '../middleware/JWTAuthentication';

@controller('')
export class AuthenticationController implements interfaces.Controller {

  @httpPost('/logout', JWTAuthentication())
  private async logout(@request() req: express.Request): Promise<any> {
    req.logout();
    return {success: true};
  }

  @httpPost('/login', authentication())
  public async login(): Promise<void> {
  }
}
