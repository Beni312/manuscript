import { inject } from 'inversify';
import { isAuthenticated } from '../decorator/IsAuthenticated';
import { validateBody } from '../decorator/ValidateBody';

import { AcademicDisciplineDto } from '../model/dto/AcademicDisciplineDto';
import { BasicResponse } from '../model/dto/BasicResponse';
import { BaseHttpController, controller, httpPost, interfaces, principal, requestBody } from 'inversify-express-utils';
import { ChangePasswordCommand } from '../model/command/ChangePasswordCommand';
import { ProfilePreload } from '../model/dto/ProfilePreload';
import { ProfileService } from '../service/ProfileService';
import { Principal } from '../model/Principal';
import { SavePersonalDataCommand } from '../model/command/SavePersonalDataCommand';
import { UpdateAcademicDisciplinesValidator } from '../validator/UpdateAcademicDisciplinesValidator';

@controller('/profile')
export class ProfileController extends BaseHttpController implements interfaces.Controller {

  @inject(ProfileService.name)
  profileService: ProfileService;

  @isAuthenticated()
  @httpPost('/preload')
  async preload(@principal() userPrincipal: Principal): Promise<ProfilePreload> {
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
  @httpPost('/change-password')
  @validateBody(ChangePasswordCommand)
  async changePassword(@principal() userPrincipal: Principal, @requestBody() changePasswordCommand: ChangePasswordCommand): Promise<BasicResponse> {
    await this.profileService.changePassword(userPrincipal.details.id, changePasswordCommand);

    return new BasicResponse()
      .withSuccessMessage('Your password has changed successfully!');
  }

  @isAuthenticated('AUTHOR')
  @httpPost('/update-academic-disciplines', UpdateAcademicDisciplinesValidator.name)
  async updateAcademicDisciplines(@principal() userPrincipal: Principal, @requestBody() academicDisciplines: Array<AcademicDisciplineDto>): Promise<BasicResponse> {
    await this.profileService.updateAcademicDisciplines(userPrincipal.details.id, academicDisciplines);

    return new BasicResponse()
      .withSuccessMessage('Your academic disciplines has changed successfully!');
  }
}
