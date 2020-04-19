import * as bcrypt from 'bcrypt-nodejs';
import { inject, injectable } from 'inversify';
import { Password, User, UserAlias } from '../model';
import { RoleEnum } from '../model/enum/RoleEnum';
import { RoleRepository } from '../repository/RoleRepository';
import { PasswordService } from './PasswordService';
import { UserRepository } from '../repository/UserRepository';

@injectable()
export class RegistrationService {

  @inject(RoleRepository.name)
  private roleRepository: RoleRepository;

  @inject(UserRepository.name)
  private userRepository: UserRepository;

  @inject(PasswordService.name)
  private passwordService: PasswordService;

  async create(params: any): Promise<void> {
    const role = await this.roleRepository._findOne({where: {name: RoleEnum.AUTHOR}});
    const user = await User.create({
      roleId: role.id,
      title: params.user.title,
      firstName: params.user.firstName,
      lastName: params.user.lastName,
      email: params.user.email
    });
    await user.setAcademicDisciplines(params.academicDisciplines);
    await user.save();
    await UserAlias.create({userId: user.id, username: params.user.username});

    const salt = bcrypt.genSaltSync();
    await Password.create({password: bcrypt.hashSync(params.password.password, salt), salt: salt, userId: user.id});
  }
}
