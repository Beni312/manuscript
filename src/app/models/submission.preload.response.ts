import {Submission} from './submission';
import {ConferenceIdNamePair} from './conference.id.name.pair';
import {AcademicDiscipline} from './academic.discipline';

export class SubmissionPreloadResponse {
  submissions: Submission[];
  conferenceIdNamePairs: ConferenceIdNamePair[];
  academicDisciplines: AcademicDiscipline[];

  // constructor(submissions: Submission[], conferenceIdNamePairs: ConferenceIdNamePair[]) {
  //   this.submissions = submissions;
  //   this.conferenceIdNamePairs = conferenceIdNamePairs;
  // }
}

