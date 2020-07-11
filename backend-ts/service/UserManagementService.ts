import { inject, injectable } from 'inversify';
import { PasswordService } from './PasswordService';
import { RoleEnum } from '../model/enum/RoleEnum';
import { RoleRepository } from '../repository/RoleRepository';
import { User } from '../model';
import { UserAliasRepository } from '../repository/UserAliasRepository';
import { UserManagementDto } from '../model/response/UserManagementDto';
import { UserRepository } from '../repository/UserRepository';
import { RegistrationCommand } from '../model/command/RegistrationCommand';
import { LoginRepository } from '../repository/LoginRepository';

@injectable()
export class UserManagementService {

  @inject(UserRepository.name)
  private userRepository: UserRepository;

  @inject(PasswordService.name)
  private passwordService: PasswordService;

  @inject(RoleRepository.name)
  private roleRepository: RoleRepository;

  @inject(UserAliasRepository.name)
  private userAliasRepository: UserAliasRepository;

  @inject(LoginRepository.name)
  private loginRepository: LoginRepository;

  async getUsers(): Promise<UserManagementDto[]> {
    const users = await this.userRepository.findUsers();
    return users.map(user => new UserManagementDto(user));
  }

  changeUserStatus(userId: number, statusId: number) {
    return this.userRepository.changeUserStatusById(userId, statusId);
  }

  async createUser(command: RegistrationCommand): Promise<User> {
    const role = await this.roleRepository._findOne({where: {name: RoleEnum.AUTHOR}});
    const user: User = await this.userRepository.create({
      roleId: role.id,
      title: command.user.title,
      firstName: command.user.firstName,
      lastName: command.user.lastName,
      email: command.user.email,
      statusId: 1
    });
    await user.setAcademicDisciplines(command.academicDisciplines);
    await user.save();

    await this.userAliasRepository.create({
      userId: user.id,
      username: command.user.username
    });
    const password = await this.passwordService.createPassword(user.id, command.password.password);

    await this.loginRepository.create({
      username: command.user.username,
      passwordId: password.id
    });

    return this.userRepository.findUserById(user.id);
  }
}
