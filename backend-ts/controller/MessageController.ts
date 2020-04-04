import { BaseHttpController, controller, httpGet, interfaces, principal } from 'inversify-express-utils';
import { MessageService } from '../service/MessageService';
import { isAuthenticated } from '../decorator/IsAuthenticated';
import { Principal } from '../model/Principal';
import { inject } from 'inversify';

@controller('/message')
export class MessageController extends BaseHttpController implements interfaces.Controller {

  @inject(MessageService.name)
  messageService: MessageService;

  @isAuthenticated()
  @httpGet('/')
  findUserMessages(@principal() userPrincipal: Principal) {
    return this.messageService.findUserMessages(userPrincipal.details.id);
  }
}
