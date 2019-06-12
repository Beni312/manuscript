import { AcademicDiscipline, AuthorsSubmission, Conference, Keyword, Role, Submission, User, UserAlias } from '../model/index';
import { ApplicationService } from './ApplicationService';
import { AuthorDto } from '../model/dto/AuthorDto';
import { MessageType } from '../model/enum/MessageType';
import { RoleEnum } from '../model/enum/RoleEnum';
import { SubmissionDto } from '../model/dto/SubmissionDto';
import { SubmissionMessage } from '../model/entity/SubmissionMessage';
import { SubmissionPreload } from '../model/dto/SubmissionPreload';
import { SubmissionStatus } from '../model/enum/SubmissionStatus';
import { UpsertSubmissionPreload } from '../model/dto/UpsertSubmissionPreload';

export class SubmissionService {

  applicationService: ApplicationService;
  editableSubmissionStatuses = [
    SubmissionStatus.CREATED,
    SubmissionStatus.REJECTED_BY_EDITOR,
    SubmissionStatus.REJECTED_BY_REVIEWER,
    SubmissionStatus.REJECTED_BY_ADMIN
  ];

  constructor() {
    this.applicationService = new ApplicationService();
  }

  async preload(user, role): Promise<SubmissionPreload> {
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
          through: {attributes: []},
          include: [
            {
              model: UserAlias
            }
          ]
        },
        {
          model: User,
          as: 'submitter',
          attributes: ['id', 'email', 'firstName', 'lastName']
        },
        {
          model: Keyword
        }
      ],
      order: [
        ['title', 'ASC'],
        ['academicDisciplines', 'name', 'ASC'],
        ['authors', 'firstName', 'ASC'],
        ['authors', 'lastName', 'ASC']
      ]
    };
    const conferenceOptions: any = {attributes: ['id', 'title']};

    if (role.toUpperCase() == RoleEnum.AUTHOR) {
      const filter = {
        model: AuthorsSubmission,
        where: {
          authorId: user.userId
        }
      };
      submissionOptions.include.push(filter);
    }

    const submissions: Submission[] = await Submission.findAll(submissionOptions);
    const submissionIds: number[] = submissions.map(item => item.id);

    if (role !== RoleEnum.ADMIN) {
      conferenceOptions.include = [{model: Submission, where: {id: submissionIds}}];
    }

    const conferenceIdNamePairs = await Conference.findAll(conferenceOptions);
    return new SubmissionPreload(
      submissions.map(item =>
        new SubmissionDto(
          item,
          this.hasPermissionToDelete(user, item),
          this.hasPermissionToEdit(user, item),
          this.hasPermissionToSubmit(user, item),
          this.hasPermissionToEvaluate(user, item))),
      conferenceIdNamePairs);
  }

  /*
    Admins or the submitter of the submission can delete the submission
   */
  private hasPermissionToDelete(user: any, submission: Submission): boolean {
    if (submission.submitter.id == user.userId) {
      return true;
    }

    if (Role.isAdmin(user.role)) {
      return true;
    }

    return false;
  }

  /*
    if the user is an admin or is an author of the submission, he can edit.
   */
  private hasPermissionToEdit(user: any, submission: Submission): boolean {
    if ((submission.submitter.id === user.userId || submission.authors.find(item => item.id === user.userId)) &&
      this.editableSubmissionStatuses.indexOf(submission.status) != -1 || Role.isAdmin(user.role)) {
      return true;
    }

    return false;
  }

  private hasPermissionToSubmit(user: any, submission: Submission) {
    if (submission.submitter.id === user.userId && submission.status == SubmissionStatus.CREATED) {
      return true;
    }
    return false;
  }

  private hasPermissionToEvaluate(user: any, submission: Submission): boolean {
    if (user.role === RoleEnum.EDITOR && submission.status === SubmissionStatus.SUBMITTED) {
      return true;
    }
    if (user.role === RoleEnum.REVIEWER && submission.status === SubmissionStatus.ACCEPTED_BY_EDITOR) {
      return true;
    }
    if (user.role === RoleEnum.ADMIN && submission.status === SubmissionStatus.ACCEPTED_BY_REVIEWER) {
      return true;
    }

    return false;
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

  async createSubmission(userId, submission): Promise<void> {
    await Submission.create({
      title: submission.title,
      manuscriptAbstract: submission.manuscriptAbstract,
      submitterId: userId,
      conferenceId: submission.conference.id
    }).then(async (createdSubmission) => {
      await createdSubmission.setAuthors(submission.authors.map(item => item.id).push(userId));
      await createdSubmission.setAcademicDisciplines(submission.academicDisciplines.map(item => item.id));
      createdSubmission.save();
    }).catch(err => {
      console.log(err);
    });
    await this.createKeywords(submission.id, submission.keywords);
  }

  private async createKeywords(submissionId: number, keywords: Keyword[]) {
    for (let i = 0; i < keywords.length; i++) {
      await Keyword.create({submissionId: submissionId, keyword: keywords[i].keyword});
    }
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

    await Submission.findByPk(submission.id)
      .then(async (s: Submission) => {
        s.title = submission.title;
        s.manuscriptAbstract = submission.manuscriptAbstract;
        await s.setAuthors(submission.authors.map(item => item.id));
        await s.setAcademicDisciplines(submission.academicDisciplines.map(item => item.id));
        s.save();
      }).catch(err => console.log(err));
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

  async submitSubmission(submissionId) {
    return await Submission._updateByPk<Submission>(submissionId, {status: SubmissionStatus.SUBMITTED});
  }
}
