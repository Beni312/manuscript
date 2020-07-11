import { inject, injectable } from 'inversify';
import { AuthorDto } from '../model/dto/AuthorDto';
import { UserRepository } from '../repository/UserRepository';

@injectable()
export class UserService {

  @inject(UserRepository.name)
  private userRepository: UserRepository;

  async getAuthors(): Promise<Array<AuthorDto>> {
    return (await this.userRepository.findAuthors())
      .map(user => new AuthorDto(user)
      );
  }
}
