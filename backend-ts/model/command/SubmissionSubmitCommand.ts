import { IsNotEmpty, IsNumber } from 'class-validator';

export class SubmissionSubmitCommand {
  @IsNotEmpty()
  @IsNumber({
    allowNaN: false,
    allowInfinity: false
  })
  submissionId: number;
}
