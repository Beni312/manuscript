import { AcademicDisciplineDto } from './AcademicDisciplineDto';
import { Keyword, Submission, User } from '..';
import { SubmissionStatus } from '../enum/SubmissionStatus';

export class SubmissionDto {
  id: number;
  title: string;
  manuscriptAbstract: string;
  status: SubmissionStatus;
  academicDisciplines: AcademicDisciplineDto[];
  submitter: User;
  conferenceId: number;
  keywords: Keyword[];
  creationDate: Date;
  updatedOn: Date;
  canDelete: boolean;
  canEdit: boolean;
  canSubmit: boolean;
  canEvaluate: boolean;

  constructor(submission: Submission, canDelete: boolean, canEdit: boolean, canSubmit: boolean, canEvaluate: boolean) {
    this.id = submission.id;
    this.title = submission.title;
    this.manuscriptAbstract = submission.manuscriptAbstract;
    this.status = submission.status;
    this.academicDisciplines = submission.academicDisciplines.map(item => new AcademicDisciplineDto(item.id, item.name));
    this.submitter = submission.submitter;
    this.conferenceId = submission.conferenceId;
    this.keywords = submission.keywords;
    this.creationDate = submission.creationDate;
    this.updatedOn = submission.updatedOn;
    this.canDelete = canDelete;
    this.canEdit = canEdit;
    this.canSubmit = canSubmit;
    this.canEvaluate = canEvaluate;
  }
}
