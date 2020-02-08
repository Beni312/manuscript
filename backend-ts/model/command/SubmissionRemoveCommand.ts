import { IsNotEmpty, IsNumber } from 'class-validator';

export class SubmissionRemoveCommand {
  @IsNotEmpty()
  @IsNumber()
  submissionId: number;
}
