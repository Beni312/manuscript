import * as express from 'express';
import { Auth } from '../auth/Auth';
import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { inject } from 'inversify';
import { UserManagementService } from '../service/UserManagementService';
import { UserManagementDto } from '../model/dto/UserManagementDto';

@controller('/usermanagement', Auth.isAuthenticated)
export class UserManagementController implements interfaces.Controller {

  @inject(UserManagementService.name)
  private userManagementService: UserManagementService;

  @httpPost('/getUsers')
  async getUsers(req: express.Request, res: express.Response, next: express.NextFunction): Promise<UserManagementDto[]> {
    return await this.userManagementService.getUsers();
  }
}
