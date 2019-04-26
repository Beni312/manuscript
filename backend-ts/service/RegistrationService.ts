import { RoleEnum } from "../model/enum/RoleEnum";
import { Password, Role, User, UserAlias } from "../model/index";
import { RegistrationError } from "../model/error/RegistrationError";
import * as bcrypt from "bcrypt-nodejs";

export class RegistrationService {

  async create(params: any): Promise<User> {
    if (params.password.password != params.password.passwordAgain) {
      throw new RegistrationError("Password parity check failed. The given passwords are not matched.");
    }

    const userWithSameUsername = await UserAlias.findOne<UserAlias>({where: {username: params.user.username}});

    if (userWithSameUsername) {
      throw new RegistrationError('Username is already used!');
    }

    const role = await Role._findOne<Role>({where: {name: RoleEnum.AUTHOR}});
    const user: User  = await User.create({
      roleId: role.id,
      title: params.user.title,
      firstName: params.user.firstName,
      lastName: params.user.lastName,
      email: params.user.email,
      academicDisciplines: params.user.academicDisciplines
    });

    await UserAlias.create({userId: user.id, username: params.user.username});

    const salt = bcrypt.genSaltSync();
    await Password.create({password: bcrypt.hashSync(params.password.password, salt), salt: salt});

    return user;
  }

}
