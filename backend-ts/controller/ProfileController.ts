import * as express from 'express';
import { BasicResponse } from '../model/dto/BasicResponse';
import { BaseHttpController, controller, httpPost, interfaces, principal } from 'inversify-express-utils';
import { inject } from 'inversify';
import { ProfilePreload } from '../model/dto/ProfilePreload';
import { ProfileService } from '../service/ProfileService';
import { Principal } from '../model/Principal';
import { isAuthenticated } from '../decorator/IsAuthenticated';

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
  @httpPost('/savepersonaldata')
  async save(@principal() userPrincipal: Principal, req: express.Request): Promise<BasicResponse> {
    const user = req.body;
    await this.profileService.saveProfile(userPrincipal.details.id, user);

    return new BasicResponse()
      .withSuccessMessage('Your personal data has been updated successfully!');
  }

  @isAuthenticated()
  @httpPost('/changepassword')
  async changePassword(@principal() userPrincipal: Principal, req: express.Request): Promise<BasicResponse> {
    await this.profileService.changePassword(userPrincipal.details.id, req.body);

    return new BasicResponse()
      .withSuccessMessage('Your password has changed successfully!');
  }

  @isAuthenticated('AUTHOR')
  @httpPost('/updatedisciplines')
  async updateAcademicDisciplines(@principal() userPrincipal: Principal, req: express.Request): Promise<BasicResponse> {
    await this.profileService.updateAcademicDisciplines(userPrincipal.details.id, req.body);

    return new BasicResponse()
      .withSuccessMessage('Your academic disciplines has changed successfully!');
  }
}
