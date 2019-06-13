import * as bcrypt from "bcrypt-nodejs";
import { injectable } from 'inversify';
import { Password, Role, User, UserAlias } from "../model/index";
import { RegistrationError } from "../model/error/RegistrationError";
import { RoleEnum } from "../model/enum/RoleEnum";

@injectable()
export class RegistrationService {

  async create(params: any): Promise<void> {
    if (params.password.password != params.password.passwordAgain) {
      throw new RegistrationError("Password parity check failed. The given passwords are not matched.");
    }

    const userWithSameUsername = await UserAlias.findOne<UserAlias>({where: {username: params.user.username}});

    if (userWithSameUsername) {
      throw new RegistrationError('Username is already used!');
    }

    const role = await Role._findOne<Role>({where: {name: RoleEnum.AUTHOR}});
    await User.create({
      roleId: role.id,
      title: params.user.title,
      firstName: params.user.firstName,
      lastName: params.user.lastName,
      email: params.user.email
    }).then(async (user: User) => {
      await user.setAcademicDisciplines(params.academicDisciplines.map(item => item.id));
      await UserAlias.create({userId: user.id, username: params.user.username});

      const salt = bcrypt.genSaltSync();
      await Password.create({password: bcrypt.hashSync(params.password.password, salt), salt: salt, userId: user.id});
    });
  }
}
