import { inject, injectable } from 'inversify';
import { logger } from './logger';
import { AcademicDisciplineDto } from '../model/dto/AcademicDisciplineDto';
import { AuthorsAcademicDiscipline, Password, User } from '../model';
import { AuthorsAcademicDisciplineRepository } from '../repository/AuthorsAcademicDisciplineRepository';
import { ChangePasswordCommand } from '../model/command/ChangePasswordCommand';
import { ImageResizer } from './ImageResizer';
import { InternalServerError } from '../model/error/InternalServerError';
import { PasswordRepository } from '../repository/PasswordRepository';
import { PasswordService } from './PasswordService';
import { SavePersonalDataCommand } from '../model/command/SavePersonalDataCommand';
import { UserInfo } from '../model/dto/UserInfo';
import { UserRepository } from '../repository/UserRepository';
import { UserDto } from '../model/dto/UserDto';

@injectable()
export class ProfileService {

  @inject(UserRepository.name)
  private userRepository: UserRepository;

  @inject(PasswordRepository.name)
  private passwordRepository: PasswordRepository;

  @inject(AuthorsAcademicDisciplineRepository.name)
  private authorsAcademicDisciplineRepository: AuthorsAcademicDisciplineRepository;

  @inject(ImageResizer.name)
  private imageResizer: ImageResizer;

  @inject(PasswordService.name)
  private passwordService: PasswordService;

  public async getPreload(userId): Promise<UserDto> {
    return new UserDto(await this.userRepository.findUserProfile(userId), true);
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

  public async changePassword(userId: number, changePasswordCommand: ChangePasswordCommand): Promise<Password> {
    return this.passwordService.modifyPassword(userId, changePasswordCommand.password.password);
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

  async uploadAvatar(user: UserInfo, file: any): Promise<void> {
    const filenameWithPath: string = process.env.AVATAR_FOLDER! + user.id;
    try {
      await this.imageResizer.resizeAvatar(file.buffer, filenameWithPath);
      if (!user.avatar) {
        await this.userRepository.updateAvatar(user.id);
      }
    } catch(err) {
      logger.error(err);
      throw new InternalServerError(err);
    }
  }
}
