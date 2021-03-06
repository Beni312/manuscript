import { ArrayMinSize, IsNotEmpty, IsNumber, Length } from 'class-validator';

export class SubmissionCreateCommand {
  @Length(5, 50)
  title: string;
  @Length(5, 254)
  manuscriptAbstract: string;
  @IsNumber()
  @IsNotEmpty()
  conferenceId: number;
  keywords: string[];
  @ArrayMinSize(1)
  academicDisciplines: number[];
}
