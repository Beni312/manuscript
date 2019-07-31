import { inject, injectable } from 'inversify';
import { UserManagementDto } from '../model/dto/UserManagementDto';
import { UserRepository } from '../repository/UserRepository';

@injectable()
export class UserManagementService {

  @inject(UserRepository.name)
  userRepository: UserRepository;

  async getUsers(): Promise<UserManagementDto[]> {
    const users = await this.userRepository.findUsers();
    return users.map(user => new UserManagementDto(user));
  }
}
