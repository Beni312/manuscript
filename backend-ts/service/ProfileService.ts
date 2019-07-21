import * as bcrypt from 'bcrypt-nodejs';
import { AcademicDiscipline, AuthorsAcademicDiscipline, User } from '../model';
import { AuthorsAcademicDisciplineRepository } from '../repository/AuthorsAcademicDisciplineRepository';
import { ChangePasswordError } from '../model/error/ChangePasswordError';
import { inject, injectable } from 'inversify';
import { PasswordRepository } from '../repository/PasswordRepository';
import { ProfilePreload } from '../model/dto/ProfilePreload';
import { UserRepository } from '../repository/UserRepository';

@injectable()
export class ProfileService {

  @inject(UserRepository.name)
  userRepository: UserRepository;

  @inject(PasswordRepository.name)
  passwordRepository: PasswordRepository;

  @inject(AuthorsAcademicDisciplineRepository.name)
  authorsAcademicDisciplineRepository: AuthorsAcademicDisciplineRepository;

  public async getPreload(userId): Promise<ProfilePreload> {
    return new ProfilePreload(await this.userRepository.findUserProfile(userId));
  }

  public async saveProfile(userId, params): Promise<User> {
    return await this.userRepository.updateByPk(userId, {
      title: params.user.title,
      firstName: params.user.firstName,
      lastName: params.user.lastName,
      job: params.user.job,
      email: params.user.email
    });
  }

  public async changePassword(userId, params): Promise<void> {
    if (params.password.password != params.password.passwordAgain) {
      throw new ChangePasswordError('The given passwords are not matched!');
    }

    const password = await this.passwordRepository._findOne({
      where: {
        userId: userId
      }
    });

    const isMatch = bcrypt.compareSync(params.oldPassword, password.password);
    if (!isMatch) {
      throw new ChangePasswordError('Your password is wrong.');
    }

    const salt = bcrypt.genSaltSync();
    await this.passwordRepository.updateByPk(password.id, {password: bcrypt.hashSync(params.password.password, salt), salt: salt});
  }

  public async updateAcademicDisciplines(userId: number, userAcademicDisciplines: Array<AcademicDiscipline>): Promise<void> {
    const oldAcademicDisciplines: AuthorsAcademicDiscipline[] = await AuthorsAcademicDiscipline.findAll({where: {userId: userId}});

    const userAcademicDisciplinesMap: Map<number, AcademicDiscipline> = new Map();
    const oldAcademicDisciplinesMap: Map<number, AuthorsAcademicDiscipline> = new Map();
    userAcademicDisciplines.forEach(item => {
      userAcademicDisciplinesMap.set(item.id, item);
    });
    oldAcademicDisciplines.forEach(item => {
      oldAcademicDisciplinesMap.set(item.academicDisciplineId, item);
    });

    for (let i = 0; i < oldAcademicDisciplines.length; i++) {
      if (!userAcademicDisciplinesMap.get(oldAcademicDisciplines[i].academicDisciplineId)) {
        await this.authorsAcademicDisciplineRepository.deleteByOptions<AuthorsAcademicDiscipline>({
          where: {
            userId: userId,
            academicDisciplineId: oldAcademicDisciplines[i].academicDisciplineId
          }
        });
      }
    }
    for (let i = 0; i < userAcademicDisciplines.length; i++) {
      if (!oldAcademicDisciplinesMap.get(userAcademicDisciplines[i].id)) {
        await AuthorsAcademicDiscipline.create({userId: userId, academicDisciplineId: userAcademicDisciplines[i].id});
      }
    }
  }
}
