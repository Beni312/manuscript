import { inject, injectable } from 'inversify';
import { AcademicDiscipline, Conference, Keyword, Submission, User } from '../model';
import { ApplicationService } from './ApplicationService';
import { EditSubmissionDto } from '../model/response/EditSubmissionDto';
import { InternalServerError } from '../model/error/InternalServerError';
import { KeywordRepository } from '../repository/KeywordRepository';
import { Manuscript } from '../model/entity/Manuscript';
import { MessageType } from '../model/enum/MessageType';
import { RoleEnum } from '../model/enum/RoleEnum';
import { Roles } from '../auth/Roles';
import { SubmissionCreateCommand } from '../model/command/SubmissionCreateCommand';
import { SubmissionDto } from '../model/dto/SubmissionDto';
import { SubmissionEvaluateCommand } from '../model/command/SubmissionEvaluateCommand';
import { SubmissionMessage } from '../model/entity/SubmissionMessage';
import { SubmissionPreload } from '../model/dto/SubmissionPreload';
import { SubmissionRepository } from '../repository/SubmissionRepository';
import { SubmissionStatus, SubmissionStatusEnumerator } from '../model/enum/SubmissionStatus';
import { UserInfo } from '../model/dto/UserInfo';
import { UpsertSubmissionPreload } from '../model/response/UpsertSubmissionPreload';
import { UserRepository } from '../repository/UserRepository';
import { UserService } from './UserService';

@injectable()
export class SubmissionService {

  @inject(ApplicationService.name)
  private applicationService: ApplicationService;

  @inject(SubmissionRepository.name)
  private submissionRepository: SubmissionRepository;

  @inject(UserRepository.name)
  private userRepository: UserRepository;

  @inject(KeywordRepository.name)
  private keywordRepository: KeywordRepository;

  @inject(UserService.name)
  private userService: UserService;

  editableSubmissionStatuses = [
    SubmissionStatus.CREATED,
    SubmissionStatus.REJECTED_BY_EDITOR,
    SubmissionStatus.REJECTED_BY_REVIEWER,
    SubmissionStatus.REJECTED_BY_ADMIN
  ];

  async preload(user: UserInfo): Promise<SubmissionPreload> {
    const submissionOptions: any = {
      include: [
        {
          model: Manuscript
        },
        {
          model: AcademicDiscipline,
          attributes: ['id', 'name'],
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
      ],
      order: [
        ['title', 'ASC'],
        ['academicDisciplines', 'name', 'ASC']
      ]
    };
    const conferenceOptions: any = {attributes: ['id', 'title']};

    if (user.role.toUpperCase() == RoleEnum.AUTHOR) {
      submissionOptions.where = {
        submitterId: user.id
      };
    }

    const submissions: Submission[] = await Submission.findAll(submissionOptions);
    const submissionIds: number[] = submissions.map(item => item.id);

    if (user.role !== RoleEnum.ADMIN) {
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
          this.hasPermissionToEvaluate(user, item),
          this.hasPermissionToUploadNewManuscript(user, item))),
      conferenceIdNamePairs,
      new SubmissionStatusEnumerator().values as SubmissionStatus[]);
  }

  /*
    Admins or the submitter of the submission can delete the submission
   */
  private hasPermissionToDelete(user: any, submission: Submission): boolean {
    if (submission.submitter.id == user.id) {
      return true;
    }

    if (Roles.isAdmin(user.role)) {
      return true;
    }

    return false;
  }

  /*
    if the user is an admin or is an author of the submission, he can edit.
   */
  private hasPermissionToEdit(user: any, submission: Submission): boolean {
    if (((submission.submitter.id === user.id) &&
      this.editableSubmissionStatuses.includes(submission.status)) || Roles.isAdmin(user.role)) {
      return true;
    }

    return false;
  }

  private hasPermissionToSubmit(user: any, submission: Submission) {
    if ((submission.submitter.id === user.id || Roles.isAdmin(user.role)) && submission.status == SubmissionStatus.CREATED && submission.manuscripts.length > 0) {
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

  hasPermissionToUploadNewManuscript(user: any, submission: Submission) {
    if (submission.submitterId === user.id && this.editableSubmissionStatuses.includes(submission.status)) {
      return true;
    }
    return false;
  }

  async remove(submissionId): Promise<void> {
    await this.submissionRepository.deleteByPk(submissionId);
  }

  async createSubmission(userId: number, submission: SubmissionCreateCommand): Promise<void> {
    await Submission.create({
      title: submission.title,
      manuscriptAbstract: submission.manuscriptAbstract,
      submitterId: userId,
      conferenceId: submission.conferenceId
    }).then(async (createdSubmission) => {
      await createdSubmission.setAcademicDisciplines(submission.academicDisciplines);
      createdSubmission.save();
      await this.createKeywords(createdSubmission.id, submission.keywords);
    }).catch(err => {
      console.log(err);
    });
  }

  private async createKeywords(submissionId: number, keywords: string[]) {
    for (let i = 0; i < keywords.length; i++) {
      await Keyword.create({submissionId: submissionId, keyword: keywords[i]});
    }
  }

  async editSubmission(submission: EditSubmissionDto): Promise<void> {
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
      await this.keywordRepository.deleteKeywordBySubmissionId(submission.id, toDeleteKeywords[i]);
    }

    for (let i = 0; i < toAddKeywords.length; i++) {
      await Keyword.create({submissionId: submission.id, keyword: toAddKeywords[i]});
    }

    await this.submissionRepository.modifySubmission(
      submission.id,
      submission.title,
      submission.manuscriptAbstract,
      submission.academicDisciplines.map(item => item.id)
    );
  }

  async evaluateSubmission(evaluation: SubmissionEvaluateCommand, userId, userRole): Promise<void> {
    let result: SubmissionStatus;
    let type;
    if (!evaluation.success) {
      type = MessageType.ERROR;
    } else if (evaluation.message && evaluation.message.length > 0) {
      type = MessageType.INFO;
    }

    switch (userRole) {
      case RoleEnum.REVIEWER: evaluation.success ? result = SubmissionStatus.ACCEPTED_BY_REVIEWER: result = SubmissionStatus.REJECTED_BY_REVIEWER; break;
      case RoleEnum.EDITOR: evaluation.success ? result = SubmissionStatus.ACCEPTED_BY_EDITOR: result = SubmissionStatus.REJECTED_BY_EDITOR; break;
      case RoleEnum.ADMIN: evaluation.success ? result = SubmissionStatus.ACCEPTED: result = SubmissionStatus.REJECTED_BY_ADMIN; break;
      default: throw new InternalServerError('No matching status');
    }

    if (type) {
      await SubmissionMessage.create({
        message: evaluation.message,
        type: type,
        submissionId: evaluation.submissionId,
        sender: userId
      });
    }

    await this.submissionRepository.updateSubmissionStatus(evaluation.submissionId, result);
  }

  async getUpsertSubmissionPreload(): Promise<UpsertSubmissionPreload> {
    return new UpsertSubmissionPreload(await this.applicationService.getAcademicDisciplines(), await this.userService.getAuthors());
  }

  async submitSubmission(submissionId: number) {
    return await this.submissionRepository.updateSubmissionStatus(submissionId, SubmissionStatus.SUBMITTED);
  }
}
