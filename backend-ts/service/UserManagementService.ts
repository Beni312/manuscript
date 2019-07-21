import { inject, injectable } from 'inversify';
import { Role, UserAlias, UserStatus } from '../model';
import { UserManagementDto } from '../model/dto/UserManagementDto';
import { UserRepository } from '../repository/UserRepository';

@injectable()
export class UserManagementService {

  @inject(UserRepository.name)
  userRepository: UserRepository;

  async getUsers(): Promise<UserManagementDto[]> {
    const users = await this.userRepository._findAll({
      include: [
        {
          model: UserAlias
        },
        {
          model: Role
        },
        {
          model: UserStatus
        }
      ]
    });
    return users.map(user => new UserManagementDto(user));
  }
}
