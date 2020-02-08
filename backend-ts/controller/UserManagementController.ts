import { BaseHttpController, controller, httpPost, interfaces, principal } from 'inversify-express-utils';
import { inject } from 'inversify';
import { isAuthenticated } from '../decorator/IsAuthenticated';
import { Principal } from '../model/Principal';
import { UserManagementService } from '../service/UserManagementService';
import { UserManagementDto } from '../model/dto/UserManagementDto';

@controller('/user-management')
export class UserManagementController extends BaseHttpController implements interfaces.Controller {

  @inject(UserManagementService.name)
  private userManagementService: UserManagementService;

  @isAuthenticated('ADMIN')
  @httpPost('/get-users')
  async getUsers(@principal() userPrincipal: Principal): Promise<UserManagementDto[]> {
    return await this.userManagementService.getUsers();
  }
}
