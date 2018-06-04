import { UserService } from '../../../services/user.service';

export class PermissionHandler {

  hasPermission(roles: string[]): boolean {
    if (!UserService.isLogined()) {
      return false;
    }

    if (roles.includes(UserService.getPreload().role.toUpperCase())) {
      return true;
    }
    return false;
  }
}
