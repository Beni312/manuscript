import * as express from 'express';
import { inject } from 'inversify';
import { isAuthenticated } from '../decorator/IsAuthenticated';
import { validateBody } from '../decorator/ValidateBody';
import { upload } from '../middleware/upload';
import { AcademicDisciplineDto } from '../model/dto/AcademicDisciplineDto';
import { BasicResponse } from '../model/response/BasicResponse';
import { BaseHttpController, controller, httpPost, interfaces, principal, request, requestBody } from 'inversify-express-utils';
import { ChangePasswordCommand } from '../model/command/ChangePasswordCommand';
import { ChangePasswordValidator } from '../validator/ChangePasswordValidator';
import { PasswordService } from '../service/PasswordService';
import { ProfileService } from '../service/ProfileService';
import { Principal } from '../model/Principal';
import { RoleEnum } from '../model/enum/RoleEnum';
import { SavePersonalDataCommand } from '../model/command/SavePersonalDataCommand';
import { UpdateAcademicDisciplinesValidator } from '../validator/UpdateAcademicDisciplinesValidator';
import { UserDto } from '../model/dto/UserDto';

@controller('/profile')
export class ProfileController extends BaseHttpController implements interfaces.Controller {

  @inject(ProfileService.name)
  private profileService: ProfileService;

  @inject(PasswordService.name)
  private passwordService: PasswordService;

  @isAuthenticated()
  @httpPost('/preload')
  async preload(@principal() userPrincipal: Principal): Promise<UserDto> {
    return await this.profileService.getPreload(userPrincipal.details.id);
  }

  @isAuthenticated()
  @httpPost('/save-personal-data')
  @validateBody(SavePersonalDataCommand)
  async save(@principal() userPrincipal: Principal, @requestBody() savePersonalDataCommand: SavePersonalDataCommand): Promise<BasicResponse> {
    await this.profileService.saveProfile(userPrincipal.details.id, savePersonalDataCommand);

    return new BasicResponse()
      .withSuccessMessage('Your personal data has been updated successfully!');
  }

  @isAuthenticated()
  @httpPost('/change-password', ChangePasswordValidator.name)
  @validateBody(ChangePasswordCommand)
  async changePassword(@principal() userPrincipal: Principal, @requestBody() changePasswordCommand: ChangePasswordCommand): Promise<BasicResponse> {
    await this.passwordService.modifyPassword(userPrincipal.details.id, changePasswordCommand.password.password);

    return new BasicResponse()
      .withSuccessMessage('Your password has changed successfully!');
  }

  @isAuthenticated(RoleEnum.AUTHOR, RoleEnum.EDITOR, RoleEnum.REVIEWER)
  @httpPost('/update-academic-disciplines', UpdateAcademicDisciplinesValidator.name)
  async updateAcademicDisciplines(@principal() userPrincipal: Principal, @requestBody() academicDisciplines: Array<AcademicDisciplineDto>): Promise<BasicResponse> {
    await this.profileService.updateAcademicDisciplines(userPrincipal.details.id, academicDisciplines);

    return new BasicResponse()
      .withSuccessMessage('Your academic disciplines has changed successfully!');
  }

  @isAuthenticated()
  @httpPost('/upload-avatar', upload.single('avatar'))
  async uploadAvatar(@request() req: express.Request, @principal() userPrincipal: Principal): Promise<void> {
    const file = req.file;
    await this.profileService.uploadAvatar(userPrincipal.details, file);
  }
}
