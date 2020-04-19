import { inject } from 'inversify';
import { isAuthenticated } from '../decorator/IsAuthenticated';
import { BaseHttpController, controller, httpGet, interfaces, principal } from 'inversify-express-utils';
import { MessageService } from '../service/MessageService';
import { Principal } from '../model/Principal';

@controller('/message')
export class MessageController extends BaseHttpController implements interfaces.Controller {

  @inject(MessageService.name)
  private messageService: MessageService;

  @isAuthenticated()
  @httpGet('/')
  findUserMessages(@principal() userPrincipal: Principal) {
    return this.messageService.findUserMessages(userPrincipal.details.id);
  }
}
