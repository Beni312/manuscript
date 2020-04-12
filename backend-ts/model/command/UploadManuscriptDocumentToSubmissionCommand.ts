import { IsNumber, IsPositive } from 'class-validator';

export class UploadManuscriptDocumentToSubmissionCommand {
  @IsNumber()
  @IsPositive()
  submissionId: number;
}
