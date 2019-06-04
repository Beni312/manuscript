import { AcademicDiscipline, Conference, Keyword, Role, Submission, User } from '../model/index';
import { ApplicationService } from './ApplicationService';
import { AuthorDto } from '../model/dto/AuthorDto';
import { IFindOptions, Model } from 'sequelize-typescript';
import { MessageType } from '../model/enum/MessageType';
import { RoleEnum } from '../model/enum/RoleEnum';
import { SubmissionMessage } from '../model/entity/SubmissionMessage';
import { SubmissionPreload } from '../model/dto/SubmissionPreload';
import { SubmissionStatus } from '../model/enum/SubmissionStatus';
import { UpsertSubmissionPreload } from '../model/dto/UpsertSubmissionPreload';

export class SubmissionService {

  applicationService: ApplicationService;

  constructor() {
    this.applicationService = new ApplicationService();
  }

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

    if (role.toUpperCase() !== RoleEnum.ADMIN) {
      const submitter: any = submissionOptions.include[1];
      submitter.through = {attributes: [], where: {authorId: userId}};
      submissionOptions.include[1] = submitter;
    }

    const submissions: Submission[] = await Submission.findAll(submissionOptions);
    const submissionIds: number[] = submissions.map(item => item.id);

    if (role !== RoleEnum.ADMIN) {
      conferenceOptions.include = [{model: Submission, where: {id: submissionIds}}];
    }

    const conferenceIdNamePairs = await Conference.findAll(conferenceOptions);
    return new SubmissionPreload(submissions, conferenceIdNamePairs);
  }

  async getAuthors(): Promise<AuthorDto[]> {
    const users: User[] = await User._findAll<User>({
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

    return users.map(user => new AuthorDto(user));
  }

  async remove(submissionId): Promise<void> {
    await Submission._deleteByPk<Submission>(submissionId);
  }

  async editSubmission(submission): Promise<void> {
    const currentKeywordsMap: Map<string, Keyword> = new Map();
    const toAddKeywordsMap: Map<string, Keyword> = new Map();
    const toAddKeywords: string[] = [];
    const toDeleteKeywords: string[] = [];

    const currentKeywords = await Keyword.findAll({where: {submissionId: submission.id}});
    currentKeywords.forEach(item => {
      currentKeywordsMap.set(item.keyword, item);
    });

    submission.keywords.forEach(item => {
      toAddKeywordsMap.set(item.keyword, item);
      if (!currentKeywordsMap.has(item.keyword)) {
        toAddKeywords.push(item.keyword);
      }
    });
    currentKeywords.forEach(item => {
      if (!toAddKeywordsMap.has(item.keyword)) {
        toDeleteKeywords.push(item.keyword);
      }
    });

    for (let i = 0; i < toDeleteKeywords.length; i++) {
      await Keyword._deleteByOptions<Keyword>({
        where: {
          submissionId: submission.id,
          keyword: toDeleteKeywords[i]
        }
      });
    }

    for (let i = 0; i < toAddKeywords.length; i++) {
      await Keyword.create({submissionId: submission.id, keyword: toAddKeywords[i]});
    }

    await Submission.findByPk(submission.id).then((s: Submission) => {
      s.title = submission.title;
      s.manuscriptAbstract = submission.manuscriptAbstract;
      s.setAuthors(submission.authors.map(item => item.id));
      s.setAcademicDisciplines(submission.academicDisciplines.map(item => item.id));
      s.save();
    });
  }

  async evaluateSubmission(evaluation, userId, userRole): Promise<void> {
    let result: SubmissionStatus;
    let type;
    if (!evaluation.result) {
      type = MessageType.ERROR;
    } else if (evaluation.message && evaluation.message.length > 0) {
      type = MessageType.INFO;
    }

    switch (userRole) {
      case RoleEnum.REVIEWER: evaluation.result.success ? result = SubmissionStatus.ACCEPTED_BY_REVIEWER: result = SubmissionStatus.REJECTED_BY_REVIEWER; break;
      case RoleEnum.EDITOR: evaluation.result.success ? result = SubmissionStatus.ACCEPTED_BY_EDITOR: result = SubmissionStatus.REJECTED_BY_EDITOR; break;
      case RoleEnum.ADMIN: evaluation.result.success ? result = SubmissionStatus.ACCEPTED: result = SubmissionStatus.REJECTED_BY_ADMIN; break;
    }

    if (type) {
      await SubmissionMessage.create({
        message: evaluation.message,
        type: type,
        submissionId: evaluation.submissionId,
        sender: userId
      });
    }
    return await Submission.findByPk(evaluation.submissionId).then((submission: Submission) => {
      submission.status = result;
      submission.save();
    }).catch(error => {
      console.log(error);
    });
  }

  async getUpsertSubmissionPreload() {
    return new UpsertSubmissionPreload(await this.applicationService.getAcademicDisciplines(), await this.getAuthors());
  }

  async submitSubmission(submissionId): Promise<Model<Submission>> {
    return await Submission._updateByPk<Submission>(submissionId, {status: SubmissionStatus.SUBMITTED});
  }
}
