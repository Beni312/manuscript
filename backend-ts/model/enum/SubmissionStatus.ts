import { EnumDataTypeOptions } from 'sequelize';

export enum SubmissionStatus {
  CREATED = 'CREATED',
  SUBMITTED = 'SUBMITTED',
  REJECTED_BY_REVIEWER ='REJECTED_BY_REVIEWER',
  REJECTED_BY_EDITOR = 'REJECTED_BY_EDITOR',
  REJECTED_BY_ADMIN = 'REJECTED_BY_ADMIN',
  ACCEPTED_BY_REVIEWER = 'ACCEPTED_BY_REVIEWER',
  ACCEPTED_BY_EDITOR = 'ACCEPTED_BY_EDITOR',
  ACCEPTED = 'ACCEPTED'
}

export class SubmissionStatusEnumerator implements EnumDataTypeOptions<string> {
  values: string[] = submissionStatuses;
}


export const submissionStatuses: string[] = Object.keys(SubmissionStatus);
