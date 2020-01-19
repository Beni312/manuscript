import * as express from 'express';
import { authentication } from '../middleware/Authentication';
import { BaseHttpController, controller, httpPost, interfaces, request } from 'inversify-express-utils';
import { isAuthenticated } from '../decorator/IsAuthenticated';

@controller('')
export class AuthenticationController extends BaseHttpController implements interfaces.Controller {

  @isAuthenticated()
  @httpPost('/logout')
  private async logout(@request() req: express.Request): Promise<any> {
    req.logout();
    return {success: true};
  }

  @httpPost('/login', authentication())
  public async login(): Promise<void> {
  }
}
