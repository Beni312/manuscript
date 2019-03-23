import * as bcrypt from "bcrypt-nodejs";
import { AcademicDiscipline, AuthorsAcademicDiscipline, Password, User, UserAlias } from "../model/index";
import { ChangePasswordError } from "../model/error/ChangePasswordError";
import { Model } from "sequelize-typescript";
import { ProfilePreload } from "../model/dto/ProfilePreload";

export class ProfileService {

  public async getPreload(userId): Promise<ProfilePreload> {
    return new ProfilePreload(await User._findByPk<User>(userId, {
      include: [
        {
          model: AcademicDiscipline,
          attributes: ['id', 'name'],
          through: {attributes: []}
        },
        {
          model: UserAlias,
          attributes: ['username']
        }
      ]
    }));
  }

  public async saveProfile(userId, params): Promise<Model<User>> {
    return await User._updateByPk<User>(userId, {
      title: params.user.title,
      firstName: params.user.firstName,
      lastName: params.user.lastName,
      job: params.user.job,
      email: params.user.email
    });
  }

  public async changePassword(userId, params): Promise<void> {
    if (params.password.password != params.password.passwordAgain) {
      throw new ChangePasswordError("The given passwords are not matched!");
    }

    const password = await Password._findOne<Password>({
      where: {
        userId: userId
      }
    });

    let isMatch = bcrypt.compareSync(params.oldPassword, password.password);
    if (!isMatch) {
      throw new ChangePasswordError("Your password is wrong.");
    }

    const salt = bcrypt.genSaltSync();
    await Password._updateByPk(password.id, {password: bcrypt.hashSync(params.password.password, salt), salt: salt});
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
        console.log("destroy");
        console.log({userId: userId, academicDisciplineId: oldAcademicDisciplines[i].academicDisciplineId});
        await AuthorsAcademicDiscipline._deleteByOptions<AuthorsAcademicDiscipline>({
          where: {
            userId: userId,
            academicDisciplineId: oldAcademicDisciplines[i].academicDisciplineId
          }
        });
      }
    }
    for (let i = 0; i < userAcademicDisciplines.length; i++) {
      if (!oldAcademicDisciplinesMap.get(userAcademicDisciplines[i].id)) {
        console.log("create");
        console.log({userId: userId, academicDisciplineId: userAcademicDisciplines[i].id});
        await AuthorsAcademicDiscipline.create({userId: userId, academicDisciplineId: userAcademicDisciplines[i].id});
      }
    }
  }
}
