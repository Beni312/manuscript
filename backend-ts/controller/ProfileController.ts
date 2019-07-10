import * as express from 'express';
import { authorize } from '../middleware/Authorize';
import { BasicResponse } from '../model/dto/BasicResponse';
import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { inject } from 'inversify';
import { ProfilePreload } from '../model/dto/ProfilePreload';
import { ProfileService } from '../service/ProfileService';

@controller('/profile', authorize())
export class ProfileController implements interfaces.Controller {

  @inject(ProfileService.name)
  profileService: ProfileService;

  @httpPost('/preload')
  async preload(req: express.Request): Promise<ProfilePreload> {
    return await this.profileService.getPreload(req.user.id);
  }

  @httpPost('/savepersonaldata')
  async save(req: express.Request): Promise<BasicResponse> {
    const user = req.body;
    await this.profileService.saveProfile(req.user.id, user);

    return new BasicResponse()
      .withSuccessMessage('Your personal data has been updated successfully!');
  }

  @httpPost('/changepassword')
  async changePassword(req: express.Request): Promise<BasicResponse> {
    await this.profileService.changePassword(req.user.id, req.body);

    return new BasicResponse()
      .withSuccessMessage('Your password has changed successfully!');
  }

  @httpPost('/updatedisciplines', authorize('AUTHOR'))
  async updateAcademicDisciplines(req: express.Request): Promise<BasicResponse> {
    await this.profileService.updateAcademicDisciplines(req.user.id, req.body);

    return new BasicResponse()
      .withSuccessMessage('Your academic disciplines has changed successfully!');
  }
}
