import { IFindOptions, Model } from 'sequelize-typescript';
import { AcademicDiscipline, Conference, Keyword, Role, Submission, User } from '../model/index';
import { SubmissionPreload } from '../model/dto/SubmissionPreload';
import { SubmissionStatus } from '../model/enum/SubmissionStatus';
import { RoleEnum } from '../model/enum/RoleEnum';
import { SubmissionMessage } from '../model/entity/SubmissionMessage';

export class SubmissionService {

  public async findUserSubmissions(userId) {
    const options: IFindOptions<Submission> = {
      include: [
        {
          model: User
        }
      ]
    };
    // this.submissionRepository.findSubmissions()
  }

  async create(userId, submission) {
    await Submission.create({
      title: submission.title,
      manuscriptAbstract: submission.manuscriptAbstract,
      submitterId: userId,
      conferenceId: submission.conferenceId
    });
  }

  async preload(userId, role): Promise<SubmissionPreload> {
    const submissionOptions: any = {
      include: [
        {
          model: AcademicDiscipline,
          attributes: ['id', 'name'],
          through: {attributes: []}
        },
        {
          model: User,
          as: 'authors',
          attributes: ['id', 'email', 'firstName', 'lastName'],
          through: {attributes: []}
        },
        {
          model: User,
          as: 'submitter',
          attributes: ['id', 'email', 'firstName', 'lastName']
        },
        {
          model: Keyword
        }
      ]
    };
    const conferenceOptions: any = {attributes: ['id', 'title']};

    if (role !== 'ADMIN') {
      const submitter: any = submissionOptions.include[1];
      submitter.through = {attributes: [], where: {authorId: userId}};
      submissionOptions.include[1] = submitter;
    }

    const submissions: Submission[] = await Submission.findAll(submissionOptions);
    const submissionIds: number[] = submissions.map(item => item.id);

    if (role !== 'ADMIN') {
      conferenceOptions.include = [{model: Submission, where: {id: submissionIds}}];
    }

    const conferenceIdNamePairs = await Conference.findAll(conferenceOptions);
    const academicDisciplines = await AcademicDiscipline._findAll<AcademicDiscipline>();
    return new SubmissionPreload(submissions, conferenceIdNamePairs, academicDisciplines);
  }

  async getAuthors() {
    return await User._findAll<User>({
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

  async remove(submissionId): Promise<void> {
    await Submission._deleteByPk<Submission>(submissionId);
  }

  async editSubmission(submission) {
    console.log(submission);
    return await Submission._updateByPk<Submission>(submission.id, {
      title: submission.title
    });
    // return await Submission.findByPk(submission.id).then(s => {
    //   if (!s) {
    //     return;
    //   }
    //   s.title = submission.title;
    //   s.save();
    // });
  }

  async evaluateSubmission(evaluation, userId, userRole): Promise<void> {
    let result: SubmissionStatus;
    switch (userRole) {
      case RoleEnum.REVIEWER:
        evaluation.result ? result = SubmissionStatus.ACCEPTED_BY_REVIEWER : result = SubmissionStatus.REJECTED_BY_REVIEWER;
        break;
      case RoleEnum.EDITOR:
        evaluation.result ? result = SubmissionStatus.ACCEPTED_BY_EDITOR : result = SubmissionStatus.REJECTED_BY_EDITOR;
    }
    await SubmissionMessage.create({
      message: evaluation.message,
      type: evaluation.type,
      submissionId: evaluation.submissionId,
      sender: userId
    });
    return await Submission._findByPk(evaluation.submissionId).then((submission: Submission) => {
      submission.status = result;
      console.log(result);
      submission.save();
    }).catch(error => {
      console.log(error);
    });
  }

  async submitSubmission(submissionId): Promise<Model<Submission>> {
    return await Submission._updateByPk<Submission>(submissionId, {status: SubmissionStatus.SUBMITTED});
  }
}
