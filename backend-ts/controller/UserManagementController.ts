import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { inject } from 'inversify';
import { JWTAuthentication } from '../middleware/JWTAuthentication';
import { UserManagementService } from '../service/UserManagementService';
import { UserManagementDto } from '../model/dto/UserManagementDto';

@controller('/usermanagement', JWTAuthentication('ADMIN'))
export class UserManagementController implements interfaces.Controller {

  @inject(UserManagementService.name)
  private userManagementService: UserManagementService;

  @httpPost('/getUsers')
  async getUsers(): Promise<UserManagementDto[]> {
    return await this.userManagementService.getUsers();
  }
}
