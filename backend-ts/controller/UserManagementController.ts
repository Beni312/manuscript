import { inject } from 'inversify';
import { isAuthenticated } from '../decorator/IsAuthenticated';
import { validateBody } from '../decorator/ValidateBody';
import { AddUserCommand } from '../model/command/AddUserCommand';
import { BaseHttpController, controller, httpPost, interfaces, requestBody } from 'inversify-express-utils';
import { ChangePasswordCommand } from '../model/command/ChangePasswordCommand';
import { ChangeUserStatusCommand } from '../model/command/ChangeUserStatusCommand';
import { UserManagementService } from '../service/UserManagementService';
import { UserManagementDto } from '../model/dto/UserManagementDto';

@controller('/user-management')
export class UserManagementController extends BaseHttpController implements interfaces.Controller {

  @inject(UserManagementService.name)
  private userManagementService: UserManagementService;

  @isAuthenticated('ADMIN')
  @httpPost('/get-users')
  async getUsers(): Promise<UserManagementDto[]> {
    return await this.userManagementService.getUsers();
  }

  @isAuthenticated('ADMIN')
  @httpPost('add-user')
  @validateBody(AddUserCommand)
  async addUser() {

  }

  @isAuthenticated('ADMIN')
  @httpPost('change-user-password')
  @validateBody(ChangePasswordCommand)
  async changeUserPassword() {

  }

  @isAuthenticated('ADMIN')
  @httpPost('change-user-status')
  @validateBody(ChangeUserStatusCommand)
  async changeUserStatus(@requestBody() changeUserStatusCommand: ChangeUserStatusCommand) {
    await this.userManagementService.changeUserStatus(changeUserStatusCommand.userId, changeUserStatusCommand.statusId);
  }


}
