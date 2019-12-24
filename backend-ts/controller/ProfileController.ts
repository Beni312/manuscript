import * as express from 'express';
import { authorize } from '../middleware/Authorize';
import { BasicResponse } from '../model/dto/BasicResponse';
import { controller, httpPost, interfaces, principal } from 'inversify-express-utils';
import { inject } from 'inversify';
import { JWTAuthentication } from '../middleware/JWTAuthentication';
import { ProfilePreload } from '../model/dto/ProfilePreload';
import { ProfileService } from '../service/ProfileService';
import { Principal } from '../model/Principal';

@controller('/profile', JWTAuthentication())
export class ProfileController implements interfaces.Controller {

  @inject(ProfileService.name)
  profileService: ProfileService;

  @httpPost('/preload')
  async preload(@principal() userPrincipal: Principal): Promise<ProfilePreload> {
    return await this.profileService.getPreload(userPrincipal.details.id);
  }

  @httpPost('/savepersonaldata')
  async save(@principal() userPrincipal: Principal, req: express.Request): Promise<BasicResponse> {
    const user = req.body;
    await this.profileService.saveProfile(userPrincipal.details.id, user);

    return new BasicResponse()
      .withSuccessMessage('Your personal data has been updated successfully!');
  }

  @httpPost('/changepassword')
  async changePassword(@principal() userPrincipal: Principal, req: express.Request): Promise<BasicResponse> {
    await this.profileService.changePassword(userPrincipal.details.id, req.body);

    return new BasicResponse()
      .withSuccessMessage('Your password has changed successfully!');
  }

  @httpPost('/updatedisciplines', authorize('AUTHOR'))
  async updateAcademicDisciplines(@principal() userPrincipal: Principal, req: express.Request): Promise<BasicResponse> {
    await this.profileService.updateAcademicDisciplines(userPrincipal.details.id, req.body);

    return new BasicResponse()
      .withSuccessMessage('Your academic disciplines has changed successfully!');
  }
}
