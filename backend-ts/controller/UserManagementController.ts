import { inject } from 'inversify';
import { isAuthenticated } from '../decorator/IsAuthenticated';
import { validateBody } from '../decorator/ValidateBody';
import { AdminChangePasswordCommand } from '../model/command/AdminChangePasswordCommand';
import { BaseHttpController, controller, httpGet, httpPost, httpPut, interfaces, requestBody } from 'inversify-express-utils';
import { BasicResponse } from '../model/response/BasicResponse';
import { ChangeUserStatusCommand } from '../model/command/ChangeUserStatusCommand';
import { PasswordService } from '../service/PasswordService';
import { UserManagementService } from '../service/UserManagementService';
import { UserManagementDto } from '../model/response/UserManagementDto';
import { RegistrationCommand } from '../model/command/RegistrationCommand';
import { RegistrationCommandValidator } from '../validator/RegistrationCommandValidator';

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
  @httpPut('', RegistrationCommandValidator.name)
  @validateBody(RegistrationCommand)
  async addUser(@requestBody() addUserCommand: RegistrationCommand): Promise<UserManagementDto> {
    const user = await this.userManagementService.createUser(addUserCommand);
    return new UserManagementDto(user);
  }

  @isAuthenticated('ADMIN')
  @httpPost('/change-password')
  @validateBody(AdminChangePasswordCommand)
  async changeUserPassword(@requestBody() changePasswordCommand: AdminChangePasswordCommand): Promise<BasicResponse> {
    await this.passwordService.modifyPassword(changePasswordCommand.userId, changePasswordCommand.password.password);
    return new BasicResponse()
      .withSuccessMessage('User password changed successfully!');
  }

  @isAuthenticated('ADMIN')
  @httpPost('/change-user-status')
  @validateBody(ChangeUserStatusCommand)
  async changeUserStatus(@requestBody() changeUserStatusCommand: ChangeUserStatusCommand) {
    await this.userManagementService.changeUserStatus(changeUserStatusCommand.userId, changeUserStatusCommand.statusId);
  }
}
