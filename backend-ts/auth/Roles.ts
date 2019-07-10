import { RoleEnum } from '../model/enum/RoleEnum';

export class Roles {

  public static isAdmin(role): boolean {
    if (role == RoleEnum.ADMIN) {
      return true;
    }
    return false;
  }
}
