import { injectable } from 'inversify';
import { Role, User, UserAlias, UserStatus } from '../model';
import { UserManagementDto } from '../model/dto/UserManagementDto';

@injectable()
export class UserManagementService {
  async getUsers(): Promise<UserManagementDto[]> {
    const users = await User._findAll<User>({
      attributes: ['id', 'firstName', 'lastName', 'email'],
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
