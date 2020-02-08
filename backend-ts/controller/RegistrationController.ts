import { BasicResponse } from '../model/dto/BasicResponse';
import { controller, httpPost, interfaces, requestBody } from 'inversify-express-utils';
import { inject } from 'inversify';
import { RegistrationService } from '../service/RegistrationService';
import { RegistrationCommand } from '../model/command/RegistrationCommand';
import { validateBody } from '../decorator/ValidateBody';

@controller('')
export class RegistrationController implements interfaces.Controller{

  @inject(RegistrationService.name)
  registrationService: RegistrationService;

  @httpPost('/register')
  @validateBody(RegistrationCommand)
  async create(@requestBody() registrationCommand: RegistrationCommand): Promise<BasicResponse> {
    await this.registrationService.create(registrationCommand);

    return new BasicResponse()
      .withSuccessMessage('Your account has been created');
  }
}
