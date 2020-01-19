import { AuthorDto } from './AuthorDto';
import { SubmissionStatus } from '../enum/SubmissionStatus';

export class ConferenceSubmissionDto {
  id: number;
  title: string;
  status: SubmissionStatus;
  submitter: AuthorDto;
  conferenceId: number;

  constructor(id: number, title: string, status: SubmissionStatus, submitter: AuthorDto, conferenceId: number) {
    this.id = id;
    this.title = title;
    this.status = status;
    this.submitter = submitter;
    this.conferenceId = conferenceId;
  }
}
