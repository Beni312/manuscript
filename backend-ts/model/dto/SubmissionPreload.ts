import { SubmissionDto } from './SubmissionDto';
import { SubmissionStatus } from '../enum/SubmissionStatus';

export class SubmissionPreload {
  submissions: SubmissionDto[];
  conferenceIdNamePairs: any;
  statuses: SubmissionStatus[];

  constructor(submissions: SubmissionDto[], conferenceIdNamePairs: any, statuses: SubmissionStatus[]) {
    this.submissions = submissions;
    this.conferenceIdNamePairs = conferenceIdNamePairs;
    this.statuses = statuses;
  }
}
