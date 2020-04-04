import { injectable } from 'inversify';
import { AcademicDiscipline, Conference, Submission, User, UserAlias } from '../model';
import { Repository } from './Repository';

@injectable()
export class ConferenceRepository extends Repository<Conference> {

  constructor() {
    super(Conference);
  }

  findConferences(): Promise<Conference[]> {
    return this.findAll({
      include: [
        {
          model: AcademicDiscipline,
          through: {attributes: []}
        },
        {
          model: User,
          include: [
            {
              model: UserAlias
            }
          ]
        },
        {
          model: Submission,
          include: [
            {
              model: User,
              as: 'submitter',
              include: [
                {
                  model: UserAlias
                }
              ]
            }
          ]
        }
      ]
    });
  }
}
