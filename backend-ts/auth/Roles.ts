import { RoleEnum } from "../model/enum/RoleEnum";
import { AuthError } from "../error/AuthError";

const ConnectRoles = require('connect-roles');

export class Roles {

  public static connectRoles;

  public static middleware() {
    return Roles.connectRoles.middleware();
  }

  public static is(role: RoleEnum) {
    return Roles.connectRoles.is(role.toString());
  }

  public static buildRoles() {
    Roles.connectRoles = new ConnectRoles({
      failureHandler: function (req, res, action) {
        const error = new AuthError('Access Denied - You don\'t have permission to: ' + action);
        res.status(403).json(error);
      },
      async: true
    });

    Roles.connectRoles.use(RoleEnum.ADMIN, function (req) {
      if (req.user.role.toUpperCase() === 'ADMIN') {
        return true;
      }
    });
  }
}
