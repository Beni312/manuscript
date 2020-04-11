import { inject, injectable } from 'inversify';
import { PasswordRepository } from '../repository/PasswordRepository';
import { UserManagementDto } from '../model/dto/UserManagementDto';
import { UserRepository } from '../repository/UserRepository';

@injectable()
export class UserManagementService {

  @inject(UserRepository.name)
  userRepository: UserRepository;

  @inject(PasswordRepository.name)
  passwordRepository: PasswordRepository;

  async getUsers(): Promise<UserManagementDto[]> {
    const users = await this.userRepository.findUsers();
    return users.map(user => new UserManagementDto(user));
  }

  changeUserStatus(userId: number, statusId: number) {
    return this.userRepository.changeUserStatusById(userId, statusId);
  }

  // changePassword() {
  // }
}
