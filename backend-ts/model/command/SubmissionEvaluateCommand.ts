import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class SubmissionEvaluateCommand {
  @IsNotEmpty()
  @IsNumber({
    allowNaN: false,
    allowInfinity: false
  })
  submissionId: number;
  @IsNotEmpty()
  message: string;
  @IsBoolean()
  success: boolean;
}
