import { Submission } from './submission';

export class SubmissionPreloadResponse {
  submissions: Submission[];

  constructor(submissions: Submission[]) {
    this.submissions = submissions;
  }
}

