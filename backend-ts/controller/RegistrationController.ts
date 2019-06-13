import * as express from 'express';
import { BasicResponse } from '../model/dto/BasicResponse';
import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { inject } from 'inversify';
import { RegistrationService } from '../service/RegistrationService';

@controller('')
export class RegistrationController implements interfaces.Controller{

  @inject(RegistrationService.name)
  registrationService: RegistrationService;

  @httpPost('/register')
  async create(req: express.Request, res: express.Response, next: express.NextFunction): Promise<BasicResponse> {
    const user = req.body;
    await this.registrationService.create(user);

    return new BasicResponse()
      .withSuccessMessage('Your account has been created');
  }
}
