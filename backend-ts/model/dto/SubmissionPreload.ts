import { Submission } from "../index";

export class SubmissionPreload {
  submissions: Submission[];
  conferenceIdNamePairs: any;

  constructor(submissions: Submission[], conferenceIdNamePairs: any) {
    this.submissions = submissions;
    this.conferenceIdNamePairs = conferenceIdNamePairs;
  }
}
