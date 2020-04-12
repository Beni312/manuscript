import * as sequelize from 'sequelize';
import { Repository } from './Repository';
import { Manuscript } from '../model/entity/Manuscript';
import { injectable } from 'inversify';

@injectable()
export class ManuscriptRepository extends Repository<Manuscript> {

  constructor() {
    super(Manuscript);
  }

  createManuscript(userId: number, submissionId: number, filename: string, version: number): Promise<Manuscript> {
    return this.create({
      userId: userId,
      submissionId: submissionId,
      version: version
    })
  }

  async findLatestVersionForSubmission(submissionId: number): Promise<number> {
    const value: any = await this.model.findOne({
      where: {
        submissionId: submissionId
      },
      attributes: [[sequelize.fn('max', sequelize.col('version')),'max']]
    });

    return value.dataValues.max;
  }
}
