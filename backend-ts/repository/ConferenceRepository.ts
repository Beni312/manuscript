import { injectable } from 'inversify';
import { Conference, Submission, User } from '../model';
import { Repository } from './Repository';

@injectable()
export class ConferenceRepository extends Repository<Conference> {

  constructor() {
    super(Conference);
  }

  async findConferences(): Promise<Conference[]> {
    return this.findAll({
      include: [
        {
          model: User
        },
        {
          model: Submission,
          include: [
            {
              model: User,
              as: 'submitter'
            }
          ]
        }
      ]
    });
  }
}
