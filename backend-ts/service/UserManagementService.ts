import { inject, injectable } from 'inversify';
import { AddUserCommand } from '../model/command/AddUserCommand';
import { PasswordService } from './PasswordService';
import { RoleEnum } from '../model/enum/RoleEnum';
import { RoleRepository } from '../repository/RoleRepository';
import { User } from '../model';
import { UserAliasRepository } from '../repository/UserAliasRepository';
import { UserManagementDto } from '../model/dto/UserManagementDto';
import { UserRepository } from '../repository/UserRepository';

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

  async getUsers(): Promise<UserManagementDto[]> {
    const users = await this.userRepository.findUsers();
    return users.map(user => new UserManagementDto(user));
  }

  changeUserStatus(userId: number, statusId: number) {
    return this.userRepository.changeUserStatusById(userId, statusId);
  }

  async createUser(command: AddUserCommand): Promise<User> {
    const role = await this.roleRepository._findOne({where: {name: RoleEnum.AUTHOR}});
    const user = await this.userRepository.create({
      roleId: role.id,
      title: command.title,
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email
    });
    await user.setAcademicDisciplines(command.academicDisciplines);
    await user.save();

    await this.userAliasRepository.create({
      userId: user.id,
      username: command.username
    });
    await this.passwordService.createPassword(user.id, command.password);

    return user;
  }
}
