import * as bcrypt from 'bcrypt-nodejs';
import { inject, injectable } from 'inversify';
import { AcademicDisciplineDto } from '../model/dto/AcademicDisciplineDto';
import { AuthorsAcademicDiscipline, User } from '../model';
import { AuthorsAcademicDisciplineRepository } from '../repository/AuthorsAcademicDisciplineRepository';
import { ChangePasswordCommand } from '../model/command/ChangePasswordCommand';
import { ChangePasswordError } from '../model/error/ChangePasswordError';
import { ImageResizer } from './ImageResizer';
import { PasswordRepository } from '../repository/PasswordRepository';
import { ProfilePreload } from '../model/dto/ProfilePreload';
import { SavePersonalDataCommand } from '../model/command/SavePersonalDataCommand';
import { UserRepository } from '../repository/UserRepository';

@injectable()
export class ProfileService {

  @inject(UserRepository.name)
  userRepository: UserRepository;

  @inject(PasswordRepository.name)
  passwordRepository: PasswordRepository;

  @inject(AuthorsAcademicDisciplineRepository.name)
  authorsAcademicDisciplineRepository: AuthorsAcademicDisciplineRepository;

  @inject(ImageResizer.name)
  imageResizer: ImageResizer;

  public async getPreload(userId): Promise<ProfilePreload> {
    return new ProfilePreload(await this.userRepository.findUserProfile(userId));
  }

  public async saveProfile(userId, savePersonalDataCommand: SavePersonalDataCommand): Promise<User> {
    return await this.userRepository.updateByPk(userId, {
      title: savePersonalDataCommand.title,
      firstName: savePersonalDataCommand.firstName,
      lastName: savePersonalDataCommand.lastName,
      job: savePersonalDataCommand.job,
      email: savePersonalDataCommand.email
    });
  }

  public async changePassword(userId: number, changePasswordCommand: ChangePasswordCommand): Promise<void> {
    if (changePasswordCommand.password.password != changePasswordCommand.password.passwordAgain) {
      throw new ChangePasswordError('The given passwords are not matched!');
    }

    const password = await this.passwordRepository._findOne({
      where: {
        userId: userId
      }
    });

    const isMatch = bcrypt.compareSync(changePasswordCommand.oldPassword, password.password);
    if (!isMatch) {
      throw new ChangePasswordError('Your password is wrong.');
    }

    const salt = bcrypt.genSaltSync();
    await this.passwordRepository.updateByPk(password.id, {password: bcrypt.hashSync(changePasswordCommand.password.password, salt), salt: salt});
  }

  public async updateAcademicDisciplines(userId: number, userAcademicDisciplines: Array<AcademicDisciplineDto>): Promise<void> {
    const oldAcademicDisciplines: AuthorsAcademicDiscipline[] = await AuthorsAcademicDiscipline.findAll({where: {userId: userId}});

    const userAcademicDisciplinesMap: Map<number, AcademicDisciplineDto> = new Map();
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

  uploadAvatar(userId: number, file: any) {
    const filename: string = process.env.AVATAR_FOLDER! + userId;
    this.imageResizer.resizeAvatar(file.buffer, filename)
      .then(async () => {
        console.log(filename);
        console.log('SUCCESS');
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
