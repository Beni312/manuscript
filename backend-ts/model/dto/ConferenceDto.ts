import { AuthorDto } from './AuthorDto';
import { ConferenceSubmissionDto } from './ConferenceSubmissionDto';

export class ConferenceDto {
  title: string;
  description: string;
  submitter: AuthorDto;
  submissions: ConferenceSubmissionDto[];

  constructor(title: string, description: string, submitter: AuthorDto, submissions: ConferenceSubmissionDto[]) {
    this.title = title;
    this.description = description;
    this.submitter = submitter;
    this.submissions = submissions;
  }
}
