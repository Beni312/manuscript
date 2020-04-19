import { ArrayMinSize, IsNumber, IsPositive, Length } from 'class-validator';

export class EditConferenceCommand {
  @IsNumber()
  @IsPositive()
  conferenceId: number;
  @Length(5, 50)
  title: string;
  @Length(5, 254)
  description: string;
  @ArrayMinSize(1)
  academicDisciplines: number[];
}
