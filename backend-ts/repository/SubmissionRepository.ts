import { injectable } from 'inversify';
import { Repository } from './Repository';
import { Submission } from '../model';
import { SubmissionStatus } from '../model/enum/SubmissionStatus';

@injectable()
export class SubmissionRepository extends Repository<Submission> {

  constructor() {
    super(Submission);
  }

  async updateSubmissionStatus(submissionId: number, status: SubmissionStatus): Promise<Submission> {
    return await this.updateByPk(submissionId, {status: status});
  }

  async modifySubmission(submissionId: number, title: string, manuscriptAbstract: string, authors: number[], academicDisciplines: number[]): Promise<Submission> {
    const submission = await this._findByPk(submissionId);
    submission.title = title;
    submission.manuscriptAbstract = manuscriptAbstract;
    await submission.setAuthors(authors);
    await submission.setAcademicDisciplines(academicDisciplines);
    return submission.save();
  }
}
