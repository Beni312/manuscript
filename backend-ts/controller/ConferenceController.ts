import { BaseHttpController, controller, httpGet, httpPost, httpPut, interfaces, principal } from 'inversify-express-utils';
import { ConferenceService } from '../service/ConferenceService';
import { ConferenceDto } from '../model/dto/ConferenceDto';
import { inject } from 'inversify';
import { isAuthenticated } from '../decorator/IsAuthenticated';
import { Principal } from '../model/Principal';

@controller('/conference')
export class ConferenceController extends BaseHttpController implements interfaces.Controller {

  @inject(ConferenceService.name)
  conferenceService: ConferenceService;

  @isAuthenticated()
  @httpGet('/')
  getConferences(@principal() userPrincipal: Principal): Promise<ConferenceDto[]> {
    return this.conferenceService.findConferences();
  }

  @httpPut('/')
  async addConference() {

  }

  @httpPost('/edit')
  async editConference() {

  }
}
