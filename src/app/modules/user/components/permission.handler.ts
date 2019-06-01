import { UserService } from '../../../services/user.service';

export class PermissionHandler {

  protected hasPermission(roles: string[]): boolean {
    if (!UserService.isLogined() || !roles.includes((UserService.getPreload().role.toUpperCase()))) {
      return false;
    }

    return true;
  }
}
