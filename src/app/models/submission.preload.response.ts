import { Submission } from './submission';
import { ConferenceIdNamePair } from './conference.id.name.pair';

export class SubmissionPreloadResponse {
  submissions: Submission[];
  conferenceIdNamePairs: ConferenceIdNamePair[];
}

