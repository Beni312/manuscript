import { injectable } from 'inversify';
import { Repository } from './Repository';
import { AcademicDiscipline, Role, User, UserAlias, UserStatus } from '../model';
import { RoleEnum } from '../model/enum/RoleEnum';
import { Op } from 'sequelize';

@injectable()
export class UserRepository extends Repository<User> {

  constructor() {
    super(User);
  }

  async findAuthors(): Promise<User[]> {
    return await this.findAll({
      attributes: ['id', 'email', 'firstName', 'lastName'],
      include: [
        {
          model: Role,
          where: {
            name: RoleEnum.AUTHOR
          }
        }
      ]
    });
  }

  async findUserProfile(userId: number): Promise<User> {
    return await this._findByPk(userId, {
      include: [
        {
          model: AcademicDiscipline,
          attributes: ['id', 'name'],
          through: {attributes: []},
          order: [
            ['name', 'ASC']
          ]
        },
        {
          model: UserAlias,
          attributes: ['username']
        }
      ]
    });
  }

  async findUsers(): Promise<User[]> {
    return await this._findAll({
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
  }

  findUsersByIds(userIds: number[]): Promise<User[]> {
    return this.findAll({
      where: {
        // [Op.in]: {
        //   id: userIds
        // }
        id: {
          [Op.in]: userIds
        }
      }
    });
  }
}
