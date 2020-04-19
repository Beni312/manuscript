import { controller, httpGet, httpPost, httpPut, principal, requestBody } from 'inversify-express-utils';
import { inject } from 'inversify';
import { isAuthenticated } from '../decorator/IsAuthenticated';
import { validateBody } from '../decorator/ValidateBody';
import { BasicResponse } from '../model/dto/BasicResponse';
import { ConferenceDto } from '../model/dto/ConferenceDto';
import { ConferenceService } from '../service/ConferenceService';
import { CreateConferenceCommand } from '../model/command/CreateConferenceCommand';
import { EditConferenceCommand } from '../model/command/EditConferenceCommand';
import { Principal } from '../model/Principal';

@controller('/conference')
export class ConferenceController {

  @inject(ConferenceService.name)
  private conferenceService: ConferenceService;

  @isAuthenticated()
  @httpGet('/')
  getConferences(@principal() userPrincipal: Principal): Promise<ConferenceDto[]> {
    return this.conferenceService.findConferences();
  }

  @isAuthenticated()
  @httpPut('/')
  @validateBody(CreateConferenceCommand)
  async createConference(@principal() userPrincipal: Principal, @requestBody() createConferenceCommand: CreateConferenceCommand): Promise<BasicResponse> {
    await this.conferenceService.createConference(userPrincipal.details.id, createConferenceCommand);

    return new BasicResponse()
      .withSuccessMessage('Conference created!');
  }

  @isAuthenticated()
  @httpPost('/edit')
  @validateBody(EditConferenceCommand)
  async editConference(@principal() userPrincipal: Principal, command: EditConferenceCommand): Promise<BasicResponse> {
    await this.conferenceService.editConference(command);

    return new BasicResponse()
      .withSuccessMessage('Conference successfully edited!');
  }
}
