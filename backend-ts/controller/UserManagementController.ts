import { inject } from 'inversify';
import { isAuthenticated } from '../decorator/IsAuthenticated';
import { validateBody } from '../decorator/ValidateBody';
import { AddUserCommand } from '../model/command/AddUserCommand';
import { BaseHttpController, controller, httpGet, httpPost, httpPut, interfaces, requestBody } from 'inversify-express-utils';
import { BasicResponse } from '../model/dto/BasicResponse';
import { ChangePasswordCommand } from '../model/command/ChangePasswordCommand';
import { ChangeUserStatusCommand } from '../model/command/ChangeUserStatusCommand';
import { PasswordService } from '../service/PasswordService';
import { UserManagementService } from '../service/UserManagementService';
import { UserManagementDto } from '../model/dto/UserManagementDto';

@controller('/user-management')
export class UserManagementController extends BaseHttpController implements interfaces.Controller {

  @inject(UserManagementService.name)
  private userManagementService: UserManagementService;

  @inject(PasswordService.name)
  private passwordService: PasswordService;

  @isAuthenticated('ADMIN')
  @httpGet('')
  async getUsers(): Promise<UserManagementDto[]> {
    return await this.userManagementService.getUsers();
  }

  @isAuthenticated('ADMIN')
  @httpPut('')
  @validateBody(AddUserCommand)
  async addUser(@requestBody() addUserCommand: AddUserCommand): Promise<BasicResponse> {
    await this.userManagementService.createUser(addUserCommand);
    return new BasicResponse()
      .withSuccessMessage('User successfully created');
  }

  @isAuthenticated('ADMIN')
  @httpPost('/change-user-password')
  @validateBody(ChangePasswordCommand)
  async changeUserPassword(@requestBody() changePasswordCommand: ChangePasswordCommand): Promise<BasicResponse> {
    await this.passwordService.modifyPassword(changePasswordCommand.userId, changePasswordCommand.password.password);
    return new BasicResponse()
      .withSuccessMessage(  'User password changed successfully!');
  }

  @isAuthenticated('ADMIN')
  @httpPost('/change-user-status')
  @validateBody(ChangeUserStatusCommand)
  async changeUserStatus(@requestBody() changeUserStatusCommand: ChangeUserStatusCommand) {
    await this.userManagementService.changeUserStatus(changeUserStatusCommand.userId, changeUserStatusCommand.statusId);
  }
}
