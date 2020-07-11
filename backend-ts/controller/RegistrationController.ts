import { controller, httpPost, interfaces, requestBody } from 'inversify-express-utils';
import { inject } from 'inversify';
import { validateBody } from '../decorator/ValidateBody';
import { BasicResponse } from '../model/response/BasicResponse';
import { RegistrationCommand } from '../model/command/RegistrationCommand';
import { RegistrationCommandValidator } from '../validator/RegistrationCommandValidator';
import { RegistrationService } from '../service/RegistrationService';

@controller('')
export class RegistrationController implements interfaces.Controller{

  @inject(RegistrationService.name)
  private registrationService: RegistrationService;

  @httpPost('/register', RegistrationCommandValidator.name)
  @validateBody(RegistrationCommand)
  async create(@requestBody() registrationCommand: RegistrationCommand): Promise<BasicResponse> {
    await this.registrationService.create(registrationCommand);

    return new BasicResponse()
      .withSuccessMessage('Your account has been created');
  }
}
