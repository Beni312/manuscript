import { UserService } from '../../../services/user.service';

export class PermissionHandler {

  public hasPermission(roles: string[]): boolean {
    if (!UserService.isLogined() || !roles.includes((UserService.getPreload().role.toUpperCase()))) {
      return false;
    }

    return true;
  }
}
