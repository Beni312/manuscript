import { SubmissionDto } from './SubmissionDto';

export class SubmissionPreload {
  submissions: SubmissionDto[];
  conferenceIdNamePairs: any;

  constructor(submissions: SubmissionDto[], conferenceIdNamePairs: any) {
    this.submissions = submissions;
    this.conferenceIdNamePairs = conferenceIdNamePairs;
  }
}
