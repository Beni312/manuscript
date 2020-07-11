import { controller, httpGet, principal } from 'inversify-express-utils';
import { isAuthenticated } from '../decorator/IsAuthenticated';
import { inject } from 'inversify';
import { AuthorDto } from '../model/dto/AuthorDto';
import { Principal } from '../model/Principal';
import { UserService } from '../service/UserService';

@controller('/user')
export class UserController {

  @inject(UserService.name)
  private userService: UserService;

  @isAuthenticated()
  @httpGet('/authors')
  async preload(@principal() userPrincipal: Principal): Promise<Array<AuthorDto>> {
    return this.userService.getAuthors();
  }
}
