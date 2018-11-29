import {Submission} from './submission';
import {ConferenceIdNamePair} from './conference.id.name.pair';

export class SubmissionPreloadResponse {
  submissions: Submission[];
  conferenceIdNamePairs: ConferenceIdNamePair[];

  constructor(submissions: Submission[], conferenceIdNamePairs: ConferenceIdNamePair[]) {
    this.submissions = submissions;
    this.conferenceIdNamePairs = conferenceIdNamePairs;
  }
}

