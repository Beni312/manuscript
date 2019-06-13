import * as express from 'express';
import { Auth } from '../auth/Auth';
import { BasicResponse } from '../model/dto/BasicResponse';
import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { inject } from 'inversify';
import { ProfilePreload } from '../model/dto/ProfilePreload';
import { ProfileService } from '../service/ProfileService';

@controller('/profile', Auth.isAuthenticated)
export class ProfileController implements interfaces.Controller{

  @inject(ProfileService.name)
  profileService: ProfileService;

  @httpPost('/preload')
  async preload(req: express.Request, res: express.Response, next: express.NextFunction): Promise<ProfilePreload> {
    return await this.profileService.getPreload(req.user.userId);
  }

  @httpPost('/savepersonaldata')
  async save(req: express.Request, res: express.Response, next: express.NextFunction): Promise<BasicResponse> {
    const user = req.body;
    await this.profileService.saveProfile(req.user.userId, user);

    return new BasicResponse()
      .withSuccessMessage('Your personal data has been updated successfully!');
  }

  @httpPost('/changepassword')
  async changePassword(req: express.Request, res: express.Response, next: express.NextFunction): Promise<BasicResponse> {
    await this.profileService.changePassword(req.user.userId, req.body);

    return new BasicResponse()
      .withSuccessMessage('Your password has changed successfully!');
  }

  @httpPost('/updatedisciplines')
  async updateAcademicDisciplines(req: express.Request, res: express.Response, next: express.NextFunction): Promise<BasicResponse> {
    await this.profileService.updateAcademicDisciplines(req.user.userId, req.body);

    return new BasicResponse()
      .withSuccessMessage('Your academic disciplines has changed successfully!');
  }
}
